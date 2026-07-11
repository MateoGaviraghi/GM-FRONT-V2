"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ChevronLeft, ChevronRight, X, Maximize2, Truck } from "lucide-react";
import type { MediaFile } from "@/types";
import { cn } from "@/lib/utils";

gsap.registerPlugin(Draggable, InertiaPlugin);

type MediaItem = { src: string; type: "image" | "video"; poster?: string };

function buildMedia(images: MediaFile[], videos: MediaFile[]): MediaItem[] {
  return [
    ...images.map((i) => ({ src: i.secure_url, type: "image" as const })),
    ...videos.map((v) => ({
      src: v.secure_url,
      type: "video" as const,
      poster: v.thumbnail || v.thumbnails?.large,
    })),
  ];
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function RemolqueGallery({
  images = [],
  videos = [],
  title,
}: {
  images?: MediaFile[];
  videos?: MediaFile[];
  title: string;
}) {
  const media = buildMedia(images, videos);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  activeRef.current = active;

  const total = media.length;

  const goTo = useCallback(
    (i: number, animate = true) => {
      const idx = clamp(i, 0, total - 1);
      setActive(idx);
      const track = trackRef.current;
      const vp = viewportRef.current;
      if (!track || !vp) return;
      const w = vp.clientWidth;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      gsap.to(track, {
        x: -idx * w,
        duration: animate && !reduce ? 0.6 : 0,
        ease: "power3.inOut",
        overwrite: true,
      });
    },
    [total]
  );

  /* Drag inercial con snap a cada slide */
  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track || total <= 1) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let w = vp.clientWidth;
    gsap.set(track, { x: -activeRef.current * w });

    let drag: Draggable | undefined;
    const syncIndex = () => {
      const x = (gsap.getProperty(track, "x") as number) || 0;
      const idx = clamp(Math.round(-x / w), 0, total - 1);
      if (idx !== activeRef.current) setActive(idx);
    };

    if (!reduce) {
      drag = Draggable.create(track, {
        type: "x",
        inertia: true,
        edgeResistance: 0.85,
        bounds: { minX: -(total - 1) * w, maxX: 0 },
        snap: (value: number) => Math.round(value / w) * w,
        onDrag: syncIndex,
        onThrowUpdate: syncIndex,
        onThrowComplete: syncIndex,
      })[0];
    }

    const onResize = () => {
      w = vp.clientWidth;
      drag?.applyBounds({ minX: -(total - 1) * w, maxX: 0 });
      gsap.set(track, { x: -activeRef.current * w });
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      drag?.kill();
    };
  }, [total]);

  /* Chip cursor "ARRASTRÁ": sigue al mouse dentro del visor (pointer:fine, >1 media) */
  useEffect(() => {
    const vp = viewportRef.current;
    const chip = chipRef.current;
    if (!vp || !chip || total <= 1) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const setX = gsap.quickTo(chip, "x", { duration: 0.4, ease: "power3" });
    const setY = gsap.quickTo(chip, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      const r = vp.getBoundingClientRect();
      setX(e.clientX - r.left + 18);
      setY(e.clientY - r.top + 18);
    };
    const onEnter = () => gsap.to(chip, { autoAlpha: 1, duration: 0.2 });
    const onLeave = () => gsap.to(chip, { autoAlpha: 0, duration: 0.2 });

    vp.addEventListener("mousemove", onMove);
    vp.addEventListener("mouseenter", onEnter);
    vp.addEventListener("mouseleave", onLeave);
    return () => {
      vp.removeEventListener("mousemove", onMove);
      vp.removeEventListener("mouseenter", onEnter);
      vp.removeEventListener("mouseleave", onLeave);
    };
  }, [total]);

  /* Ken Burns sutil en el slide activo (solo imágenes), se resetea al cambiar */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = track.querySelectorAll<HTMLElement>("[data-kb]");
    gsap.killTweensOf(nodes);
    gsap.set(nodes, { scale: 1 });
    if (reduce) return;
    const el = track.querySelector<HTMLElement>(`[data-kb="${active}"]`);
    if (!el || media[active]?.type !== "image") return;
    gsap.fromTo(
      el,
      {
        scale: 1,
        transformOrigin: active % 2 === 0 ? "left center" : "right center",
      },
      { scale: 1.045, duration: 6, ease: "none" }
    );
  }, [active, media]);

  /* Lightbox: teclado + bloqueo de scroll */
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") goTo(activeRef.current + 1);
      if (e.key === "ArrowLeft") goTo(activeRef.current - 1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, goTo]);

  if (total === 0) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center border border-line-dark bg-carbon-2">
        <div className="flex flex-col items-center gap-3 text-steel">
          <Truck className="size-12" strokeWidth={1} />
          <span className="gm-label">Sin imágenes</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Visor principal (drag) */}
      <div className="group relative overflow-hidden border border-line-dark bg-carbon-2">
        <div
          ref={viewportRef}
          className="relative aspect-[16/10] w-full overflow-hidden"
        >
          <div ref={trackRef} className="flex h-full w-full will-change-transform">
            {media.map((m, i) => (
              <div
                key={m.src + i}
                data-kb={i}
                className="relative flex h-full w-full shrink-0 items-center justify-center will-change-transform"
              >
                {m.type === "image" ? (
                  <Image
                    src={m.src}
                    alt={`${title} ${i + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="pointer-events-none object-cover"
                    priority={i === 0}
                  />
                ) : (
                  <video
                    src={m.src}
                    poster={m.poster}
                    controls
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Chip cursor "arrastrá" */}
          {total > 1 ? (
            <div
              ref={chipRef}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0 z-30 gm-label whitespace-nowrap border border-line-dark-2 bg-carbon-0/70 px-3 py-1.5 text-platinum opacity-0 backdrop-blur"
            >
              Arrastrá
            </div>
          ) : null}

          {/* Contador */}
          <div className="pointer-events-none absolute left-4 top-4 z-20">
            <span className="gm-display text-3xl text-platinum drop-shadow">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="gm-label ml-1 text-platinum/60">
              / {String(total).padStart(2, "0")}
            </span>
          </div>

          {/* Ampliar */}
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Ampliar"
            className="absolute right-4 top-4 z-20 flex size-10 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum opacity-100 md:opacity-0 backdrop-blur-sm transition-all hover:bg-platinum hover:text-carbon-0 md:group-hover:opacity-100"
          >
            <Maximize2 className="size-4" strokeWidth={1.5} />
          </button>

          {/* Controles */}
          {total > 1 ? (
            <div className="absolute bottom-4 right-4 z-20 flex">
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Anterior"
                className="flex size-11 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum backdrop-blur-sm transition-colors hover:bg-platinum hover:text-carbon-0"
              >
                <ChevronLeft className="size-5" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Siguiente"
                className="-ml-px flex size-11 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum backdrop-blur-sm transition-colors hover:bg-platinum hover:text-carbon-0"
              >
                <ChevronRight className="size-5" strokeWidth={1.5} />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Miniaturas */}
      {total > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-3">
          {media.slice(0, 10).map((m, i) => (
            <button
              key={m.src + i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Ver ${i + 1}`}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border transition-colors",
                i === active
                  ? "border-petrol-bright"
                  : "border-line-dark hover:border-line-dark-2"
              )}
            >
              <Image
                src={m.type === "video" ? m.poster || m.src : m.src}
                alt=""
                fill
                sizes="120px"
                className={cn(
                  "object-cover transition-opacity",
                  i === active ? "opacity-100" : "opacity-55 hover:opacity-90"
                )}
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Lightbox */}
      {lightbox ? (
        <Lightbox
          media={media}
          index={active}
          title={title}
          onClose={() => setLightbox(false)}
          onNav={(i) => goTo(i)}
        />
      ) : null}
    </div>
  );
}

