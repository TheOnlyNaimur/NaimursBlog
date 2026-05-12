"use client";

type LibraryEditorNotesPanelProps = {
  notes: string;
  onNotesChange: (value: string) => void;
};

export function LibraryEditorNotesPanel({
  notes,
  onNotesChange,
}: LibraryEditorNotesPanelProps) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
        Notes
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
        Summary and takeaways
      </h2>
      <textarea
        value={notes}
        onChange={(event) => onNotesChange(event.target.value)}
        placeholder="Write why this resource matters, the summary, and your personal notes..."
        className="mt-5 min-h-56 w-full rounded-3xl border border-[var(--color-border)] bg-white/70 px-4 py-4 text-sm leading-7 text-[var(--color-text)] outline-none placeholder:text-[var(--color-text)]/35 focus:border-[var(--color-accent)]"
      />
    </section>
  );
}
