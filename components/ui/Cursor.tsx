"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

/**
 * A single restrained ring that trails the pointer and tightens over
 * interactive elements. Pointer-fine devices only; native cursor stays.
 */
export default function Cursor() {
  const reduced = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const ring = ringRef.current;
    if (!ring) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let visible = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!visible) {
        visible = true;
        ring.style.opacity = "1";
        rx = x;
        ry = y;
      }
      const el = e.target as HTMLElement | null;
      targetScale = el?.closest("a,button,[data-cursor]") ? 1.9 : 1;
    };

    const onLeave = () => {
      visible = false;
      ring.style.opacity = "0";
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.18;
      ring.style.transform = `translate3d(${rx - 14}px, ${ry - 14}px, 0) scale(${scale})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-99 h-7 w-7 rounded-full border border-bone/60 opacity-0 transition-opacity duration-300 max-md:hidden"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
