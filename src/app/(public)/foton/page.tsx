"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  TruckIcon,
  Package,
  Container,
  Boxes,
  Factory,
  Zap,
  ArrowUpRight,
  Users,
  Phone,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/cliente/home/gm/section-heading";
import { Reveal } from "@/components/cliente/home/gm/reveal";
import { GmButton } from "@/components/cliente/home/gm/gm-button";
import { NumberTicker } from "@/components/ui/number-ticker";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CATEGORIES = [
  {
    id: "pick-ups",
    name: "Pick Ups",
    description: "Potencia y versatilidad 4x4",
    icon: Truck,
    image:
      "/images/FOTON/cateogries/pickups/Foto-Cateogries-Foton-PickUps1.jpg",
    modelsCount: 2,
    badge: "4X4",
    href: "/foton/pick-ups",
  },
  {
    id: "ultralivianos",
    name: "Ultralivianos",
    description: "Eficiencia urbana",
    icon: TruckIcon,
    image:
      "/images/FOTON/cateogries/ultralivianos/Foto-Cateogries-Foton-Ultralivianos1.webp",
    modelsCount: 3,
    badge: "URBANO",
    href: "/foton/ultralivianos",
  },
  {
    id: "livianos",
    name: "Livianos",
    description: "Distribución versátil",
    icon: Package,
    image:
      "/images/FOTON/cateogries/livianos/Foto-Cateogries-Foton-Livianos1.png",
    modelsCount: 2,
    badge: "LOGÍSTICA",
    href: "/foton/livianos",
  },
  {
    id: "medianos",
    name: "Medianos",
    description: "Cargas medianas",
    icon: Container,
    image:
      "/images/FOTON/cateogries/medianos/Foto-Cateogries-Foton-Medianos1.jpg",
    modelsCount: 1,
    badge: "CARGA",
    href: "/foton/medianos",
  },
  {
    id: "pesados-ruta",
    name: "Pesados Ruta",
    description: "Largas distancias",
    icon: Boxes,
    image:
      "/images/FOTON/cateogries/PesadosRuta/Foto-Cateogries-Foton-PesadosRuta1.jpg",
    modelsCount: 2,
    badge: "RUTA",
    href: "/foton/pesados-ruta",
  },
  {
    id: "pesados-vocacionales",
    name: "Pesados Vocacionales",
    description: "Trabajos especializados",
    icon: Factory,
    image:
      "/images/FOTON/cateogries/PesadosVocacionales/Foto-Cateogries-Foton-PesadosVocacionales1.jpg",
    modelsCount: 1,
    badge: "VOCACIONAL",
    href: "/foton/pesados-vocacionales",
  },
  {
    id: "electricos",
    name: "Eléctricos",
    description: "Sustentabilidad",
    icon: Zap,
    image:
      "/images/FOTON/cateogries/Electricos/Foto-Cateogries-Foton-Electricos1.jpg",
    modelsCount: 1,
    badge: "ELÉCTRICO",
    href: "/foton/electricos",
  },
];

const HERO_STATS = [
  { value: 7, suffix: "", label: "Categorías", ticker: true },
  { value: 13, suffix: "+", label: "Modelos Disponibles", ticker: true },
  { value: 100, suffix: "%", label: "Garantía Oficial", ticker: true },
  { value: 2024, suffix: "", label: "Última Tecnología", ticker: false },
];

/* ============================================================
   Índice de categorías — preview de imagen que persigue al cursor
   (desktop puntero fino; en mobile cada fila lleva su thumb)
   ============================================================ */
