"use client";

import { useState } from "react";
import { StepQuestion } from "./StepQuestion";
import { StepCategoryPicker } from "./StepCategoryPicker";
import { StepGenerating } from "./StepGenerating";
import type { Category } from "@/types";

interface NewArticleWizardProps {
  categories: Pick<Category, "id" | "name" | "slug" | "description">[];
}

type Step = 1 | 2 | 3 | 4 | 5;

interface WizardState {
  subject: string;
  audience: string;
  message: string;
  categoryId: string;
}

const TOTAL_STEPS = 5;

const STEP_LABELS = [
  "Sujet",
  "Audience",
  "Message",
  "Catégorie",
  "Génération",
];

export function NewArticleWizard({ categories }: NewArticleWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<WizardState>({
    subject: "",
    audience: "",
    message: "",
    categoryId: "",
  });

  return (
    <div className="flex min-h-[70vh] flex-col">
      {/* Step indicator */}
      {step < 5 && (
        <div className="mb-8">
          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const s = (i + 1) as Step;
              const isDone = step > s;
              const isActive = step === s;
              return (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                      isDone
                        ? "bg-emerald-500 text-white"
                        : isActive
                        ? "bg-sf-blue text-white shadow-md shadow-sf-blue/30"
                        : "bg-sf-gray-200 text-sf-gray-400"
                    }`}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      s
                    )}
                  </div>
                  {/* Connector line */}
                  {i < TOTAL_STEPS - 1 && (
                    <div
                      className={`h-0.5 w-8 rounded-full transition-all duration-500 ${
                        step > s ? "bg-emerald-400" : "bg-sf-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Active step label */}
          <p className="mt-2 text-center text-xs font-medium text-sf-gray-400">
            {STEP_LABELS[step - 1]}
          </p>
        </div>
      )}

      {/* Steps */}
      <div className="flex flex-1 items-start justify-center pt-2">
        {step === 1 && (
          <StepQuestion
            stepNumber={1}
            totalSteps={TOTAL_STEPS}
            question="Quel est le sujet de l'article ?"
            hint="Décris le thème principal en une phrase claire et précise."
            placeholder="Ex : Comment construire une stack RevOps en 90 jours…"
            onNext={(value) => {
              setData((d) => ({ ...d, subject: value }));
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <StepQuestion
            stepNumber={2}
            totalSteps={TOTAL_STEPS}
            question="À qui s'adresse-t-il ?"
            hint="Décris le profil du lecteur idéal : rôle, secteur, niveau d'expertise."
            placeholder="Ex : VP Sales, RevOps managers en scale-up B2B SaaS…"
            onNext={(value) => {
              setData((d) => ({ ...d, audience: value }));
              setStep(3);
            }}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <StepQuestion
            stepNumber={3}
            totalSteps={TOTAL_STEPS}
            question="Quel est le message clé à retenir ?"
            hint="La seule idée que le lecteur doit garder en tête après lecture."
            placeholder="Ex : Une bonne stack RevOps réduit le cycle de vente de 30%…"
            onNext={(value) => {
              setData((d) => ({ ...d, message: value }));
              setStep(4);
            }}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <StepCategoryPicker
            categories={categories}
            onSelect={(categoryId) => {
              setData((d) => ({ ...d, categoryId }));
              setStep(5);
            }}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && (
          <StepGenerating
            brief={{
              subject: data.subject,
              audience: data.audience,
              message: data.message,
              categoryId: data.categoryId,
            }}
          />
        )}
      </div>
    </div>
  );
}
