"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteArticleAction } from "@/app/(admin)/admin/actions";

interface DeleteArticleButtonProps {
  id: string;
  title: string;
  onDeleted: (id: string) => void;
}

export function DeleteArticleButton({ id, title, onDeleted }: DeleteArticleButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    startTransition(async () => {
      const result = await deleteArticleAction(id);
      if (!result.error) {
        onDeleted(id);
      }
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          className="flex items-center gap-1 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : null}
          Confirmer
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-lg px-2 py-1 text-xs text-sf-gray-600 hover:bg-sf-gray-100"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Supprimer "${title}"`}
      className="rounded-lg p-1.5 text-sf-gray-400 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 size={15} />
    </button>
  );
}
