import OpenAI from "openai";
import type { TipTapContent } from "@/types";
import type { KeywordsAgentOutput, ValidatorAgentOutput } from "@/types";
import { markdownToTipTap } from "./tiptap-builder";

// Lazy-initialize to avoid crashing at build time when env vars are absent
function getClient() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";

// ─── Keywords Agent ───────────────────────────────────────────────────────────

export async function runKeywordsAgent(
  brief: { subject: string; audience: string; message: string },
  onProgress: (delta: string) => void
): Promise<KeywordsAgentOutput> {
  const stream = await getClient().chat.completions.create({
    model: MODEL,
    stream: true,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert SEO B2B pour Scalefast, une agence française spécialisée en GTM, RevOps et SaaS. Retourne UNIQUEMENT du JSON valide, sans markdown, sans texte autour.",
      },
      {
        role: "user",
        content: `Analyse ce brief et retourne ce JSON (remplace les valeurs) :
{
  "primary_keyword": "mot-clé principal SEO",
  "secondary_keywords": ["kw2", "kw3", "kw4", "kw5"],
  "angle": "angle unique et différenciant",
  "tone": "professionnel",
  "estimated_words": 1800,
  "h1": "Titre H1 optimisé SEO",
  "outline": [
    { "h2": "Section 1", "h3s": ["sous-section 1.1", "sous-section 1.2"] },
    { "h2": "Section 2", "h3s": ["sous-section 2.1"] },
    { "h2": "Section 3", "h3s": ["sous-section 3.1"] },
    { "h2": "Conclusion", "h3s": [] }
  ]
}

Brief :
- Sujet : ${brief.subject}
- Audience : ${brief.audience}
- Message clé : ${brief.message}`,
      },
    ],
  });

  let fullText = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    if (delta) {
      onProgress(delta);
      fullText += delta;
    }
  }

  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Keywords agent : réponse JSON invalide.");
  return JSON.parse(jsonMatch[0]) as KeywordsAgentOutput;
}

// ─── Redactor Agent ───────────────────────────────────────────────────────────

export async function runRedactorAgent(
  input: {
    brief: { subject: string; audience: string; message: string };
    keywordsOutput: KeywordsAgentOutput;
  },
  onProgress: (delta: string) => void
): Promise<{ markdown: string; tipTapContent: TipTapContent }> {
  const outlineText = input.keywordsOutput.outline
    .map(
      (s) =>
        `## ${s.h2}${s.h3s.length > 0 ? "\n" + s.h3s.map((h) => `  ### ${h}`).join("\n") : ""}`
    )
    .join("\n\n");

  const stream = await getClient().chat.completions.create({
    model: MODEL,
    stream: true,
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content:
          "Tu es un rédacteur B2B senior pour Scalefast, spécialisé en GTM, RevOps et SaaS B2B. Tu rédiges en français, avec un style expert, concret et orienté résultats.",
      },
      {
        role: "user",
        content: `Rédige un article complet optimisé SEO en Markdown.

Brief :
- Sujet : ${input.brief.subject}
- Audience : ${input.brief.audience}
- Message clé : ${input.brief.message}

Stratégie SEO :
- Mot-clé principal : ${input.keywordsOutput.primary_keyword}
- Mots-clés secondaires : ${input.keywordsOutput.secondary_keywords.join(", ")}
- Angle : ${input.keywordsOutput.angle}
- Ton : ${input.keywordsOutput.tone}
- ~${input.keywordsOutput.estimated_words} mots

Plan :
# ${input.keywordsOutput.h1}

${outlineText}

Instructions :
- Commence directement par "# ${input.keywordsOutput.h1}"
- Markdown strict : #, ##, ###, **gras**, *italic*, listes
- Introduction percutante (2-3 phrases)
- Exemples concrets, chiffres quand possible
- Call-to-action Scalefast en conclusion`,
      },
    ],
  });

  let markdown = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    if (delta) {
      onProgress(delta);
      markdown += delta;
    }
  }

  return { markdown, tipTapContent: markdownToTipTap(markdown) };
}

// ─── Validator Agent ──────────────────────────────────────────────────────────

export async function runValidatorAgent(
  input: { articleMarkdown: string; keywordsOutput: KeywordsAgentOutput },
  onProgress: (delta: string) => void
): Promise<ValidatorAgentOutput> {
  const stream = await getClient().chat.completions.create({
    model: MODEL,
    stream: true,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Tu es un expert SEO B2B. Évalue l'article et retourne UNIQUEMENT du JSON valide, sans markdown.",
      },
      {
        role: "user",
        content: `Évalue cet article en français et retourne ce JSON :
{
  "score": 85,
  "issues": ["problème 1"],
  "suggestions": ["suggestion 1"],
  "approved": true
}

Mot-clé principal : ${input.keywordsOutput.primary_keyword}
Mots-clés secondaires : ${input.keywordsOutput.secondary_keywords.join(", ")}
Longueur cible : ${input.keywordsOutput.estimated_words} mots

Critères (score /100) :
- Densité mot-clé principal (25pts)
- Structure H2/H3 (20pts)
- Longueur approximative (20pts)
- Lisibilité B2B (20pts)
- Call-to-action (15pts)

approved = true si score ≥ 70.

Article :
${input.articleMarkdown.slice(0, 3500)}`,
      },
    ],
  });

  let fullText = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content ?? "";
    if (delta) {
      onProgress(delta);
      fullText += delta;
    }
  }

  const jsonMatch = fullText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Validator agent : réponse JSON invalide.");
  return JSON.parse(jsonMatch[0]) as ValidatorAgentOutput;
}
