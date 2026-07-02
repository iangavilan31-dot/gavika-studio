import Link from "next/link";
import HomeClient from "@/components/home/HomeClient";
import Footer from "@/components/ui/Footer";
import MagneticLink from "@/components/ui/MagneticLink";
import Words from "@/components/ui/Words";

const CASES = [
  {
    id: "avelum",
    index: "W—01",
    name: "Avelum",
    field: "Electric hypercar launch",
    premise:
      "A 1,400 bhp hypercar revealed the way it moves — as light before metal.",
    metric: "42,000",
    metricLabel: "Reveal-day reservations",
    href: "/work/avelum",
    hue: "var(--hue-avelum)",
    align: "start",
  },
  {
    id: "solve",
    index: "W—02",
    name: "Sölve",
    field: "Niche fragrance house",
    premise:
      "An invisible product made tangible — three notes told as light through liquid.",
    metric: "11 days",
    metricLabel: "To a sold-out first run",
    href: "/work/solve",
    hue: "var(--hue-solve)",
    align: "end",
  },
  {
    id: "obsidian",
    index: "W—03",
    name: "Obsidian Reserve",
    field: "Rare single-malt release",
    premise: "Thirty years of patience, staged as one deepening amber light.",
    metric: "300/300",
    metricLabel: "Bottles allocated pre-launch",
    href: "/work/obsidian-reserve",
    hue: "var(--hue-obsidian)",
    align: "start",
  },
] as const;

const PROCESS = [
  ["01", "Discovery", "We interrogate the brief until it confesses what the launch is really about."],
  ["02", "Art direction", "One idea, chosen early and committed to completely. Everything else is cut."],
  ["03", "Prototype", "If it doesn't feel right at 60fps, it isn't right. We test the feeling first."],
  ["04", "Build", "Engineering with a cinematographer's eye — every kilobyte earns its place."],
  ["05", "Launch", "Measured, tuned, and handed over calm. Then we watch the numbers with you."],
] as const;

const MANIFESTO: Array<{ plain?: string; serif?: string; after?: string }> = [
  { plain: "Most of the web is forgettable by default." },
  { plain: "We think that's a choice — and we make ", serif: "the other one." },
  { plain: "Design is not decoration. It's ", serif: "the argument." },
  { serif: "Motion should mean something,", after: " or it shouldn't move." },
  {
    plain:
      "Fast is a feature. Beautiful is a standard. We refuse to trade one for the other.",
  },
  { plain: "We don't ship pages. We ship experiences ", serif: "people remember." },
  { plain: "Gavika — ", serif: "built to be felt." },
];

