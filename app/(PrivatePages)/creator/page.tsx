const overviewStats = [
  { label: "Drafts", value: "12" },
  { label: "Published", value: "48" },
  { label: "Library Items", value: "87" },
  { label: "Users", value: "142" },
] as const;

const quickActions = [
  "Open blog editor",
  "Review latest posts",
  "Add a research item",
  "Check newsletter inbox",
] as const;

export default function CreatorOverviewPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.72)] p-5 shadow-lg shadow-black/5 backdrop-blur-xl"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
              {stat.label}
            </p>
            <p className="mt-4 text-4xl font-semibold text-[var(--color-text)]">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.72)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Workspace
          </p>
          <h3 className="mt-3 font-serif text-2xl text-[var(--color-text)]">
            Start from the sidebar
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text)]/65">
            This shell is ready for your editors, management tools, and user
            controls. Each area can grow into its own route when we start
            building the real features.
          </p>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[rgba(253,252,240,0.72)] p-6 shadow-lg shadow-black/5 backdrop-blur-xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-text)]/45">
            Quick Actions
          </p>
          <ul className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <li
                key={action}
                className="rounded-2xl border border-[var(--color-border)] bg-white/50 px-4 py-3 text-sm text-[var(--color-text)]/75"
              >
                {action}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
