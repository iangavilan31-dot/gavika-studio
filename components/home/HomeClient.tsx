"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/reduced-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { buildChoreography, playIntro } from "./choreography";
import Preloader from "./Preloader";

const HomeScene = dynamic(() => import("./HomeScene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Orchestrates the homepage film: preloader → scene reveal → scroll
 * choreography. Under reduced motion (or no WebGL) it renders nothing
 * extra — the server-rendered document IS the linear edit.
 */
export default function HomeClient({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [gl, setGl] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(0);
  const [sceneReady, setSceneReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const choreographed = useRef(false);

  useEffect(() => {
    setGl(webglAvailable());
  }, []);

  const cinematic = !reduced && gl === true;

  // safety: if the scene never reports ready, release the preloader anyway
  useEffect(() => {
    if (!cinematic || sceneReady) return;
    const t = setTimeout(() => setSceneReady(true), 4000);
    return () => clearTimeout(t);
  }, [cinematic, sceneReady]);

  const onExited = useCallback(() => {
    setRevealed(true);
    playIntro();
  }, []);

  // choreography mounts once the film starts
  useEffect(() => {
    if (!cinematic || !revealed || choreographed.current) return;
    choreographed.current = true;
    const cleanup = buildChoreography();
    // late layout shifts (fonts, viewport) — remeasure
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      cleanup();
      choreographed.current = false;
    };
  }, [cinematic, revealed]);

  // lock scroll during the preloader; pre-hide the hero so the exit wipe
  // reveals darkness, not a fully-formed title
  useEffect(() => {
    if (!cinematic) return;
    if (!revealed) {
      document.documentElement.style.overflow = "hidden";
      window.scrollTo(0, 0);
      gsap.set("[data-hero-char]", { opacity: 0 });
      gsap.set("[data-hero-fade]", { opacity: 0 });
    } else {
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [cinematic, revealed]);

  return (
    <div data-cinematic={cinematic || undefined}>
      {cinematic && (
        <>
          <HomeScene onProgress={setProgress} onReady={() => setSceneReady(true)} />
          {!revealed && (
            <Preloader progress={progress} done={sceneReady} onExited={onExited} />
          )}
        </>
      )}
      {children}
    </div>
  );
}
