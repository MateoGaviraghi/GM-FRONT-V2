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
import { remolqueService } from "@/services";
import type { Remolque, CondicionRemolque } from "@/types";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { RemolqueCard } from "./remolque-card";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

const useIsoLayout =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const HERO_IMG = "/images/remolques/alcortaRemolque.webp";

export function RemolquesListado() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [remolques, setRemolques] = useState<Remolque[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [busqueda, setBusqueda] = useState("");
  const [filtroCondicion, setFiltroCondicion] = useState<
    CondicionRemolque | "Todas"
  >("Todas");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroMarca, setFiltroMarca] = useState("Todas");
  const [filtroAnio, setFiltroAnio] = useState("Todos");

  const gridRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<Flip.FlipState | null>(null);
  const enteredRef = useRef(false);

  /* ----- Carga (todo el inventario; el filtrado vive en el cliente = "el patio") ----- */
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await remolqueService.searchPublicRemolquesAdvanced({
        page: 1,
        limit: 100,
      });
      setRemolques(res?.remolques || []);
    } catch (err) {
      console.error("Error cargando remolques:", err);
      setError("Error al cargar los remolques. Por favor, inténtalo de nuevo.");
      setRemolques([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ----- Coreografía "El patio": apertura del hero + scroll ----- */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const gates = root.querySelectorAll<HTMLElement>("[data-gate]");
      if (reduce) {
        /* Sin animación: los portones no deben tapar nada */
        gsap.set(gates, { display: "none" });
        return;
      }

      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const bg = root.querySelector<HTMLElement>("[data-hero-bg]");
      const chars = root.querySelectorAll<HTMLElement>("[data-hero-char]");
      const soft = root.querySelectorAll<HTMLElement>("[data-hero-soft]");
      const statCells = root.querySelectorAll<HTMLElement>("[data-stat]");

      /* Apertura "El patio": los portones del galpón se deslizan revelando la
         foto, el título se ESTAMPA letra por letra (stencil) y la banda técnica
         se recorta en diagonal. Entrada exclusiva de esta ruta. */
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (bg) {
        tl.fromTo(
          bg,
          { scale: 1.14 },
          { scale: 1, duration: 2.2, ease: "power2.out" },
          0
        );
      }
      if (gates.length === 2) {
        tl.to(
          gates[0],
          { xPercent: -101, duration: 1.05, ease: "power4.inOut" },
          0.2
        )
          .to(
            gates[1],
            { xPercent: 101, duration: 1.05, ease: "power4.inOut" },
            0.2
          )
          .set(gates, { display: "none" });
      }
      if (chars.length) {
        tl.fromTo(
          chars,
          { yPercent: 95, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.05,
            ease: "power4.out",
          },
          0.65
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 },
          1.0
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
          1.15
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

      /* Reveals genéricos (barra de filtros, encabezado del patio) */
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

  /* ----- Opciones de filtro (derivadas del inventario completo) ----- */
  const categoriasUnicas = useMemo(
    () => [...new Set(remolques.map((r) => r.categoria).filter(Boolean))].sort(),
    [remolques]
  ) as string[];
  const marcasUnicas = useMemo(
    () => [...new Set(remolques.map((r) => r.marca).filter(Boolean))].sort(),
    [remolques]
  ) as string[];
  const aniosUnicos = useMemo(
    () =>
      [
        ...new Set(
          remolques.map((r) => (r.anio ? String(r.anio) : null)).filter(Boolean)
        ),
      ]
        .sort()
        .reverse() as string[],
    [remolques]
  );

  /* ----- Filtrado ----- */
  const remolquesFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase();
    return remolques.filter((r) => {
      const okBusqueda =
        !busqueda ||
        r.titulo?.toLowerCase().includes(q) ||
        r.marca?.toLowerCase().includes(q) ||
        r.modelo?.toLowerCase().includes(q) ||
        r.categoria?.toLowerCase().includes(q) ||
        r.descripcion?.toLowerCase().includes(q);
      const okCondicion =
        filtroCondicion === "Todas" || r.condicion === filtroCondicion;
      const okCategoria =
        filtroCategoria === "Todas" || r.categoria === filtroCategoria;
      const okMarca = filtroMarca === "Todas" || r.marca === filtroMarca;
      const okAnio = filtroAnio === "Todos" || String(r.anio) === filtroAnio;
      return okBusqueda && okCondicion && okCategoria && okMarca && okAnio;
    });
  }, [remolques, busqueda, filtroCondicion, filtroCategoria, filtroMarca, filtroAnio]);

  const hayFiltros =
    !!busqueda ||
    filtroCondicion !== "Todas" ||
    filtroCategoria !== "Todas" ||
    filtroMarca !== "Todas" ||
    filtroAnio !== "Todos";

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
    setFiltroCondicion("Todas");
    setFiltroCategoria("Todas");
    setFiltroMarca("Todas");
    setFiltroAnio("Todos");
  };

  /* Entrada en cascada diagonal (al entrar al viewport) + Flip al filtrar */
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
        }
      );
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
  }, [remolquesFiltrados]);

  const stats: { value: React.ReactNode; label: string }[] = [
    {
      value: (
        <>
          <NumberTicker value={remolques.length} className="text-platinum" />+
        </>
      ),
      label: "Remolques disponibles",
    },
    { value: "Nuevos", label: "y Usados" },
    { value: "1-2", label: "Años garantía" },
    { value: "2025", label: "Modelos disponibles" },
  ];

  return (
    <div ref={rootRef} className="min-h-screen bg-carbon-0">
      {/* ============ HERO — apertura del patio ============ */}
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

        {/* Portones del galpón — se deslizan revelando el patio (solo entrada) */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[3] flex">
          <div data-gate className="h-full w-1/2 bg-carbon-0 will-change-transform" />
          <div data-gate className="h-full w-1/2 bg-carbon-0 will-change-transform" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pb-12 pt-28 sm:px-8 lg:px-12">
          <div data-hero-soft className="flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label text-silver">Fabricación Nacional</span>
          </div>

          {/* Título estampado letra por letra (stencil del patio) */}
          <h1
            data-hero-title
            aria-label="Remolques"
            className="gm-display text-display-1 mt-5 overflow-hidden"
          >
            {"Remolques".split("").map((c, i) => (
              <span
                key={i}
                data-hero-char
                aria-hidden
                className="inline-block will-change-transform"
              >
                {c}
              </span>
            ))}
          </h1>

          <p
            data-hero-soft
            className="gm-display text-display-3 mt-3 text-petrol-bright"
          >
            Soluciones Profesionales de Carga
          </p>
          <p
            data-hero-soft
            className="mt-5 max-w-2xl text-base leading-relaxed text-silver sm:text-lg"
          >
            Robustez, durabilidad y diseño adaptado a cada necesidad de
            transporte
          </p>

          {/* Datos del patio — 2×2, tira mínima sin cajas */}
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
            <span className="gm-label text-silver">Explorar el patio</span>
          </div>
        </div>
      </section>

      {/* ============ FRASE ============ */}
      <section className="border-t border-line-dark bg-carbon-1 py-20 sm:py-28">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <h2 data-frase-title className="gm-display text-display-2 text-platinum">
              Soluciones de transporte{" "}
              <span className="text-petrol-bright">de alta calidad</span>
            </h2>
            <span
              data-frase-line
              aria-hidden
              className="mt-8 block h-px w-full max-w-xl origin-left bg-line-dark-2"
            />
            <p
              data-frase-p
              className="mt-8 max-w-3xl text-base leading-relaxed text-silver sm:text-lg"
            >
              Contamos con una amplia variedad de remolques diseñados para
              satisfacer las necesidades más exigentes del transporte de carga.
              Desde acoplados hasta semiremolques, ofrecemos productos fabricados
              con materiales de primera calidad y tecnología de vanguardia,
              garantizando durabilidad, seguridad y rendimiento óptimo en cada
              operación.
            </p>
          </div>
        </div>
      </section>

      {/* ============ EL PATIO (filtros + grilla) ============ */}
      <section className="border-t border-line-dark bg-carbon-0 py-16 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          {/* Panel de filtros — bordes marcados sobre carbón + acento petróleo */}
          <div
            data-reveal
            className="border border-line-dark-2 bg-carbon-1 p-5 sm:p-6"
          >
            <div className="flex items-center gap-3">
              <SlidersHorizontal
                className="size-4 text-petrol-bright"
                strokeWidth={1.5}
              />
              <span className="gm-label text-silver">Filtrar el patio</span>
              <span aria-hidden className="h-px flex-1 bg-line-dark-2" />
              {hayFiltros ? (
                <button
                  onClick={limpiarFiltros}
                  className="gm-label inline-flex items-center gap-1.5 text-steel transition-colors hover:text-platinum"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                  Limpiar
                </button>
              ) : null}
            </div>

            {/* Búsqueda con borde marcado */}
            <div className="relative mt-5">
              <Search
                className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-steel"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Buscar remolques..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full border border-line-dark-2 bg-carbon-0 py-3 pl-11 pr-10 text-[16px] sm:text-sm text-platinum placeholder:text-steel transition-colors focus:border-petrol-bright focus:outline-none"
              />
              {busqueda ? (
                <button
                  onClick={() => setBusqueda("")}
                  aria-label="Borrar búsqueda"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-steel transition-colors hover:text-platinum"
                >
                  <X className="size-4" strokeWidth={1.5} />
                </button>
              ) : null}
            </div>

            {/* Condición — pills bordeadas con contadores */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="gm-label mr-1 text-steel">Condición</span>
              {(["Todas", "0KM", "USADO"] as const).map((c) => {
                const n =
                  c === "Todas"
                    ? remolques.length
                    : remolques.filter((r) => r.condicion === c).length;
                return (
                  <FilterPill
                    key={c}
                    active={filtroCondicion === c}
                    onClick={() => {
                      captureFlip();
                      setFiltroCondicion(c);
                    }}
                  >
                    {c} <span className="opacity-60">[{n}]</span>
                  </FilterPill>
                );
              })}
            </div>

            {/* Categoría — pills bordeadas con contadores */}
            {categoriasUnicas.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="gm-label mr-1 text-steel">Categoría</span>
                <FilterPill
                  active={filtroCategoria === "Todas"}
                  onClick={() => {
                    captureFlip();
                    setFiltroCategoria("Todas");
                  }}
                >
                  Todas <span className="opacity-60">[{remolques.length}]</span>
                </FilterPill>
                {categoriasUnicas.map((cat) => {
                  const n = remolques.filter(
                    (r) => r.categoria === cat
                  ).length;
                  return (
                    <FilterPill
                      key={cat}
                      active={filtroCategoria === cat}
                      onClick={() => {
                        captureFlip();
                        setFiltroCategoria(cat);
                      }}
                    >
                      {cat} <span className="opacity-60">[{n}]</span>
                    </FilterPill>
                  );
                })}
              </div>
            ) : null}

            {/* Marca + Año — selects bordeados */}
            {marcasUnicas.length > 0 || aniosUnicos.length > 0 ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
                {marcasUnicas.length > 0 ? (
                  <FilterSelect
                    label="Marca"
                    value={filtroMarca}
                    allLabel="Todas las marcas"
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
                    allLabel="Todos los años"
                    allValue="Todos"
                    options={aniosUnicos}
                    onChange={(v) => {
                      captureFlip();
                      setFiltroAnio(v);
                    }}
                  />
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Encabezado del patio */}
          <div data-reveal className="mt-10 flex items-baseline justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="gm-label text-petrol-bright">El patio</span>
              <span aria-hidden className="hidden h-px w-16 bg-line-dark sm:block" />
            </div>
            {!loading && !error ? (
              <span className="gm-label text-steel">
                <NumberTicker
                  value={remolquesFiltrados.length}
                  className="text-steel"
                />{" "}
                {remolquesFiltrados.length === 1 ? "unidad" : "unidades"}
              </span>
            ) : null}
          </div>

          {/* Grilla */}
          <div className="relative mt-6">
            <span
              aria-hidden
              className="gm-plus absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-petrol-bright"
            />
            <span
              aria-hidden
              className="gm-plus absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 text-petrol-bright"
            />
            <span
              aria-hidden
              className="gm-plus absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-petrol-bright"
            />
            <span
              aria-hidden
              className="gm-plus absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-petrol-bright"
            />
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:[&>article:nth-child(3n+2)]:translate-y-7">
                {[...Array(6)].map((_, i) => (
                  <article
                    key={i}
                    className="animate-pulse border border-line-dark bg-carbon-1"
                  >
                    <div className="aspect-[4/3] border-b border-line-dark bg-carbon-2" />
                    <div className="space-y-3 p-5">
                      <div className="h-3 w-1/3 bg-carbon-2" />
                      <div className="h-5 w-3/4 bg-carbon-2" />
                      <div className="h-16 w-full bg-carbon-2" />
                    </div>
                  </article>
                ))}
              </div>
            ) : error ? (
              <div className="border border-line-dark bg-carbon-1 p-12 text-center">
                <p className="text-base text-silver">{error}</p>
                <button
                  onClick={load}
                  className="gm-label mt-6 border border-line-dark-2 px-6 py-3 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
                >
                  Reintentar
                </button>
              </div>
            ) : remolquesFiltrados.length === 0 ? (
              <EmptyState onClear={limpiarFiltros} />
            ) : (
              <div
                ref={gridRef}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:[&>article:nth-child(3n+2)]:translate-y-7"
              >
                {remolquesFiltrados.map((r, i) => (
                  <RemolqueCard key={r._id} remolque={r} index={i} />
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
          ? "border-petrol-bright bg-petrol-dim text-petrol-bright"
          : "border-line-dark text-steel hover:border-line-dark-2 hover:text-platinum"
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
      <span className="gm-label text-steel">{label}</span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-line-dark-2 bg-carbon-0 px-4 py-3 pr-10 text-[16px] sm:text-sm text-platinum transition-colors hover:border-line-dark-2 focus:border-petrol-bright focus:outline-none"
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
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel"
        >
          ▾
        </span>
      </div>
    </label>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border border-line-dark bg-carbon-1 p-8 text-center sm:p-14">
      <div className="mx-auto max-w-2xl">
        <span className="gm-plus mx-auto text-petrol-bright" aria-hidden />
        <h3 className="gm-display text-display-3 mt-6 text-platinum">
          ¿No encontraste el remolque que buscas?
        </h3>
        <p className="mt-3 text-base text-silver">
          ¡No te preocupes! Estamos aquí para ayudarte
        </p>

        <div className="mt-8 border border-line-dark bg-carbon-0 p-6 text-left">
          <p className="text-sm leading-relaxed text-silver">
            En <span className="text-platinum">Guzmán Motors</span> nuestro
            inventario se actualiza constantemente. Contáctanos y te ayudaremos a
            encontrar las mejores opciones disponibles según tus necesidades.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {[
              "Asesoramiento personalizado",
              "Sin compromiso",
              "Garantía de calidad",
            ].map((f, i) => (
              <div key={f} className="flex items-center gap-2">
                <span className="gm-label text-petrol-bright">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-silver">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/5493424216850?text=Hola! No encontré el remolque que busco en la web. ¿Podrían ayudarme a ver opciones disponibles?"
            target="_blank"
            rel="noopener noreferrer"
            className="gm-label inline-flex items-center justify-center gap-2 bg-petrol-bright px-6 py-3.5 text-carbon-0 transition-colors hover:bg-platinum"
          >
            <FaWhatsapp className="size-4" />
            Contáctanos por WhatsApp
          </a>
          <button
            onClick={onClear}
            className="gm-label inline-flex items-center justify-center gap-2 border border-line-dark-2 px-6 py-3.5 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
          >
            <X className="size-4" strokeWidth={1.5} />
            Limpiar filtros
          </button>
        </div>

        <p className="mt-6 text-sm text-steel">
          También puedes llamarnos al{" "}
          <span className="text-petrol-bright">+54 9 342 421 6850</span> o
          visitarnos en nuestro local
        </p>
      </div>
    </div>
  );
}
