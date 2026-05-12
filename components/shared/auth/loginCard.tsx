"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/toastProvider";

type AuthMode = "login" | "register";

type LoginCardProps = {
  onClose: () => void;
};

export function LoginCard({ onClose }: LoginCardProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const { showToast } = useToast();

  const isLogin = mode === "login";

  function toggleMode() {
    setFormMessage(null);
    setMode((current) => (current === "login" ? "register" : "login"));
  }

  function clearInputs() {
    setName("");
    setEmail("");
    setPassword("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        mode === "login"
          ? { email, password }
          : { name, email, password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setFormMessage(data.message ?? "Something went wrong.");
        showToast({
          title: "Auth failed",
          message: data.message ?? "Something went wrong.",
          variant: "error",
        });
        return;
      }

      window.dispatchEvent(new Event("auth-changed"));

      if (mode === "login") {
        showToast({
          title: "Login successful",
          message: "Welcome back to the creator space.",
          variant: "success",
        });
        clearInputs();
        onClose();
        return;
      }

      showToast({
        title: "Registration complete",
        message: "Your account is ready. You can log in now.",
        variant: "success",
      });
      setFormMessage("Account created. You can log in now.");
      setMode("login");
      clearInputs();
    } catch {
      setFormMessage("Network error. Please try again.");
      showToast({
        title: "Network error",
        message: "Please try again in a moment.",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative w-full" style={{ perspective: "1400px" }}>
      <div
        className="relative min-h-[560px] w-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isLogin ? "rotateY(0deg)" : "rotateY(180deg)",
        }}
      >
        <section
          className="absolute inset-0 rounded-2xl border border-white/15 bg-[rgba(253,252,240,0.12)] p-8 shadow-2xl shadow-black/15 backdrop-blur-2xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[var(--color-text)] transition-colors hover:bg-white/20"
            aria-label="Close login"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-8 pr-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/50">
              Welcome Back
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--color-text)]">
              Login
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/65">
              Enter the creator space with your credentials.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
                Email
              </span>
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                <Mail className="h-4 w-4 text-[var(--color-text)]/45" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text)]/30"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
                Password
              </span>
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                <Lock className="h-4 w-4 text-[var(--color-text)]/45" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text)]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-[var(--color-text)]/45 transition-colors hover:text-[var(--color-accent)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition-all hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Please wait" : "Login"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {formMessage ? (
            <p className="mt-4 text-sm text-[var(--color-text)]/70">
              {formMessage}
            </p>
          ) : null}

          <div className="mt-8 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm text-[var(--color-text)]/65">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-dark)]"
              >
                Register
              </button>
            </p>
          </div>
        </section>

        <section
          className="absolute inset-0 rounded-2xl border border-white/15 bg-[rgba(253,252,240,0.12)] p-8 shadow-2xl shadow-black/15 backdrop-blur-2xl"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-[var(--color-text)] transition-colors hover:bg-white/20"
            aria-label="Close register"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-8 pr-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--color-text)]/50">
              Create Account
            </p>
            <h2 className="mt-3 font-serif text-3xl text-[var(--color-text)]">
              Register
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text)]/65">
              Enter the hidden creator portal with a new account.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
                Name
              </span>
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                <User className="h-4 w-4 text-[var(--color-text)]/45" />
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text)]/30"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
                Email
              </span>
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                <Mail className="h-4 w-4 text-[var(--color-text)]/45" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text)]/30"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.24em] text-[var(--color-text)]/55">
                Password
              </span>
              <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-3">
                <Lock className="h-4 w-4 text-[var(--color-text)]/45" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--color-text)]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-[var(--color-text)]/45 transition-colors hover:text-[var(--color-accent)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--color-accent)] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-white transition-all hover:bg-[var(--color-accent-dark)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Please wait" : "Register"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {formMessage ? (
            <p className="mt-4 text-sm text-[var(--color-text)]/70">
              {formMessage}
            </p>
          ) : null}

          <div className="mt-8 border-t border-[var(--color-border)] pt-5">
            <p className="text-sm text-[var(--color-text)]/65">
              Already have an account?{" "}
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-[var(--color-accent)] transition-colors hover:text-[var(--color-accent-dark)]"
              >
                Login
              </button>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
