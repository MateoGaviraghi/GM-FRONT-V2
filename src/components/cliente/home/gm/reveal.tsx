"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /**
   * "rise": clip-path + y direccional con stagger (cards, grids).
   * "wipe": revelado lateral con clip-path (paneles de imagen).
   */
  variant?: "rise" | "wipe";
  /** Selector hijo a animar; por defecto anima los hijos directos */
  stagger?: number;
  delay?: number;
};

/**
 * Entrada coreografiada al viewport — clip-path direccional,
 * no el fade-up uniforme de siempre.
 */
export function Reveal({
  children,
  className,
  variant = "rise",
  stagger = 0.09,
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;
      const found = root.querySelectorAll<HTMLElement>("[data-reveal]");
      const items = found.length
        ? Array.from(found)
        : (Array.from(root.children) as HTMLElement[]);
      if (!items.length) return;

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* Sin animación: contenido en su estado final, sin clip/opacidad */
      if (reduce) {
        gsap.set(items, { clearProps: "all" });
        return;
      }

      if (variant === "wipe") {
        gsap.fromTo(
          items,
          { clipPath: "inset(0 100% 0 0)", opacity: 1 },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.05,
            ease: "power4.inOut",
            stagger,
            delay,
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
          }
        );
        return;
      }

      gsap.fromTo(
        items,
        { y: 34, opacity: 0, clipPath: "inset(0 0 18% 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.85,
          ease: "power3.out",
          stagger,
          delay,
          scrollTrigger: { trigger: root, start: "top 84%", once: true },
        }
      );
    },
    { scope: ref, dependencies: [variant, stagger, delay] }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
