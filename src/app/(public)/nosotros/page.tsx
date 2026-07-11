"use client";

import { useRef } from "react";
import Image from "next/image";
import { Clock, MapPin, Phone, Mail } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/cliente/home/gm/section-heading";
import { Reveal } from "@/components/cliente/home/gm/reveal";
import { GmButton } from "@/components/cliente/home/gm/gm-button";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

/* Cifras del negocio — reubicadas del hero al cierre de la historia (verbatim) */
const STATS = [
  { value: "38", suffix: "+", label: "Años de Experiencia" },
  { value: "1500", suffix: "+", label: "Unidades Vendidas" },
  { value: "2", suffix: "", label: "Generaciones" },
  { value: "2019", suffix: "", label: "Guzman Motors SRL" },
];

type Era = {
  year: string;
  range: string;
  title: string;
  image: string;
  caption: string;
  flip: boolean;
  items: React.ReactNode[];
};

const ERAS: Era[] = [
  {
    year: "1987",
    range: "1987 — 1999",
    title: "Los Inicios",
    image: "/images/nosotros/equipo guzman motoros.webp",
    caption: "Héctor y Cristina con su hijo Leonardo",
    flip: false,
    items: [
      <>
        <strong className="font-semibold text-petrol-deep">1987:</strong>{" "}
        Héctor Guzmán inicia su actividad en Santo Tomé (Ruta 19 y Bs As),
        especializándose en acoplados y remolques Astivia, compra-venta y
        consignación de camiones.
      </>,
      <>
        <strong className="font-semibold text-petrol-deep">1989:</strong>{" "}
        Traslado al nuevo local propio en{" "}
        <strong className="font-semibold text-ink-0">
          Avda. Blas Parera 6422
        </strong>
        , Santa Fe.
      </>,
      <>
        Incorporación de camiones{" "}
        <strong className="font-semibold text-ink-0">Fiat (hoy Iveco)</strong>{" "}
        como subagentes de{" "}
        <strong className="font-semibold text-ink-0">
          Frencia y Rossi de Córdoba
        </strong>{" "}
        hasta 1999.
      </>,
    ],
  },
  {
    year: "1999",
    range: "1999 — 2019",
    title: "Era Volkswagen",
    image: "/images/nosotros/equipo guzman motros 2.webp",
    caption: "El equipo en las oficinas de Blas Parera 6422",
    flip: true,
    items: [
      <>
        <strong className="font-semibold text-petrol-deep">1999:</strong>{" "}
        Llegada de Volkswagen de camiones y buses al país. Comenzamos como
        subagentes de{" "}
        <strong className="font-semibold text-ink-0">Devol SA</strong>{" "}
        (concesionario oficial).
      </>,
      <>
        <strong className="font-semibold text-petrol-deep">2016:</strong>{" "}
        Devol SA se traslada a Blas Parera 10800 tras haber vendido{" "}
        <strong className="font-semibold text-ink-0">
          más de 1500 unidades
        </strong>{" "}
        en la zona.
      </>,
      <>
        <strong className="font-semibold text-petrol-deep">2019:</strong>{" "}
        Leonardo, con 30 años de experiencia, decide independizarse y reabrir
        el negocio familiar. Ambos renuncian a Devol SA en abril.
      </>,
    ],
  },
  {
    year: "2019",
    range: "2019 — Presente",
    title: "Guzman Motors SRL",
    image: "/images/nosotros/entrada-negocio-gm-motros-nostros.jpg",
    caption: "Nuestra fachada actual - Guzman Motors SRL",
    flip: false,
    items: [
      <>
        Nace{" "}
        <strong className="font-semibold text-ink-0">Guzman Motors SRL</strong>{" "}
        con Leonardo y Héctor como titulares, regresando al histórico local de
        Blas Parera 6422.
      </>,
      <>
        Representamos a{" "}
        <strong className="font-semibold text-ink-0">Red Alcorta</strong> en la
        venta de acoplados y semirremolques de las marcas:{" "}
        <strong className="font-semibold text-ink-0">
          Sola y Brusa, Lambert, Metagro, Aiello y Cormetal
        </strong>
        .
      </>,
      <>
        Somos subagentes de{" "}
        <strong className="font-semibold text-ink-0">LTA Motors</strong> para
        las marcas{" "}
        <strong className="font-semibold text-ink-0">Foton y Zanella</strong>.
      </>,
    ],
  },
];

