"use client";

import { Plus, Trash2 } from "lucide-react";

export type LibraryEditorAuthor = {
  id: string;
  name: string;
};

type LibraryEditorAuthorsPanelProps = {
  authors: LibraryEditorAuthor[];
  onAuthorsChange: (authors: LibraryEditorAuthor[]) => void;
};

export function LibraryEditorAuthorsPanel({
  authors,
  onAuthorsChange,
}: LibraryEditorAuthorsPanelProps) {
  function updateAuthor(id: string, value: string) {
    onAuthorsChange(
      authors.map((author) =>
        author.id === id ? { ...author, name: value } : author
      )
    );
  }

  function addAuthor() {
    onAuthorsChange([
      ...authors,
      {
        id: `author-${authors.length + 1}`,
        name: "",
      },
    ]);
  }

  function removeAuthor(id: string) {
    if (authors.length === 1) {
      return;
    }

    onAuthorsChange(authors.filter((author) => author.id !== id));
  }

  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Authors
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
            Source and ownership
          </h2>
        </div>

        <button
          type="button"
          onClick={addAuthor}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/65 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/65 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
        >
          <Plus className="h-4 w-4" />
          Add author
        </button>
      </div>

      <div className="mt-5 space-y-3">
        {authors.map((author, index) => (
          <div
            key={author.id}
            className="rounded-2xl border border-[var(--color-border)] bg-white/60 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <label className="block flex-1">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
                  Author name
                </span>
                <input
                  value={author.name}
                  onChange={(event) => updateAuthor(author.id, event.target.value)}
                  placeholder={index === 0 ? "Naimur Islam" : "Collaborator"}
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
                />
              </label>

              <div className="pt-6">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => removeAuthor(author.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white/70 text-[var(--color-text)]/55 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                    aria-label="Remove author"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
