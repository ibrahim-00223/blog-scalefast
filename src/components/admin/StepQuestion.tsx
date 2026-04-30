"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface StepQuestionProps {
  stepNumber: number;
  totalSteps: number;
  question: string;
  hint?: string;
  placeholder: string;
  onNext: (value: string) => void;
  onBack?: () => void;
}

export function StepQuestion({
  stepNumber,
  totalSteps,
  question,
  hint,
  placeholder,
  onNext,
  onBack,
}: StepQuestionProps) {
  const [value, setValue] = useState("");
  const maxLength = 300;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onNext(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl animate-[fadeSlideIn_0.25s_ease]"
    >
      {/* Step label */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sf-blue text-xs font-bold text-white">
            {stepNumber}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
            Question {stepNumber} / {totalSteps}
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-sf-navy">{question}</h2>
        {hint && <p className="mt-1.5 text-sm text-sf-gray-400">{hint}</p>}
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={4}
          autoFocus
          className="w-full resize-none rounded-2xl border-2 border-sf-gray-200 px-5 py-4 text-sm leading-relaxed text-sf-navy placeholder:text-sf-gray-400 transition-colors focus:border-sf-blue focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim()) handleSubmit(e);
          }}
        />
        <span className={`absolute bottom-3 right-4 text-xs ${value.length > maxLength * 0.9 ? "text-amber-500" : "text-sf-gray-400"}`}>
          {value.length}/{maxLength}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full px-4 py-2 text-sm font-semibold text-sf-gray-400 hover:bg-sf-gray-100 hover:text-sf-navy"
          >
            ← Retour
          </button>
        ) : (
          <p className="text-xs text-sf-gray-400">⌘ + Entrée pour continuer</p>
        )}
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sf-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Suivant <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
