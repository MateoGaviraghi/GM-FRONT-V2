"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, type LucideIcon } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";
import { GmButton } from "@/components/cliente/home/gm/gm-button";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, useGSAP);

export type CategorySpec = { icon: LucideIcon; label: string };
export type CategoryModel = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  specs: CategorySpec[];
  href: string;
};
export type CategoryFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};
export type CategoryData = {
  chip: string;
  title: string;
  description: React.ReactNode;
  heroImage: string;
  stats: { value: string; label: string }[];
  models: CategoryModel[];
  /** Panel "Más modelos próximamente" (opcional) */
  comingSoon?: { title: string; text: string };
  /** Sección de ventajas (opcional — Livianos no la tiene) */
  featuresLead?: string;
  featuresHighlight?: string;
  featuresIntro?: string;
  features?: CategoryFeature[];
  /** Banda CTA de cierre (opcional) */
  cta?: {
    title: string;
    description: string;
    label: string;
    href: string;
    external?: boolean;
  };
};

export function CategoryTemplate({ data }: { data: CategoryData }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const fine = window.matchMedia("(pointer: fine)").matches;

      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const img = root.querySelector<HTMLElement>("[data-hero-img]");
      const vignette = root.querySelector<HTMLElement>("[data-hero-vignette]");
      const titleWrap = root.querySelector<HTMLElement>("[data-hero-titlewrap]");
      const titleInner = root.querySelector<HTMLElement>("[data-hero-title]");
      const soft = root.querySelectorAll<HTMLElement>("[data-hero-soft]");
      const arrow = root.querySelector<HTMLElement>("[data-back-arrow]");

      if (reduce) return;

      /* ---- Entrada del hero ---- */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (img) {
        tl.fromTo(
          img,
          { autoAlpha: 0, scale: 1.14 },
          { autoAlpha: 1, scale: 1, duration: 1.5, ease: "power2.out" },
          0
        );
      }
      if (titleInner) {
        tl.fromTo(
          titleInner,
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, duration: 1, ease: "power4.out" },
          0.3
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.09 },
          0.5
        );
      }

      /* ---- Túnel: al scrollear, el hero se adentra (zoom + viñeta),
             el título retrocede. Todo scrub, sin pin (fiable en mobile). ---- */
      if (hero && img) {
        gsap.to(img, {
          scale: 1.32,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (hero && vignette) {
        gsap.fromTo(
          vignette,
          { opacity: 0 },
          {
            opacity: 0.85,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "center top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
      if (hero && titleWrap) {
        gsap.to(titleWrap, {
          scale: 0.6,
          yPercent: -40,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* ---- Breadcrumb magnético ---- */
      if (arrow && fine) {
        const qx = gsap.quickTo(arrow, "x", { duration: 0.4, ease: "power3" });
        const btn = arrow.closest("a");
        if (btn) {
          const onMove = (e: MouseEvent) => {
            const r = btn.getBoundingClientRect();
            qx(((e.clientX - r.left) / r.width - 0.5) * 10 - 3);
          };
          const onLeave = () => qx(0);
          btn.addEventListener("mousemove", onMove);
          btn.addEventListener("mouseleave", onLeave);
        }
      }

      /* ---- Filas editoriales de modelos: clip lateral + stagger del
             contenido; tilt 3D + glare acotados SOLO al bloque de imagen ---- */
      const rows = gsap.utils.toArray<HTMLElement>("[data-model]", root);
      rows.forEach((row, i) => {
        const isLeft = i % 2 === 0;
        const imageBlock = row.querySelector<HTMLElement>("[data-model-image]");
        const contentItems = row.querySelectorAll<HTMLElement>(
          "[data-model-content] > *"
        );
        const tl = gsap.timeline({
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        });
        if (imageBlock) {
          tl.fromTo(
            imageBlock,
            { clipPath: isLeft ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" },
            0
          );
        }
        if (contentItems.length) {
          tl.fromTo(
            contentItems,
            { autoAlpha: 0, x: isLeft ? 24 : -24 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "power3.out",
            },
            0.15
          );
        }
      });

      if (fine && !reduce) {
        rows.forEach((row) => {
          const imageBlock = row.querySelector<HTMLElement>("[data-model-image]");
          if (!imageBlock) return;
          const rx = gsap.quickTo(imageBlock, "rotationX", {
            duration: 0.5,
            ease: "power3",
          });
          const ry = gsap.quickTo(imageBlock, "rotationY", {
            duration: 0.5,
            ease: "power3",
          });
          const glare = imageBlock.querySelector<HTMLElement>("[data-glare]");
          const onMove = (e: MouseEvent) => {
            const r = imageBlock.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            ry((px - 0.5) * 7);
            rx((0.5 - py) * 7);
            if (glare) {
              glare.style.setProperty("--gx", `${px * 100}%`);
              glare.style.setProperty("--gy", `${py * 100}%`);
            }
          };
          const onEnter = () => {
            if (glare) gsap.to(glare, { opacity: 1, duration: 0.3 });
          };
          const onLeave = () => {
            rx(0);
            ry(0);
            if (glare) gsap.to(glare, { opacity: 0, duration: 0.4 });
          };
          imageBlock.addEventListener("mousemove", onMove);
          imageBlock.addEventListener("mouseenter", onEnter);
          imageBlock.addEventListener("mouseleave", onLeave);
        });
      }

      /* ---- Features: los íconos se trazan (DrawSVG) al entrar ---- */
      const featureBlocks = gsap.utils.toArray<HTMLElement>(
        "[data-feature]",
        root
      );
      featureBlocks.forEach((block, i) => {
        const strokes = block.querySelectorAll<SVGElement>(
          "[data-feature-icon] path, [data-feature-icon] line, [data-feature-icon] polyline, [data-feature-icon] circle, [data-feature-icon] rect, [data-feature-icon] polygon"
        );
        if (strokes.length) {
          gsap.fromTo(
            strokes,
            { drawSVG: "0%" },
            {
              drawSVG: "100%",
              duration: 1,
              ease: "power2.inOut",
              stagger: 0.06,
              scrollTrigger: { trigger: block, start: "top 85%", once: true },
            }
          );
        }
        gsap.fromTo(
          block,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            delay: i * 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: block, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: rootRef, dependencies: [] }
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-carbon-0">
      {/* ============ HERO — túnel ============ */}
      <section
        data-hero
        className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col overflow-hidden bg-carbon-0 text-platinum"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div data-hero-img className="absolute inset-0 will-change-transform">
            <Image
              src={data.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-0 via-carbon-0/55 to-carbon-0/15" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-carbon-0 to-transparent" />
          {/* Viñeta del túnel (crece con el scroll) */}
          <div
            data-hero-vignette
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(circle at 50% 45%, transparent 30%, var(--gm-carbon-0) 92%)",
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-5 pb-14 pt-8 sm:px-8 lg:px-12">
          {/* Breadcrumb */}
          <Link
            href="/foton"
            data-hero-soft
            className="group inline-flex w-fit items-center gap-2.5 py-3 -my-3 text-silver transition-colors hover:text-platinum"
          >
            <span
              data-back-arrow
              className="inline-flex will-change-transform"
            >
              <ArrowLeft
                strokeWidth={1.5}
                className="size-4 text-petrol-bright"
              />
            </span>
            <span className="gm-label">Volver a FOTON</span>
          </Link>

          <div className="flex flex-1 flex-col justify-center">
            <div data-hero-soft className="mb-6 flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">{data.chip}</span>
            </div>

            <div data-hero-titlewrap className="origin-left will-change-transform">
              <h1
                data-hero-title
                className="gm-display text-display-1 max-w-[16ch]"
              >
                {data.title}
              </h1>
            </div>

            <p
              data-hero-soft
              className="mt-7 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl"
            >
              {data.description}
            </p>

            {/* Stats del hero — franja inline, sin caja */}
            <dl
              data-hero-soft
              className="mt-10 flex flex-wrap items-stretch divide-x divide-line-dark"
            >
              {data.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`flex-1 py-2 ${i === 0 ? "pr-6" : "px-6"}`}
                >
                  <dd className="gm-display text-2xl text-platinum sm:text-3xl">
                    {stat.value}
                  </dd>
                  <dt className="gm-label mt-1.5 text-silver">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============ MODELOS ============ */}
      <section className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="flex items-center gap-4">
            <span className="gm-label text-petrol-bright">
              {String(data.models.length).padStart(2, "0")}
            </span>
            <span className="gm-label text-silver">
              {data.models.length === 1 ? "Modelo" : "Modelos"} disponibles
            </span>
            <span aria-hidden className="h-px flex-1 bg-line-dark" />
          </div>

          <div className="mt-12 flex flex-col">
            {data.models.map((model, i) => {
              const isLeft = i % 2 === 0;
              return (
                <Link
                  key={model.id}
                  href={model.href}
                  data-model
                  className="group relative grid grid-cols-1 gap-10 border-t border-line-dark py-10 first:border-t-0 first:pt-0 lg:grid-cols-2 lg:items-center lg:gap-x-16 lg:py-16"
                >
                  {/* Bloque de imagen — tilt 3D + glare, simétrico 50/50 */}
                  <div
                    className={`relative aspect-[16/10] ${
                      isLeft ? "lg:order-1" : "lg:order-2"
                    }`}
                    style={{ perspective: "1400px" }}
                  >
                    <div
                      data-model-image
                      className="relative h-full w-full overflow-hidden [transform-style:preserve-3d] will-change-transform"
                    >
                      <Image
                        src={model.image}
                        alt={model.name}
                        fill
                        sizes="(max-width: 1024px) 100vw, 48vw"
                        className="object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                      <span className="gm-label absolute left-4 top-4 border border-line-dark-2 bg-carbon-0/70 px-2.5 py-1.5 text-petrol-bright backdrop-blur-sm">
                        {model.badge}
                      </span>
                      {/* Glare que sigue al cursor */}
                      <div
                        data-glare
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-0"
                        style={{
                          background:
                            "radial-gradient(circle at var(--gx,50%) var(--gy,50%), rgba(255,255,255,0.16), transparent 55%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Contenido — columna propia, canal limpio con la imagen */}
                  <div
                    className={`relative z-10 flex flex-col justify-center ${
                      isLeft ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div data-model-content className="relative">
                      {/* Índice fantasma EN FLUJO: bloque propio, imposible que tape texto */}
                      <span
                        aria-hidden
                        className={`gm-display pointer-events-none block text-7xl leading-[0.85] text-platinum/[0.06] select-none sm:text-8xl ${
                          isLeft ? "text-right" : "text-left"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <h3 className="gm-display text-display-2 relative mt-3 text-platinum">
                        {model.name}
                      </h3>

                      <p className="gm-label mt-3 text-petrol-bright">
                        {model.subtitle}
                      </p>

                      <p className="mt-5 max-w-lg text-base leading-relaxed text-silver">
                        {model.description}
                      </p>

                      {/* Specs — línea mono, sin chips-caja */}
                      <div className="mt-7 flex flex-wrap divide-x divide-line-dark border-y border-line-dark">
                        {model.specs.map((spec, j) => {
                          const Icon = spec.icon;
                          return (
                            <div
                              key={j}
                              className={`flex items-center gap-2 py-3 ${j === 0 ? "pr-4" : "px-4"}`}
                            >
                              <Icon
                                aria-hidden
                                strokeWidth={1.5}
                                className="size-3.5 text-petrol-bright"
                              />
                              <span className="gm-label text-silver">
                                {spec.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <span className="gm-underline gm-label mt-8 inline-flex w-fit items-center gap-2 text-platinum">
                        Ver modelo
                        <ArrowUpRight
                          aria-hidden
                          strokeWidth={1.75}
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Más modelos próximamente (opcional) */}
          {data.comingSoon ? (
            <div className="mt-6 flex flex-col items-start gap-4 border-t border-line-dark pt-10 sm:flex-row sm:items-center sm:gap-6">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <div>
                <h3 className="gm-display text-display-3 text-platinum">
                  {data.comingSoon.title}
                </h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-silver">
                  {data.comingSoon.text}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ============ FEATURES (opcional) ============ */}
      {data.features && data.features.length > 0 ? (
        <section className="relative overflow-hidden bg-paper-0 py-20 text-ink-0 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-deep" aria-hidden />
              <span className="gm-label text-ink-1">La ventaja FOTON</span>
              <span aria-hidden className="h-px flex-1 bg-line-light" />
            </div>
            <h2 className="gm-display text-display-2 mt-7 max-w-4xl text-ink-0">
              {data.featuresLead}{" "}
              {data.featuresHighlight ? (
                <span className="text-petrol-deep">
                  {data.featuresHighlight}
                </span>
              ) : null}
            </h2>
            {data.featuresIntro ? (
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-1 sm:text-lg">
                {data.featuresIntro}
              </p>
            ) : null}

            <div className="mt-14 flex flex-col divide-y divide-line-light sm:flex-row sm:divide-y-0 sm:divide-x sm:divide-line-light">
              {data.features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={i}
                    data-feature
                    className={`flex flex-1 flex-col py-8 ${
                      i === 0 ? "sm:pl-0 sm:pr-8 lg:pr-10" : "sm:px-8 lg:px-10"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="gm-label text-petrol-deep">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex size-12 items-center justify-center text-petrol-deep">
                        <span data-feature-icon className="contents">
                          <Icon strokeWidth={1.25} className="size-6" />
                        </span>
                      </span>
                    </div>
                    <h3 className="gm-display mt-6 text-xl text-ink-0">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-ink-1">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ============ CTA de cierre (opcional) ============ */}
      {data.cta ? (
        <section className="gm-grain relative overflow-hidden border-t border-line-dark bg-carbon-0 py-20 text-platinum sm:py-24">
          <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="gm-plus text-petrol-bright" aria-hidden />
                <span className="gm-label text-silver">Asesoramiento</span>
              </div>
              <h2 className="gm-display text-display-2 mt-6 text-platinum">
                {data.cta.title}
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver">
                {data.cta.description}
              </p>
              <div className="mt-9">
                <GmButton
                  href={data.cta.href}
                  external={data.cta.external}
                  tone="solidLight"
                >
                  {data.cta.label}
                </GmButton>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
