"use client";

export function NewsletterCard() {
  return (
    <aside className="hidden lg:block w-full">
      {/* Sticky sidebar that stays in view when scrolling */}
      <div className="sticky top-16 z-30 space-y-10 w-full">
        
        {/* Global Wire Section */}
        <section className="bg-[var(--color-surface)] p-6 rounded-sm border border-[var(--color-border)]">
          <h4 className="text-[10px] tracking-[0.24em] uppercase text-[var(--color-muted)] mb-6 font-medium">
            Global Wire
          </h4>
          <div className="space-y-8">
            <div className="group cursor-pointer">
              <span className="text-[9px] tracking-widest text-[var(--color-accent)] uppercase font-bold">Tech</span>
              <p className="text-sm font-medium leading-snug mt-1 text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                Neural processing units see 40% efficiency boost in localized environments.
              </p>
              <p className="text-[9px] text-[var(--color-text)]/40 mt-2 italic">2h ago</p>
            </div>
            
            <div className="group cursor-pointer border-t border-[var(--color-border)] pt-6">
              <span className="text-[9px] tracking-widest text-[var(--color-accent)] uppercase font-bold">Research</span>
              <p className="text-sm font-medium leading-snug mt-1 text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors">
                DeepMind publishes open-source dataset for protein folding.
              </p>
              <p className="text-[9px] text-[var(--color-text)]/40 mt-2 italic">6h ago</p>
            </div>
          </div>
          
          <button className="w-full mt-8 border border-[var(--color-border)] py-3 text-[9px] uppercase tracking-[0.2em] text-[var(--color-text)]/60 hover:bg-[var(--color-surface)] transition-all">
            View Full Archive
          </button>
        </section>

        {/* Newsletter Signup Section */}
        <section className="p-8 border border-[var(--color-border)] rounded-sm bg-white/30 backdrop-blur-sm">
          <h4 className="text-lg font-serif italic text-[var(--color-text)] mb-2">The Sunday Digest</h4>
          <p className="text-xs text-[var(--color-text)]/60 leading-relaxed mb-6">
            Deep analysis of the week’s most meaningful signals amidst the noise.
          </p>
          
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-sm outline-none focus:border-[var(--color-accent)] transition-all placeholder:text-[var(--color-text)]/30"
            />
            <button className="w-full bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-[0.25em] py-4 mt-2 shadow-sm hover:bg-[var(--color-accent-dark)] transition-all active:scale-[0.98]">
              Subscribe
            </button>
          </div>
        </section>

      </div>
    </aside>
  );
}
