"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GmButton } from "@/components/cliente/home/gm/gm-button";
import { FotonShareButton } from "@/components";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ModelSpecCard = {
  icon?: LucideIcon;
  label: string;
  value?: string;
  sublabel?: string;
};
export type ModelGallery = {
  id: string;
  label: string;
  images: string[];
  headingLead: string;
  headingHighlight: string;
  description: string;
  bullets?: string[];
  specCards?: ModelSpecCard[];
  featured?: { value: string; label: string };
};
export type ModelVersion = {
  id: string;
  nombre: string;
  imagen?: string;
  pdf?: string;
};
export type ModelHeroSpec = { icon: LucideIcon; label: string; value: string };
export type ModelData = {
  category: { label: string; href: string };
  backLabel: string;
  name: string;
  shareName: string;
  /** URL propia de esta ficha (para compartir), ej "/foton/pick-ups/tunland-g7" */
  url: string;
  headline: string;
  description: string;
  heroImage: string;
  /** Assets de marca: wordmark (membrete del riel) + logo de vehículo (placa insignia) */
  logo?: { wordmark?: string; vehicle?: string; wordmarkRaw?: boolean };
  heroSpecs: ModelHeroSpec[];
  consultarHref: string;
  pdfHref?: string;
  pdfLabel?: string;
  galleries: ModelGallery[];
  components?: { label: string; image: string }[];
  versionsIntro?: string;
  versions: ModelVersion[];
  cta: { title: string; description: string; label: string; href: string };
};

