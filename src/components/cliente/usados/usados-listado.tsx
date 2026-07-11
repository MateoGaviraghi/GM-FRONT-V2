"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { usadosService } from "@/services";
import type { Usados } from "@/types";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { UsadoCard } from "./usado-card";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

const useIsoLayout =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HERO_IMG = "/images/usados/FotonUsado.webp";

export function UsadosListado() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [usados, setUsados] = useState<Usados[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroAnio, setFiltroAnio] = useState("Todos");
  const [filtroCombustible, setFiltroCombustible] = useState("Todos");

  const gridRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<Flip.FlipState | null>(null);
  const enteredRef = useRef(false);

  /* ----- Carga (todo el inventario disponible; el filtrado vive en el cliente) ----- */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usadosService.getPublicUsados({ page: 1, limit: 100 });
      const items = res?.items || [];
      const disponibles = items.filter(
        (u) => (u.estado ?? "Disponible") === "Disponible"
      );
      setUsados(disponibles);
    } catch (err) {
      console.error("Error cargando usados:", err);
      setError(
        "Error al cargar los vehículos usados. Por favor, inténtalo de nuevo."
      );
      setUsados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ----- Coreografía "Segunda vida": estampado del hero + scroll ----- */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      /* Sin animación: nada queda oculto, todo se renderiza en su estado final */
      if (reduce) return;

      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const bg = root.querySelector<HTMLElement>("[data-hero-bg]");
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const line = root.querySelector<HTMLElement>("[data-hero-line]");
      const soft = root.querySelectorAll<HTMLElement>("[data-hero-soft]");
      const statCells = root.querySelectorAll<HTMLElement>("[data-stat]");

      /* El fondo asienta, el título se ESTAMPA con barrido horizontal (sello
         de certificación) y la línea petrol se dibuja bajo el eyebrow. */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (bg) {
        tl.fromTo(
          bg,
          { scale: 1.12 },
          { scale: 1, duration: 2.1, ease: "power2.out" },
          0
        );
      }
      if (line) {
        tl.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, ease: "power3.inOut" },
          0.05
        );
      }
      if (title) {
        tl.fromTo(
          title,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.05,
            ease: "power4.out",
          },
          0.2
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 },
          0.8
        );
      }
      if (statCells.length) {
        tl.fromTo(
          statCells,
          { autoAlpha: 0, clipPath: "inset(0 100% 100% 0)" },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0% 0)",
            duration: 0.65,
            stagger: 0.09,
            ease: "power3.out",
          },
          1.1
        );
      }

      /* Parallax del fondo al scrollear */
      if (hero && bg) {
        gsap.to(bg, {
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

      /* Frase: el título barre desde la izquierda, el párrafo asciende */
      const fraseTitle = root.querySelector<HTMLElement>("[data-frase-title]");
      const fraseP = root.querySelector<HTMLElement>("[data-frase-p]");
      const fraseLine = root.querySelector<HTMLElement>("[data-frase-line]");
      if (fraseTitle) {
        gsap.fromTo(
          fraseTitle,
          { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: fraseTitle, start: "top 80%", once: true },
          }
        );
      }
      if (fraseLine) {
        gsap.fromTo(
          fraseLine,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: fraseLine, start: "top 85%", once: true },
          }
        );
      }
      if (fraseP) {
        gsap.fromTo(
          fraseP,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: fraseP, start: "top 85%", once: true },
          }
        );
      }

      /* Reveals genéricos (barra de filtros, encabezado de la selección) */
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          }
        );
      });
    },
    { scope: rootRef, dependencies: [] }
  );

  /* ----- Opciones de filtro (derivadas del inventario disponible) ----- */
  const tiposUnicos = useMemo(
    () => [...new Set(usados.map((u) => u.tipoVehiculo).filter(Boolean))].sort(),
    [usados]
  ) as string[];
  const marcasUnicas = useMemo(
    () => [...new Set(usados.map((u) => u.marca).filter(Boolean))].sort(),
    [usados]
  ) as string[];
  const aniosUnicos = useMemo(
    () => [...new Set(usados.map((u) => String(u.anio)))].sort().reverse(),
    [usados]
  ) as string[];
  const combustiblesUnicos = useMemo(
    () =>
      [...new Set(usados.map((u) => u.tipoCombustible).filter(Boolean))].sort(),
    [usados]
  ) as string[];

  /* ----- Filtrado (lógica verbatim del listado original) ----- */
  const usadosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return usados.filter((u) => {
      const okBusqueda =
        !busqueda ||
        u.titulo?.toLowerCase().includes(q) ||
        u.marca?.toLowerCase().includes(q) ||
        u.modelo?.toLowerCase().includes(q);
      const okTipo = filtroTipo === "Todos" || u.tipoVehiculo === filtroTipo;
      const okMarca = filtroMarca === "Todas" || u.marca === filtroMarca;
      const okAnio = filtroAnio === "Todos" || String(u.anio) === filtroAnio;
      const okCombustible =
        filtroCombustible === "Todos" ||
        u.tipoCombustible === filtroCombustible;
      return okBusqueda && okTipo && okMarca && okAnio && okCombustible;
    });
  }, [usados, busqueda, filtroTipo, filtroMarca, filtroAnio, filtroCombustible]);

  const hayFiltros =
    !!busqueda ||
    filtroTipo !== "Todos" ||
    filtroMarca !== "Todas" ||
    filtroAnio !== "Todos" ||
    filtroCombustible !== "Todos";

  /* ----- Motion: captura de estado Flip antes de reordenar ----- */
  const captureFlip = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    flipRef.current = Flip.getState(grid.querySelectorAll("[data-card]"));
  }, []);

  const limpiarFiltros = () => {
    captureFlip();
    setBusqueda("");
    setFiltroTipo("Todos");
    setFiltroMarca("Todas");
    setFiltroAnio("Todos");
    setFiltroCombustible("Todos");
  };

  /* Entrada en cortina lateral (al entrar al viewport) + flip-year + Flip al filtrar */
  useIsoLayout(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = grid.querySelectorAll<HTMLElement>("[data-card]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      enteredRef.current = true;
      flipRef.current = null;
      return;
    }

    if (!enteredRef.current && cards.length) {
      enteredRef.current = true;
      flipRef.current = null;

      /* Entrada en cascada diagonal (misma mecánica que remolques): clip
         diagonal + scrollTrigger en la grilla, once. */
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

      const badges = grid.querySelectorAll<HTMLElement>("[data-year-badge]");
      if (badges.length) {
        gsap.fromTo(
          badges,
          { rotationX: -90, autoAlpha: 0, transformPerspective: 400 },
          {
            rotationX: 0,
            autoAlpha: 1,
            duration: 0.6,
            delay: 0.25,
            ease: "power3.out",
            stagger: { each: 0.06, grid: "auto", from: "start" },
            scrollTrigger: { trigger: grid, start: "top 88%", once: true },
            clearProps: "transform,perspective",
          }
        );
      }
      return;
    }

    if (flipRef.current) {
      Flip.from(flipRef.current, {
        duration: 0.55,
        ease: "power3.inOut",
        stagger: 0.02,
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
          ),
        onLeave: (els) =>
          gsap.to(els, {
            opacity: 0,
            scale: 0.85,
            duration: 0.3,
            ease: "power2.in",
          }),
      });
      flipRef.current = null;
    }
  }, [usadosFiltrados]);

  const stats: { value: React.ReactNode; label: string }[] = [
    {
      value: (
        <>
          <NumberTicker value={usados.length} className="text-platinum" />+
        </>
      ),
      label: "Vehículos Disponibles",
    },
    { value: "Usados", label: "0 KM Seleccionados" },
    { value: "2025", label: "Modelos Disponibles" },
    { value: "1-2", label: "Años Garantía" },
  ];

  return (
    <div ref={rootRef} className="min-h-screen bg-carbon-0">
      {/* ============ HERO — foto con scrim + estampado del título ============ */}
      <section
        data-hero
        className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col justify-end overflow-hidden bg-carbon-0 text-platinum"
      >
        <div
          data-hero-bg
          className="absolute inset-[-5%] will-change-transform"
          aria-hidden
        >
          <Image
            src={HERO_IMG}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_95px,rgba(255,255,255,0.05)_95px,rgba(255,255,255,0.05)_96px),repeating-linear-gradient(0deg,transparent_0,transparent_95px,rgba(255,255,255,0.05)_95px,rgba(255,255,255,0.05)_96px)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 z-[2] bg-gradient-to-t from-carbon-0 via-carbon-0/65 to-carbon-0/25"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-[2] w-2/3 bg-gradient-to-r from-carbon-0/90 to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pb-12 pt-28 sm:px-8 lg:px-12">
          <div data-hero-soft className="flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label text-silver">
              Revisados y Certificados
            </span>
          </div>

          <span
            data-hero-line
            aria-hidden
            className="mt-4 block h-px w-24 origin-left bg-petrol-bright"
          />

          {/* Título estampado con barrido horizontal (sello de certificación) */}
          <h1
            data-hero-title
            className="gm-display text-display-1 mt-5 overflow-hidden"
          >
            VEHÍCULOS USADOS
          </h1>

          <p
            data-hero-soft
            className="gm-display text-display-3 mt-3 text-petrol-bright"
          >
            Oportunidades Únicas en Vehículos de Calidad
          </p>
          <p
            data-hero-soft
            className="mt-5 max-w-2xl text-base leading-relaxed text-silver sm:text-lg"
          >
            Revisados, certificados y listos para rodar
          </p>

          {/* Estadísticas rápidas — 2×2, tira mínima sin cajas */}
          <dl className="mt-10 grid max-w-xl grid-cols-2 gap-x-12 gap-y-8">
            {stats.map((s) => (
              <div
                key={s.label}
                data-stat
                className="border-l border-line-dark-2 pl-4"
              >
                <dt className="gm-display text-2xl text-platinum">{s.value}</dt>
                <dd className="gm-label mt-1.5 text-silver">{s.label}</dd>
              </div>
            ))}
          </dl>

          {/* Cue de scroll */}
          <div
            data-hero-soft
            className="mt-10 flex items-center gap-3"
            aria-hidden
          >
            <span className="relative block h-10 w-px overflow-hidden bg-line-dark-2">
              <span className="absolute inset-0 origin-top bg-petrol-bright [animation:gm-scroll-cue_2.2s_cubic-bezier(0.83,0,0.17,1)_infinite]" />
            </span>
            <span className="gm-label text-silver">Explorar la selección</span>
          </div>
        </div>
      </section>

      {/* ============ FRASE ============ */}
      <section className="border-t border-line-light bg-paper-0 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <h2
              data-frase-title
              className="gm-display text-display-2 text-ink-0"
            >
              Vehículos Usados{" "}
              <span className="text-petrol-deep">de Alta Calidad</span>
            </h2>
            <span
              data-frase-line
              aria-hidden
              className="mt-8 block h-px w-full max-w-xl origin-left bg-line-light-2"
            />
            <p
              data-frase-p
              className="mt-8 max-w-3xl text-base leading-relaxed text-ink-1 sm:text-lg"
            >
              Contamos con una amplia variedad de vehículos usados 0 KM
              cuidadosamente seleccionados y revisados. Cada unidad pasa por
              rigurosos controles de calidad para garantizar tu tranquilidad y
              seguridad en cada viaje. Ofrecemos financiación a medida y
              asesoramiento personalizado para que encuentres el vehículo
              perfecto para vos.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SEGUNDA VIDA (filtros + grilla) — skin porcelana ============ */}
      <section className="border-t border-line-light bg-paper-1 py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          {/* Panel de filtros — bordes marcados sobre porcelana + acento petróleo */}
          <div
            data-reveal
            className="border border-line-light-2 bg-paper-2 p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal
                className="size-4 text-petrol-deep"
                strokeWidth={1.5}
              />
              <span className="gm-label text-ink-1">Filtrar usados</span>
              <span aria-hidden className="h-px flex-1 bg-line-light-2" />
              {hayFiltros ? (
                <button
                  onClick={limpiarFiltros}
                  className="gm-label inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink-0"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                  Limpiar
                </button>
              ) : null}
            </div>

            {/* Búsqueda con borde marcado */}
            <div className="relative mt-5">
              <Search
                className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-2"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Buscar vehículos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-line-light-2 bg-paper-0 py-3 pl-11 pr-10 text-[16px] sm:text-sm text-ink-0 placeholder:text-ink-2 transition-colors focus:border-petrol-deep focus:outline-none"
              />
              {busqueda ? (
                <button
                  onClick={() => setBusqueda("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 transition-colors hover:text-ink-0"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              ) : null}
            </div>

            {/* Tipo — pills bordeadas */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="gm-label mr-1 text-ink-2">Tipo</span>
              <FilterPill
                active={filtroTipo === "Todos"}
                onClick={() => {
                  captureFlip();
                  setFiltroTipo("Todos");
                }}
              >
                Todos <span className="opacity-60">[{usados.length}]</span>
              </FilterPill>
              {tiposUnicos.map((tipo) => {
                const n = usados.filter((u) => u.tipoVehiculo === tipo).length;
                return (
                  <FilterPill
                    key={tipo}
                    active={filtroTipo === tipo}
                    onClick={() => {
                      captureFlip();
                      setFiltroTipo(tipo);
                    }}
                  >
                    {tipo} <span className="opacity-60">[{n}]</span>
                  </FilterPill>
                );
              })}
            </div>

            {/* Marca + Año + Combustible — selects bordeados */}
            {marcasUnicas.length > 0 ||
            aniosUnicos.length > 0 ||
            combustiblesUnicos.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:max-w-3xl">
                {marcasUnicas.length > 0 ? (
                  <FilterSelect
                    label="Marca"
                    value={filtroMarca}
                    allLabel="Todas las Marcas"
                    allValue="Todas"
                    options={marcasUnicas}
                    onChange={(v) => {
                      captureFlip();
                      setFiltroMarca(v);
                    }}
                  />
                ) : null}
                {aniosUnicos.length > 0 ? (
                  <FilterSelect
                    label="Año"
                    value={filtroAnio}
                    allLabel="Todos los Años"
                    allValue="Todos"
                    options={aniosUnicos}
                    onChange={(v) => {
                      captureFlip();
                      setFiltroAnio(v);
                    }}
                  />
                ) : null}
                {combustiblesUnicos.length > 0 ? (
                  <FilterSelect
                    label="Combustible"
                    value={filtroCombustible}
                    allLabel="Todos los Combustibles"
                    allValue="Todos"
                    options={combustiblesUnicos}
                    onChange={(v) => {
                      captureFlip();
                      setFiltroCombustible(v);
                    }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Encabezado de la selección */}
          <div data-reveal className="mt-10 flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="gm-label text-petrol-deep">Segunda vida</span>
              <span aria-hidden className="hidden h-px w-16 bg-line-light sm:block" />
            </div>
            {!loading && !error ? (
              <span className="gm-label text-ink-2">
                <NumberTicker
                  value={usadosFiltrados.length}
                  className="text-ink-2"
                />{" "}
                {usadosFiltrados.length === 1 ? "unidad" : "unidades"}
              </span>
            ) : null}
          </div>

          {/* Grilla */}
          <div className="relative mt-6">
            <span
              aria-hidden
              className="gm-plus absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-petrol-deep"
            />
            <span
              aria-hidden
              className="gm-plus absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-petrol-deep"
            />
            <span
              aria-hidden
              className="gm-plus absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-petrol-deep"
            />
            <span
              aria-hidden
              className="gm-plus absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-petrol-deep"
            />
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <article
                    key={i}
                    className="animate-pulse border border-line-light bg-paper-1"
                  >
                    <div className="aspect-[16/10] border-b border-line-light bg-paper-2" />
                    <div className="space-y-3 p-5">
                      <div className="h-3 w-1/3 bg-paper-2" />
                      <div className="h-5 w-3/4 bg-paper-2" />
                      <div className="h-16 w-full bg-paper-2" />
                    </div>
                  </article>
                ))}
              </div>
            ) : error ? (
              <div className="border border-line-light bg-paper-1 p-12 text-center">
                <p className="text-base text-ink-1">{error}</p>
                <button
                  onClick={load}
                  className="gm-label mt-6 border border-line-light-2 px-6 py-3 text-ink-0 transition-colors hover:bg-ink-0 hover:text-paper-1"
                >
                  Reintentar
                </button>
              </div>
            ) : usadosFiltrados.length === 0 ? (
              <EmptyState onClear={limpiarFiltros} />
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              >
                {usadosFiltrados.map((u, i) => (
                  <UsadoCard key={u._id} usado={u} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Subcomponentes ---------------- */

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "gm-label min-h-11 border px-4 py-2 transition-colors",
        active
          ? "border-petrol-deep bg-petrol-dim text-petrol-deep"
          : "border-line-light-2 text-ink-2 hover:border-ink-2 hover:text-ink-0"
      )}
    >
      {children}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  allLabel,
  allValue = "Todas",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  allLabel: string;
  allValue?: string;
}) {
  return (
    <label className="block">
      <span className="gm-label text-ink-2">{label}</span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-line-light-2 bg-paper-0 px-4 py-3 pr-10 text-[16px] sm:text-sm text-ink-0 transition-colors hover:border-ink-2 focus:border-petrol-deep focus:outline-none"
        >
          <option value={allValue}>{allLabel}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-2"
        >
          ▾
        </span>
      </div>
    </label>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border border-line-light bg-paper-0 p-8 text-center sm:p-14">
      <div className="mx-auto max-w-2xl">
        <span className="gm-plus mx-auto text-petrol-deep" aria-hidden />
        <h3 className="gm-display text-display-3 mt-6 text-ink-0">
          ¿No encontraste el vehículo que buscas?
        </h3>
        <p className="mt-3 text-base text-ink-1">
          ¡No te preocupes! Estamos aquí para ayudarte
        </p>

        <div className="mt-8 border border-line-light bg-paper-1 p-6 text-left">
          <p className="text-sm leading-relaxed text-ink-1">
            En <span className="text-ink-0">Guzmán Motors</span> nuestro
            inventario se actualiza constantemente. Contáctanos y te ayudaremos
            a encontrar las mejores opciones disponibles según tus
            necesidades.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {[
              "Asesoramiento personalizado",
              "Sin compromiso",
              "Garantía de calidad",
            ].map((f, i) => (
              <div key={f} className="flex items-center gap-2">
                <span className="gm-label text-petrol-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-ink-1">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/5493424216850?text=Hola! No encontré el vehículo usado que busco en la web. ¿Podrían ayudarme a ver opciones disponibles?"
            target="_blank"
            rel="noopener noreferrer"
            className="gm-label inline-flex items-center justify-center gap-2 bg-petrol-deep px-6 py-3.5 text-paper-1 transition-colors hover:bg-ink-0"
          >
            <FaWhatsapp className="size-4" />
            Contáctanos por WhatsApp
          </a>
          <button
            onClick={onClear}
            className="gm-label inline-flex items-center justify-center gap-2 border border-line-light-2 px-6 py-3.5 text-ink-0 transition-colors hover:bg-ink-0 hover:text-paper-1"
          >
            <X className="size-4" strokeWidth={1.5} />
            Limpiar Filtros
          </button>
        </div>

        <p className="mt-6 text-sm text-ink-2">
          También puedes explorar todas nuestras categorías o modificar tus
          filtros de búsqueda
        </p>
      </div>
    </div>
  );
}
