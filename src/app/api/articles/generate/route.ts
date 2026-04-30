import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runKeywordsAgent, runRedactorAgent, runValidatorAgent } from "@/lib/ai/agents";
import { slugify } from "@/lib/utils";
import type { SSEEvent } from "@/types";

// ─── In-memory rate limit: 3 req / 10 min per user ───────────────────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): void {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 10 * 60 * 1000 });
    return;
  }
  if (entry.count >= 3) {
    throw new Error("Rate limit : 3 générations maximum par 10 minutes.");
  }
  entry.count++;
}

// ─── SSE helpers ─────────────────────────────────────────────────────────────

function sseData(event: SSEEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    checkRateLimit(user.id);
  } catch (e) {
    return new Response((e as Error).message, { status: 429 });
  }

  const body = (await req.json()) as {
    brief_subject: string;
    brief_audience: string;
    brief_message: string;
    category_id: string;
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: SSEEvent) => {
        controller.enqueue(encoder.encode(sseData(event)));
      };

      try {
        send({ type: "pipeline_started" });

        // ── Keywords Agent ───────────────────────────────────────────────────
        send({ type: "agent_started", agent: "keywords" });

        const keywordsOutput = await runKeywordsAgent(
          {
            subject: body.brief_subject,
            audience: body.brief_audience,
            message: body.brief_message,
          },
          () => {
            // JSON agent — no streaming progress sent to client
          }
        );

        send({
          type: "agent_completed",
          agent: "keywords",
          summary: `Mot-clé principal : "${keywordsOutput.primary_keyword}" · ${keywordsOutput.outline.length} sections planifiées`,
        });

        // ── Redactor Agent ───────────────────────────────────────────────────
        send({ type: "agent_started", agent: "redactor" });

        const redactorOutput = await runRedactorAgent(
          {
            brief: {
              subject: body.brief_subject,
              audience: body.brief_audience,
              message: body.brief_message,
            },
            keywordsOutput,
          },
          (delta) => {
            send({ type: "agent_progress", agent: "redactor", delta });
          }
        );

        const wordCount = redactorOutput.markdown.split(/\s+/).filter(Boolean).length;
        send({
          type: "agent_completed",
          agent: "redactor",
          summary: `Article rédigé · ~${wordCount} mots`,
        });

        // ── Validator Agent ──────────────────────────────────────────────────
        send({ type: "agent_started", agent: "validator" });

        const validatorOutput = await runValidatorAgent(
          {
            articleMarkdown: redactorOutput.markdown,
            keywordsOutput,
          },
          () => {
            // JSON agent — no streaming progress sent to client
          }
        );

        send({
          type: "agent_completed",
          agent: "validator",
          summary: `Score SEO : ${validatorOutput.score}/100 · ${validatorOutput.approved ? "Approuvé ✓" : "À améliorer"}`,
        });

        // ── Insert article in Supabase ───────────────────────────────────────
        const title = keywordsOutput.h1;
        const baseSlug = slugify(title);

        // Ensure slug uniqueness by appending a timestamp if needed
        const { data: existing } = await supabase
          .from("articles")
          .select("id")
          .eq("slug", baseSlug)
          .maybeSingle();

        const slug = existing ? `${baseSlug}-${Date.now()}` : baseSlug;
        const excerpt = body.brief_message.slice(0, 300);

        const { data: article, error: insertError } = await supabase
          .from("articles")
          .insert({
            title,
            slug,
            excerpt,
            content: redactorOutput.tipTapContent,
            status: "review",
            category_id: body.category_id || null,
            author_id: user.id,
            brief_subject: body.brief_subject,
            brief_audience: body.brief_audience,
            brief_message: body.brief_message,
            meta_title: title,
            meta_description: excerpt,
            reading_time_minutes: Math.ceil(wordCount / 200),
          })
          .select("id")
          .single();

        if (insertError || !article) {
          throw new Error(`Erreur DB : ${insertError?.message ?? "insertion échouée"}`);
        }

        // Create generation record
        await supabase.from("article_ai_generation").insert({
          article_id: article.id,
          user_id: user.id,
          brief_subject: body.brief_subject,
          brief_audience: body.brief_audience,
          brief_message: body.brief_message,
          keywords_output: keywordsOutput,
          redactor_output: { markdown: redactorOutput.markdown },
          validator_output: validatorOutput,
          status: "completed",
        });

        send({ type: "pipeline_completed", articleId: article.id });
      } catch (error) {
        send({
          type: "error",
          message: error instanceof Error ? error.message : "Erreur inconnue",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