/* ---- Galería GM: visor principal + riel de miniaturas + contador + lightbox ---- */
function Gallery({
  gallery,
  onOpen,
}: {
  gallery: ModelGallery;
  onOpen: (images: string[], index: number) => void;
}) {
  const [active, setActive] = useState(0);
  const total = gallery.images.length;
  const go = (dir: number) =>
    setActive((p) => (p + dir + total) % total);
  const kenBurnsRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* Ken Burns sutil: el slide activo escala 1 → 1.045 en 6s, origen alterna
     por índice (par: izquierda, impar: derecha). Se resetea al cambiar de slide. */
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;
    const el = kenBurnsRefs.current[active];
    if (!el) return;
    const origin = active % 2 === 0 ? "left center" : "right center";
    gsap.set(el, { transformOrigin: origin, scale: 1 });
    const tween = gsap.to(el, { scale: 1.045, duration: 6, ease: "none" });
    return () => {
      tween.kill();
      gsap.set(el, { scale: 1 });
    };
  }, [active]);

  return (
    <div>
      {/* Visor principal */}
      <div className="group relative aspect-[16/10] overflow-hidden border border-line-dark bg-carbon-2">
        {gallery.images.map((src, i) => (
          <button
            key={`${src}-${i}`}
            type="button"
            onClick={() => onOpen(gallery.images, i)}
            aria-label={`Ampliar imagen ${i + 1}`}
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              i === active
                ? "z-10 opacity-100"
                : "pointer-events-none z-0 opacity-0"
            )}
          >
            <div
              ref={(el) => {
                kenBurnsRefs.current[i] = el;
              }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={`${gallery.label} ${i + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
          </button>
        ))}

        {/* Contador */}
        <div className="pointer-events-none absolute left-4 top-4 z-20">
          <span className="gm-display text-3xl text-platinum/90 drop-shadow">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="gm-label ml-1 text-platinum/60">
            / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Controles */}
        {total > 1 ? (
          <div className="absolute bottom-4 right-4 z-20 flex">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="flex size-11 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum backdrop-blur-sm transition-colors hover:bg-platinum hover:text-carbon-0"
            >
              <ChevronLeft className="size-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="-ml-px flex size-11 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum backdrop-blur-sm transition-colors hover:bg-platinum hover:text-carbon-0"
            >
              <ChevronRight className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        ) : null}
      </div>

      {/* Riel de miniaturas */}
      {total > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {gallery.images.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagen ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border transition-colors",
                i === active
                  ? "border-petrol-bright"
                  : "border-line-dark hover:border-line-dark-2"
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className={cn(
                  "object-cover transition-opacity",
                  i === active ? "opacity-100" : "opacity-55 hover:opacity-90"
                )}
              />
              {i === active ? (
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-[2px] bg-petrol-bright"
                />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ModelTemplate({ data }: { data: ModelData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(data.galleries[0]?.id);
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);

  const pdfLabel = data.pdfLabel ?? "Ficha Técnica";

  /* Lightbox: navegación + cerrar con teclado */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight")
        setLightbox((l) =>
          l ? { ...l, index: (l.index + 1) % l.images.length } : l
        );
      if (e.key === "ArrowLeft")
        setLightbox((l) =>
          l
            ? { ...l, index: (l.index - 1 + l.images.length) % l.images.length }
            : l
        );
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const fine = window.matchMedia("(pointer: fine)").matches;

      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const bg = root.querySelector<HTMLElement>("[data-hero-bg]");
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const soft = root.querySelectorAll<HTMLElement>("[data-hero-soft]");
      const layers = root.querySelectorAll<HTMLElement>("[data-depth]");
      const railLine = root.querySelector<HTMLElement>("[data-rail-line]");
      const specs = root.querySelectorAll<HTMLElement>("[data-spec]");
      const wordmark = root.querySelector<HTMLElement>("[data-hero-wordmark]");
      const badge = root.querySelector<HTMLElement>("[data-hero-badge]");

      /* Scroll-spy para las tabs (siempre, incluso con reduced motion) */
      const sections = gsap.utils.toArray<HTMLElement>(
        "[data-section]",
        root
      );
      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setActiveSection(sec.id),
        });
      });

      if (reduce) return;

      /* Entrada del hero — el fondo entra en profundidad, el nombre se descubre
         por clip vertical y el riel técnico "imprime" fila por fila desde la
         derecha (mecánica propia de la ficha, distinta a la del home). */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (bg) {
        tl.fromTo(
          bg,
          { autoAlpha: 0, scale: 1.16 },
          { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          0
        );
      }
      if (title) {
        tl.fromTo(
          title,
          { autoAlpha: 0, y: 24, clipPath: "inset(0 0 100% 0)" },
          {
            autoAlpha: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.15,
            ease: "power4.out",
          },
          0.3
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.09 },
          0.55
        );
      }
      /* Membrete (wordmark) = fila cero del riel, antes de la línea y las filas */
      if (wordmark) {
        tl.fromTo(
          wordmark,
          { autoAlpha: 0, x: 12 },
          { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out" },
          0.7
        );
      }
      if (railLine) {
        tl.fromTo(
          railLine,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "power2.out" },
          0.9
        );
      }
      if (specs.length) {
        tl.fromTo(
          specs,
          { autoAlpha: 0, x: 24 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
          },
          1.0
        );
      }
      /* Placa insignia = lo último, sin transform (evita un tercer movimiento) */
      if (badge) {
        tl.fromTo(
          badge,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.6, ease: "power2.out" },
          1.2
        );
      }

      /* Parallax de profundidad al scrollear */
      if (hero && bg) {
        gsap.to(bg, {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* Parallax multicapa con el cursor (profundidad) */
      if (hero && fine && layers.length) {
        const setters = Array.from(layers).map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" }),
          depth: Number(el.dataset.depth) || 1,
        }));
        const onMove = (e: MouseEvent) => {
          const r = hero.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          setters.forEach((s) => {
            s.x(px * 22 * s.depth);
            s.y(py * 16 * s.depth);
          });
        };
        hero.addEventListener("mousemove", onMove);
      }

      /* Reveals de secciones */
      gsap.utils.toArray<HTMLElement>("[data-reveal-block]", root).forEach(
        (block) => {
          gsap.fromTo(
            block,
            { autoAlpha: 0, y: 34 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: { trigger: block, start: "top 82%", once: true },
            }
          );
        }
      );

      /* Bullets: entrada "impresión" fila por fila */
      gsap.utils.toArray<HTMLElement>("[data-bullets]", root).forEach(
        (ul) => {
          const rows = ul.querySelectorAll<HTMLElement>("[data-bullet-row]");
          if (!rows.length) return;
          gsap.fromTo(
            rows,
            { autoAlpha: 0, x: -14 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.05,
              ease: "power3.out",
              scrollTrigger: { trigger: ul, start: "top 85%", once: true },
            }
          );
        }
      );

      /* Cota blueprint: la línea de cota se dibuja al entrar */
      gsap.utils.toArray<HTMLElement>("[data-dim-line]", root).forEach(
        (line) => {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.9,
              ease: "power3.inOut",
              transformOrigin: "left center",
              scrollTrigger: { trigger: line, start: "top 85%", once: true },
            }
          );
        }
      );
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-carbon-0">
      {/* ============ HERO — Ficha maestra (identidad izq. · riel de specs der.) ============ */}
      <section
        data-hero
        className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col overflow-hidden bg-carbon-0 text-platinum"
      >
        <div
          data-hero-bg
          data-depth="0.5"
          className="absolute inset-[-4%] will-change-transform"
          aria-hidden
        >
          <Image
            src={data.heroImage}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Scrims: lateral izq. para la identidad + base alta para el riel derecho */}
        <div
          aria-hidden
          className="absolute inset-0 z-[2] bg-gradient-to-r from-carbon-0 via-carbon-0/45 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[2] h-3/5 bg-gradient-to-t from-carbon-0 via-carbon-0/60 to-transparent"
        />
        {/* Scrim superior suave para asentar navegación + placa sobre cielos claros */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-carbon-0/35 to-transparent"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-5 pb-14 pt-7 sm:px-8 lg:px-12">
          {/* Fila superior: volver (izq) + placa insignia del vehículo (der) */}
          <div className="flex items-start justify-between gap-4">
            <Link
              href={data.category.href}
              data-hero-soft
              className="group inline-flex w-fit items-center gap-2.5 py-3 -my-3 text-silver transition-colors hover:text-platinum"
            >
              <ArrowLeft
                strokeWidth={1.5}
                className="size-4 text-petrol-bright transition-transform group-hover:-translate-x-1"
              />
              <span className="gm-label">{data.backLabel}</span>
            </Link>

            {data.logo?.vehicle ? (
              <div
                data-hero-badge
                className="flex w-fit shrink-0 items-center border border-line-dark bg-carbon-0/60 px-4 py-3 backdrop-blur-[8px]"
              >
                <Image
                  src={data.logo.vehicle}
                  alt=""
                  aria-hidden
                  width={200}
                  height={80}
                  className="h-auto max-h-10 w-auto max-w-32 object-contain object-right sm:max-h-20 sm:max-w-[200px]"
                />
              </div>
            ) : null}
          </div>

          {/* Zona inferior: identidad (izq) + riel de specs (der), ancladas abajo */}
          <div className="flex flex-1 items-end pt-12">
            <div className="grid w-full items-end gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_310px]">
              {/* IDENTIDAD */}
              <div>
                <div data-hero-soft className="mb-5 flex items-center gap-4">
                  <span className="gm-plus text-petrol-bright" aria-hidden />
                  <span className="gm-label text-silver">
                    {data.category.label}
                  </span>
                </div>

                <div data-depth="2.4" className="will-change-transform">
                  <h1
                    data-hero-title
                    className="gm-display text-display-1 max-w-[14ch]"
                  >
                    {data.name}
                  </h1>
                </div>

                <p
                  data-hero-soft
                  className="mt-4 gm-display text-display-3 text-petrol-bright"
                >
                  {data.headline}
                </p>

                <p
                  data-hero-soft
                  className="mt-6 max-w-xl text-base leading-relaxed text-silver sm:text-lg"
                >
                  {data.description}
                </p>

                <div
                  data-hero-soft
                  className="mt-8 flex flex-wrap items-center gap-4"
                >
                  <GmButton href={data.consultarHref} external tone="solidLight">
                    Consultar
                  </GmButton>
                  {data.pdfHref ? (
                    <GmButton
                      href={data.pdfHref}
                      external
                      tone="outlineDark"
                      icon={Download}
                    >
                      {pdfLabel}
                    </GmButton>
                  ) : null}
                </div>
              </div>

              {/* RIEL DE SPECS — minimalista, a la derecha */}
              {data.heroSpecs.length ? (
                <div
                  data-hero-rail
                  className="-mx-4 bg-carbon-0/45 px-4 py-4 backdrop-blur-md [text-shadow:0_1px_14px_rgba(0,0,0,0.65)] sm:-mx-5 sm:px-5 lg:m-0 lg:w-[310px] lg:justify-self-end lg:border-l lg:border-line-dark-2 lg:py-5 lg:pl-8 lg:pr-5"
                >
                  {/* Membrete: wordmark del modelo, normalizado a blanco */}
                  {data.logo?.wordmark ? (
                    <div
                      data-hero-wordmark
                      className="mb-5 border-b border-line-dark pb-5"
                    >
                      <div className="flex h-9 items-center lg:h-11">
                        <Image
                          src={data.logo.wordmark}
                          alt=""
                          aria-hidden
                          width={310}
                          height={44}
                          className={cn(
                            "h-full w-auto max-w-full object-contain object-left",
                            data.logo.wordmarkRaw
                              ? ""
                              : "[filter:brightness(0)_invert(1)] opacity-90"
                          )}
                        />
                      </div>
                    </div>
                  ) : null}
                  <div className="mb-1 flex items-center gap-3">
                    <span
                      data-rail-line
                      className="h-px w-8 origin-left bg-petrol-bright"
                      aria-hidden
                    />
                    <span className="gm-label text-silver">Ficha rápida</span>
                  </div>
                  <dl>
                    {data.heroSpecs.map((spec) => {
                      const Icon = spec.icon;
                      return (
                        <div
                          key={spec.label}
                          data-spec
                          className="border-t border-line-dark py-4 last:pb-0"
                        >
                          <dt className="gm-label flex items-center gap-2 text-silver">
                            <Icon
                              className="size-3.5 shrink-0 text-petrol-bright"
                              strokeWidth={1.5}
                            />
                            {spec.label}
                          </dt>
                          <dd className="mt-2 whitespace-pre-line text-sm leading-snug text-platinum">
                            {spec.value}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ============ NAV STICKY (tabs) ============ */}
      {data.galleries.length > 1 ? (
        <nav className="sticky top-[var(--gm-header-h-live,68px)] z-30 border-y border-line-dark bg-carbon-0/90 backdrop-blur-md">
          <div className="scrollbar-hide mx-auto flex max-w-[1480px] gap-1 overflow-x-auto px-5 sm:px-8 lg:px-12">
            {data.galleries.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className={cn(
                  "gm-label whitespace-nowrap border-b-2 px-4 py-4 transition-colors",
                  activeSection === g.id
                    ? "border-petrol-bright text-petrol-bright"
                    : "border-transparent text-steel hover:text-silver"
                )}
              >
                {g.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      {/* ============ GALERÍAS ============ */}
      {data.galleries.map((gallery, gi) => {
        const dark = gi % 2 === 0;
        return (
          <section
            key={gallery.id}
            id={gallery.id}
            data-section
            className={cn(
              "relative scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] overflow-hidden border-t border-line-dark py-20 sm:py-24 lg:py-28",
              dark ? "bg-carbon-1 text-platinum" : "bg-carbon-0 text-platinum"
            )}
          >
            <div className="mx-auto grid w-full max-w-[1480px] items-start gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:px-12">
              {/* Texto */}
              <div
                data-reveal-block
                className="lg:sticky lg:top-[calc(var(--gm-header-h-live,68px)+96px)]"
              >
                {/* Índice fantasma EN FLUJO: bloque propio, imposible que tape texto */}
                <div className="relative">
                  <span
                    aria-hidden
                    className="gm-display pointer-events-none block select-none text-7xl leading-[0.85] text-platinum/[0.06] sm:text-8xl"
                  >
                    {String(gi + 1).padStart(2, "0")}
                  </span>
                  <div className="relative mt-4 flex items-center gap-4">
                    <span className="gm-plus text-petrol-bright" aria-hidden />
                    <span className="gm-label text-silver">
                      {gallery.label}
                    </span>
                  </div>
                  <h2 className="gm-display text-display-2 relative mt-5 text-platinum">
                    {gallery.headingLead}{" "}
                    <span className="text-petrol-bright">
                      {gallery.headingHighlight}
                    </span>
                  </h2>
                </div>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-silver">
                  {gallery.description}
                </p>

                {gallery.bullets?.length ? (
                  <ul data-bullets className="mt-7 space-y-3">
                    {gallery.bullets.map((b, i) => (
                      <li
                        key={i}
                        data-bullet-row
                        className="flex items-start gap-3"
                      >
                        <span
                          className="gm-label mt-1 text-petrol-bright"
                          aria-hidden
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm leading-relaxed text-silver sm:text-base">
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {gallery.specCards?.length
                  ? (() => {
                      const withValue = gallery.specCards!.filter(
                        (s) => s.value
                      );
                      const withoutValue = gallery.specCards!.filter(
                        (s) => !s.value
                      );
                      return (
                        <div className="mt-8">
                          {withValue.length ? (
                            <div className="flex flex-wrap divide-x divide-line-dark">
                              {withValue.map((s, i) => (
                                <div
                                  key={i}
                                  className={cn(
                                    "basis-1/2 py-3 sm:basis-auto sm:flex-1",
                                    i === 0 ? "pr-5" : "px-5"
                                  )}
                                >
                                  <div className="gm-display text-2xl text-platinum">
                                    {s.value}
                                  </div>
                                  <div className="gm-label mt-1 text-steel">
                                    {s.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}

                          {withoutValue.length ? (
                            <div
                              className={cn(withValue.length ? "mt-6" : "")}
                            >
                              {withoutValue.map((s, i) => (
                                <div
                                  key={i}
                                  className="flex items-start gap-3 border-b border-line-dark py-3 last:border-b-0"
                                >
                                  <span
                                    className="mt-1.5 size-1.5 shrink-0 bg-petrol-bright"
                                    aria-hidden
                                  />
                                  <div>
                                    <div className="gm-display text-base text-platinum">
                                      {s.label}
                                    </div>
                                    {s.sublabel ? (
                                      <div className="gm-label mt-1 text-steel">
                                        {s.sublabel}
                                      </div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      );
                    })()
                  : null}

                {gallery.featured ? (
                  <div data-reveal-block className="mt-8">
                    <span className="gm-display text-4xl text-petrol-bright">
                      {gallery.featured.value}
                    </span>
                    <div
                      data-dim-line
                      className="relative mt-3 h-px bg-line-dark-2"
                    >
                      <span
                        aria-hidden
                        className="absolute left-0 top-1/2 h-[7px] w-px -translate-y-1/2 bg-line-dark-2"
                      />
                      <span
                        aria-hidden
                        className="absolute right-0 top-1/2 h-[7px] w-px -translate-y-1/2 bg-line-dark-2"
                      />
                    </div>
                    <span className="gm-label mt-2 block text-steel">
                      {gallery.featured.label}
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Galería */}
              <div data-reveal-block>
                <Gallery
                  gallery={gallery}
                  onOpen={(images, index) => setLightbox({ images, index })}
                />
              </div>
            </div>
          </section>
        );
      })}

      {/* ============ COMPONENTES (motor / caja) ============ */}
      {data.components?.length ? (
        <section className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">Tren motriz</span>
              <span aria-hidden className="h-px flex-1 bg-line-dark" />
            </div>
            <div
              data-reveal-block
              className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2"
            >
              {data.components.map((c) => (
                <figure key={c.label} className="group">
                  {/* Objeto flotante: recorte con sombra de piso, sin caja */}
                  <div className="relative flex aspect-[16/10] items-center justify-center">
                    <span
                      aria-hidden
                      className="absolute bottom-6 left-1/2 h-10 w-3/5 -translate-x-1/2 bg-[radial-gradient(50%_100%_at_50%_50%,rgba(0,0,0,0.55),transparent_70%)] blur-md transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-1/2 group-hover:opacity-70"
                    />
                    <Image
                      src={c.image}
                      alt={c.label}
                      width={640}
                      height={400}
                      sizes="(max-width: 640px) 90vw, 45vw"
                      className="relative max-h-full w-auto object-contain drop-shadow-[0_28px_44px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-center gap-4 border-t border-line-dark pt-4">
                    <span className="gm-label text-petrol-bright" aria-hidden>
                      +
                    </span>
                    <span className="gm-label text-silver">{c.label}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ VERSIONES ============ */}
      {data.versions.length ? (
        <section className="relative overflow-hidden bg-paper-0 py-20 text-ink-0 sm:py-24">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-deep" aria-hidden />
              <span className="gm-label text-ink-1">
                {data.versions.length === 1 ? "Versión" : "Versiones"}
              </span>
              <span aria-hidden className="h-px flex-1 bg-line-light" />
            </div>
            {data.versionsIntro ? (
              <p
                data-reveal-block
                className="mt-6 max-w-2xl text-base leading-relaxed text-ink-1"
              >
                {data.versionsIntro}
              </p>
            ) : null}
            <div
              data-reveal-block
              className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {data.versions.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-col border border-line-light bg-paper-1"
                >
                  {v.imagen ? (
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-line-light">
                      <Image
                        src={v.imagen}
                        alt={v.nombre}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="gm-display text-lg text-ink-0">
                      {v.nombre}
                    </h3>
                    {v.pdf ? (
                      <a
                        href={v.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gm-underline gm-label mt-auto inline-flex items-center gap-2 pt-6 text-petrol-deep"
                      >
                        <Download className="size-4" strokeWidth={1.5} />
                        Ficha técnica
                      </a>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ CTA FINAL ============ */}
      <section className="gm-grain relative overflow-hidden border-t border-line-dark bg-carbon-0 py-20 text-platinum sm:py-24">
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">Contacto</span>
            </div>
            <h2 className="gm-display text-display-2 mt-6 text-platinum">
              {data.cta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver">
              {data.cta.description}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <GmButton href={data.cta.href} tone="solidLight">
                {data.cta.label}
              </GmButton>
              <GmButton href={data.consultarHref} external tone="outlineDark">
                Consultar
              </GmButton>
            </div>
          </div>
        </div>
      </section>

      {/* Share flotante (funcionalidad preservada) */}
      <FotonShareButton
        vehicleName={data.shareName}
        vehicleUrl={data.url}
        versions={data.versions}
        variant="floating"
      />

      {/* ============ LIGHTBOX ============ */}
      {lightbox ? (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-carbon-0/95 p-4 sm:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
            className="absolute right-5 top-5 flex size-11 items-center justify-center border border-line-dark-2 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
          <div
            className="relative h-full max-h-[82vh] w-full max-w-[1200px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={lightbox.index}
              src={lightbox.images[lightbox.index]}
              alt=""
              fill
              sizes="100vw"
              className="object-contain"
            />
            {lightbox.images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox((l) =>
                      l
                        ? {
                            ...l,
                            index:
                              (l.index - 1 + l.images.length) %
                              l.images.length,
                          }
                        : l
                    )
                  }
                  aria-label="Anterior"
                  className="absolute left-0 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
                >
                  <ChevronLeft className="size-6" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightbox((l) =>
                      l
                        ? { ...l, index: (l.index + 1) % l.images.length }
                        : l
                    )
                  }
                  aria-label="Siguiente"
                  className="absolute right-0 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
                >
                  <ChevronRight className="size-6" strokeWidth={1.5} />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