function CategoryIndex() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const quick = useRef<{
    x?: gsap.QuickToFunc;
    y?: gsap.QuickToFunc;
  }>({});

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const preview = previewRef.current;
      if (!wrap || !preview) return;
      if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !window.matchMedia("(pointer: fine)").matches
      ) {
        return;
      }

      gsap.set(preview, { autoAlpha: 0, scale: 0.94 });
      quick.current.x = gsap.quickTo(preview, "x", {
        duration: 0.55,
        ease: "power3",
      });
      quick.current.y = gsap.quickTo(preview, "y", {
        duration: 0.55,
        ease: "power3",
      });

      const onMove = (e: MouseEvent) => {
        const r = wrap.getBoundingClientRect();
        quick.current.x?.(e.clientX - r.left + 28);
        quick.current.y?.(e.clientY - r.top - 130);
      };
      wrap.addEventListener("mousemove", onMove);
      return () => wrap.removeEventListener("mousemove", onMove);
    },
    { scope: wrapRef }
  );

  const show = (i: number) => {
    setActive(i);
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  };
  const hide = () => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        autoAlpha: 0,
        scale: 0.94,
        duration: 0.3,
        ease: "power3.out",
      });
    }
  };

  return (
    <div ref={wrapRef} className="relative" onMouseLeave={hide}>
      {/* Preview flotante (solo desktop con mouse) */}
      <div
        ref={previewRef}
        aria-hidden
        className="pointer-events-none invisible absolute left-0 top-0 z-20 hidden w-[340px] border border-line-dark-2 bg-carbon-2 opacity-0 lg:block"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {active !== null && (
            <Image
              key={CATEGORIES[active].id}
              src={CATEGORIES[active].image}
              alt=""
              fill
              sizes="340px"
              className="object-cover"
            />
          )}
        </div>
        {active !== null && (
          <div className="flex items-center justify-between border-t border-line-dark px-4 py-2.5">
            <span className="gm-label text-silver">
              {CATEGORIES[active].badge}
            </span>
            <span className="gm-label text-petrol-bright">
              {String(active + 1).padStart(2, "0")} / 07
            </span>
          </div>
        )}
      </div>

      <Reveal stagger={0.06} className="border-t border-line-dark">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              data-reveal
              onMouseEnter={() => show(i)}
              className="group relative flex items-center gap-5 border-b border-line-dark py-6 transition-colors duration-400 hover:bg-carbon-2/50 sm:gap-7 lg:py-8"
            >
              {/* Thumb estático en mobile/tablet */}
              <span className="relative block h-[72px] w-[96px] shrink-0 overflow-hidden border border-line-dark lg:hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </span>

              <span className="gm-label hidden w-10 shrink-0 text-steel sm:block">
                {String(i + 1).padStart(2, "0")}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="gm-display text-2xl text-platinum transition-colors duration-300 group-hover:text-petrol-bright sm:text-3xl lg:text-4xl">
                    {cat.name}
                  </span>
                  <span className="text-sm leading-relaxed text-silver sm:text-base">
                    {cat.description}
                  </span>
                </span>
              </span>

              <span className="hidden shrink-0 items-center gap-3 md:flex">
                <Icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-4 text-petrol-bright"
                />
                <span className="gm-label border border-line-dark-2 px-2.5 py-1.5 text-silver">
                  {cat.badge}
                </span>
              </span>

              <span className="gm-label hidden w-24 shrink-0 text-right text-steel sm:block">
                {cat.modelsCount} {cat.modelsCount === 1 ? "Modelo" : "Modelos"}
              </span>

              <span
                aria-hidden
                className="flex size-10 shrink-0 items-center justify-center border border-line-dark-2 text-silver transition-all duration-300 group-hover:border-petrol-bright group-hover:bg-petrol-bright group-hover:text-carbon-0 sm:size-11"
              >
                <ArrowUpRight strokeWidth={1.5} className="size-4" />
              </span>
            </Link>
          );
        })}
      </Reveal>

      {/* Meta visible en mobile (badge + modelos) */}
      <p className="gm-label mt-4 text-steel md:hidden">
        07 Categorías · 13+ Modelos
      </p>
    </div>
  );
}

