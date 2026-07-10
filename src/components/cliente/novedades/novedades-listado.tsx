"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  Search,
  X,
  Tag,
  Star,
  ChevronLeft,
  ChevronRight,
  Newspaper,
  SlidersHorizontal,
} from "lucide-react";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { Novedad } from "@/types";
import { cn } from "@/lib/utils";
import { NovedadCard } from "./novedad-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const HERO_IMG = "/images/novedades/hero-nuevo-novedades.webp";

export function NovedadesListado() {
  const rootRef = useRef<HTMLDivElement>(null);
  const feedGridRef = useRef<HTMLDivElement>(null);
  const feedScrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const { categorias } = useNovedadOptions();

  const [novedades, setNovedades] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ----- Paginación (verbatim del original) ----- */
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(9);

  /* ----- Filtros (verbatim del original) ----- */
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("");
  const [destacadaFilter, setDestacadaFilter] = useState<string>("");

  const cargarNovedades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const params: any = {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      };

      if (categoriaFilter) {
        params.categoria = categoriaFilter;
      }

      if (destacadaFilter !== "") {
        params.destacada = destacadaFilter;
      }

      let result;
      if (searchQuery.trim()) {
        result = await novedadService.public.search({
          ...params,
          q: searchQuery,
        });
      } else {
        result = await novedadService.public.list(params);
      }

      setNovedades(result.items);
      setTotal(result.total);
      setTotalPages(result.pages);
    } catch (err) {
      console.error("Error cargando novedades:", err);
      setError("Error al cargar las novedades");
    } finally {
      setLoading(false);
    }
  }, [page, limit, categoriaFilter, destacadaFilter, searchQuery]);

  useEffect(() => {
    cargarNovedades();
  }, [cargarNovedades]);

  const handleSearch = () => {
    setPage(1);
    cargarNovedades();
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoriaFilter("");
    setDestacadaFilter("");
    setPage(1);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (categoriaFilter ? 1 : 0) +
    (destacadaFilter ? 1 : 0);

  /* ============ Motion: "cierre de edición" — hero fotográfico ============
     La foto asienta, el filete doble se IMPRIME, el título emerge desde
     debajo del filete y el eyebrow + subtítulo entran en teletipo. Reduced-
     motion: todo queda visible en su estado final (fromTo nunca corre). */
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const bg = root.querySelector<HTMLElement>("[data-hero-bg]");
      const ruleThick = root.querySelector<HTMLElement>("[data-rule-thick]");
      const ruleThin = root.querySelector<HTMLElement>("[data-rule-thin]");
      const titleInner = root.querySelector<HTMLElement>(
        "[data-hero-title-inner]"
      );
      const soft = gsap.utils.toArray<HTMLElement>("[data-hero-soft]", root);

      const tl = gsap.timeline();

      /* 1 — la foto asienta */
      if (bg) {
        tl.fromTo(
          bg,
          { autoAlpha: 0, scale: 1.12 },
          { autoAlpha: 1, scale: 1, duration: 1.6, ease: "power2.out" },
          0
        );
      }
      /* 2 — el filete doble se imprime */
      if (ruleThick) {
        tl.fromTo(
          ruleThick,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
          0.4
        );
      }
      if (ruleThin) {
        tl.fromTo(
          ruleThin,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.9, ease: "power3.inOut" },
          0.52
        );
      }
      /* 3 — el título emerge desde debajo del filete */
      if (titleInner) {
        tl.fromTo(
          titleInner,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: "power4.out" },
          0.67
        );
      }
      /* 4 — teletipo del eyebrow + subtítulo */
      if (soft.length) {
        tl.fromTo(
          soft,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
          },
          0.9
        );
      }
    },
    { scope: rootRef, dependencies: [] }
  );

  /* ============ Motion: entrada de cards del feed (misma mecánica que remolques) ============
     Clip diagonal + scrollTrigger en la grilla, once. Al cambiar de página la
     lista de cards es nueva (dependencies: [novedades, loading]): se mata el
     ScrollTrigger anterior antes de crear el nuevo para no dejar instancias
     apuntando a nodos ya desmontados. */
  useGSAP(
    () => {
      feedScrollTriggerRef.current?.kill();
      feedScrollTriggerRef.current = null;

      const grid = feedGridRef.current;
      if (!grid || loading) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const cards = grid.querySelectorAll<HTMLElement>("[data-row]");
      if (!cards.length) return;

      const tween = gsap.fromTo(
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
      feedScrollTriggerRef.current = tween.scrollTrigger ?? null;

      return () => {
        feedScrollTriggerRef.current?.kill();
        feedScrollTriggerRef.current = null;
      };
    },
    { scope: rootRef, dependencies: [novedades, loading] }
  );

  return (
    <div ref={rootRef} className="min-h-screen bg-paper-0">
      {/* ============ HERO — foto full-bleed, filete doble ============ */}
      <section className="gm-grain relative flex min-h-[calc(78svh-var(--gm-header-h,102px))] flex-col justify-end overflow-hidden bg-carbon-0 text-platinum">
        <div data-hero-bg className="absolute inset-[-5%] will-change-transform">
          <Image
            src={HERO_IMG}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        <div
          aria-hidden
          className="absolute inset-0 z-[2] bg-gradient-to-t from-carbon-0 via-carbon-0/60 to-carbon-0/25"
        />
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 z-[2] w-2/3 bg-gradient-to-r from-carbon-0/85 to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pb-0 pt-24 sm:px-8 lg:px-12">
          <div data-hero-soft className="flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label text-silver">ACTUALIDAD</span>
          </div>

          <h1
            data-hero-title
            className="gm-display text-display-1 mt-5 overflow-hidden"
          >
            <span data-hero-title-inner className="block">
              NOVEDADES
            </span>
          </h1>

          <p
            data-hero-soft
            className="mt-4 max-w-2xl text-base leading-relaxed text-silver sm:text-lg"
          >
            Mantente informado sobre las últimas noticias, lanzamientos y
            actualizaciones
          </p>

          {/* Filete doble — dispositivo distintivo de "La prensa" */}
          <div className="mt-10">
            <span
              data-rule-thick
              aria-hidden
              className="block h-[2px] w-full origin-left bg-platinum"
            />
            <span
              data-rule-thin
              aria-hidden
              className="mt-[3px] block h-px w-full origin-left bg-platinum/60"
            />
          </div>
          <div aria-hidden className="pb-10" />
        </div>
      </section>

      {/* ============ TOOLBAR + FEED ============ */}
      <section className="bg-paper-1 py-14 sm:py-20">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          {/* Barra de herramientas editorial — panel bordeado (regla 14) */}
          <div className="border border-line-light-2 bg-paper-2 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <SlidersHorizontal
                className="size-4 text-petrol-deep"
                strokeWidth={1.5}
              />
              <span className="gm-label text-ink-1">Buscar en la prensa</span>
              <span aria-hidden className="h-px flex-1 bg-line-light-2" />
              {activeFiltersCount > 0 ? (
                <button
                  onClick={handleClearFilters}
                  className="gm-label inline-flex items-center gap-1.5 text-ink-2 transition-colors hover:text-ink-0"
                >
                  <X className="size-3.5" strokeWidth={1.5} />
                  Limpiar
                </button>
              ) : null}
            </div>

            {/* Búsqueda con submit (Enter o botón "Buscar") */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="mt-5 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Search
                  className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-2"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar novedades..."
                  className="w-full border border-line-light-2 bg-paper-0 py-3 pl-11 pr-10 text-sm text-ink-0 placeholder:text-ink-2 transition-colors focus:border-petrol-deep focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Borrar búsqueda"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-2 transition-colors hover:text-ink-0"
                  >
                    <X className="size-4" strokeWidth={1.5} />
                  </button>
                ) : null}
              </div>
              <button
                type="submit"
                className="gm-label bg-petrol-deep px-6 py-3 text-paper-1 transition-colors hover:bg-ink-0"
              >
                Buscar
              </button>
            </form>

            {/* Categoría + Mostrar */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
              <NovedadSelect
                label="Categoría"
                value={categoriaFilter}
                allLabel="Todas las categorías"
                options={categorias}
                onChange={(v) => {
                  setCategoriaFilter(v);
                  setPage(1);
                }}
              />
              <NovedadSelect
                label="Mostrar"
                value={destacadaFilter}
                allLabel="Todas"
                options={[
                  { value: "true", label: "Solo destacadas" },
                  { value: "false", label: "No destacadas" },
                ]}
                onChange={(v) => {
                  setDestacadaFilter(v);
                  setPage(1);
                }}
              />
            </div>

            {/* Filtros activos */}
            {activeFiltersCount > 0 ? (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line-light-2 pt-5">
                <span className="gm-label text-ink-2">Filtros activos:</span>
                {searchQuery ? (
                  <FilterChip
                    icon={<Search className="size-3" strokeWidth={1.5} />}
                    onClear={() => {
                      setSearchQuery("");
                      setPage(1);
                    }}
                  >
                    {searchQuery}
                  </FilterChip>
                ) : null}
                {categoriaFilter ? (
                  <FilterChip
                    icon={<Tag className="size-3" strokeWidth={1.5} />}
                    onClear={() => {
                      setCategoriaFilter("");
                      setPage(1);
                    }}
                  >
                    {categoriaFilter}
                  </FilterChip>
                ) : null}
                {destacadaFilter ? (
                  <FilterChip
                    icon={<Star className="size-3" strokeWidth={1.5} />}
                    onClear={() => {
                      setDestacadaFilter("");
                      setPage(1);
                    }}
                  >
                    {destacadaFilter === "true" ? "Destacadas" : "No destacadas"}
                  </FilterChip>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Resultados info */}
          {!loading && !error && novedades.length > 0 ? (
            <p className="mt-8 text-ink-1">
              Mostrando{" "}
              <span className="font-semibold text-ink-0">
                {novedades.length}
              </span>{" "}
              de <span className="font-semibold text-ink-0">{total}</span>{" "}
              novedades
            </p>
          ) : null}

          {/* ---- Loading: skeleton filas ---- */}
          {loading ? (
            <div className="mt-8">
              <p className="gm-label mb-6 text-ink-2">Cargando novedades...</p>
              <div className="space-y-8">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse border-b border-line-light pb-8"
                  >
                    <div className="h-3 w-1/4 bg-paper-2" />
                    <div className="mt-3 h-7 w-3/4 bg-paper-2" />
                    <div className="mt-3 h-16 w-full bg-paper-2" />
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="mt-8 border border-line-light bg-paper-1 p-12 text-center">
              <Newspaper
                className="mx-auto mb-4 size-16 text-ink-2/50"
                strokeWidth={1}
              />
              <h3 className="gm-display text-display-3 text-ink-0">
                Error al cargar
              </h3>
              <p className="mt-2 text-ink-1">{error}</p>
            </div>
          ) : novedades.length === 0 ? (
            <div className="mt-8 border border-line-light bg-paper-1 p-12 text-center">
              <Newspaper
                className="mx-auto mb-4 size-16 text-ink-2/50"
                strokeWidth={1}
              />
              <h3 className="gm-display text-display-3 text-ink-0">
                No se encontraron novedades
              </h3>
              <p className="mt-2 text-ink-1">
                Intenta ajustar los filtros o realizar otra búsqueda
              </p>
              {activeFiltersCount > 0 ? (
                <button
                  onClick={handleClearFilters}
                  className="gm-label mt-6 inline-flex items-center gap-2 border border-line-light-2 px-6 py-3 text-ink-0 transition-colors hover:bg-ink-0 hover:text-paper-1"
                >
                  <X className="size-4" strokeWidth={1.5} />
                  Limpiar filtros
                </button>
              ) : null}
            </div>
          ) : (
            <div className="mt-10">
              {/* ---- Feed: cards foto-dominantes ---- */}
              <div
                ref={feedGridRef}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {novedades.map((n) => (
                  <NovedadCard key={n._id} novedad={n} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 ? (
                <Paginacion page={page} totalPages={totalPages} onPage={setPage} />
              ) : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ---------------- Subcomponentes ---------------- */

function NovedadSelect({
  label,
  value,
  allLabel,
  options,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: string[] | { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const normalized: { value: string; label: string }[] = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  return (
    <label className="block">
      <span className="gm-label text-ink-2">{label}</span>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none border border-line-light-2 bg-paper-0 px-4 py-3 pr-10 text-sm text-ink-0 transition-colors hover:border-ink-2 focus:border-petrol-deep focus:outline-none"
        >
          <option value="">{allLabel}</option>
          {normalized.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
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

function FilterChip({
  icon,
  onClear,
  children,
}: {
  icon: React.ReactNode;
  onClear: () => void;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-line-light-2 bg-paper-0 px-3 py-1 text-sm text-ink-1">
      {icon}
      {children}
      <button
        onClick={onClear}
        aria-label="Quitar filtro"
        className="text-ink-2 transition-colors hover:text-ink-0"
      >
        <X className="size-3" strokeWidth={1.5} />
      </button>
    </span>
  );
}

function Paginacion({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number | ((p: number) => number)) => void;
}) {
  const pageNumbers = (() => {
    return Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
      if (totalPages <= 5) return i + 1;
      if (page <= 3) return i + 1;
      if (page >= totalPages - 2) return totalPages - 4 + i;
      return page - 2 + i;
    });
  })();

  return (
    <div className="mt-14 flex items-center justify-center gap-2">
      <button
        onClick={() => onPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className={cn(
          "border p-2 transition-colors",
          page === 1
            ? "cursor-not-allowed border-line-light text-ink-2/40"
            : "border-line-light-2 text-ink-1 hover:border-petrol-deep hover:text-petrol-deep"
        )}
      >
        <ChevronLeft className="size-4" strokeWidth={1.5} />
      </button>

      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onPage(n)}
          className={cn(
            "gm-label border px-4 py-2 transition-colors",
            page === n
              ? "border-petrol-deep bg-petrol-dim text-petrol-deep"
              : "border-line-light-2 text-ink-1 hover:border-ink-2 hover:text-ink-0"
          )}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => onPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className={cn(
          "border p-2 transition-colors",
          page === totalPages
            ? "cursor-not-allowed border-line-light text-ink-2/40"
            : "border-line-light-2 text-ink-1 hover:border-petrol-deep hover:text-petrol-deep"
        )}
      >
        <ChevronRight className="size-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}
