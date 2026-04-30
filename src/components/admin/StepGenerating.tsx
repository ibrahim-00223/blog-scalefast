"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import type { SSEEvent, SSEAgentName } from "@/types";

interface StepGeneratingProps {
  brief: {
    subject: string;
    audience: string;
    message: string;
    categoryId: string;
  };
}

type AgentPhase = "idle" | "running" | "done" | "error";

interface AgentState {
  phase: AgentPhase;
  summary?: string;
}

const AGENTS: { key: SSEAgentName; label: string; description: string }[] = [
  {
    key: "keywords",
    label: "Keywords Agent",
    description: "Analyse le brief et planifie la stratégie SEO…",
  },
  {
    key: "redactor",
    label: "Redactor Agent",
    description: "Rédige l'article complet…",
  },
  {
    key: "validator",
    label: "Validator Agent",
    description: "Valide la qualité SEO et la structure…",
  },
];

export function StepGenerating({ brief }: StepGeneratingProps) {
  const router = useRouter();
  const [agents, setAgents] = useState<Record<SSEAgentName, AgentState>>({
    keywords: { phase: "idle" },
    redactor: { phase: "idle" },
    validator: { phase: "idle" },
  });
  const [streamText, setStreamText] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const started = useRef(false);

  const processEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.type) {
        case "agent_started":
          setAgents((prev) => ({
            ...prev,
            [event.agent]: { phase: "running" },
          }));
          break;

        case "agent_progress":
          setStreamText((t) => t + event.delta);
          break;

        case "agent_completed":
          setAgents((prev) => ({
            ...prev,
            [event.agent]: { phase: "done", summary: event.summary },
          }));
          if (event.agent === "redactor") setStreamText("");
          break;

        case "pipeline_completed":
          router.push(`/admin/articles/${event.articleId}?status=ai-generated`);
          break;

        case "error":
          setGlobalError(event.message);
          setAgents((prev) => {
            const updated = { ...prev };
            for (const k of Object.keys(updated) as SSEAgentName[]) {
              if (updated[k].phase === "running") {
                updated[k] = { phase: "error" };
              }
            }
            return updated;
          });
          break;
      }
    },
    [router]
  );

  const runPipeline = useCallback(async () => {
    try {
      const res = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief_subject: brief.subject,
          brief_audience: brief.audience,
          brief_message: brief.message,
          category_id: brief.categoryId,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const event = JSON.parse(raw) as SSEEvent;
            processEvent(event);
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }, [brief, processEvent]);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    runPipeline();
  }, [runPipeline]);

  return (
    <div className="mx-auto w-full max-w-xl animate-[fadeSlideIn_0.3s_ease]">
      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
          Étape 5 / 5
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-sf-navy">
          Génération en cours…
        </h2>
        <p className="mt-1 text-sm text-sf-gray-600">
          Le pipeline multi-agents travaille sur ton article. Ça prend environ 30-60 secondes.
        </p>
      </div>

      {/* Agent statuses */}
      <div className="space-y-4">
        {AGENTS.map(({ key, label, description }) => {
          const s = agents[key];
          return (
            <div
              key={key}
              className="flex items-start gap-4 rounded-2xl border border-sf-gray-200 bg-white p-5"
            >
              <div className="mt-0.5 shrink-0">
                {s.phase === "idle" && (
                  <div className="h-5 w-5 rounded-full border-2 border-sf-gray-200" />
                )}
                {s.phase === "running" && (
                  <Loader2 size={20} className="animate-spin text-sf-blue" />
                )}
                {s.phase === "done" && (
                  <CheckCircle size={20} className="text-emerald-500" />
                )}
                {s.phase === "error" && <XCircle size={20} className="text-red-500" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sf-navy">{label}</p>
                <p className="mt-0.5 text-sm text-sf-gray-600">
                  {s.summary ?? description}
                </p>

                {/* Live stream preview for redactor */}
                {key === "redactor" && s.phase === "running" && streamText && (
                  <div className="mt-3 max-h-40 overflow-y-auto rounded-xl bg-sf-gray-100 p-3">
                    <pre className="whitespace-pre-wrap text-xs leading-5 text-sf-gray-600">
                      {streamText}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {globalError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <strong>Erreur :</strong> {globalError}
          <br />
          <Link href="/admin/articles/new" className="mt-2 inline-block underline">
            Réessayer
          </Link>
        </div>
      )}
    </div>
  );
}
