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

export function NewArticleWizard({ categories }: NewArticleWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<WizardState>({
    subject: "",
    audience: "",
    message: "",
    categoryId: "",
  });

  // Progress bar width
  const progress = Math.round((step / 5) * 100);

  return (
    <div className="flex min-h-[70vh] flex-col">
      {/* Progress bar */}
      <div className="mb-8 h-1.5 w-full overflow-hidden rounded-full bg-sf-gray-200">
        <div
          className="h-full rounded-full bg-sf-blue transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="flex flex-1 items-start justify-center pt-4">
        {step === 1 && (
          <StepQuestion
            stepNumber={1}
            question="Quel est le sujet de l'article ?"
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
            question="À qui s'adresse-t-il ?"
            placeholder="Ex : VP Sales, RevOps managers en scale-up B2B SaaS…"
            onNext={(value) => {
              setData((d) => ({ ...d, audience: value }));
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <StepQuestion
            stepNumber={3}
            question="Quel est le message clé à retenir ?"
            placeholder="Ex : Une bonne stack RevOps réduit le cycle de vente de 30%…"
            onNext={(value) => {
              setData((d) => ({ ...d, message: value }));
              setStep(4);
            }}
          />
        )}

        {step === 4 && (
          <StepCategoryPicker
            categories={categories}
            onSelect={(categoryId) => {
              setData((d) => ({ ...d, categoryId }));
              setStep(5);
            }}
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
