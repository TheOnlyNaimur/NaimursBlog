import { Plus, Trash2 } from "lucide-react";
import type { BlogAuthor } from "@/components/shared/creator/blog-editor/blogEditorShell";

type BlogEditorAuthorPanelProps = {
  authors: BlogAuthor[];
  onAuthorsChange: (authors: BlogAuthor[]) => void;
};

export function BlogEditorAuthorPanel({
  authors,
  onAuthorsChange,
}: BlogEditorAuthorPanelProps) {
  function updateAuthor(id: string, key: keyof BlogAuthor, value: string) {
    onAuthorsChange(
      authors.map((author) =>
        author.id === id ? { ...author, [key]: value } : author
      )
    );
  }

  function addAuthor() {
    onAuthorsChange([
      ...authors,
      {
        id: `author-${authors.length + 1}`,
        name: "",
        role: "Co-author",
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
            Ownership and credits
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
            className="rounded-2xl border border-[var(--color-border)] bg-white/55 px-4 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
                    Author name
                  </span>
                  <input
                    value={author.name}
                    onChange={(event) =>
                      updateAuthor(author.id, "name", event.target.value)
                    }
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
                    Role
                  </span>
                  <input
                    value={author.role}
                    onChange={(event) =>
                      updateAuthor(author.id, "role", event.target.value)
                    }
                    className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
                  />
                </label>
              </div>

              <div className="flex items-start gap-2">
                <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/50">
                  {index === 0 ? "Default" : "Optional"}
                </span>

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
