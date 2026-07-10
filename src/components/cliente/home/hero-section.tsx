"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { GmButton } from "./gm/gm-button";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 38, suffix: "+", label: "Años de Experiencia" },
  { value: 1500, suffix: "+", label: "Unidades Vendidas" },
  { value: 4, suffix: "", label: "Categorías" },
  { value: 100, suffix: "%", label: "Garantía" },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const section = sectionRef.current;
      if (!section) return;

      const img = section.querySelector("[data-hero-img]");
      const lines = section.querySelectorAll("[data-hero-line]");
      const soft = section.querySelectorAll("[data-hero-soft]");
      const rule = section.querySelector("[data-hero-rule]");
      const cells = section.querySelectorAll("[data-hero-stat]");
      const content = section.querySelector("[data-hero-content]");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (img) {
        tl.fromTo(
          img,
          { scale: 1.16, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 1.7, ease: "power2.out" }
        );
      }
      if (lines.length) {
        tl.fromTo(
          lines,
          { yPercent: 114 },
          { yPercent: 0, duration: 1.05, stagger: 0.12 },
          "-=1.15"
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.09 },
          "-=0.7"
        );
      }
      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power4.inOut",
            transformOrigin: "left center",
          },
          "-=0.6"
        );
      }
      if (cells.length) {
        tl.fromTo(
          cells,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          "-=0.65"
        );
      }

      /* Parallax cinematográfico al scrollear */
      if (img) {
        gsap.to(img, {
          yPercent: 16,
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
      if (content) {
        gsap.to(content, {
          yPercent: -7,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "40% top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col overflow-hidden bg-carbon-0 text-platinum"
    >
      {/* Imagen real del negocio — tratamiento carbón */}
      <div
        data-hero-img
        className="absolute inset-0 will-change-transform"
        aria-hidden
      >
        <Image
          src="/images/inicio/entrada neogcio gumzan motors.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 z-[2] bg-gradient-to-t from-carbon-0 via-carbon-0/55 to-carbon-0/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 z-[2] bg-gradient-to-r from-carbon-0/85 via-carbon-0/30 to-transparent"
      />

      {/* Marca técnica vertical */}
      <div
        aria-hidden
        className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-5 [writing-mode:vertical-rl] xl:flex"
      >
        <span className="h-16 w-px bg-line-dark" />
        <span className="gm-label text-steel">
          FOTON · Remolques · Usados
        </span>
        <span className="h-16 w-px bg-line-dark" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
        <div
          data-hero-content
          className="relative flex flex-1 flex-col justify-center pb-12 pt-12 lg:pt-16"
        >
          <div data-hero-soft className="mb-8 flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label text-silver">
              Desde 1987 — Santa Fe, Argentina
            </span>
          </div>

          <h1 className="gm-display text-[clamp(2rem,9vw,6.8rem)] leading-[0.97] tracking-[-0.015em]">
            <span className="block overflow-hidden pb-[0.06em] pt-[0.08em]">
              <span
                data-hero-line
                className="block whitespace-nowrap will-change-transform"
              >
                Agencia de Venta
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em] pt-[0.08em]">
              <span
                data-hero-line
                className="block whitespace-nowrap will-change-transform"
              >
                y Consignación
              </span>
            </span>
          </h1>

          <p
            data-hero-soft
            className="mt-8 text-lg leading-relaxed text-silver sm:text-xl"
          >
            Distribuidores{" "}
            <span className="gm-display text-[1.02em] text-petrol-bright">
              FOTON
            </span>{" "}
            — Camiones y Pickups
          </p>
          <p
            data-hero-soft
            className="mt-2 max-w-2xl text-base leading-relaxed text-steel sm:text-lg"
          >
            Camiones, Utilitarios y Remolques — 0km y Usados
          </p>

          <div data-hero-soft className="mt-10 flex flex-wrap items-center gap-4">
            <GmButton href="/foton" tone="solidLight">
              Ver Vehículos
            </GmButton>
            <GmButton href="/contacto" tone="outlineDark">
              Contactanos
            </GmButton>
          </div>

          {/* Cue de scroll */}
          <div
            data-hero-soft
            aria-hidden
            className="absolute bottom-4 right-0 hidden flex-col items-center gap-3 md:flex"
          >
            <span className="gm-label text-steel [writing-mode:vertical-rl]">
              Scroll
            </span>
            <span className="relative block h-12 w-px overflow-hidden bg-line-dark">
              <span className="absolute inset-0 origin-top animate-[gm-scroll-cue_2.2s_cubic-bezier(0.83,0,0.17,1)_infinite] bg-petrol-bright" />
            </span>
          </div>
        </div>

        {/* Cifras reales — banda técnica */}
        <div className="relative">
          <span
            data-hero-rule
            aria-hidden
            className="absolute inset-x-0 top-0 block h-px bg-line-dark-2 will-change-transform"
          />
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                data-hero-stat
                className="border-line-dark px-2 py-6 sm:px-6 lg:py-7 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+3)]:border-t-0 lg:[&:not(:first-child)]:border-l"
              >
                <dd className="gm-display flex items-baseline text-3xl text-platinum sm:text-4xl">
                  <NumberTicker
                    value={stat.value}
                    delay={0.9 + i * 0.12}
                    className="text-platinum"
                  />
                  {stat.suffix ? (
                    <span className="ml-0.5 text-[0.62em] text-petrol-bright">
                      {stat.suffix}
                    </span>
                  ) : null}
                </dd>
                <dt className="gm-label mt-2 text-steel">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
