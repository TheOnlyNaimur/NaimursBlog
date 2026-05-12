type BlogEditorStatusPanelProps = {
  status: "draft" | "published";
  featured: boolean;
  keepInFeed: boolean;
  feedOrder: string;
  onStatusChange: (value: "draft" | "published") => void;
  onFeaturedChange: (value: boolean) => void;
  onKeepInFeedChange: (value: boolean) => void;
  onFeedOrderChange: (value: string) => void;
};

const categoryOptions = ["Technical", "General", "Documentation"] as const;

export function BlogEditorStatusPanel({
  status,
  featured,
  keepInFeed,
  feedOrder,
  onStatusChange,
  onFeaturedChange,
  onKeepInFeedChange,
  onFeedOrderChange,
}: BlogEditorStatusPanelProps) {
  return (
    <section className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.9)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
        Publishing
      </p>
      <h2 className="mt-2 font-serif text-2xl text-[var(--color-text)]">
        Visibility and order
      </h2>

      <div className="mt-5 grid gap-3">
        {[
          {
            label: "Draft",
            description: "Hide from public pages until you publish.",
            active: status === "draft",
            onClick: () => onStatusChange("draft"),
          },
          {
            label: "Published",
            description: "Show the post on the blogs page.",
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
                : "border-[var(--color-border)] bg-white/55 hover:border-[var(--color-accent)]"
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
            description: "Highlight this article as a featured post.",
            value: featured,
            onClick: () => onFeaturedChange(!featured),
          },
          {
            label: "Keep in Feed",
            description: "Include it on the homepage feed too.",
            value: keepInFeed,
            onClick: () => onKeepInFeedChange(!keepInFeed),
          },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={option.onClick}
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              option.value
                ? "border-[var(--color-accent)] bg-[rgba(214,169,117,0.12)]"
                : "border-[var(--color-border)] bg-white/55 hover:border-[var(--color-accent)]"
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

      <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-white/55 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
          Feed order
        </p>
        <label className="mt-3 block">
          <span className="mb-2 block text-sm text-[var(--color-text)]/68">
            Feed ID
          </span>
          <input
            value={feedOrder}
            onChange={(event) => onFeedOrderChange(event.target.value)}
            className="w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
        </label>
      </div>

      <div className="mt-5 rounded-2xl border border-[rgba(214,169,117,0.22)] bg-[rgba(214,169,117,0.1)] px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
          Category
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {categoryOptions.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[rgba(214,169,117,0.22)] bg-white/55 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/65"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