export default function NosotrosPage() {
  const heroRef = useRef<HTMLElement>(null);
  const timelineWrapRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLSpanElement>(null);
  const odoRef = useRef<HTMLDivElement>(null);
  const balanceRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      const hero = heroRef.current;
      if (!hero) return;

      const img = hero.querySelector<HTMLElement>("[data-hero-img]");
      const titleEl = hero.querySelector<HTMLElement>("[data-hero-title]");
      const twEl = hero.querySelector<HTMLElement>("[data-tw]");
      const caret = hero.querySelector<HTMLElement>("[data-caret]");
      const soft = hero.querySelectorAll<HTMLElement>("[data-hero-soft]");

      /* --- SplitText: título en caracteres, eyebrow en caracteres --- */
      const titleSplit = titleEl
        ? new SplitText(titleEl, { type: "chars" })
        : null;
      const twSplit = twEl ? new SplitText(twEl, { type: "chars" }) : null;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* Entrada del hero: todo arranca casi junto, un punto más pausado */

      /* Foto: entrada limpia (color, sin tratamiento B&N) */
      if (img) {
        tl.fromTo(
          img,
          { scale: 1.08, autoAlpha: 0.4 },
          { scale: 1, autoAlpha: 1, duration: 1.7, ease: "power2.out" },
          0
        );
      }

      /* Eyebrow: máquina de escribir + caret parpadeante */
      if (twSplit) {
        gsap.set(twSplit.chars, { autoAlpha: 0 });
        tl.to(
          twSplit.chars,
          { autoAlpha: 1, duration: 0.01, stagger: 0.03, ease: "none" },
          0.2
        );
      }
      if (caret) {
        gsap.set(caret, { autoAlpha: 1 });
        tl.to(
          caret,
          {
            autoAlpha: 0,
            duration: 0.44,
            repeat: 5,
            yoyo: true,
            ease: "steps(1)",
            onComplete: () => gsap.set(caret, { autoAlpha: 0 }),
          },
          1.1
        );
      }

      /* Título: cada letra se para desde el piso (drum-flip 3D) */
      if (titleSplit) {
        gsap.set(titleSplit.chars, {
          transformOrigin: "50% 100%",
          rotationX: -92,
          autoAlpha: 0,
        });
        tl.to(
          titleSplit.chars,
          {
            rotationX: 0,
            autoAlpha: 1,
            duration: 1.05,
            stagger: 0.06,
            ease: "power4.out",
          },
          0.2
        );
      }

      /* Sub + botones: entran con el título, no después */
      if (soft.length) {
        tl.fromTo(
          soft,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: 0.1 },
          0.35
        );
      }

      /* Parallax suave del hero */
      if (img) {
        gsap.to(img, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* --- Timeline: trazo que se dibuja --- */
      const timeline = timelineRef.current;
      const fill = lineFillRef.current;
      if (timeline && fill) {
        gsap.fromTo(
          fill,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: timeline,
              start: "top 72%",
              end: "bottom 60%",
              scrub: 0.6,
            },
          }
        );

        timeline.querySelectorAll<HTMLElement>("[data-era]").forEach((era) => {
          const body = era.querySelector<HTMLElement>("[data-era-body]");
          const dot = era.querySelector("[data-era-dot]");
          if (!body) return;

          if (dot) {
            ScrollTrigger.create({
              trigger: body,
              start: "top 68%",
              once: true,
              onEnter: () =>
                gsap.to(dot, {
                  backgroundColor: "var(--gm-petrol-deep)",
                  scale: 1.15,
                  duration: 0.4,
                  ease: "power2.out",
                }),
            });
          }

          const ghost = era.querySelector("[data-era-year]");
          if (ghost) {
            gsap.fromTo(
              ghost,
              { y: 44 },
              {
                y: -44,
                ease: "none",
                scrollTrigger: {
                  trigger: body,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });

        /* --- Odómetro de eras: HUD sticky que rueda al cruzar cada etapa --- */
        const odo = odoRef.current;
        if (odo) {
          const labels = gsap.utils.toArray<HTMLElement>("[data-odo]", odo);
          gsap.set(labels, { yPercent: 110, autoAlpha: 0 });
          if (labels[0]) gsap.set(labels[0], { yPercent: 0, autoAlpha: 1 });

          const setActive = (idx: number) => {
            labels.forEach((l, k) => {
              gsap.to(l, {
                yPercent: k === idx ? 0 : k < idx ? -110 : 110,
                autoAlpha: k === idx ? 1 : 0,
                duration: 0.5,
                ease: "power3.inOut",
                overwrite: true,
              });
            });
          };

          timeline
            .querySelectorAll<HTMLElement>("[data-era-body]")
            .forEach((body, i) => {
              ScrollTrigger.create({
                trigger: body,
                start: "top 50%",
                end: "bottom 50%",
                onToggle: (self) => self.isActive && setActive(i),
              });
            });
        }
      }

      /* --- Cierre: las cifras se revelan con wipe (no conteo) --- */
      const balance = balanceRef.current;
      if (balance) {
        const nums = gsap.utils.toArray<HTMLElement>(
          "[data-balance-num]",
          balance
        );
        gsap.set(nums, { clipPath: "inset(100% 0 0 0)" });
        gsap.to(nums, {
          clipPath: "inset(0% 0 0 0)",
          duration: 0.95,
          stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: { trigger: balance, start: "top 78%", once: true },
        });
      }

      return () => {
        titleSplit?.revert();
        twSplit?.revert();
      };
    },
    { dependencies: [] }
  );

  return (
    <div className="min-h-screen bg-carbon-0">
      {/* ============ HERO — "Archivo": B&N que cobra color ============ */}
      <section
        ref={heroRef}
        className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col overflow-hidden bg-carbon-0 text-platinum"
      >
        <div
          data-hero-img
          className="absolute inset-0 will-change-transform"
          aria-hidden
        >
          <Image
            src="/images/nosotros/equipo guzman motoros.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        {/* Scrim lateral: oscuro a la izquierda (texto legible),
            la foto respira a la derecha */}
        <div
          aria-hidden
          className="absolute inset-0 z-[2] bg-gradient-to-r from-carbon-0 via-carbon-0/55 to-carbon-0/10"
        />
        {/* Anclaje inferior para la transición de sección */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[2] h-2/5 bg-gradient-to-t from-carbon-0 to-transparent"
        />

        {/* Marca técnica vertical */}
        <div
          aria-hidden
          className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-5 [writing-mode:vertical-rl] xl:flex"
        >
          <span className="h-16 w-px bg-line-dark" />
          <span className="gm-label whitespace-nowrap text-steel">
            Santa Fe, Argentina
          </span>
          <span className="h-16 w-px bg-line-dark" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label flex items-center text-silver">
              <span data-tw aria-label="Desde 1987 — Santa Fe, Argentina">
                Desde 1987 — Santa Fe, Argentina
              </span>
              <span
                data-caret
                aria-hidden
                className="ml-1 inline-block text-petrol-bright opacity-0"
              >
                |
              </span>
            </span>
          </div>

          <h1
            data-hero-title
            aria-label="Nosotros"
            className="gm-display text-[clamp(2.6rem,11vw,8rem)] leading-[0.97] tracking-[-0.015em]"
            style={{ perspective: "900px" }}
          >
            Nosotros
          </h1>

          <p
            data-hero-soft
            className="mt-8 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl"
          >
            Más de 35 años de experiencia en el sector automotriz comercial,
            construyendo confianza y excelencia en cada operación
          </p>

          <div
            data-hero-soft
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <GmButton href="/contacto" tone="solidLight">
              Contactanos
            </GmButton>
            <GmButton href="/foton" tone="outlineDark">
              Ver Vehículos
            </GmButton>
          </div>
        </div>
      </section>

      {/* ============ NUESTRA HISTORIA — timeline + odómetro ============ */}
      <section className="relative overflow-x-clip bg-paper-0 py-20 text-ink-0 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="01"
            label="Nuestra Historia"
            theme="light"
            title={
              <>
                Nuestra <span className="text-petrol-deep">Historia</span>
              </>
            }
            sub="Más de tres décadas construyendo confianza en el sector automotriz comercial"
          />

          {/* Gutter del odómetro (desktop) + timeline */}
          <div className="mt-16 lg:mt-20 lg:flex lg:gap-10">
            <div
              className="relative hidden shrink-0 lg:block lg:w-16"
              aria-hidden
            >
              <div
                ref={odoRef}
                className="sticky top-[42vh] flex h-44 items-center justify-center overflow-hidden"
              >
                {ERAS.map((era) => (
                  <span
                    key={era.year}
                    data-odo
                    className="gm-label absolute inset-0 flex items-center justify-center whitespace-nowrap rotate-180 text-petrol-deep [writing-mode:vertical-rl]"
                  >
                    {era.range}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div
              ref={timelineRef}
              className="relative grid flex-1 grid-cols-[28px_1fr] gap-x-5 sm:gap-x-8 lg:grid-cols-[36px_1fr] lg:gap-x-12"
            >
              {/* Riel + trazo que se dibuja */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-6 left-[13.5px] top-2 w-px bg-line-light lg:left-[17.5px]"
              >
                <span
                  ref={lineFillRef}
                  className="absolute inset-0 block origin-top scale-y-0 bg-petrol-deep"
                />
              </div>

              {ERAS.map((era, i) => (
                <div key={era.year} data-era className="contents">
                  {/* Nodo */}
                  <div className="relative pt-1.5">
                    <span
                      data-era-dot
                      className="absolute left-[7px] top-2 block size-[14px] border border-petrol-deep bg-paper-0 lg:left-[11px]"
                    />
                  </div>

                  {/* Contenido de la era */}
                  <div
                    data-era-body
                    className={`relative ${i < ERAS.length - 1 ? "pb-20 lg:pb-28" : "pb-2"}`}
                  >
                    {/* Año fantasma monumental */}
                    <span
                      data-era-year
                      aria-hidden
                      className="gm-display pointer-events-none absolute -top-12 right-0 select-none text-[clamp(5rem,13vw,12rem)] leading-none text-ink-0/[0.05] lg:-top-20"
                    >
                      {era.year}
                    </span>

                    <Reveal className="relative">
                      <div
                        data-reveal
                        className="flex flex-wrap items-center gap-4"
                      >
                        <span className="gm-label border border-line-light-2 px-3 py-1.5 text-ink-1">
                          {era.range}
                        </span>
                      </div>
                      <h3
                        data-reveal
                        className="gm-display text-display-2 mt-5 text-ink-0"
                      >
                        {era.title}
                      </h3>
                    </Reveal>

                    <div className="mt-9 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
                      {/* Hitos */}
                      <Reveal
                        className={`space-y-7 ${era.flip ? "lg:order-2" : ""}`}
                        stagger={0.12}
                      >
                        {era.items.map((item, j) => (
                          <div
                            key={j}
                            data-reveal
                            className="grid grid-cols-[20px_1fr] gap-4"
                          >
                            <span
                              aria-hidden
                              className="gm-label pt-1 text-petrol-deep"
                            >
                              {String(j + 1).padStart(2, "0")}
                            </span>
                            <p className="border-l border-line-light pl-5 text-base leading-relaxed text-ink-1 sm:text-lg">
                              {item}
                            </p>
                          </div>
                        ))}
                      </Reveal>

                      {/* Foto de archivo */}
                      <Reveal
                        variant="wipe"
                        className={era.flip ? "lg:order-1" : ""}
                      >
                        <figure
                          data-reveal
                          className="group border border-line-light bg-paper-1"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden border-b border-line-light">
                            <Image
                              src={era.image}
                              alt={era.caption}
                              fill
                              sizes="(max-width: 1024px) 100vw, 50vw"
                              className="object-cover grayscale-[25%] transition-[filter,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] group-hover:grayscale-0"
                            />
                          </div>
                          <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                            <span className="gm-label text-ink-2">
                              {era.caption}
                            </span>
                            <span className="gm-plus shrink-0 text-petrol-deep" />
                          </figcaption>
                        </figure>
                      </Reveal>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cierre: las cifras del negocio (reubicadas del hero) */}
          <div
            ref={balanceRef}
            className="mt-20 border-t border-line-light pt-12 lg:mt-24"
          >
            <p className="gm-label mb-9 text-ink-2">En números</p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="gm-label mb-4 text-ink-2">{stat.label}</dt>
                  <dd className="overflow-hidden">
                    <span
                      data-balance-num
                      className="gm-display block text-[clamp(2.6rem,7vw,5rem)] leading-none text-ink-0 will-change-[clip-path]"
                    >
                      {stat.value}
                      {stat.suffix ? (
                        <span className="text-petrol-deep">{stat.suffix}</span>
                      ) : null}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* ============ INFORMACIÓN DE CONTACTO ============ */}
      <section className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="02"
            label="Visitanos"
            theme="dark"
            title={
              <>
                Información de{" "}
                <span className="text-petrol-bright">Contacto</span>
              </>
            }
            sub="Estamos aquí para ayudarte. Visitanos, llamanos o escribenos."
          />

          <Reveal className="mt-12 grid grid-cols-1 border-y border-line-dark md:grid-cols-3">
            <div
              data-reveal
              className="border-line-dark px-2 py-8 sm:px-6 md:border-r"
            >
              <p className="gm-label flex items-center gap-2.5 text-steel">
                <Clock
                  className="size-4 text-petrol-bright"
                  strokeWidth={1.5}
                />
                Horarios
              </p>
              <p className="gm-display mt-5 text-xl text-platinum">
                Lunes - Viernes
              </p>
              <p className="mt-3 text-base leading-relaxed text-silver">
                8:30 - 12:30 hs
                <br />
                15:30 - 18:30 hs
              </p>
            </div>

            <div
              data-reveal
              className="border-t border-line-dark px-2 py-8 sm:px-6 md:border-r md:border-t-0"
            >
              <p className="gm-label flex items-center gap-2.5 text-steel">
                <MapPin
                  className="size-4 text-petrol-bright"
                  strokeWidth={1.5}
                />
                Encontranos
              </p>
              <p className="gm-display mt-5 text-xl text-platinum">
                AV. Blas Parera 6422
              </p>
              <p className="mt-3 text-base leading-relaxed text-silver">
                Santa Fe
              </p>
            </div>

            <div
              data-reveal
              className="border-t border-line-dark px-2 py-8 sm:px-6 md:border-t-0"
            >
              <p className="gm-label flex items-center gap-2.5 text-steel">
                <Phone
                  className="size-4 text-petrol-bright"
                  strokeWidth={1.5}
                />
                Contacto
              </p>
              <a
                href="tel:+5493424216850"
                className="gm-display gm-underline relative mt-2 inline-flex items-center py-3 -mb-3 text-xl text-platinum"
              >
                +54 9 342 421 6850
              </a>
              <p className="mt-3">
                <a
                  href="mailto:hguzmanmotors@gmail.com"
                  className="gm-underline relative inline-flex items-center gap-2 py-3 -my-3 text-base text-silver transition-colors hover:text-platinum"
                >
                  <Mail
                    className="size-4 text-petrol-bright"
                    strokeWidth={1.5}
                  />
                  hguzmanmotors@gmail.com
                </a>
              </p>
            </div>
          </Reveal>

          <div className="mt-12 flex justify-end">
            <GmButton href="/contacto" tone="solidLight">
              Contactanos
            </GmButton>
          </div>
        </div>
      </section>
    </div>
  );
}
