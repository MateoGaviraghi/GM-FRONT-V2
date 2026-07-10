"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  Newspaper,
  Share2,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";
import { cn } from "@/lib/utils";
import { GmButton } from "@/components/cliente/home/gm/gm-button";
import { NovedadCard } from "./novedad-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---------------- Utils ---------------- */

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function updateMetaTag(property: string, content: string) {
  let element = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;
  if (!element) {
    element = document.querySelector(
      `meta[name="${property}"]`
    ) as HTMLMetaElement | null;
  }
  if (!element) {
    element = document.createElement("meta");
    if (property.startsWith("og:") || property.startsWith("article:")) {
      element.setAttribute("property", property);
    } else {
      element.setAttribute("name", property);
    }
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function NovedadDetalle() {
  const params = useParams();
  const novedadId = params.id as string;

  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [relacionadas, setRelacionadas] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  /* ----- Carga (lógica verbatim del original) ----- */
  useEffect(() => {
    if (!novedadId) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await novedadService.public.getById(novedadId);
        if (!alive) return;
        setNovedad(data);

        if (data.categoria) {
          try {
            const relacionadasData = await novedadService.public.getByCategoria(
              data.categoria,
              1,
              3
            );
            if (alive) {
              setRelacionadas(
                relacionadasData.items.filter((n) => n._id !== novedadId)
              );
            }
          } catch (err) {
            console.error("Error cargando relacionadas:", err);
          }
        }
      } catch (err) {
        console.error("Error cargando novedad:", err);
        if (alive) setError("Error al cargar la novedad");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [novedadId]);

  /* ----- Meta tags para compartir en redes sociales (verbatim) ----- */
  useEffect(() => {
    if (!novedad) return;
    const baseUrl = window.location.origin;
    const currentUrl = window.location.href;
    const imageUrl =
      novedad.imagenes?.[0]?.thumbnails?.large || `${baseUrl}/logo.png`;

    document.title = `${novedad.titulo} | Guzman Motors`;

    updateMetaTag("og:title", novedad.titulo);
    updateMetaTag("og:description", novedad.resumen || novedad.titulo);
    updateMetaTag("og:image", imageUrl);
    updateMetaTag("og:url", currentUrl);
    updateMetaTag("og:type", "article");

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", novedad.titulo);
    updateMetaTag("twitter:description", novedad.resumen || novedad.titulo);
    updateMetaTag("twitter:image", imageUrl);

    updateMetaTag("description", novedad.resumen || novedad.titulo);
  }, [novedad]);

  /* ----- Compartir (lógica verbatim del original) ----- */
  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Error copiando enlace:", err);
    }
  };

  const shareToWhatsApp = () => {
    const text = `${novedad?.titulo}\n\n${novedad?.resumen || ""}\n\nVer más: ${
      window.location.href
    }`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareToInstagram = () => {
    alert(
      "Para compartir en Instagram, copia este enlace y pégalo en tu historia o publicación:\n\n" +
        window.location.href
    );
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  /* ----- Lightbox (navega TODO el array de imágenes) ----- */
  const totalImagenes = novedad?.imagenes?.length ?? 0;

  const nextImage = () => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : prev === totalImagenes - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setLightboxIndex((prev) =>
      prev === null ? 0 : prev === 0 ? totalImagenes - 1 : prev - 1
    );
  };

  /* ----- Coreografía "cierre de edición" + reveals (firma "La prensa") ----- */
  useGSAP(
    () => {
      if (!novedad) return;
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const thick = root.querySelector<HTMLElement>("[data-filete-thick]");
      const thin = root.querySelector<HTMLElement>("[data-filete-thin]");
      const titleInner = root.querySelector<HTMLElement>("[data-title-inner]");
      const teletype = root.querySelectorAll<HTMLElement>("[data-teletype]");
      const heroImg = root.querySelector<HTMLElement>("[data-hero-img]");
      const progressBar = root.querySelector<HTMLElement>("[data-progress-bar]");

      const tl = gsap.timeline();

      if (thick) {
        tl.fromTo(
          thick,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.inOut",
            transformOrigin: "left center",
          },
          0
        );
      }
      if (thin) {
        tl.fromTo(
          thin,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.inOut",
            transformOrigin: "left center",
          },
          0.12
        );
      }
      if (titleInner) {
        tl.fromTo(
          titleInner,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            clearProps: "transform",
          },
          0.27
        );
      }
      if (teletype.length) {
        tl.fromTo(
          teletype,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out",
            clearProps: "transform,opacity,visibility",
          },
          0
        );
      }
      if (heroImg) {
        tl.fromTo(
          heroImg,
          { autoAlpha: 0, scale: 1.03 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "transform",
          },
          0.35
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 30 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
          }
        );
      });

      /* Barra de progreso de lectura — scrub sobre el CUERPO del artículo */
      const bodyEl = bodyRef.current;
      if (progressBar && bodyEl) {
        gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" });
        gsap.to(progressBar, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: bodyEl,
            start: "top 20%",
            end: "bottom bottom",
            scrub: true,
          },
        });
      }
    },
    { scope: rootRef, dependencies: [novedad] }
  );

  /* ----- Estados loading/error (verbatim) ----- */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-0">
        <div className="text-center">
          <div className="mx-auto size-12 animate-spin rounded-full border-2 border-line-light-2 border-t-petrol-deep" />
          <p className="gm-label mt-4 text-ink-2">Cargando novedad...</p>
        </div>
      </div>
    );
  }

  if (error || !novedad) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-0 px-4">
        <div className="mx-auto max-w-md border border-line-light-2 bg-paper-1 p-12 text-center">
          <Newspaper className="mx-auto mb-4 size-16 text-ink-2/40" strokeWidth={1} />
          <h2 className="gm-display text-display-3 text-ink-0">
            Novedad no encontrada
          </h2>
          <p className="mt-3 text-ink-1">
            {error || "La novedad no existe o fue eliminada"}
          </p>
          <div className="mt-8 flex justify-center">
            <GmButton tone="solidDark" icon={ArrowLeft} href="/novedades">
              Ver todas las novedades
            </GmButton>
          </div>
        </div>
      </div>
    );
  }

  const heroImg = novedad.imagenes?.[0];
  const galeria = novedad.imagenes
    .map((img, i) => ({ img, i }))
    .slice(1)
    .filter(({ img }) => img.thumbnails?.medium);
  const dropCapEnabled = /^[\p{L}]/u.test((novedad.contenido || "").trimStart());
  const lightboxImg =
    lightboxIndex !== null ? novedad.imagenes[lightboxIndex] : null;

  return (
    <div ref={rootRef} className="min-h-screen bg-paper-0">
      {/* ============ BARRA DE PROGRESO DE LECTURA ============ */}
      <div
        data-progress-bar
        aria-hidden
        className="fixed inset-x-0 z-40 h-[2px] bg-petrol-deep"
        style={{ top: "var(--gm-header-h-live,68px)" }}
      />

      {/* ============ BREADCRUMB + VOLVER ============ */}
      <div className="border-b border-line-light bg-paper-1">
        <div className="mx-auto flex max-w-[880px] flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <nav
            data-teletype
            className="flex flex-wrap items-center gap-2 text-sm"
            aria-label="Breadcrumb"
          >
            <Link
              href="/"
              className="text-ink-2 transition-colors hover:text-petrol-deep"
            >
              Inicio
            </Link>
            <span className="text-ink-2/40">/</span>
            <Link
              href="/novedades"
              className="text-ink-2 transition-colors hover:text-petrol-deep"
            >
              Novedades
            </Link>
            <span className="text-ink-2/40">/</span>
            <span className="max-w-xs truncate font-medium text-ink-0 sm:max-w-md">
              {novedad.titulo}
            </span>
          </nav>

          <div data-teletype>
            <GmButton tone="outlineLight" size="sm" icon={ArrowLeft} href="/novedades">
              Volver
            </GmButton>
          </div>
        </div>
      </div>

      {/* ============ ARTÍCULO ============ */}
      <article className="mx-auto max-w-[880px] px-5 py-14 sm:px-8 sm:py-16">
        {/* Dateline */}
        <div
          data-teletype
          className="gm-label flex flex-wrap items-center gap-x-5 gap-y-3 text-ink-2"
        >
          {novedad.categoria ? (
            <Link
              href={`/novedades?categoria=${encodeURIComponent(novedad.categoria)}`}
              className="inline-flex items-center gap-1.5 border border-line-light-2 bg-paper-2 px-3 py-1 text-ink-1 transition-colors hover:border-petrol-deep hover:text-petrol-deep"
            >
              <Tag className="size-3.5" strokeWidth={1.75} />
              {novedad.categoria}
            </Link>
          ) : null}
          {novedad.destacada ? (
            <span className="inline-flex items-center gap-1.5 bg-petrol-dim px-3 py-1 text-petrol-deep">
              <Sparkles className="size-3.5" strokeWidth={1.75} />
              Destacada
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-3.5" strokeWidth={1.75} />
            {formatDate(novedad.fechaPublicacion)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3.5" strokeWidth={1.75} />
            {novedad.vistas} {novedad.vistas === 1 ? "vista" : "vistas"}
          </span>
        </div>

        {/* Título */}
        <div className="mt-5 overflow-hidden">
          <h1
            data-title-inner
            className="gm-display max-w-[26ch] text-3xl leading-[1.05] text-ink-0 sm:text-4xl lg:text-[2.75rem]"
          >
            {novedad.titulo}
          </h1>
        </div>

        {/* Filete doble — dispositivo distintivo de "La prensa" */}
        <div className="mt-6" aria-hidden>
          <div data-filete-thick className="h-[2px] w-full bg-ink-0" />
          <div data-filete-thin className="mt-[3px] h-px w-full bg-line-light-2" />
        </div>

        {novedad.resumen ? (
          <p data-teletype className="mt-6 max-w-[68ch] text-xl leading-relaxed text-ink-1">
            {novedad.resumen}
          </p>
        ) : null}

        {/* Imagen hero — sin recorte; comparte view-transition-name con la card del listado */}
        {heroImg ? (
          <figure className="mt-10 border border-line-light-2 bg-carbon-0">
            <Image
              src={heroImg.secure_url || heroImg.thumbnails?.large || ""}
              alt={novedad.titulo}
              width={heroImg.width || 1200}
              height={heroImg.height || 800}
              sizes="(max-width: 1024px) 100vw, 900px"
              priority
              className="mx-auto h-auto max-h-[560px] w-auto object-contain"
              style={{ viewTransitionName: `nota-${novedad._id}` }}
            />
          </figure>
        ) : null}

        {/* Compartir — re-vestido GM (verbatim: textos y comportamiento) */}
        <div
          data-teletype
          className="mt-8 grid grid-cols-2 divide-x divide-y divide-line-light border-y border-line-light sm:grid-cols-4 sm:divide-y-0"
        >
          <button
            type="button"
            onClick={copyLinkToClipboard}
            className="flex items-center justify-center gap-2 px-4 py-4 text-ink-0 transition-colors hover:bg-paper-2"
          >
            <Share2 className="size-4 text-petrol-deep" strokeWidth={1.75} />
            <span className="gm-label">{copiedLink ? "¡Copiado!" : "Compartir"}</span>
          </button>
          <button
            type="button"
            onClick={shareToWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-4 text-ink-0 transition-colors hover:bg-paper-2"
          >
            <svg className="size-4 text-petrol-deep" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="gm-label">WhatsApp</span>
          </button>
          <button
            type="button"
            onClick={shareToInstagram}
            className="flex items-center justify-center gap-2 px-4 py-4 text-ink-0 transition-colors hover:bg-paper-2"
          >
            <svg className="size-4 text-petrol-deep" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="gm-label">Instagram</span>
          </button>
          <button
            type="button"
            onClick={shareToFacebook}
            className="flex items-center justify-center gap-2 px-4 py-4 text-ink-0 transition-colors hover:bg-paper-2"
          >
            <svg className="size-4 text-petrol-deep" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="gm-label">Facebook</span>
          </button>
        </div>

        {/* Cuerpo — texto plano, drop cap CSS puro */}
        <div
          ref={bodyRef}
          data-reveal
          className={cn(
            "mt-14 max-w-[68ch] whitespace-pre-wrap text-lg leading-relaxed text-ink-1",
            dropCapEnabled &&
              "first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:font-display first-letter:text-[3.25rem] first-letter:leading-[0.9] first-letter:text-ink-0 first-letter:[font-stretch:125%]"
          )}
        >
          {novedad.contenido}
        </div>

        {/* Galería — resto de imagenes[] */}
        {galeria.length ? (
          <div data-reveal className="mt-16">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-deep" aria-hidden />
              <span className="gm-label text-ink-2">Galería</span>
              <span aria-hidden className="h-px flex-1 bg-line-light" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {galeria.map(({ img, i }) => (
                <figure
                  key={img.public_id}
                  onClick={() => setLightboxIndex(i)}
                  className="relative aspect-[4/3] cursor-pointer border border-line-light-2 bg-paper-2"
                >
                  <Image
                    src={img.thumbnails!.medium}
                    alt={`${novedad.titulo} - Imagen ${i + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </figure>
              ))}
            </div>
          </div>
        ) : null}

        {/* Enlaces relacionados — verbatim */}
        {novedad.links && novedad.links.length > 0 ? (
          <div data-reveal className="mt-16">
            <div className="mb-2 flex items-center gap-3">
              <span className="gm-plus text-petrol-deep" aria-hidden />
              <span className="gm-label text-ink-2">Actualidad</span>
            </div>
            <h2 className="gm-display text-lg text-ink-0 sm:text-xl">
              Enlaces Relacionados
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {novedad.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-start gap-3 overflow-hidden border border-line-light-2 p-5 transition-colors hover:border-petrol-deep"
                >
                  <ExternalLink
                    className="mt-0.5 size-4 shrink-0 text-petrol-deep"
                    strokeWidth={1.75}
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-ink-0 group-hover:text-petrol-deep">
                      {link.titulo}
                    </h3>
                    {link.descripcion ? (
                      <p className="mt-1 truncate text-sm text-ink-2">
                        {link.descripcion}
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-ink-2 transition-transform group-hover:translate-x-1 group-hover:text-petrol-deep" />
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {/* Novedades relacionadas — verbatim */}
        {relacionadas.length > 0 ? (
          <div data-reveal className="mt-20 border-t border-line-light pt-14">
            <div className="mb-2 flex items-center gap-3">
              <span className="gm-plus text-petrol-deep" aria-hidden />
              <span className="gm-label text-ink-2">Actualidad</span>
            </div>
            <h2 className="gm-display text-lg text-ink-0 sm:text-xl">
              Novedades relacionadas
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relacionadas.map((relacionada) => (
                <NovedadCard
                  key={relacionada._id}
                  novedad={relacionada}
                  conVT={false}
                />
              ))}
            </div>
          </div>
        ) : null}
      </article>

      {/* ============ MODAL DE IMAGEN AMPLIADA — GM oscuro ============ */}
      {lightboxIndex !== null && lightboxImg?.thumbnails?.large ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-0/95 p-4 backdrop-blur-md"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative flex h-full w-full max-w-6xl items-center justify-center">
            <Image
              src={lightboxImg.thumbnails.large}
              alt={`${novedad.titulo} - Imagen ${lightboxIndex + 1}`}
              fill
              quality={100}
              unoptimized
              sizes="100vw"
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-4 top-4 border border-line-dark-2 bg-carbon-1 p-3 text-platinum transition-colors hover:bg-carbon-2"
              aria-label="Cerrar"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>

            {totalImagenes > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 border border-line-dark-2 bg-carbon-1 p-3 text-platinum transition-colors hover:bg-carbon-2"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="size-6" strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 border border-line-dark-2 bg-carbon-1 p-3 text-platinum transition-colors hover:bg-carbon-2"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="size-6" strokeWidth={1.75} />
                </button>

                <div className="gm-label absolute bottom-6 left-1/2 -translate-x-1/2 border border-line-dark-2 bg-carbon-1 px-5 py-2.5 text-platinum">
                  {lightboxIndex + 1} / {totalImagenes}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
