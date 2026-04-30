"use client";

import { useRef, useState } from "react";
import { Sparkles, Loader2, CheckCircle2, Circle, XCircle, Search, PenLine, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";
import type { TipTapContent, SSEEvent } from "@/types";

interface RegenerateButtonProps {
  articleId: string;
  briefSubject: string;
  briefAudience: string;
  briefMessage: string;
  categoryId: string | null;
  onComplete: (newContent: TipTapContent) => void;
}

type AgentPhase = "idle" | "running" | "done" | "error";
interface AgentStatus { phase: AgentPhase; summary?: string }

const AGENT_CONFIG = [
  { key: "keywords", label: "Keywords", icon: Search, color: "text-violet-600", activeBg: "bg-violet-50 border-violet-200" },
  { key: "redactor", label: "Rédacteur", icon: PenLine, color: "text-sf-blue", activeBg: "bg-sf-blue-light border-sf-blue-mid" },
  { key: "validator", label: "Validateur", icon: BadgeCheck, color: "text-emerald-600", activeBg: "bg-emerald-50 border-emerald-200" },
];

export function RegenerateButton({ briefSubject, briefAudience, briefMessage, categoryId }: RegenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>({
    keywords: { phase: "idle" },
    redactor: { phase: "idle" },
    validator: { phase: "idle" },
  });
  const [streamText, setStreamText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<HTMLPreElement>(null);

  function reset() {
    setIsDone(false);
    setStreamText("");
    setError(null);
    setStatuses({ keywords: { phase: "idle" }, redactor: { phase: "idle" }, validator: { phase: "idle" } });
  }

  function handleEvent(event: SSEEvent) {
    switch (event.type) {
      case "agent_started":
        setStatuses((p) => ({ ...p, [event.agent]: { phase: "running" } }));
        break;
      case "agent_progress":
        setStreamText((t) => t + event.delta);
        if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
        break;
      case "agent_completed":
        setStatuses((p) => ({ ...p, [event.agent]: { phase: "done", summary: event.summary } }));
        if (event.agent === "redactor") setStreamText("");
        break;
      case "pipeline_completed":
        setIsDone(true);
        setIsRunning(false);
        setTimeout(() => { window.location.href = `/admin/articles/${event.articleId}?status=ai-regenerated`; }, 800);
        break;
      case "error":
        setError(event.message);
        setIsRunning(false);
        setStatuses((p) => {
          const u = { ...p };
          for (const k of Object.keys(u)) {
            if (u[k].phase === "running") u[k] = { phase: "error" };
          }
          return u;
        });
        break;
    }
  }

  async function handleRegenerate() {
    if (isRunning) return;
    if (!briefSubject || !briefAudience || !briefMessage) {
      setError("Complete le brief (sujet, audience, message) avant de régénérer.");
      return;
    }
    reset();
    setIsRunning(true);
    try {
      const res = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief_subject: briefSubject, brief_audience: briefAudience, brief_message: briefMessage, category_id: categoryId ?? "" }),
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
          if (raw) try { handleEvent(JSON.parse(raw) as SSEEvent); } catch { /* ignore */ }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setIsRunning(false);
    }
  }

  const doneCount = Object.values(statuses).filter((s) => s.phase === "done").length;

  return (
    <div className="w-full">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
          isOpen
            ? "border-sf-blue bg-sf-blue text-white"
            : "border-sf-blue-mid bg-sf-blue-light text-sf-blue hover:bg-sf-blue hover:text-white"
        }`}
      >
        <Sparkles size={15} />
        Régénérer avec l&apos;IA
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-sf-gray-200 bg-white shadow-sm">
          {/* Panel header */}
          <div className="border-b border-sf-gray-200 bg-sf-gray-100 px-5 py-4">
            <p className="text-sm font-semibold text-sf-navy">Pipeline multi-agents GPT-4o</p>
            <p className="mt-0.5 text-xs text-sf-gray-400">
              Génère un nouvel article complet depuis le brief ci-dessus. Tu seras redirigé vers la nouvelle version.
            </p>
            {/* Mini progress */}
            {isRunning && (
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-sf-gray-200">
                <div
                  className="h-full rounded-full bg-sf-blue transition-all duration-700"
                  style={{ width: `${Math.round((doneCount / 3) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Agent rows */}
          <div className="divide-y divide-sf-gray-100 px-5">
            {AGENT_CONFIG.map(({ key, label, icon: Icon, color, activeBg }) => {
              const s = statuses[key];
              const isActive = s.phase === "running";
              return (
                <div key={key} className={`flex items-start gap-3 py-3.5 ${isActive ? "rounded-xl -mx-1 px-1 " + activeBg : ""}`}>
                  <div className="mt-0.5 shrink-0">
                    {s.phase === "idle" && <Circle size={18} className="text-sf-gray-200" />}
                    {isActive && <Loader2 size={18} className={`animate-spin ${color}`} />}
                    {s.phase === "done" && <CheckCircle2 size={18} className="text-emerald-500" />}
                    {s.phase === "error" && <XCircle size={18} className="text-red-500" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Icon size={13} className={s.phase !== "idle" ? color : "text-sf-gray-400"} />
                      <span className={`text-sm font-semibold ${s.phase !== "idle" ? "text-sf-navy" : "text-sf-gray-400"}`}>
                        {label}
                      </span>
                    </div>
                    {s.summary && <p className="mt-0.5 text-xs text-sf-gray-400">{s.summary}</p>}
                    {key === "redactor" && isActive && streamText && (
                      <pre
                        ref={streamRef}
                        className="mt-2 max-h-32 overflow-y-auto rounded-xl bg-sf-gray-100 p-2.5 text-xs leading-5 text-sf-gray-600"
                        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                      >
                        {streamText}
                        <span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-sf-blue align-middle" />
                      </pre>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="mx-5 mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <XCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-sf-gray-200 px-5 py-4">
            {isDone ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                <CheckCircle2 size={16} />
                Article généré — redirection…
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={isRunning}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-sf-blue py-2.5 text-sm font-semibold text-white hover:bg-sf-blue-dark disabled:opacity-50"
              >
                {isRunning ? (
                  <><Loader2 size={15} className="animate-spin" /> Génération en cours…</>
                ) : (
                  <><Sparkles size={15} /> Lancer la régénération</>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
