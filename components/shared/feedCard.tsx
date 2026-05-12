"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface PostData {
  id: string | number;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image?: string;
}

interface FeedCardProps {
  post: PostData;
  className?: string;
  isLarge?: boolean;
  isHorizontal?: boolean;
}

export function FeedCard({ post, className = "", isLarge = false, isHorizontal = false }: FeedCardProps) {
  if (!post) return null;

  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(post.image) && !imageFailed;

  if (isHorizontal) {
    return (
      <article 
        className={`group relative flex flex-row overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-text)]/5 ${className}`}
      >
        {/* Image Section - LEFT */}
        <div className="relative w-1/2 shrink-0 overflow-hidden bg-[var(--color-text)]/5">
          {showImage ? (
            <Image
              src={post.image!}
              alt={post.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif italic text-[var(--color-text)]/10 text-xl">
              {post.category}
            </div>
          )}
          
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] tracking-widest text-[var(--color-accent)] font-bold uppercase">
            {post.category}
          </div>
        </div>

        {/* Content Section - RIGHT */}
        <div className="w-1/2 min-w-0 p-8 flex flex-col h-full">
          <div className="min-h-0">
            <div className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--color-text)]/40">
              <span>{post.readTime}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>

            <Link href={`/blog/${post.id}`}>
              <h3 className="font-serif text-2xl text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-accent)] leading-tight mb-4">
                {post.title}
              </h3>
            </Link>

            <p className="text-[var(--color-text)]/70 font-light leading-relaxed line-clamp-3 text-sm">
              {post.excerpt}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
            <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-bold hover:underline underline-offset-4">
              Read Essay →
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-text)]/5 ${className}`}
    >
      {/* Image Section */}
      <div className={`relative w-full shrink-0 overflow-hidden bg-[var(--color-text)]/5 ${isLarge ? "flex-grow" : "h-40"}`}>
        {showImage ? (
          <Image
            src={post.image!}
            alt={post.title}
            fill
            sizes={isLarge ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center font-serif italic text-[var(--color-text)]/10 text-xl">
            {post.category}
          </div>
        )}
        
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] tracking-widest text-[var(--color-accent)] font-bold uppercase">
          {post.category}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--color-text)]/40">
          <span>{post.readTime}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>

        <Link href={`/blog/${post.id}`}>
          <h3 className={`font-serif text-[var(--color-text)] transition-colors duration-300 group-hover:text-[var(--color-accent)] leading-tight ${isLarge ? "mb-3 text-3xl" : "mb-2 text-lg line-clamp-2"}`}>
            {post.title}
          </h3>
        </Link>

        <p className={`text-[var(--color-text)]/70 font-light leading-relaxed line-clamp-2 ${isLarge ? "text-base" : "text-xs"}`}>
          {post.excerpt}
        </p>

        <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
           <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[var(--color-accent)] font-bold hover:underline underline-offset-4">
            Read Essay →
          </Link>
        </div>
      </div>
    </article>
  );
}