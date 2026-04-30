"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
} from "lucide-react";
import type { TipTapContent } from "@/types";

interface TipTapEditorProps {
  initialContent?: TipTapContent | null;
  onChange?: (content: TipTapContent) => void;
}

export function TipTapEditor({ initialContent, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "underline text-sf-blue" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full" } }),
    ],
    content: initialContent ?? undefined,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON() as TipTapContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose-scalefast min-h-[400px] outline-none px-6 py-5 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  function setLink() {
    const url = window.prompt("URL :");
    if (!url) return;
    editor!.chain().focus().setLink({ href: url }).run();
  }

  function addImage() {
    const url = window.prompt("URL de l'image :");
    if (!url) return;
    editor!.chain().focus().setImage({ src: url }).run();
  }

  const toolbarBtnClass = (isActive: boolean) =>
    `p-1.5 rounded-lg text-sm transition-colors ${
      isActive
        ? "bg-sf-blue text-white"
        : "text-sf-gray-600 hover:bg-sf-gray-100 hover:text-sf-navy"
    }`;

  return (
    <div className="overflow-hidden rounded-2xl border border-sf-gray-200 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-sf-gray-200 bg-sf-gray-100 px-3 py-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtnClass(editor.isActive("bold"))}
          title="Gras"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarBtnClass(editor.isActive("italic"))}
          title="Italique"
        >
          <Italic size={16} />
        </button>

        <div className="mx-1 h-4 w-px bg-sf-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarBtnClass(editor.isActive("heading", { level: 2 }))}
          title="Titre H2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={toolbarBtnClass(editor.isActive("heading", { level: 3 }))}
          title="Titre H3"
        >
          <Heading3 size={16} />
        </button>

        <div className="mx-1 h-4 w-px bg-sf-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtnClass(editor.isActive("bulletList"))}
          title="Liste à puces"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarBtnClass(editor.isActive("orderedList"))}
          title="Liste numérotée"
        >
          <ListOrdered size={16} />
        </button>

        <div className="mx-1 h-4 w-px bg-sf-gray-200" />

        <button
          type="button"
          onClick={setLink}
          className={toolbarBtnClass(editor.isActive("link"))}
          title="Lien"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className={toolbarBtnClass(false)}
          title="Image"
        >
          <ImageIcon size={16} />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
