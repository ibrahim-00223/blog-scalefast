"use client";

import { useState } from "react";
import { Wand2, Loader2, CheckCircle, XCircle } from "lucide-react";
import type { TipTapContent, SSEEvent } from "@/types";

interface RegenerateButtonProps {
  articleId: string;
  briefSubject: string;
  briefAudience: string;
  briefMessage: string;
  categoryId: string | null;
  onComplete: (newContent: TipTapContent) => void;
}

type AgentState = "idle" | "running" | "done" | "error";

interface AgentStatus {
  state: AgentState;
  summary?: string;
}

export function RegenerateButton({
  briefSubject,
  briefAudience,
  briefMessage,
  categoryId,
  onComplete,
}: RegenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({
    keywords: { state: "idle" },
    redactor: { state: "idle" },
    validator: { state: "idle" },
  });
  const [streamText, setStreamText] = useState("");
  const [globalError, setGlobalError] = useState<string | null>(null);

  const agentLabels: Record<string, string> = {
    keywords: "🔍 Keywords Agent",
    redactor: "✍️ Redactor Agent",
    validator: "✅ Validator Agent",
  };

  async function handleRegenerate() {
    if (isRunning) return;
    if (!briefSubject || !briefAudience || !briefMessage) {
      setGlobalError("Remplis le brief (sujet, audience, message) avant de régénérer.");
      return;
    }

    setIsRunning(true);
    setStreamText("");
    setGlobalError(null);
    setAgentStatuses({
      keywords: { state: "idle" },
      redactor: { state: "idle" },
      validator: { state: "idle" },
    });

    try {
      const res = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief_subject: briefSubject,
          brief_audience: briefAudience,
          brief_message: briefMessage,
          category_id: categoryId ?? "",
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
            handleEvent(event);
          } catch {
            // Ignore malformed lines
          }
        }
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setIsRunning(false);
    }
  }

  function handleEvent(event: SSEEvent) {
    switch (event.type) {
      case "agent_started":
        setAgentStatuses((prev) => ({
          ...prev,
          [event.agent]: { state: "running" },
        }));
        break;

      case "agent_progress":
        setStreamText((t) => t + event.delta);
        break;

      case "agent_completed":
        setAgentStatuses((prev) => ({
          ...prev,
          [event.agent]: { state: "done", summary: event.summary },
        }));
        if (event.agent === "redactor") setStreamText("");
        break;

      case "pipeline_completed":
        // Reload the page to get the new content from DB
        window.location.href = `/admin/articles/${event.articleId}?status=ai-regenerated`;
        break;

      case "error":
        setGlobalError(event.message);
        break;
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-sf-blue-mid px-4 py-2 text-sm font-semibold text-sf-blue hover:bg-sf-blue-light"
      >
        <Wand2 size={15} />
        Régénérer avec l&apos;IA
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 rounded-2xl border border-sf-gray-200 bg-white p-5">
          <p className="text-sm text-sf-gray-600">
            Le pipeline va régénérer l&apos;article complet à partir du brief et créer une
            nouvelle version. Tu seras redirigé vers la nouvelle version.
          </p>

          {/* Agent statuses — inlined to avoid component-in-render lint error */}
          <div className="divide-y divide-sf-gray-100">
            {Object.keys(agentStatuses).map((agentKey) => {
              const s = agentStatuses[agentKey];
              return (
                <div key={agentKey} className="flex items-start gap-3 py-1.5">
                  <div className="mt-0.5 shrink-0">
                    {s.state === "idle" && (
                      <div className="h-4 w-4 rounded-full border-2 border-sf-gray-200" />
                    )}
                    {s.state === "running" && (
                      <Loader2 size={16} className="animate-spin text-sf-blue" />
                    )}
                    {s.state === "done" && (
                      <CheckCircle size={16} className="text-emerald-500" />
                    )}
                    {s.state === "error" && <XCircle size={16} className="text-red-500" />}
                  </div>
                  <div className="flex-1 text-sm">
                    <span className="font-medium text-sf-navy">{agentLabels[agentKey]}</span>
                    {s.summary && (
                      <p className="mt-0.5 text-xs text-sf-gray-400">{s.summary}</p>
                    )}
                    {agentKey === "redactor" && s.state === "running" && streamText && (
                      <pre className="mt-2 max-h-32 overflow-y-auto whitespace-pre-wrap rounded-lg bg-sf-gray-100 p-2 text-xs text-sf-gray-600">
                        {streamText}
                      </pre>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {globalError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {globalError}
            </p>
          )}

          {!isRunning && (
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRunning}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-sf-blue py-2.5 text-sm font-semibold text-white hover:bg-sf-blue-dark disabled:opacity-60"
            >
              <Wand2 size={15} />
              Lancer la régénération
            </button>
          )}
        </div>
      )}
    </div>
  );
}
