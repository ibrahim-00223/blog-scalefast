"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface StepQuestionProps {
  stepNumber: number;
  question: string;
  placeholder: string;
  onNext: (value: string) => void;
}

export function StepQuestion({ stepNumber, question, placeholder, onNext }: StepQuestionProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) onNext(value.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-xl animate-[fadeSlideIn_0.3s_ease] flex-col gap-6"
    >
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
          Question {stepNumber} / 3
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-sf-navy">{question}</h2>
      </div>

      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        rows={4}
        autoFocus
        className="w-full resize-none rounded-2xl border border-sf-gray-200 px-5 py-4 text-sm text-sf-navy shadow-sm focus:border-sf-blue focus:outline-none focus:ring-2 focus:ring-sf-blue/20"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim()) {
            handleSubmit(e);
          }
        }}
      />

      <div className="flex items-center justify-between">
        <p className="text-xs text-sf-gray-400">Cmd+Enter pour continuer</p>
        <button
          type="submit"
          disabled={!value.trim()}
          className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-sf-blue-dark disabled:opacity-40"
        >
          Suivant
          <ArrowRight size={15} />
        </button>
      </div>
    </form>
  );
}