export default function Home() {
  return (
    <main id="main">
      <HomeClient>
        {/* ————— SC 01 — TITLE ————— */}
        <section data-beat="title" className="beat relative h-[175vh]">
          <div className="beat-sticky sticky top-0 flex h-screen flex-col justify-between overflow-hidden">
            <div className="gutter flex items-center justify-between pt-20">
              <p data-hero-fade className="t-label">
                01/06 — Title
              </p>
              <p data-hero-fade className="t-label hidden sm:block">
                A film in six scenes
              </p>
            </div>
            <h1
              className="t-display gutter text-center"
              style={{ fontSize: "min(16.5vw, 17rem)" }}
            >
              <span className="sr-only">Gavika</span>
              <span aria-hidden="true">
                {"GAVIKA".split("").map((c, i) => (
                  <span key={i} data-hero-char className="inline-block">
                    {c}
                  </span>
                ))}
              </span>
            </h1>
            <div className="gutter flex items-end justify-between pb-10">
              <p
                data-hero-fade
                className="t-serif max-w-[16em] text-[clamp(1.05rem,1.6vw,1.35rem)] text-smoke"
              >
                A digital experience studio for launches that refuse to be
                forgotten.
              </p>
              <div data-hero-fade className="flex flex-col items-center gap-3">
                <span className="t-label">Scroll</span>
                <span className="scroll-cue" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ————— SC 02 — POSITIONING ————— */}
        <section data-beat="positioning" className="beat relative h-[160vh]">
          <div className="beat-sticky sticky top-0 flex h-screen items-center">
            <div className="gutter w-full">
              <p className="t-label mb-8">02/06 — Positioning</p>
              <p className="t-title max-w-[11em] text-[clamp(2.2rem,5.8vw,5.4rem)]">
                <Words text="We don't build websites. We build" />{" "}
                <span className="t-serif normal-case">
                  <Words text="digital experiences." />
                </span>
              </p>
              <p className="t-body mt-10 md:ml-[41.666%]">
                Gavika is the studio between a creative agency and an
                engineering practice — cinematic front of house, ruthless under
                the hood. Two founders, no handoffs, one standard.
              </p>
            </div>
          </div>
        </section>

        {/* ————— SC 03 — WORK ————— */}
        <section aria-labelledby="work-heading">
          <div className="gutter hairline-t flex items-baseline justify-between pt-6">
            <h2 id="work-heading" className="t-label">
              03/06 — Selected work
            </h2>
            <p className="t-serif text-smoke">Three launches, one discipline.</p>
          </div>

          {CASES.map((c) => (
            <article
              key={c.id}
              data-panel={c.id}
              className="beat relative h-[150vh]"
            >
              <div
                className={`beat-sticky gutter sticky top-0 flex h-screen items-center ${
                  c.align === "end" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  data-dock
                  className="w-full max-w-[34rem] border border-[color:var(--hairline)] bg-carbon/60 p-7 md:p-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="t-label">{c.index}</span>
                    <span
                      className="t-label border border-[color:var(--hairline)] px-2 py-1"
                      title="Self-initiated concept work"
                    >
                      Concept
                    </span>
                  </div>
                  <h3 className="t-title mt-6" style={{ color: c.hue }}>
                    {c.name}
                  </h3>
                  <p className="t-label mt-2">{c.field}</p>
                  <p className="t-body mt-6">{c.premise}</p>
                  <div className="hairline-t mt-8 flex items-end justify-between gap-6 pt-6">
                    <div>
                      <p
                        className="tabular-nums text-[clamp(1.8rem,3vw,2.6rem)] font-semibold leading-none"
                        style={{ fontStretch: "118%" }}
                      >
                        {c.metric}
                      </p>
                      <p className="t-label mt-2">{c.metricLabel}</p>
                    </div>
                    <Link
                      href={c.href}
                      className="t-label t-label-bone u-link shrink-0"
                      data-cursor
                    >
                      View case
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* ————— SC 04 — PROCESS ————— */}
        <section data-beat="process" className="beat relative h-[280vh]">
          <div className="beat-sticky sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
            <p className="t-label gutter mb-12">04/06 — Process</p>
            <div
              data-process-track
              className="flex w-max items-start gap-[9vw] pl-[var(--gutter)] pr-[30vw]"
            >
              {PROCESS.map(([num, name, line]) => (
                <div
                  key={num}
                  className="w-[74vw] shrink-0 sm:w-[46vw] md:w-[34rem]"
                >
                  <p className="t-label">{num}</p>
                  <h3 className="t-title mt-3">{name}</h3>
                  <p className="t-body mt-5">{line}</p>
                </div>
              ))}
            </div>
            <div className="gutter mt-16">
              <div className="h-px w-full bg-carbon-2">
                <div
                  data-process-progress
                  className="h-px origin-left scale-x-0 bg-bone/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ————— SC 05 — MANIFESTO ————— */}
        <section data-beat="manifesto" aria-labelledby="manifesto-heading">
          <h2 id="manifesto-heading" className="t-label gutter hairline-t pt-6">
            05/06 — Manifesto
          </h2>
          <div className="gutter">
            {MANIFESTO.map((line, i) => (
              <p
                key={i}
                data-manifesto-line
                className="beat t-title flex min-h-[44vh] max-w-[13em] items-center text-[clamp(1.7rem,4.4vw,4rem)]"
              >
                <span>
                  {line.plain}
                  {line.serif && (
                    <span className="t-serif normal-case">{line.serif}</span>
                  )}
                  {line.after}
                </span>
              </p>
            ))}
          </div>
        </section>

        {/* ————— SC 06 — CREDITS ————— */}
        <section data-beat="credits" className="beat relative min-h-screen">
          <div className="gutter hairline-t pt-6">
            <h2 className="t-label">06/06 — Credits</h2>
            <p className="t-serif mt-16 text-smoke">A studio by</p>
            <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-6">
              <div className="hairline-t pt-6">
                <h3 className="t-heading">Ian Gavilan</h3>
                <p className="t-label mt-2">Direction &amp; engineering</p>
                <p className="t-body mt-4">
                  Builds the machinery behind the feeling — real-time graphics,
                  performance budgets, and the discipline that keeps cinema
                  shippable.
                </p>
              </div>
              <div className="hairline-t pt-6">
                <h3 className="t-heading">Luca Hernandez</h3>
                <p className="t-label mt-2">Design &amp; strategy</p>
                <p className="t-body mt-4">
                  Shapes the argument — identity, art direction, and the
                  narrative arc every launch rides in on.
                </p>
              </div>
            </div>

            <div className="my-24 flex flex-col items-start gap-6 md:my-32">
              <p className="t-label">Have a launch worth staging?</p>
              <MagneticLink href="/contact" className="px-12 py-6 text-[1rem]">
                Start a project
              </MagneticLink>
            </div>
          </div>
          <Footer />
        </section>
      </HomeClient>
    </main>
  );
}
