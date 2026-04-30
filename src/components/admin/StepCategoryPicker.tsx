"use client";

import type { Category } from "@/types";
import { CATEGORY_COLORS } from "@/types";

interface StepCategoryPickerProps {
  categories: Pick<Category, "id" | "name" | "slug" | "description">[];
  onSelect: (categoryId: string) => void;
}

export function StepCategoryPicker({ categories, onSelect }: StepCategoryPickerProps) {
  return (
    <div className="mx-auto w-full max-w-xl animate-[fadeSlideIn_0.3s_ease]">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-sf-blue">
          Étape 4 / 5
        </span>
        <h2 className="mt-2 text-2xl font-extrabold text-sf-navy">
          Choisis une catégorie
        </h2>
        <p className="mt-1 text-sm text-sf-gray-600">
          L&apos;article sera classé dans cette catégorie sur le blog.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((cat) => {
          const colors = CATEGORY_COLORS[cat.slug] ?? {
            bg: "#F8FAFF",
            text: "#3B5BDB",
            border: "#C7D2FE",
          };
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className="group flex flex-col items-start gap-1 rounded-2xl border px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.border ?? colors.bg,
              }}
            >
              <span
                className="text-sm font-bold"
                style={{ color: colors.text }}
              >
                {cat.name}
              </span>
              {cat.description && (
                <span className="line-clamp-2 text-xs" style={{ color: colors.text, opacity: 0.7 }}>
                  {cat.description}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
