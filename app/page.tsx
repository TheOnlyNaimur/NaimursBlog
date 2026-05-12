"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/navbar";
import { NewsletterCard } from "@/components/shared/newsletterCard";
import { FeedCard } from "@/components/shared/feedCard";
import { posts } from "@/lib/mockdata/posts";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("ALL POSTS");

  const filteredPosts =
    activeTab === "ALL POSTS"
      ? posts
      : posts.filter((post) => post.category === activeTab);

  return (
    <>
      <Navbar title="Naimurs Blog" />

      <main className="mx-auto w-full max-w-6xl px-6 py-12 pb-24">
        <header className="mb-12 flex items-end justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text)]/60">
              Archive
            </p>
            <h2 className="font-serif text-[24px] italic text-[var(--color-text)]">
              The Curated Feed
            </h2>
          </div>

          <nav className="flex gap-8 text-[11px] font-medium uppercase tracking-[0.15em]">
            {["ALL POSTS", "TECHNICAL", "GENERAL"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`pb-4 -mb-[17px] transition-all duration-300 ${
                  activeTab === tab
                    ? "border-b-2 border-[var(--color-accent)] text-[var(--color-text)]"
                    : "text-[var(--color-text)]/40 hover:text-[var(--color-text)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_320px]">
          <div className="space-y-12">
            {filteredPosts[0] && (
              <div className="h-80">
                <FeedCard
                  post={filteredPosts[0]}
                  isHorizontal
                  className="h-full"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredPosts.slice(1, 3).map((post) => (
                <div key={post.id} className="h-80">
                  <FeedCard post={post} className="h-full" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredPosts.slice(3, 5).map((post) => (
                <div key={post.id} className="h-80">
                  <FeedCard post={post} className="h-full" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {filteredPosts.slice(5, 7).map((post) => (
                <div key={post.id} className="h-80">
                  <FeedCard post={post} className="h-full" />
                </div>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <p className="text-sm text-[var(--color-text)]/50">
                No posts available in this category.
              </p>
            )}
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <NewsletterCard />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
