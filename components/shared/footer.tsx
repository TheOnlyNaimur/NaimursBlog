import Link from "next/link";
import { ArrowUpRight, Mail, Rss } from "lucide-react";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";


const footerLinks = [
  { href: "/", label: "Feed" },
  { href: "/news", label: "News" },
  { href: "/general", label: "Library" },
  { href: "/creator", label: "Studio" },
];

const topicLinks = [
  { href: "/?tab=technical", label: "Technical writing" },
  { href: "/?tab=general", label: "Essays" },
  { href: "/?tab=featured", label: "Featured" },
  { href: "/archive", label: "Archive" },
];

const socialLinks = [
  { href: "https://github.com", label: "GitHub", icon: FaGithub },
  { href: "https://x.com", label: "X", icon: FaXTwitter },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedin },
  { href: "/rss.xml", label: "RSS", icon: Rss },
];


export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div className="space-y-6">
            <Link
              href="/"
              className="font-serif text-3xl tracking-tight text-[var(--color-text)]"
            >
              Naimurs Blog
            </Link>

            <p className="max-w-xl text-sm leading-relaxed text-[var(--color-text)]/65">
              Notes on software engineering, research, systems, and thoughtful
              digital craft. Built like an editorial desk, with space for ideas
              that deserve to breathe.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:hello@naimursblog.com"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text)]/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <Mail className="h-3.5 w-3.5" />
                hello@naimursblog.com
              </a>

              <Link
                href="/archive"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text)]/70 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                Browse archive
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--color-text)]/45">
              Explore
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-[var(--color-text)]/75 transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-5 text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--color-text)]/45">
              Topics
            </h3>
            <nav className="flex flex-col gap-3 text-sm">
              {topicLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="w-fit text-[var(--color-text)]/75 transition-colors hover:text-[var(--color-accent)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-[var(--color-border)] pt-8 lg:grid-cols-[1.3fr_1fr]">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/45">
              Stay connected
            </p>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--color-text)]/60">
              A quiet weekly digest of new essays, notes, and experiments from
              the studio.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              const isExternal = item.href.startsWith("http");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-white/50 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text)]/65 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-[10px] uppercase tracking-[0.2em] text-[var(--color-text)]/65 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Naimurs Blog</p>
          <p>Designed with a calm editorial rhythm</p>
        </div>
      </div>
    </footer>
  );
}
