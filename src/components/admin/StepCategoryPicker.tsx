"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import { CATEGORY_COLORS } from "@/types";

interface StepCategoryPickerProps {
  categories: Pick<Category, "id" | "name" | "slug" | "description">[];
  onSelect: (categoryId: string) => void;
  onBack?: () => void;
}

export function StepCategoryPicker({ categories, onSelect, onBack }: StepCategoryPickerProps) {
  const [selected, setSelected] = useState<string | null>(null);

  function handleConfirm() {
    if (selected) onSelect(selected);
  }

  return (
    <div className="mx-auto w-full max-w-xl animate-[fadeSlideIn_0.25s_ease]">
      {/* Step label */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sf-blue text-xs font-bold text-white">
            4
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
            Question 4 / 5
          </span>
        </div>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-sf-navy">
          Choisis une catégorie
        </h2>
        <p className="mt-1.5 text-sm text-sf-gray-400">
          L&apos;article sera classé dans cette section du blog.
        </p>
      </div>

      {/* Category grid */}
      {categories.length === 0 ? (
        <p className="rounded-2xl border border-sf-gray-200 px-5 py-8 text-center text-sm text-sf-gray-400">
          Aucune catégorie disponible. Crée-en une dans les paramètres.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => {
            const colors = CATEGORY_COLORS[cat.slug] ?? {
              bg: "#F8FAFF",
              text: "#3B5BDB",
              border: "#C7D2FE",
            };
            const isSelected = selected === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelected(cat.id)}
                className="group relative flex flex-col items-start gap-1 rounded-2xl border-2 px-4 py-4 text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: isSelected ? colors.text : (colors.border ?? colors.bg),
                  boxShadow: isSelected ? `0 0 0 3px ${colors.bg}, 0 0 0 5px ${colors.text}` : undefined,
                }}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <span
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{ backgroundColor: colors.text }}
                  >
                    <CheckCircle2 size={13} className="text-white" />
                  </span>
                )}
                <span className="pr-6 text-sm font-bold" style={{ color: colors.text }}>
                  {cat.name}
                </span>
                {cat.description && (
                  <span
                    className="line-clamp-2 text-xs leading-relaxed"
                    style={{ color: colors.text, opacity: 0.65 }}
                  >
                    {cat.description}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full px-4 py-2 text-sm font-semibold text-sf-gray-400 hover:bg-sf-gray-100 hover:text-sf-navy"
          >
            ← Retour
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selected}
          className="flex items-center gap-2 rounded-full bg-sf-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sf-blue-dark disabled:cursor-not-allowed disabled:opacity-40"
        >
          Suivant <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}
