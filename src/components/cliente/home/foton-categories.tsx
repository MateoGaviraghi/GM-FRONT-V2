"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "./gm/section-heading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const categories = [
  {
    id: "pick-ups",
    name: "Pick Ups",
    description: "Potencia y versatilidad 4x4",
    image: "/images/FOTON/TUNDLAND.G7/HERO/heroTunlandG7.jpg",
    modelsCount: 2,
    badge: "4X4",
    href: "/foton/pick-ups",
  },
  {
    id: "ultralivianos",
    name: "Ultralivianos",
    description: "Eficiencia urbana",
    image:
      "/images/FOTON/cateogries/ultralivianos/WONDER/HERO/WONDER-HERO.jpg",
    modelsCount: 3,
    badge: "URBANO",
    href: "/foton/ultralivianos",
  },
  {
    id: "livianos",
    name: "Livianos",
    description: "Distribución versátil",
    image:
      "/images/FOTON/cateogries/livianos/AUMARK/EXTERIOR/EXTERIOR-AUMARK-2.jpg",
    modelsCount: 2,
    badge: "LOGÍSTICA",
    href: "/foton/livianos",
  },
  {
    id: "medianos",
    name: "Medianos",
    description: "Cargas medianas",
    image: "/images/FOTON/cateogries/medianos/AUMAN D/HERO/HERO-AUMAN D.jpg",
    modelsCount: 1,
    badge: "CARGA",
    href: "/foton/medianos",
  },
  {
    id: "pesados-ruta",
    name: "Pesados Ruta",
    description: "Largas distancias",
    image:
      "/images/FOTON/cateogries/PesadosRuta/AUMAN R/EXTERIOR/EXTERIOR-AUMAN R-1.jpg",
    modelsCount: 2,
    badge: "RUTA",
    href: "/foton/pesados-ruta",
  },
  {
    id: "pesados-vocacionales",
    name: "Pesados Vocacionales",
    description: "Trabajos especializados",
    image:
      "/images/FOTON/cateogries/PesadosVocacionales/AUMAN C/EXTERIOR/EXTERIOR-AUMAN-C-2.jpg",
    modelsCount: 1,
    badge: "VOCACIONAL",
    href: "/foton/pesados-vocacionales",
  },
  {
    id: "electricos",
    name: "Eléctricos",
    description: "Sustentabilidad",
    image:
      "/images/FOTON/cateogries/Electricos/EAUMARK/EXTERIOR/EXTERIOR-E AUMARK-1.jpg",
    modelsCount: 1,
    badge: "ELÉCTRICO",
    href: "/foton/electricos",
  },
];