/* ---------------- Lightbox con zoom/pan ---------------- */
function Lightbox({
  media,
  index,
  title,
  onClose,
  onNav,
}: {
  media: MediaItem[];
  index: number;
  title: string;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const current = media[index];

  useEffect(() => {
    setZoom(1);
    posRef.current = { x: 0, y: 0 };
    if (imgWrapRef.current) gsap.set(imgWrapRef.current, { x: 0, y: 0, scale: 1 });
  }, [index]);

  const applyTransform = (z: number) => {
    if (imgWrapRef.current)
      gsap.to(imgWrapRef.current, {
        scale: z,
        x: z === 1 ? 0 : posRef.current.x,
        y: z === 1 ? 0 : posRef.current.y,
        duration: 0.25,
        ease: "power2.out",
      });
  };

  const onWheel = (e: React.WheelEvent) => {
    if (current.type !== "image") return;
    const next = clamp(zoom + (e.deltaY < 0 ? 0.5 : -0.5), 1, 4);
    if (next === 1) posRef.current = { x: 0, y: 0 };
    setZoom(next);
    applyTransform(next);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom === 1 || current.type !== "image") return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const origin = { ...posRef.current };
    const move = (ev: PointerEvent) => {
      posRef.current = {
        x: origin.x + (ev.clientX - startX),
        y: origin.y + (ev.clientY - startY),
      };
      if (imgWrapRef.current)
        gsap.set(imgWrapRef.current, {
          x: posRef.current.x,
          y: posRef.current.y,
        });
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-carbon-0/95 p-4 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-5 top-5 z-10 flex size-11 items-center justify-center border border-line-dark-2 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
      >
        <X className="size-5" strokeWidth={1.5} />
      </button>

      <div
        className="relative flex h-full max-h-[84vh] w-full max-w-[1200px] items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
      >
        {current.type === "image" ? (
          <div
            ref={imgWrapRef}
            onPointerDown={onPointerDown}
            className={cn(
              "relative h-full w-full",
              zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
            )}
          >
            <Image
              key={index}
              src={current.src}
              alt={`${title} ${index + 1}`}
              fill
              sizes="100vw"
              className="pointer-events-none object-contain"
            />
          </div>
        ) : (
          <video
            key={index}
            src={current.src}
            poster={current.poster}
            controls
            autoPlay
            className="max-h-full max-w-full object-contain"
          />
        )}
      </div>

      {media.length > 1 ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav((index - 1 + media.length) % media.length);
            }}
            aria-label="Anterior"
            className="absolute left-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
          >
            <ChevronLeft className="size-6" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNav((index + 1) % media.length);
            }}
            aria-label="Siguiente"
            className="absolute right-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center border border-line-dark-2 bg-carbon-0/70 text-platinum transition-colors hover:bg-platinum hover:text-carbon-0"
          >
            <ChevronRight className="size-6" strokeWidth={1.5} />
          </button>
        </>
      ) : null}

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2">
        <span className="gm-display text-2xl text-platinum">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="gm-label ml-1 text-platinum/60">
          / {String(media.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
