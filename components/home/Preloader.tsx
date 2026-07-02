"use client";

import { useEffect, useRef, useState } from "react";

/**
 * BEAT 0 — the slate. A counter that tracks real readiness
 * (fonts + formation build + first GL frame), never a fake spinner.
 */
export default function Preloader({
  progress,
  done,
  onExited,
}: {
  progress: number; // 0..1 real readiness
  done: boolean;
  onExited: () => void;
}) {
  const [shown, setShown] = useState(0);
  const [exiting, setExiting] = useState(false);
  const raf = useRef(0);
  const exitedRef = useRef(false);

  // counter eases toward real progress; completes only when done
  useEffect(() => {
    const tick = () => {
      setShown((s) => {
        const target = done ? 1 : Math.min(progress, 0.92);
        const next = s + (target - s) * 0.08;
        return next > 0.999 ? 1 : next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [progress, done]);

  useEffect(() => {
    if (done && shown >= 1 && !exiting) {
      setExiting(true);
      const t = setTimeout(() => {
        if (!exitedRef.current) {
          exitedRef.current = true;
          onExited();
        }
      }, 950);
      return () => clearTimeout(t);
    }
  }, [done, shown, exiting, onExited]);

  const pct = String(Math.round(shown * 100)).padStart(3, "0");

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-96 flex flex-col justify-between bg-carbon transition-transform duration-[900ms]"
      style={{
        transitionTimingFunction: "var(--ease)",
        transform: exiting ? "translateY(-100%)" : "translateY(0)",
      }}
    >
      <div className="gutter flex items-center justify-between py-5">
        <span className="t-label t-label-bone">Gavika</span>
        <span className="t-label">Digital experience studio</span>
      </div>
      <div className="gutter flex items-end justify-between pb-8">
        <p className="t-serif text-smoke text-[clamp(1rem,2vw,1.4rem)]">
          Setting the stage
        </p>
        <span
          className="t-display tabular-nums leading-none"
          style={{ fontSize: "clamp(4rem, 9vw, 8rem)" }}
        >
          {pct}
        </span>
      </div>
    </div>
  );
}