export function FotonCategories() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!section || !wrap || !track) return;

      ScrollTrigger.config({ ignoreMobileResize: true });
      const mm = gsap.matchMedia();

      mm.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          /* En modo pin el carril NO debe ser un scroller táctil:
             "clip" lo vuelve no-scrolleable (hidden queda de fallback),
             sin snap y con el touch reservado al scroll vertical. */
          wrap.style.overflowX = "hidden";
          wrap.style.overflowX = "clip";
          wrap.style.scrollSnapType = "none";
          wrap.style.touchAction = "pan-y";
          wrap.scrollLeft = 0;

          const getAmount = () =>
            Math.max(0, track.scrollWidth - wrap.clientWidth);

          const tween = gsap.to(track, {
            x: () => -getAmount(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${getAmount()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (wrap.scrollLeft) wrap.scrollLeft = 0;
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`;
                }
              },
            },
          });

          /* Parallax interno por panel durante el desplazamiento */
          const imgs = track.querySelectorAll<HTMLElement>("[data-panel-img]");
          const parallax: gsap.core.Tween[] = [];
          imgs.forEach((img) => {
            const panel = img.closest("[data-panel]");
            if (!panel) return;
            parallax.push(
              gsap.fromTo(
                img,
                { xPercent: -4 },
                {
                  xPercent: 4,
                  ease: "none",
                  scrollTrigger: {
                    trigger: panel as HTMLElement,
                    containerAnimation: tween,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                }
              )
            );
          });

          return () => {
            parallax.forEach((p) => {
              p.scrollTrigger?.kill();
              p.kill();
            });
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(track, { clearProps: "x" });
            wrap.style.overflowX = "";
            wrap.style.scrollSnapType = "";
            wrap.style.touchAction = "";
          };
        }
      );

      /* Sin animación: sin pin, la pista queda como carril horizontal
         nativo (scroll táctil normal), contenido siempre visible. */
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { clearProps: "x" });
        wrap.style.overflowX = "auto";
        wrap.style.scrollSnapType = "";
        wrap.style.touchAction = "";
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh min-h-[600px] flex-col justify-center overflow-hidden bg-paper-0 py-0 text-ink-0 lg:h-screen lg:min-h-[760px]"
    >
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="02"
          label="Categorías FOTON"
          theme="light"
          title={
            <>
              Explorá las <span className="text-petrol-deep">Categorías</span>
            </>
          }
          sub="Encuentra el vehículo perfecto según tus necesidades de transporte"
          aside={
            <div className="flex items-center gap-4">
              <span className="gm-label text-ink-2">07 Categorías</span>
              <span className="relative block h-px w-28 bg-line-light sm:w-44">
                <span
                  ref={progressRef}
                  className="absolute inset-0 origin-left scale-x-0 bg-petrol-deep"
                />
              </span>
            </div>
          }
        />
      </div>

      {/* Pista horizontal — pin + scrub en desktop, snap nativo en mobile */}
      <div
        ref={wrapRef}
        className="scrollbar-hide mt-8 w-full snap-x snap-mandatory overflow-x-auto border-y border-line-light lg:mt-14"
      >
        <div ref={trackRef} className="flex w-max">
          {/* Espaciador de alineación con el contenedor */}
          <div
            aria-hidden
            className="w-5 shrink-0 sm:w-8 lg:w-[max(3rem,calc((100vw-1480px)/2+3rem))]"
          />
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={category.href}
              data-panel
              className="group relative flex h-[52svh] min-h-[400px] w-[82vw] shrink-0 snap-start flex-col border-l border-line-light bg-paper-0 transition-colors duration-500 first-of-type:border-l-0 hover:bg-paper-1 sm:w-[58vw] lg:h-[58vh] lg:min-h-[480px] lg:w-[40vw] xl:w-[36vw]"
            >
              <div className="flex items-start justify-between px-6 pt-6 sm:px-8 sm:pt-7">
                <span className="gm-display text-4xl text-ink-0/15 transition-colors duration-500 group-hover:text-petrol-deep/30 sm:text-5xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3">
                  <span className="gm-label border border-line-light-2 px-2.5 py-1.5 text-ink-1">
                    {category.badge}
                  </span>
                </div>
              </div>

              <div className="relative mt-5 flex-1 overflow-hidden">
                <div data-panel-img className="absolute -inset-x-[5%] inset-y-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 1024px) 82vw, 40vw"
                    className="object-cover grayscale-[30%] transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                  />
                </div>
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-0/35 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-30"
                />
              </div>

              <div className="flex items-end justify-between gap-4 px-6 py-6 sm:px-8 sm:py-7">
                <div>
                  <h3 className="gm-display text-display-3 text-ink-0">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-1 sm:text-base">
                    {category.description}
                  </p>
                  <p className="gm-label mt-3 text-ink-2">
                    {category.modelsCount}{" "}
                    {category.modelsCount === 1 ? "Modelo" : "Modelos"}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center border border-line-light-2 text-ink-1 transition-all duration-300 group-hover:border-petrol-deep group-hover:bg-petrol-deep group-hover:text-white"
                >
                  <ArrowUpRight strokeWidth={1.5} className="size-5" />
                </span>
              </div>
            </Link>
          ))}
          {/* Respiro final */}
          <div aria-hidden className="w-5 shrink-0 sm:w-8 lg:w-24" />
        </div>
      </div>

    </section>
  );
}
