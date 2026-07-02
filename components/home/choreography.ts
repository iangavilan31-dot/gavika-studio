"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { sceneState, FORMATIONS as F } from "@/lib/scene-state";

/** case hues in linear-ish rgb — the only color the site ever takes */
const HUES = {
  bone: [0.92, 0.9, 0.86],
  avelum: [0.7, 0.82, 0.9],
  solve: [0.68, 0.78, 0.56],
  obsidian: [0.92, 0.55, 0.18],
} as const;

function hueTo(tl: gsap.core.Timeline, hue: readonly number[], pos: gsap.Position, dur = 1) {
  tl.to(
    sceneState.hue,
    { 0: hue[0], 1: hue[1], 2: hue[2], duration: dur, ease: "none" },
    pos
  );
}

/** raise one formation while every other active one falls — total stays ~1 */
function morph(
  tl: gsap.core.Timeline,
  to: number,
  pos: gsap.Position,
  dur = 1
) {
  const targets: Record<string, number> = {};
  for (let i = 0; i < sceneState.weights.length; i++) {
    targets[i] = i === to ? 1 : 0;
  }
  tl.to(sceneState.weights, { ...targets, duration: dur, ease: "none" }, pos);
  // a storm passes through every recomposition
  tl.to(
    sceneState,
    { turbulence: 0.85, duration: dur * 0.4, ease: "none" },
    pos
  );
  tl.to(
    sceneState,
    { turbulence: 0.18, duration: dur * 0.6, ease: "none" },
    `>${0}`
  );
}

/**
 * The intro — plays once, after the preloader exits.
 */
export function playIntro() {
  const tl = gsap.timeline();
  tl.to(sceneState, { revealed: 1, opacity: 0.9, duration: 1.6, ease: "power2.out" }, 0)
    .to(sceneState, { turbulence: 0.2, duration: 1.8, ease: "power2.out" }, 0)
    .to(
      sceneState.weights,
      { [F.CLOUD]: 0, [F.TITLE]: 1, duration: 1.7, ease: "power2.inOut" },
      0.25
    )
    .fromTo(
      "[data-hero-char]",
      { yPercent: 55, opacity: 0, filter: "blur(10px)" },
      {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.0,
        stagger: 0.05,
        ease: "power3.out",
      },
      0.8
    )
    .fromTo(
      "[data-hero-fade]",
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
      1.5
    );
  return tl;
}

/**
 * Every scroll-linked timeline for the homepage film.
 * Returns a cleanup function.
 */
