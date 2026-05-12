"use client";

type CreatorTransitionOverlayProps = {
  phase: number;
};

export function CreatorTransitionOverlay({
  phase,
}: CreatorTransitionOverlayProps) {
  return (
    <div className="fixed inset-0 z-[80] overflow-hidden bg-transparent">
      <div className="absolute inset-0 bg-[rgba(20,13,11,0.22)] backdrop-blur-[4px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,169,117,0.14),transparent_34%),radial-gradient(circle_at_center,rgba(255,241,219,0.05),transparent_30%),radial-gradient(circle_at_center,rgba(10,7,5,0.06),transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,8,6,0.06),rgba(13,8,6,0.9))]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={`relative transition-all duration-[1450ms] ease-in-out ${
            phase >= 4
              ? "h-[240vmax] w-[240vmax]"
              : phase >= 3
                ? "h-[92vmax] w-[92vmax]"
                : phase >= 2
                  ? "h-[42vmin] w-[42vmin]"
                  : phase >= 1
                    ? "h-[18vmin] w-[18vmin]"
                    : "h-[14vmin] w-[14vmin]"
          }`}
        >
          <div className={`creator-transition-core ${phase >= 1 ? "creator-transition-core-spin" : ""}`} />
          <div className={`creator-transition-aura creator-transition-aura-a ${phase >= 1 ? "creator-transition-aura-spin" : ""}`} />
          <div className={`creator-transition-aura creator-transition-aura-b ${phase >= 2 ? "creator-transition-aura-spin-reverse" : ""}`} />
          <div className={`creator-transition-glow creator-transition-glow-${phase}`} />
        </div>
      </div>

      <style jsx global>{`
        .creator-transition-core {
          position: absolute;
          inset: 0;
          margin: auto;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 9999px;
          background: radial-gradient(
            circle at 40% 35%,
            rgba(255, 249, 241, 0.96) 0%,
            rgba(246, 228, 198, 0.88) 24%,
            rgba(226, 179, 120, 0.72) 62%,
            rgba(93, 56, 38, 0.96) 100%
          );
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.035),
            0 0 26px rgba(214, 169, 117, 0.14),
            0 0 58px rgba(214, 169, 117, 0.08);
          transform-origin: center;
          opacity: 0.98;
        }

        .creator-transition-core-spin {
          animation: creator-transition-core-spin 11s linear infinite;
        }

        .creator-transition-aura {
          position: absolute;
          inset: 0;
          margin: auto;
          border-radius: 9999px;
          background: conic-gradient(
            from 0deg,
            rgba(255, 244, 224, 0) 0deg,
            rgba(255, 244, 224, 0.05) 14deg,
            rgba(214, 169, 117, 0.48) 32deg,
            rgba(255, 244, 224, 0.12) 56deg,
            rgba(214, 169, 117, 0.18) 90deg,
            rgba(255, 244, 224, 0) 360deg
          );
          -webkit-mask: radial-gradient(
            closest-side,
            transparent 60%,
            #000 63%,
            #000 68%,
            transparent 71%
          );
          mask: radial-gradient(
            closest-side,
            transparent 60%,
            #000 63%,
            #000 68%,
            transparent 71%
          );
          filter: blur(5px);
          opacity: 0.84;
          transform-origin: center;
        }

        .creator-transition-aura-a {
          width: 74%;
          height: 74%;
        }

        .creator-transition-aura-b {
          width: 112%;
          height: 112%;
          opacity: 0.58;
          filter: blur(7px);
        }

        .creator-transition-aura-spin {
          animation: creator-transition-aura-spin 14s linear infinite;
        }

        .creator-transition-aura-spin-reverse {
          animation: creator-transition-aura-spin 9s linear infinite reverse;
        }

        .creator-transition-glow {
          position: absolute;
          inset: -36%;
          border-radius: 9999px;
          background: radial-gradient(
            circle,
            rgba(255, 244, 224, 0.2) 0%,
            rgba(214, 169, 117, 0.15) 26%,
            rgba(214, 169, 117, 0.08) 42%,
            transparent 74%
          );
          filter: blur(18px);
          opacity: 0.88;
          transform-origin: center;
          animation: creator-transition-glow-pulse 3.8s ease-in-out infinite;
        }

        .creator-transition-glow-0 {
          opacity: 0.72;
        }

        .creator-transition-glow-1 {
          opacity: 0.8;
        }

        .creator-transition-glow-2 {
          opacity: 0.92;
        }

        .creator-transition-glow-3,
        .creator-transition-glow-4 {
          opacity: 0.78;
        }

        @keyframes creator-transition-core-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes creator-transition-aura-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes creator-transition-glow-pulse {
          0%,
          100% {
            transform: scale(0.96);
            opacity: 0.72;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
