"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Remolque, Usados } from "@/types";
import { remolqueService, usadosService } from "@/services";
import { SectionHeading } from "./gm/section-heading";
import { Reveal } from "./gm/reveal";
import { GmButton } from "./gm/gm-button";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ITEMS_PER_SLIDE = 3;

function CarouselControls({
  onPrev,
  onNext,
  theme,
  current,
  total,
}: {
  onPrev: () => void;
  onNext: () => void;
  theme: "dark" | "light";
  current: number;
  total: number;
}) {
  const dark = theme === "dark";
  const btn = cn(
    "flex size-11 items-center justify-center border transition-colors duration-300",
    dark
      ? "border-line-dark-2 text-platinum hover:bg-platinum hover:text-carbon-0"
      : "border-line-light-2 text-ink-0 hover:bg-ink-0 hover:text-paper-1"
  );
  return (
    <div className="flex items-center gap-4">
      <span className={cn("gm-label", dark ? "text-steel" : "text-ink-2")}>
        {String(current + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </span>
      <div className="flex">
        <button type="button" onClick={onPrev} className={btn} aria-label="Anterior">
          <ArrowLeft strokeWidth={1.5} className="size-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          className={cn(btn, "-ml-px")}
          aria-label="Siguiente"
        >
          <ArrowRight strokeWidth={1.5} className="size-5" />
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  theme,
  title,
  text,
  whatsappHref,
}: {
  theme: "dark" | "light";
  title: string;
  text: string;
  whatsappHref: string;
}) {
  const dark = theme === "dark";
  return (
    <div
      className={cn(
        "border px-6 py-16 text-center sm:px-10",
        dark ? "border-line-dark bg-carbon-2/30" : "border-line-light bg-paper-1"
      )}
    >
      <div className="mx-auto max-w-lg">
        <h3
          className={cn(
            "gm-display text-display-3",
            dark ? "text-platinum" : "text-ink-0"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            dark ? "text-silver" : "text-ink-1"
          )}
        >
          {text}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <GmButton
            href={whatsappHref}
            external
            tone={dark ? "solidLight" : "solidDark"}
            icon={FaWhatsapp}
          >
            WhatsApp
          </GmButton>
          <GmButton
            href="/contacto"
            tone={dark ? "outlineDark" : "outlineLight"}
            icon={Phone}
          >
            Contactanos
          </GmButton>
        </div>
      </div>
    </div>
  );
}

type RemolquesUsadosSectionProps = {
  /** Data resuelta en el servidor (ISR). null = fallback a fetch en cliente. */
  initialRemolques?: Remolque[] | null;
  initialUsados?: Usados[] | null;
};

export function RemolquesUsadosSection({
  initialRemolques = null,
  initialUsados = null,
}: RemolquesUsadosSectionProps) {
  const [currentSlideRemolques, setCurrentSlideRemolques] = useState(0);
  const [currentSlideUsados, setCurrentSlideUsados] = useState(0);
  const [remolques, setRemolques] = useState<Remolque[]>(
    initialRemolques ?? []
  );
  const [usados, setUsados] = useState<Usados[]>(initialUsados ?? []);

  // Fallback: cargar en cliente solo si el servidor no trajo data
  useEffect(() => {
    if (initialRemolques !== null) return;
    const loadRemolques = async () => {
      try {
        const response = await remolqueService.getPublicRemolques({ limit: 6 });
        setRemolques(response?.items || []);
      } catch (error) {
        console.error("Error cargando remolques:", error);
        setRemolques([]);
      }
    };
    loadRemolques();
  }, [initialRemolques]);

  useEffect(() => {
    if (initialUsados !== null) return;
    const loadUsados = async () => {
      try {
        const response = await usadosService.getPublicUsados({ limit: 6 });
        setUsados(response?.items || []);
      } catch (error) {
        console.error("Error cargando usados:", error);
        setUsados([]);
      }
    };
    loadUsados();
  }, [initialUsados]);

  const remolquesGridRef = useRef<HTMLDivElement>(null);
  const usadosGridRef = useRef<HTMLDivElement>(null);

  /* Entrada en cascada de las cards (clip-path), disparada cuando la data
     async ya existe; el ScrollTrigger previo se mata solo al re-ejecutar. */
  useGSAP(
    () => {
      const grid = remolquesGridRef.current;
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
    { scope: remolquesGridRef, dependencies: [remolques.length] }
  );

  useGSAP(
    () => {
      const grid = usadosGridRef.current;
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
    { scope: usadosGridRef, dependencies: [usados.length] }
  );

  const totalSlidesRemolques = Math.ceil(remolques.length / ITEMS_PER_SLIDE);
  const totalSlidesUsados = Math.ceil(usados.length / ITEMS_PER_SLIDE);

  const nextSlideRemolques = () =>
    setCurrentSlideRemolques((prev) => (prev + 1) % totalSlidesRemolques);
  const prevSlideRemolques = () =>
    setCurrentSlideRemolques(
      (prev) => (prev - 1 + totalSlidesRemolques) % totalSlidesRemolques
    );
  const nextSlideUsados = () =>
    setCurrentSlideUsados((prev) => (prev + 1) % totalSlidesUsados);
  const prevSlideUsados = () =>
    setCurrentSlideUsados(
      (prev) => (prev - 1 + totalSlidesUsados) % totalSlidesUsados
    );

  return (
    <>
      {/* ============ REMOLQUES — carbón ============ */}
      <section className="relative overflow-hidden border-t border-line-dark bg-carbon-0 py-20 text-platinum sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="03"
            label="Stock en consignación"
            title="Remolques"
            theme="dark"
            aside={
              remolques.length > 0 && totalSlidesRemolques > 1 ? (
                <CarouselControls
                  onPrev={prevSlideRemolques}
                  onNext={nextSlideRemolques}
                  theme="dark"
                  current={currentSlideRemolques}
                  total={totalSlidesRemolques}
                />
              ) : undefined
            }
          />

          {/* Fabricantes representados */}
          <Reveal
            variant="wipe"
            className="mt-10 grid grid-cols-3 border-y border-line-dark"
          >
            {[
              {
                src: "/images/logos empresas/logo- RED ALCORTA.png",
                alt: "RED ALCORTA",
              },
              {
                src: "/images/logos empresas/LOGO SOLO Y BRUSA.png",
                alt: "SOL Y BRUSA",
              },
              { src: "/images/logos empresas/LOGO LAMBERT.png", alt: "LAMBERT" },
            ].map((logo, i) => (
              <div
                key={logo.alt}
                data-reveal
                className={cn(
                  "flex items-center justify-center px-4 py-6 sm:py-8",
                  i === 1 && "border-x border-line-dark"
                )}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={240}
                  height={120}
                  className="h-8 w-auto object-contain opacity-85 mix-blend-screen sm:h-12 lg:h-14"
                />
              </div>
            ))}
          </Reveal>

          <div className="mt-12">
            {remolques.length > 0 ? (
              <div ref={remolquesGridRef} className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.83,0,0.17,1)]"
                  style={{
                    transform: `translateX(-${currentSlideRemolques * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalSlidesRemolques }).map(
                    (_, slideIndex) => {
                      const itemsInSlide = remolques.slice(
                        slideIndex * ITEMS_PER_SLIDE,
                        (slideIndex + 1) * ITEMS_PER_SLIDE
                      );
                      return (
                        <div
                          key={slideIndex}
                          className="flex min-w-full flex-wrap justify-center gap-6"
                        >
                          {itemsInSlide.map((remolque) => (
                            <div
                              key={remolque._id}
                              data-home-card
                              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                            >
                              <Link
                                href={`/remolques/${remolque._id}`}
                                className="group flex h-full w-full flex-col border border-line-dark bg-carbon-1 transition-colors duration-500 hover:bg-carbon-2"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden border-b border-line-dark">
                                  <Image
                                    src={
                                      remolque.imagenes?.[0]?.secure_url ||
                                      "/images/remolques/alcortaRemolque.webp"
                                    }
                                    alt={remolque.titulo || "Remolque"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                  />
                                  <span className="gm-label absolute left-4 top-4 border border-line-dark-2 bg-carbon-0/70 px-2.5 py-1.5 text-platinum backdrop-blur-sm">
                                    Disponible
                                  </span>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                  <div className="gm-label flex flex-wrap items-center gap-x-3 gap-y-2 text-steel">
                                    {remolque.marca ? (
                                      <span>{remolque.marca}</span>
                                    ) : null}
                                    {remolque.marca && remolque.tipoCarroceria ? (
                                      <span
                                        aria-hidden
                                        className="h-3 w-px bg-line-dark-2"
                                      />
                                    ) : null}
                                    {remolque.tipoCarroceria ? (
                                      <span className="text-petrol-bright">
                                        {remolque.tipoCarroceria}
                                      </span>
                                    ) : null}
                                  </div>
                                  <h3 className="gm-display mt-3 line-clamp-2 text-xl text-platinum">
                                    {remolque.titulo}
                                  </h3>
                                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm text-silver">
                                    <span className="gm-underline gm-label">
                                      Ver detalles
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
                    }
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                theme="dark"
                title="¿Buscás un remolque específico?"
                text="En este momento no tenemos remolques en stock, pero si te comunicás con nosotros podemos ayudarte a encontrar exactamente lo que necesitás"
                whatsappHref="https://wa.me/+5493424216850?text=Hola!%20Me%20interesa%20consultar%20sobre%20remolques%20disponibles."
              />
            )}
          </div>

          {remolques.length > 0 && (
            <div className="mt-12 flex justify-end border-t border-line-dark pt-8">
              <GmButton href="/remolques" tone="outlineDark">
                Ver más remolques
              </GmButton>
            </div>
          )}
        </div>
      </section>

      {/* ============ USADOS — porcelana ============ */}
      <section className="relative overflow-hidden bg-paper-0 py-20 text-ink-0 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="04"
            label="Seleccionados y verificados"
            title="Usados"
            theme="light"
            aside={
              usados.length > 0 && totalSlidesUsados > 1 ? (
                <CarouselControls
                  onPrev={prevSlideUsados}
                  onNext={nextSlideUsados}
                  theme="light"
                  current={currentSlideUsados}
                  total={totalSlidesUsados}
                />
              ) : undefined
            }
          />

          <div className="mt-12">
            {usados.length > 0 ? (
              <div ref={usadosGridRef} className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-[cubic-bezier(0.83,0,0.17,1)]"
                  style={{
                    transform: `translateX(-${currentSlideUsados * 100}%)`,
                  }}
                >
                  {Array.from({ length: totalSlidesUsados }).map(
                    (_, slideIndex) => {
                      const itemsInSlide = usados.slice(
                        slideIndex * ITEMS_PER_SLIDE,
                        (slideIndex + 1) * ITEMS_PER_SLIDE
                      );
                      return (
                        <div
                          key={slideIndex}
                          className="flex min-w-full flex-wrap justify-center gap-6"
                        >
                          {itemsInSlide.map((usado) => (
                            <div
                              key={usado._id}
                              data-home-card
                              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]"
                            >
                              <Link
                                href={`/usados/${usado._id}`}
                                className="group flex h-full w-full flex-col border border-line-light bg-paper-1 transition-colors duration-500 hover:bg-white"
                              >
                                <div className="relative aspect-[4/3] overflow-hidden border-b border-line-light">
                                  <Image
                                    src={
                                      usado.imagenes?.[0]?.secure_url ||
                                      "/images/usados/FotonUsado.webp"
                                    }
                                    alt={usado.titulo || "Vehículo usado"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                                  />
                                  <span className="gm-label absolute left-4 top-4 border border-line-light-2 bg-paper-1/80 px-2.5 py-1.5 text-ink-0 backdrop-blur-sm">
                                    {usado.anio}
                                  </span>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                  <div className="gm-label flex flex-wrap items-center gap-x-3 gap-y-2 text-ink-2">
                                    <span className="text-petrol-deep">
                                      {usado.marca}
                                    </span>
                                    {usado.modelo ? (
                                      <>
                                        <span
                                          aria-hidden
                                          className="h-3 w-px bg-line-light-2"
                                        />
                                        <span>{usado.modelo}</span>
                                      </>
                                    ) : null}
                                  </div>
                                  <h3 className="gm-display mt-3 line-clamp-2 text-xl text-ink-0">
                                    {usado.titulo}
                                  </h3>
                                  <span className="mt-auto flex items-center gap-2 pt-6 text-sm text-ink-1">
                                    <span className="gm-underline gm-label">
                                      Ver detalles
                                    </span>
                                    <ArrowUpRight
                                      aria-hidden
                                      strokeWidth={1.5}
                                      className="size-4 text-petrol-deep transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                  </span>
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                theme="light"
                title="¿Buscás un vehículo usado?"
                text="En este momento no tenemos vehículos usados en stock, pero si te comunicás con nosotros podemos ayudarte a encontrar exactamente lo que necesitás"
                whatsappHref="https://wa.me/5493424216850?text=Hola!%20Me%20interesa%20consultar%20sobre%20veh%C3%ADculos%20usados%20disponibles."
              />
            )}
          </div>

          {usados.length > 0 && (
            <div className="mt-12 flex justify-end border-t border-line-light pt-8">
              <GmButton href="/usados" tone="outlineLight">
                Ver más usados
              </GmButton>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
