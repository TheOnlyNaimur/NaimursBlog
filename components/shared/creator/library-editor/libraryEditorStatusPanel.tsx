"use client";

type LibraryEditorStatusPanelProps = {
  status: "draft" | "published";
  featured: boolean;
  pinned: boolean;
  visible: boolean;
  priority: string;
  onStatusChange: (value: "draft" | "published") => void;
  onFeaturedChange: (value: boolean) => void;
  onPinnedChange: (value: boolean) => void;
  onVisibleChange: (value: boolean) => void;
  onPriorityChange: (value: string) => void;
};

export function LibraryEditorStatusPanel({
  status,
  featured,
  pinned,
  visible,
  priority,
  onStatusChange,
  onFeaturedChange,
  onPinnedChange,
  onVisibleChange,
  onPriorityChange,
}: LibraryEditorStatusPanelProps) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
        Visibility
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
        Library control
      </h2>

      <div className="mt-5 grid gap-3">
        {[
          {
            label: "Draft",
            description: "Keep it private until you're ready.",
            active: status === "draft",
            onClick: () => onStatusChange("draft"),
          },
          {
            label: "Published",
            description: "Show it on the public library page.",
            active: status === "published",
            onClick: () => onStatusChange("published"),
          },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={option.onClick}
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              option.active
                ? "border-[var(--color-accent)] bg-[rgba(214,169,117,0.12)]"
                : "border-[var(--color-border)] bg-white/60 hover:border-[var(--color-accent)]"
            }`}
          >
            <p className="text-sm font-medium text-[var(--color-text)]">
              {option.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text)]/55">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3">
        {[
          {
            label: "Featured",
            description: "Lift this item visually in the library.",
            value: featured,
            onClick: () => onFeaturedChange(!featured),
          },
          {
            label: "Pinned",
            description: "Keep this item near the top.",
            value: pinned,
            onClick: () => onPinnedChange(!pinned),
          },
          {
            label: "Visible",
            description: "Make this item available in public lists.",
            value: visible,
            onClick: () => onVisibleChange(!visible),
          },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={option.onClick}
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              option.value
                ? "border-[var(--color-accent)] bg-[rgba(214,169,117,0.12)]"
                : "border-[var(--color-border)] bg-white/60 hover:border-[var(--color-accent)]"
            }`}
          >
            <p className="text-sm font-medium text-[var(--color-text)]">
              {option.label}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text)]/55">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white/60 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
          Priority
        </p>
        <input
          value={priority}
          onChange={(event) => onPriorityChange(event.target.value)}
          placeholder="01"
          className="mt-3 w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
        />
      </div>
    </section>
  );
}
