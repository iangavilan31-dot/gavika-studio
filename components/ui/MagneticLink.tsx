"use client";

import Link from "next/link";
import { useRef, type ReactNode, type ComponentProps } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";

type Props = {
  href: ComponentProps<typeof Link>["href"];
  children: ReactNode;
  className?: string;
};

/** A link that leans toward the pointer — used sparingly, for the one CTA per view. */
export default function MagneticLink({ href, children, className = "" }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.PointerEvent) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = ref.current;
    const sp = inner.current;
    if (!el || !sp) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate(${dx * 7}px, ${dy * 6}px)`;
    sp.style.transform = `translate(${dx * 4}px, ${dy * 3}px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    const sp = inner.current;
    if (!el || !sp) return;
    el.style.transition = "transform .7s var(--ease)";
    sp.style.transition = "transform .7s var(--ease)";
    el.style.transform = "translate(0,0)";
    sp.style.transform = "translate(0,0)";
    window.setTimeout(() => {
      el.style.transition = "";
      sp.style.transition = "";
    }, 700);
  };

  return (
    <Link
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-cursor
      className={`invert-action inline-block border border-bone/40 px-8 py-4 text-center uppercase tracking-[0.12em] text-[0.8rem] font-semibold text-bone ${className}`}
      style={{ fontStretch: "115%" }}
    >
      <span ref={inner} className="inline-block">
        {children}
      </span>
    </Link>
  );
}
