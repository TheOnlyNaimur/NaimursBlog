"use client";

import type { JSONContent } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  ImageUp,
  Italic,
  Link2,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Video,
} from "lucide-react";

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
};

type BlogEditorContentCanvasProps = {
  initialContent: JSONContent;
  onContentChange: (content: JSONContent) => void;
};

function ToolbarButton({
  label,
  active = false,
  onClick,
  icon: Icon,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
        active
          ? "border-[var(--color-accent)] bg-[rgba(214,169,117,0.16)] text-[var(--color-accent)]"
          : "border-[var(--color-border)] bg-white/75 text-[var(--color-text)]/70 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      }`}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

export function BlogEditorContentCanvas({
  initialContent,
  onContentChange,
}: BlogEditorContentCanvasProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: false,
        linkOnPaste: true,
      }),
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      Youtube.configure({
        controls: true,
        nocookie: true,
        inline: false,
        modestBranding: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Placeholder.configure({
        placeholder: "Start writing your blog here...",
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor: currentEditor }) => {
      onContentChange(currentEditor.getJSON());
    },
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[420px] cursor-text outline-none focus:outline-none text-[15px] leading-8 text-[var(--color-text)]",
      },
    },
  });

  if (!editor) {
    return (
      <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
        <p className="text-sm text-[var(--color-text)]/65">Loading editor...</p>
      </section>
    );
  }

  function insertImage() {
    const url = window.prompt("Paste an image URL");

    if (!url) {
      return;
    }

    editor.chain().focus().setImage({ src: url }).run();
  }

  function insertVideo() {
    const url = window.prompt("Paste a YouTube URL");

    if (!url) {
      return;
    }

    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function insertLink() {
    const url = window.prompt("Paste a link URL");

    if (!url) {
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="sticky top-4 z-20 rounded-2xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.95)] px-4 py-4 shadow-md shadow-black/5 backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-[var(--color-border)] pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
              Content Canvas
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
              Build the article in blocks
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <ToolbarButton
              label="Undo"
              onClick={() => editor.chain().focus().undo().run()}
              icon={Undo2}
            />
            <ToolbarButton
              label="Redo"
              onClick={() => editor.chain().focus().redo().run()}
              icon={Redo2}
            />
            <ToolbarButton
              label="Bold"
              active={editor.isActive("bold")}
              onClick={() => editor.chain().focus().toggleBold().run()}
              icon={Bold}
            />
            <ToolbarButton
              label="Italic"
              active={editor.isActive("italic")}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              icon={Italic}
            />
            <ToolbarButton
              label="Underline"
              active={editor.isActive("underline")}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              icon={UnderlineIcon}
            />
            <ToolbarButton
              label="Strike"
              active={editor.isActive("strike")}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              icon={Strikethrough}
            />
            <ToolbarButton
              label="Align left"
              active={editor.isActive({ textAlign: "left" })}
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              icon={AlignLeft}
            />
            <ToolbarButton
              label="Align center"
              active={editor.isActive({ textAlign: "center" })}
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              icon={AlignCenter}
            />
            <ToolbarButton
              label="Align right"
              active={editor.isActive({ textAlign: "right" })}
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              icon={AlignRight}
            />
            <ToolbarButton label="Link" onClick={insertLink} icon={Link2} />
            <ToolbarButton
              label="Insert image"
              onClick={insertImage}
              icon={ImageUp}
            />
            <ToolbarButton label="Embed video" onClick={insertVideo} icon={Video} />
            <ToolbarButton
              label="Code block"
              active={editor.isActive("codeBlock")}
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              icon={Code2}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div
          className="rounded-3xl border border-dashed border-[var(--color-border)] bg-white/60 p-6"
          onMouseDown={() => editor.chain().focus().run()}
        >
          <div className="rounded-2xl border border-[rgba(214,169,117,0.12)] bg-[rgba(255,255,255,0.9)] p-5 shadow-sm shadow-black/5">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-text)]/45">
              Article body
            </p>
            <div className="mt-4">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
