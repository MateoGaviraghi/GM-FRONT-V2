"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Newspaper } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";
import { SectionHeading } from "./gm/section-heading";
import { GmButton } from "./gm/gm-button";
import { cn, formatShortDate } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ITEMS_PER_SLIDE = 3;

type NovedadesSectionProps = {
  /** Data resuelta en el servidor (ISR). null = fallback a fetch en cliente. */
  initialNovedades?: Novedad[] | null;
};

export function NovedadesSection({
  initialNovedades = null,
}: NovedadesSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [novedades, setNovedades] = useState<Novedad[]>(
    initialNovedades ?? []
  );

  // Fallback: cargar en cliente solo si el servidor no trajo data
  useEffect(() => {
    if (initialNovedades !== null) return;
    const loadNovedades = async () => {
      try {
        const params = {
          page: 1,
          limit: 6,
          sortBy: "createdAt" as const,
          sortOrder: "desc" as const,
        };
        const response = await novedadService.public.list(params);
        setNovedades(response?.items || []);
      } catch (error) {
        console.error("Error cargando novedades:", error);
        setNovedades([]);
      }
    };
    loadNovedades();
  }, [initialNovedades]);

  const novedadesGridRef = useRef<HTMLDivElement>(null);

  /* Entrada en cascada de las cards (clip-path), disparada cuando la data
     async ya existe; el ScrollTrigger previo se mata solo al re-ejecutar. */
  useGSAP(
    () => {
      const grid = novedadesGridRef.current;
      if (!grid) return;
      const cards = grid.querySelectorAll<HTMLElement>("[data-home-card]");
      if (!cards.length) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }
      gsap.fromTo(
        cards,
        { clipPath: "inset(0 100% 100% 0)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 0.75,
          ease: "power3.out",
          stagger: { each: 0.05, grid: "auto", from: "start" },
          scrollTrigger: { trigger: grid, start: "top 88%", once: true },
          clearProps: "clipPath",
        }
      );
    },
    { scope: novedadesGridRef, dependencies: [novedades.length] }
  );

  const totalSlides = Math.ceil(novedades.length / ITEMS_PER_SLIDE);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const controlBtn =
    "flex size-11 items-center justify-center border border-line-dark-2 text-platinum transition-colors duration-300 hover:bg-platinum hover:text-carbon-0";

  return (
    <section className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          index="05"
          label="Prensa y lanzamientos"
          title="Novedades"
          sub="Mantente al día con las últimas actualizaciones y lanzamientos"
          theme="dark"
          aside={
            novedades.length > 0 && totalSlides > 1 ? (
              <div className="flex items-center gap-4">
                <span className="gm-label text-steel">
                  {String(currentSlide + 1).padStart(2, "0")} /{" "}
                  {String(totalSlides).padStart(2, "0")}
                </span>
                <div className="flex">
                  <button
                    type="button"
                    onClick={prevSlide}
                    className={controlBtn}
                    aria-label="Anterior"
                  >
                    <ArrowLeft strokeWidth={1.5} className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className={cn(controlBtn, "-ml-px")}
                    aria-label="Siguiente"
                  >
                    <ArrowRight strokeWidth={1.5} className="size-5" />
                  </button>
                </div>
              </div>
            ) : undefined
          }
        />

        <div className="mt-12">
          {novedades.length > 0 ? (
            <div ref={novedadesGridRef} className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-[cubic-bezier(0.83,0,0.17,1)]"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                  const itemsInSlide = novedades.slice(
                    slideIndex * ITEMS_PER_SLIDE,
                    (slideIndex + 1) * ITEMS_PER_SLIDE
                  );
                  return (
                    <div
                      key={slideIndex}
                      className="flex min-w-full flex-wrap justify-center gap-6"
                    >
                      {itemsInSlide.map((novedad) => (
                        <div
                          key={novedad._id}
                          data-home-card
                          className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                        >
                          <Link
                            href={`/novedades/${novedad._id}`}
                            className="group flex h-full w-full flex-col border border-line-dark bg-carbon-2/40 transition-colors duration-500 hover:bg-carbon-2"
                          >
                            <div className="relative aspect-[16/10] overflow-hidden border-b border-line-dark bg-carbon-2">
                              {novedad.imagenes &&
                              novedad.imagenes.length > 0 &&
                              novedad.imagenes[0]?.thumbnails?.large ? (
                                <Image
                                  src={novedad.imagenes[0].thumbnails.large}
                                  alt={novedad.titulo || "Novedad"}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Newspaper
                                    strokeWidth={1}
                                    className="size-14 text-steel"
                                  />
                                </div>
                              )}
                              {novedad.categoria ? (
                                <span className="gm-label absolute left-4 top-4 border border-line-dark-2 bg-carbon-0/70 px-2.5 py-1.5 text-petrol-bright backdrop-blur-sm">
                                  {novedad.categoria}
                                </span>
                              ) : null}
                            </div>

                            <div className="flex flex-1 flex-col p-6">
                              {novedad.fechaPublicacion ? (
                                <time className="gm-label text-steel">
                                  {formatShortDate(novedad.fechaPublicacion)}
                                </time>
                              ) : null}
                              <h3 className="gm-display mt-3 line-clamp-2 min-h-[2.6em] text-lg text-platinum">
                                {novedad.titulo}
                              </h3>
                              {novedad.resumen ? (
                                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-silver">
                                  {novedad.resumen}
                                </p>
                              ) : null}
                              <span className="mt-auto flex items-center gap-2 pt-6">
                                <span className="gm-underline gm-label text-petrol-bright">
                                  Leer más
                                </span>
                                <ArrowUpRight
                                  aria-hidden
                                  strokeWidth={1.5}
                                  className="size-4 text-petrol-bright transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </span>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="border border-line-dark bg-carbon-2/30 px-6 py-16 text-center sm:px-10">
              <div className="mx-auto max-w-lg">
                <h3 className="gm-display text-display-3 text-platinum">
                  Próximamente nuevas novedades
                </h3>
                <p className="mt-4 text-base leading-relaxed text-silver sm:text-lg">
                  Mantente informado sobre las últimas actualizaciones
                </p>
              </div>
            </div>
          )}
        </div>

        {novedades.length > 0 && (
          <div className="mt-12 flex justify-end border-t border-line-dark pt-8">
            <GmButton href="/novedades" tone="outlineDark">
              Ver todas las novedades
            </GmButton>
          </div>
        )}
      </div>
    </section>
  );
}
