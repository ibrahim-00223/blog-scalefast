"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Circle, Loader2, XCircle, Sparkles, Search, PenLine, BadgeCheck } from "lucide-react";
import type { SSEEvent, SSEAgentName } from "@/types";

interface StepGeneratingProps {
  brief: { subject: string; audience: string; message: string; categoryId: string };
}

type AgentPhase = "idle" | "running" | "done" | "error";
interface AgentState { phase: AgentPhase; summary?: string }

const AGENTS: {
  key: SSEAgentName;
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bg: string;
}[] = [
  {
    key: "keywords",
    label: "Keywords Agent",
    description: "Analyse du brief et stratégie SEO…",
    icon: Search,
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    key: "redactor",
    label: "Redactor Agent",
    description: "Rédaction de l'article complet…",
    icon: PenLine,
    color: "text-sf-blue",
    bg: "bg-sf-blue-light border-sf-blue-mid",
  },
  {
    key: "validator",
    label: "Validator Agent",
    description: "Validation SEO et qualité…",
    icon: BadgeCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
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
  const [isDone, setIsDone] = useState(false);
  const streamRef = useRef<HTMLPreElement>(null);
  const started = useRef(false);

  // Auto-scroll stream preview
  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [streamText]);

  const processEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.type) {
        case "agent_started":
          setAgents((prev) => ({ ...prev, [event.agent]: { phase: "running" } }));
          break;
        case "agent_progress":
          setStreamText((t) => t + event.delta);
          break;
        case "agent_completed":
          setAgents((prev) => ({ ...prev, [event.agent]: { phase: "done", summary: event.summary } }));
          if (event.agent === "redactor") setStreamText("");
          break;
        case "pipeline_completed":
          setIsDone(true);
          setTimeout(() => router.push(`/admin/articles/${event.articleId}?status=ai-generated`), 800);
          break;
        case "error":
          setGlobalError(event.message);
          setAgents((prev) => {
            const updated = { ...prev };
            for (const k of Object.keys(updated) as SSEAgentName[]) {
              if (updated[k].phase === "running") updated[k] = { phase: "error" };
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
      if (!res.ok || !res.body) throw new Error(`Erreur HTTP ${res.status}`);

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
          try { processEvent(JSON.parse(raw) as SSEEvent); } catch { /* ignore */ }
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

  const doneCount = Object.values(agents).filter((a) => a.phase === "done").length;
  const progress = Math.round((doneCount / 3) * 100);

  return (
    <div className="mx-auto w-full max-w-2xl animate-[fadeSlideIn_0.3s_ease]">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDone ? "bg-emerald-100" : "bg-sf-blue-light"}`}>
            {isDone ? (
              <CheckCircle2 size={22} className="text-emerald-600" />
            ) : (
              <Sparkles size={20} className="animate-pulse text-sf-blue" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-sf-navy">
              {isDone ? "Article généré !" : "Génération en cours…"}
            </h2>
            <p className="text-sm text-sf-gray-400">
              {isDone ? "Redirection vers l'éditeur…" : "~30-60 secondes"}
            </p>
          </div>
        </div>

        {/* Global progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-sf-gray-200">
          <div
            className={`h-full rounded-full transition-all duration-700 ${isDone ? "bg-emerald-500" : "bg-sf-blue"}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-3">
        {AGENTS.map(({ key, label, description, icon: Icon, color, bg }) => {
          const s = agents[key];
          const isActive = s.phase === "running";
          const isDoneAgent = s.phase === "done";
          const isError = s.phase === "error";

          return (
            <div
              key={key}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                isActive ? bg : isDoneAgent ? "border-sf-gray-200 bg-white" : "border-sf-gray-200 bg-sf-gray-100/50"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Status icon */}
                <div className="mt-0.5 shrink-0">
                  {s.phase === "idle" && <Circle size={20} className="text-sf-gray-200" />}
                  {isActive && <Loader2 size={20} className={`animate-spin ${color}`} />}
                  {isDoneAgent && <CheckCircle2 size={20} className="text-emerald-500" />}
                  {isError && <XCircle size={20} className="text-red-500" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className={isDoneAgent ? "text-emerald-500" : color} />
                    <span className={`text-sm font-bold ${isActive || isDoneAgent ? "text-sf-navy" : "text-sf-gray-400"}`}>
                      {label}
                    </span>
                    {isActive && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${bg} ${color}`}>
                        En cours
                      </span>
                    )}
                    {isDoneAgent && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                        Terminé
                      </span>
                    )}
                  </div>

                  <p className={`mt-0.5 text-xs ${isActive || isDoneAgent ? "text-sf-gray-600" : "text-sf-gray-400"}`}>
                    {s.summary ?? description}
                  </p>

                  {/* Live stream preview for Redactor */}
                  {key === "redactor" && isActive && streamText && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-sf-blue-mid bg-white">
                      <div className="flex items-center gap-2 border-b border-sf-gray-200 bg-sf-gray-100 px-3 py-1.5">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-sf-blue" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-sf-gray-400">
                          Rédaction en direct
                        </span>
                      </div>
                      <pre
                        ref={streamRef}
                        className="max-h-48 overflow-y-auto p-3 text-xs leading-5 text-sf-gray-600"
                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                      >
                        {streamText}
                        <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-sf-blue align-middle" />
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error state */}
      {globalError && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle size={20} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-semibold text-red-700">Erreur lors de la génération</p>
              <p className="mt-1 text-sm text-red-600">{globalError}</p>
              <Link
                href="/admin/articles/new"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Réessayer
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
