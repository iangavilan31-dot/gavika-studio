"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/providers/Providers";

const PRIMARY = [
  { href: "/", label: "Home", index: "01" },
  { href: "/work", label: "Work", index: "02" },
  { href: "/lab", label: "Lab", index: "03" },
  { href: "/performance", label: "Performance", index: "04" },
  { href: "/contact", label: "Contact", index: "05" },
] as const;

const CASES = [
  { href: "/work/avelum", label: "Avelum", note: "Hypercar reveal" },
  { href: "/work/solve", label: "Sölve", note: "Fragrance house" },
  { href: "/work/obsidian-reserve", label: "Obsidian Reserve", note: "Rare single malt" },
] as const;

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect x="1" y="1" width="16" height="16" fill="none" stroke="currentColor" />
        <path d="M1 17 L17 1" stroke="currentColor" fill="none" />
        <rect x="10.5" y="10.5" width="6.5" height="6.5" fill="currentColor" />
      </svg>
      <span
        className="text-[0.95rem] font-semibold uppercase tracking-[0.08em]"
        style={{ fontStretch: "122%" }}
      >
        Gavika
      </span>
    </span>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    getLenis()?.start();
    document.documentElement.style.overflow = "";
    menuButtonRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setOpen(true);
    getLenis()?.stop();
    document.documentElement.style.overflow = "hidden";
  }, []);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // close on route change
  useEffect(() => {
    if (open) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <header className="gutter fixed inset-x-0 top-0 z-90 flex items-center justify-between py-5">
        <Link
          href="/"
          aria-label="Gavika — home"
          className="text-bone transition-opacity duration-500 hover:opacity-70"
          data-cursor
        >
          <Wordmark />
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/contact"
            className="t-label t-label-bone u-link hidden sm:block"
            data-cursor
          >
            Start a project
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={openMenu}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="t-label t-label-bone flex items-center gap-2.5"
            data-cursor
          >
            <span className="flex flex-col gap-1" aria-hidden="true">
              <span className="block h-px w-5 bg-current" />
              <span className="block h-px w-5 bg-current" />
            </span>
            Menu
          </button>
        </div>
      </header>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={`fixed inset-0 z-95 bg-carbon transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ transitionTimingFunction: "var(--ease)" }}
      >
        <div className="gutter flex items-center justify-between py-5">
          <span className="text-bone">
            <Wordmark />
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            className="t-label t-label-bone"
            data-cursor
          >
            Close
          </button>
        </div>

        <nav
          aria-label="Primary"
          className="gutter mt-[8vh] grid grid-cols-1 gap-y-12 md:grid-cols-12"
        >
          <ul className="md:col-span-7">
            {PRIMARY.map((item, i) => (
              <li
                key={item.href}
                className="hairline-t overflow-hidden"
                style={{
                  transition: `opacity .7s var(--ease) ${80 * i}ms, transform .7s var(--ease) ${80 * i}ms`,
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(1.4rem)",
                }}
              >
                <Link
                  href={item.href}
                  className="group flex items-baseline gap-6 py-4 md:py-5"
                  data-cursor
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <span className="t-label w-8">{item.index}</span>
                  <span className="t-title transition-transform duration-500 group-hover:translate-x-3">
                    {item.label}
                  </span>
                  {pathname === item.href && (
                    <span className="t-label ml-auto">Here</span>
                  )}
                </Link>
              </li>
            ))}
            <li className="hairline-t" aria-hidden="true" />
          </ul>

          <div
            className="md:col-span-4 md:col-start-9"
            style={{
              transition: `opacity .7s var(--ease) 400ms`,
              opacity: open ? 1 : 0,
            }}
          >
            <p className="t-label mb-5">Selected work</p>
            <ul className="flex flex-col gap-3">
              {CASES.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="group block" data-cursor>
                    <span className="u-link text-bone">{c.label}</span>
                    <span className="t-label ml-3">{c.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="t-label mt-12">New business</p>
            <a
              href="mailto:studio@gavika.com"
              className="u-link mt-2 inline-block text-bone"
              data-cursor
            >
              studio@gavika.com
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