export default function FotonPage() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;

      const aperture = hero.querySelector<HTMLElement>("[data-hero-aperture]");
      const img = hero.querySelector<HTMLElement>("[data-hero-img]");
      const title = hero.querySelector<HTMLElement>("[data-hero-title]");
      const soft = hero.querySelectorAll<HTMLElement>("[data-hero-soft]");
      const rule = hero.querySelector<HTMLElement>("[data-hero-rule]");
      const catCells = hero.querySelectorAll<HTMLElement>("[data-hero-cat]");
      const catIcons = hero.querySelectorAll<HTMLElement>("[data-hero-cat-icon]");

      /* Reduced motion: revelar la foto y dejar el ancho normal */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (aperture) gsap.set(aperture, { clipPath: "none" });
        if (title) gsap.set(title, { "--wdth": 125 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* Foto: barrido con máscara diagonal desde la esquina inferior-izq */
      if (aperture) {
        tl.fromTo(
          aperture,
          { clipPath: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)" },
          {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.3,
            ease: "power4.inOut",
          },
          0
        );
      }

      /* Título FOTON: spool del eje de ancho (condensado → expandido) */
      if (title) {
        tl.fromTo(
          title,
          { "--wdth": 70, autoAlpha: 0, y: 22 },
          {
            "--wdth": 125,
            autoAlpha: 1,
            y: 0,
            duration: 1.3,
            ease: "power2.out",
          },
          0.3
        );
      }

      if (soft.length) {
        tl.fromTo(
          soft,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.09 },
          0.55
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
          0.8
        );
      }

      /* Desfile: las 7 categorías entran y una luz petrol recorre los íconos */
      if (catCells.length) {
        tl.fromTo(
          catCells,
          { y: 18, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07 },
          0.9
        );
      }
      if (catIcons.length) {
        tl.fromTo(
          catIcons,
          { color: "var(--gm-steel)" },
          {
            color: "var(--gm-petrol-bright)",
            duration: 0.35,
            stagger: 0.09,
            yoyo: true,
            repeat: 1,
          },
          1
        );
      }

      /* Parallax suave (sin scale) */
      if (img) {
        gsap.to(img, {
          yPercent: 14,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    },
    { dependencies: [] }
  );

  return (
    <div className="min-h-screen bg-carbon-0">
      {/* ============ HERO — la marca ============ */}
      <section
        ref={heroRef}
        className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col overflow-hidden bg-carbon-0 text-platinum"
      >
        {/* Backdrop con barrido de máscara diagonal */}
        <div
          data-hero-aperture
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: "polygon(0% 100%, 0% 100%, 0% 100%, 0% 100%)" }}
        >
          <div data-hero-img className="absolute inset-0 will-change-transform">
            <Image
              src="/images/FOTON/camionesFoton.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-carbon-0 via-carbon-0/35 to-carbon-0/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-0/75 via-carbon-0/20 to-transparent" />
        </div>

        {/* Marca técnica vertical */}
        <div
          aria-hidden
          className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-5 [writing-mode:vertical-rl] xl:flex"
        >
          <span className="h-16 w-px bg-line-dark" />
          <span className="gm-label text-steel">
            Beiqi Foton Motor Co. Ltd.
          </span>
          <span className="h-16 w-px bg-line-dark" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col px-5 sm:px-8 lg:px-12">
          <div className="relative flex flex-1 flex-col justify-center pb-12 pt-12 lg:pt-16">
            <div data-hero-soft className="mb-8 flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">
                Vehículos Comerciales Premium
              </span>
            </div>

            <h1
              data-hero-title
              className="gm-display text-[clamp(4rem,17vw,12.5rem)] leading-[0.9] tracking-[-0.015em] will-change-[transform,font-variation-settings]"
              style={
                {
                  fontVariationSettings: "'wdth' var(--wdth, 125)",
                  "--wdth": "125",
                } as React.CSSProperties
              }
            >
              Foton
            </h1>

            <p
              data-hero-soft
              className="mt-7 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl"
            >
              Líderes en soluciones de transporte con tecnología de vanguardia.
              Encuentra el vehículo perfecto para tu negocio.
            </p>

            {/* Cifras (verbatim), reubicadas en una línea técnica compacta */}
            <p
              data-hero-soft
              className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1"
            >
              {HERO_STATS.map((stat, i) => (
                <span key={stat.label} className="flex items-center gap-3">
                  {i > 0 ? (
                    <span aria-hidden className="text-steel">
                      ·
                    </span>
                  ) : null}
                  <span className="gm-label text-silver">
                    <span className="text-petrol-bright">
                      {stat.value}
                      {stat.suffix}
                    </span>{" "}
                    {stat.label}
                  </span>
                </span>
              ))}
            </p>

            <div
              data-hero-soft
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <GmButton href="#categorias" tone="solidLight">
                Ver Categorías
              </GmButton>
              <GmButton href="/contacto" tone="outlineDark" icon={Phone}>
                Contactar Ahora
              </GmButton>
            </div>
          </div>

          {/* Desfile de la gama — las 7 categorías como iconografía */}
          <div className="relative">
            <span
              data-hero-rule
              aria-hidden
              className="absolute inset-x-0 top-0 block h-px origin-left bg-line-dark-2 will-change-transform"
            />
            <ul className="scrollbar-hide flex overflow-x-auto lg:grid lg:grid-cols-7 lg:overflow-visible">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li
                    key={cat.id}
                    data-hero-cat
                    className="flex min-w-[46%] shrink-0 items-center gap-3 border-line-dark px-4 py-5 [&:not(:first-child)]:border-l sm:min-w-[30%] lg:min-w-0"
                  >
                    <Icon
                      data-hero-cat-icon
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-4 shrink-0 text-steel"
                    />
                    <span className="gm-label truncate text-silver">
                      {cat.name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ 01 · CATEGORÍAS — índice con preview ============ */}
      <section
        id="categorias"
        className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24 lg:py-28"
      >
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="01"
            label="La gama"
            theme="dark"
            title={
              <>
                Explora por{" "}
                <span className="text-petrol-bright">Categoría</span>
              </>
            }
            sub="Encuentra el vehículo perfecto según tus necesidades de transporte"
          />

          <div className="mt-12 lg:mt-14">
            <CategoryIndex />
          </div>
        </div>
      </section>

      {/* ============ 02 · ACERCA DE CVN Y FOTON ============ */}
      <section className="relative overflow-hidden bg-paper-0 py-20 text-ink-0 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="02"
            label="La compañía"
            theme="light"
            title={
              <>
                Acerca de <span className="text-petrol-deep">CVN y Foton</span>
              </>
            }
          />

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal stagger={0.1} className="space-y-6">
              <p
                data-reveal
                className="text-base leading-relaxed text-ink-1 sm:text-lg"
              >
                <strong className="font-semibold text-petrol-deep">
                  CVN Motors
                </strong>{" "}
                distribuye y comercializa en Argentina vehículos comerciales de
                la reconocida marca &ldquo;Foton&rdquo;.
                <strong className="font-semibold text-ink-0">
                  {" "}
                  Beiqi Foton Motor Co. Ltd.
                </strong>
                , es líder internacional en la fabricación de{" "}
                <strong className="font-semibold text-ink-0">
                  camiones livianos, medianos y pesados, vans, pickups, buses y
                  vehículos especiales
                </strong>{" "}
                para la construcción.
              </p>

              <p
                data-reveal
                className="text-base leading-relaxed text-ink-1 sm:text-lg"
              >
                La firma fue fundada el{" "}
                <strong className="font-semibold text-petrol-deep">
                  28 de agosto de 1996
                </strong>
                , tiene su sede central en{" "}
                <strong className="font-semibold text-ink-0">
                  Beijing, China
                </strong>
                , y es el resultado de la fusión de dos Joint Ventures{" "}
                <strong className="font-semibold text-ink-0">
                  Beijing Foton Daimler Automotive Co., Ltd.
                </strong>{" "}
                y{" "}
                <strong className="font-semibold text-ink-0">
                  Beijing Foton Cummins Engine Co. Ltd.
                </strong>
              </p>

              <blockquote
                data-reveal
                className="border-l-2 border-petrol-deep bg-paper-1 px-6 py-6"
              >
                <p className="text-xl leading-relaxed text-ink-0 sm:text-2xl">
                  &ldquo;La excelencia en vehículos comerciales es nuestro
                  compromiso diario&rdquo;
                </p>
                <cite className="gm-label mt-4 block not-italic text-ink-1">
                  — Mikey Diokles, President of Motors
                </cite>
              </blockquote>
            </Reveal>

            <Reveal variant="wipe">
              <figure
                data-reveal
                className="group border border-line-light bg-paper-1"
              >
                <div className="relative aspect-[3/2] overflow-hidden border-b border-line-light">
                  <Image
                    src="/images/FOTON/imagen foton 1.webp"
                    alt="Fábrica Foton - Líder en vehículos comerciales"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="gm-label text-ink-2">
                    Instalaciones de Beiqi Foton Motor Co. Ltd. en Beijing,
                    China
                  </span>
                  <span className="gm-plus shrink-0 text-petrol-deep" />
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 03 · FOTON EN EL MUNDO ============ */}
      <section className="relative overflow-hidden border-t border-line-dark bg-carbon-1 py-20 text-platinum sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="03"
            label="Presencia global"
            theme="dark"
            title={
              <>
                Foton en el <span className="text-petrol-bright">Mundo</span>
              </>
            }
          />

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="wipe" className="lg:order-1">
              <figure
                data-reveal
                className="group border border-line-dark bg-carbon-2"
              >
                <div className="relative aspect-[3/2] overflow-hidden border-b border-line-dark">
                  <Image
                    src="/images/FOTON/imagen foton 2.webp"
                    alt="Logo FOTON - Presencia mundial"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="gm-label text-silver">
                    FOTON: Líder mundial en vehículos comerciales
                  </span>
                  <span className="gm-plus shrink-0 text-petrol-bright" />
                </figcaption>
              </figure>
            </Reveal>

            <div className="lg:order-2">
              <Reveal stagger={0.1} className="space-y-6">
                <p
                  data-reveal
                  className="text-base leading-relaxed text-silver sm:text-lg"
                >
                  <strong className="font-semibold text-petrol-bright">
                    FOTON
                  </strong>{" "}
                  es en la actualidad el fabricante chino de vehículos
                  comerciales con el rango más amplio de modelos con más de{" "}
                  <strong className="font-semibold text-platinum">
                    8 millones de unidades producidas
                  </strong>
                  , y cuenta además con{" "}
                  <strong className="font-semibold text-platinum">
                    70 representantes
                  </strong>{" "}
                  y más de{" "}
                  <strong className="font-semibold text-platinum">
                    1,000 distributores oficiales
                  </strong>{" "}
                  en todo el mundo.
                </p>

                <p
                  data-reveal
                  className="text-base leading-relaxed text-silver sm:text-lg"
                >
                  Sus productos y servicios se extienden hacia{" "}
                  <strong className="font-semibold text-petrol-bright">
                    más de 110 países
                  </strong>{" "}
                  en todos los continentes.{" "}
                  <strong className="font-semibold text-platinum">
                    CVN MOTORS
                  </strong>{" "}
                  es una de la más recientes unidades de negocio de{" "}
                  <strong className="font-semibold text-platinum">
                    Grupo Iraola
                  </strong>
                  , un grupo empresario de capitales nacionales, con{" "}
                  <strong className="font-semibold text-petrol-bright">
                    50 años de trayectoria industrial
                  </strong>{" "}
                  en el país, y una sólida estructura comercial y
                  administrativa, orientada a la satisfacción del cliente.
                </p>
              </Reveal>

              {/* Estadísticas destacadas — banda técnica */}
              <Reveal className="mt-10">
                <dl
                  data-reveal
                  className="grid grid-cols-3 border-y border-line-dark"
                >
                  <div className="border-r border-line-dark px-2 py-5 sm:px-5">
                    <dd className="gm-display flex items-baseline text-2xl text-platinum sm:text-3xl">
                      <NumberTicker value={8} className="text-platinum" />
                      <span className="ml-0.5 text-[0.62em] text-petrol-bright">
                        M+
                      </span>
                    </dd>
                    <dt className="gm-label mt-2 text-steel">
                      Unidades Producidas
                    </dt>
                  </div>
                  <div className="border-r border-line-dark px-2 py-5 sm:px-5">
                    <dd className="gm-display flex items-baseline text-2xl text-platinum sm:text-3xl">
                      <NumberTicker value={110} className="text-platinum" />
                      <span className="ml-0.5 text-[0.62em] text-petrol-bright">
                        +
                      </span>
                    </dd>
                    <dt className="gm-label mt-2 text-steel">Países</dt>
                  </div>
                  <div className="px-2 py-5 sm:px-5">
                    <dd className="gm-display flex items-baseline text-2xl text-platinum sm:text-3xl">
                      <NumberTicker value={50} className="text-platinum" />
                    </dd>
                    <dt className="gm-label mt-2 text-steel">
                      Años de Experiencia
                    </dt>
                  </div>
                </dl>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 04 · ACERCA DEL GRUPO IRAOLA ============ */}
      <section className="relative overflow-hidden bg-paper-0 py-20 text-ink-0 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="04"
            label="Respaldo nacional"
            theme="light"
            title={
              <>
                Acerca del{" "}
                <span className="text-petrol-deep">Grupo Iraola</span>
              </>
            }
          />

          <div className="mt-12 grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="wipe" className="lg:order-1">
              <figure
                data-reveal
                className="group border border-line-light bg-paper-1"
              >
                <div className="relative aspect-[3/2] overflow-hidden border-b border-line-light">
                  <Image
                    src="/images/FOTON/imagen foton 3.webp"
                    alt="Grupo Iraola - Mapa mundial de operaciones"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-4 px-5 py-4">
                  <span className="gm-label text-ink-2">
                    Grupo Iraola: Presencia estratégica en Argentina
                  </span>
                  <span className="gm-plus shrink-0 text-petrol-deep" />
                </figcaption>
              </figure>
            </Reveal>

            <div className="lg:order-2">
              <Reveal stagger={0.1} className="space-y-6">
                <p
                  data-reveal
                  className="text-base leading-relaxed text-ink-1 sm:text-lg"
                >
                  <strong className="font-semibold text-petrol-deep">
                    Grupo Iraola
                  </strong>{" "}
                  está integrado por distintas unidades de negocios enfocadas
                  en el mercado de{" "}
                  <strong className="font-semibold text-ink-0">
                    Autopartes, Motos, Agropecuario, Energético, Bienes Raíces
                  </strong>
                  , y recientemente ha sumado una división automotriz,{" "}
                  <strong className="font-semibold text-ink-0">
                    CVN Motors
                  </strong>
                  .
                </p>

                <p
                  data-reveal
                  className="text-base leading-relaxed text-ink-1 sm:text-lg"
                >
                  Grupo Iraola posee sus centros fabriles estratégicamente
                  ubicados en la ciudad de{" "}
                  <strong className="font-semibold text-petrol-deep">
                    Venado Tuerto, Provincia de Santa Fe
                  </strong>
                  , y además, cuenta con un importante{" "}
                  <strong className="font-semibold text-ink-0">
                    Centro Logístico y Administrativo
                  </strong>{" "}
                  en la localidad de{" "}
                  <strong className="font-semibold text-ink-0">
                    La Reja, Buenos Aires
                  </strong>
                  , en expansión.
                </p>

                <div
                  data-reveal
                  className="border border-line-light bg-paper-1 p-6"
                >
                  <div className="flex items-center gap-5">
                    <span className="flex size-11 shrink-0 items-center justify-center border border-line-light-2 text-petrol-deep">
                      <Users className="size-5" strokeWidth={1.5} />
                    </span>
                    <div>
                      <div className="gm-display flex items-baseline text-3xl text-ink-0">
                        <NumberTicker value={800} className="text-ink-0" />
                        <span className="ml-0.5 text-[0.62em] text-petrol-deep">
                          +
                        </span>
                      </div>
                      <div className="gm-label mt-1 text-ink-2">
                        Empleados Directos
                      </div>
                    </div>
                  </div>
                  <p className="mt-5 border-t border-line-light pt-5 text-base leading-relaxed text-ink-1">
                    El grupo emplea a más de{" "}
                    <strong className="font-semibold text-petrol-deep">
                      800 personas
                    </strong>{" "}
                    en forma directa, consolidándose como un importante actor
                    en la industria nacional.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="gm-grain relative overflow-hidden border-t border-line-dark bg-carbon-0 py-20 text-platinum sm:py-24">
        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <Reveal>
            <div data-reveal className="max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="gm-plus text-petrol-bright" aria-hidden />
                <span className="gm-label text-silver">Asesoramiento</span>
              </div>
              <h2 className="gm-display text-display-2 mt-6 text-platinum">
                ¿Listo para encontrar tu{" "}
                <span className="text-petrol-bright">vehículo ideal?</span>
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl">
                Nuestros expertos están listos para asesorarte y encontrar la
                solución perfecta para tu negocio
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <GmButton href="/contacto" tone="solidLight">
                  Contactar Ahora
                </GmButton>
                <GmButton href="#categorias" tone="outlineDark">
                  Ver Categorías
                </GmButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
