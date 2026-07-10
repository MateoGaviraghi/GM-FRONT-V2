"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SectionHeadingProps = {
  /** Índice de sección, ej. "01" */
  index: string;
  /** Eyebrow técnico, ej. "GAMA FOTON" */
  label: string;
  /** Título display (string o nodos) */
  title: React.ReactNode;
  sub?: React.ReactNode;
  theme?: "dark" | "light";
  /** Slot derecho alineado al título (ej. controles de carrusel) */
  aside?: React.ReactNode;
  className?: string;
};

/**
 * Cabecera de sección del lenguaje GM: regla técnica numerada +
 * título display con máscara de revelado al entrar en viewport.
 */
export function SectionHeading({
  index,
  label,
  title,
  sub,
  theme = "dark",
  aside,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const dark = theme === "dark";

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const rule = root.querySelector("[data-sh-rule]");
      const masked = root.querySelectorAll("[data-sh-mask]");
      const soft = root.querySelectorAll("[data-sh-soft]");

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* Sin animación: regla, título y contenido soft quedan en su estado final */
      if (reduce) {
        const targets = [
          ...(rule ? [rule] : []),
          ...Array.from(masked),
          ...Array.from(soft),
        ];
        if (targets.length) gsap.set(targets, { clearProps: "all" });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 82%", once: true },
      });

      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, transformOrigin: "left center" }
        );
      }
      if (masked.length) {
        tl.fromTo(
          masked,
          { yPercent: 112 },
          { yPercent: 0, duration: 0.95, stagger: 0.1 },
          "-=0.55"
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
          "-=0.5"
        );
      }
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "gm-plus shrink-0",
            dark ? "text-petrol-bright" : "text-petrol-deep"
          )}
          aria-hidden
        />
        <span
          className={cn("gm-label", dark ? "text-silver" : "text-ink-1")}
        >
          {index} — {label}
        </span>
        <span
          data-sh-rule
          aria-hidden
          className={cn(
            "h-px flex-1",
            dark ? "bg-line-dark" : "bg-line-light"
          )}
        />
      </div>

      <div className="mt-7 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
        <h2
          className={cn(
            "gm-display text-display-2",
            dark ? "text-platinum" : "text-ink-0"
          )}
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-sh-mask className="block will-change-transform">
              {title}
            </span>
          </span>
        </h2>
        {aside ? (
          <div data-sh-soft className="shrink-0">
            {aside}
          </div>
        ) : null}
      </div>

      {sub ? (
        <p
          data-sh-soft
          className={cn(
            "mt-5 max-w-xl text-base leading-relaxed sm:text-lg",
            dark ? "text-silver" : "text-ink-1"
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
