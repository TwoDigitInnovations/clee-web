"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { useEffect } from "react";

import { Bold, Italic, Underline as UnderlineIcon, List } from "lucide-react";

export default function TipTapEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 outline-none prose max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg">

      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2 flex-wrap">

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <Bold size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <Italic size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <UnderlineIcon size={18} />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <List size={18} />
        </button>

      </div>

      <EditorContent editor={editor} />

    </div>
  );
}