export function buildChoreography(): () => void {
  const ctx = gsap.context(() => {
    /* ————— SC 01 — TITLE: type scatters, dust becomes the monolith ————— */
    const sc01 = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-beat='title']",
        start: "top top",
        end: "bottom top",
        scrub: 0.4,
      },
    });
    sc01.to(
      "[data-hero-char]",
      {
        yPercent: -70,
        opacity: 0,
        filter: "blur(7px)",
        stagger: { each: 0.02, from: "random" },
        ease: "none",
        duration: 0.55,
      },
      0
    );
    sc01.to("[data-hero-fade]", { opacity: 0, duration: 0.3, ease: "none" }, 0);
    morph(sc01, F.MONOLITH, 0.15, 0.7);
    sc01.to(sceneState, { camZ: 13.5, duration: 1, ease: "none" }, 0);

    /* ————— SC 02 — POSITIONING: camera pulls back, the claim resolves ————— */
    const words = gsap.utils.toArray<HTMLElement>(
      "[data-beat='positioning'] [data-word]"
    );
    const sc02 = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-beat='positioning']",
        start: "top 70%",
        end: "bottom 90%",
        scrub: 0.4,
      },
    });
    sc02.fromTo(
      words,
      { opacity: 0.1, filter: "blur(4px)" },
      {
        opacity: 1,
        filter: "blur(0px)",
        stagger: 0.06,
        duration: 0.7,
        ease: "none",
      },
      0
    );
    sc02.to(sceneState, { camZ: 15.2, camY: 0.5, duration: 1, ease: "none" }, 0);

    /* ————— SC 03 — WORK: three recompositions, three hues ————— */
    const panels: Array<{
      sel: string;
      formation: number;
      hue: readonly number[];
      camX: number;
      camY: number;
      lookY: number;
    }> = [
      { sel: "[data-panel='avelum']", formation: F.AIRFLOW, hue: HUES.avelum, camX: 1.6, camY: 0.2, lookY: 0 },
      { sel: "[data-panel='solve']", formation: F.LIQUID, hue: HUES.solve, camX: -1.7, camY: 0, lookY: 0.1 },
      { sel: "[data-panel='obsidian']", formation: F.CASK, hue: HUES.obsidian, camX: 1.2, camY: 1.6, lookY: -0.8 },
    ];

    panels.forEach((p) => {
      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: p.sel,
          start: "top 85%",
          end: "top 15%",
          scrub: 0.5,
        },
      });
      morph(scene, p.formation, 0, 1);
      hueTo(scene, p.hue, 0, 1);
      scene.to(
        sceneState,
        { camX: p.camX, camY: p.camY, lookY: p.lookY, camZ: 12.4, duration: 1, ease: "none" },
        0
      );

      // the panel docks in, holds, releases
      gsap.fromTo(
        `${p.sel} [data-dock]`,
        { y: 90, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: p.sel,
            start: "top 90%",
            end: "top 35%",
            scrub: 0.4,
          },
        }
      );
      gsap.to(`${p.sel} [data-dock]`, {
        y: -60,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: p.sel,
          start: "bottom 60%",
          end: "bottom 20%",
          scrub: 0.4,
        },
      });
    });

    /* ————— SC 04 — PROCESS: the pipeline, travelled left to right ————— */
    const track = document.querySelector<HTMLElement>("[data-process-track]");
    if (track) {
      const distance = () => track.scrollWidth - window.innerWidth;
      const sc04 = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-beat='process']",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });
      morph(sc04, F.PIPELINE, 0, 0.5);
      hueTo(sc04, HUES.bone, 0, 0.5);
      sc04.to(
        sceneState,
        { camX: -4, camY: 0, lookY: 0, camZ: 12, duration: 0.5, ease: "none" },
        0
      );
      sc04.to(track, { x: () => -distance(), duration: 2.4, ease: "none" }, 0.35);
      sc04.to(sceneState, { camX: 4, duration: 2.4, ease: "none" }, 0.35);
      sc04.to(
        "[data-process-progress]",
        { scaleX: 1, duration: 2.4, ease: "none" },
        0.35
      );
    }

    /* ————— SC 05 — MANIFESTO: the field recedes, the argument lands ————— */
    const sc05 = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-beat='manifesto']",
        start: "top 80%",
        end: "top 20%",
        scrub: 0.5,
      },
    });
    morph(sc05, F.CLOUD, 0, 1);
    sc05.to(sceneState, { opacity: 0.34, camX: 0, camY: 0, lookY: 0, camZ: 15, duration: 1, ease: "none" }, 0);

    gsap.utils
      .toArray<HTMLElement>("[data-manifesto-line]")
      .forEach((line) => {
        gsap.fromTo(
          line,
          { opacity: 0.07 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line,
              start: "top 78%",
              end: "top 45%",
              scrub: 0.3,
            },
          }
        );
        gsap.to(line, {
          opacity: 0.14,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 28%",
            end: "top 6%",
            scrub: 0.3,
          },
        });
      });

    /* ————— SC 06 — CREDITS: the dust settles ————— */
    const sc06 = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-beat='credits']",
        start: "top 80%",
        end: "top 10%",
        scrub: 0.5,
      },
    });
    morph(sc06, F.FLOOR, 0, 1);
    sc06.to(
      sceneState,
      { opacity: 0.5, camY: 3.2, camZ: 12.5, lookY: -2.2, turbulence: 0.1, duration: 1, ease: "none" },
      0
    );
    hueTo(sc06, HUES.bone, 0, 1);
  });

  return () => ctx.revert();
}
