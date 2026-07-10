"use client";

import Image from "next/image";
import Link from "next/link";
import { Newspaper, ArrowUpRight } from "lucide-react";
import type { Novedad } from "@/types";
import { formatDate } from "@/lib/utils";

export function NovedadCard({
  novedad: n,
  conVT = true,
}: {
  novedad: Novedad;
  conVT?: boolean;
}) {
  const primeraImagen = n.imagenes?.[0];
  const fechaFormateada = formatDate(n.fechaPublicacion);
  const textoVistasVerbatim = `${n.vistas} ${
    n.vistas === 1 ? "vista" : "vistas"
  }`;
  const textoLeerMasVerbatim = "Leer más";

  return (
    <Link
      href={`/novedades/${n._id}`}
      data-row
      className="group relative flex flex-col border border-line-light-2 bg-paper-1 transition-colors duration-300 hover:border-ink-2"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-px w-full origin-left scale-x-0 bg-petrol-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />
      <figure className="relative aspect-[16/10] overflow-hidden border-b border-line-light-2 bg-paper-2">
        {primeraImagen ? (
          <Image
            src={primeraImagen.thumbnails?.large || primeraImagen.secure_url}
            alt={n.titulo}
            fill
            sizes="(max-width: 640px) 92vw, 46vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            style={conVT ? { viewTransitionName: `nota-${n._id}` } : undefined}
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <Newspaper className="size-12 text-ink-2/40" strokeWidth={1} />
          </span>
        )}
        {n.destacada ? (
          <span className="gm-label absolute left-4 top-4 border border-platinum/25 bg-carbon-0/60 px-2.5 py-1 text-platinum backdrop-blur-sm">
            Destacada
          </span>
        ) : null}
      </figure>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="gm-label flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-2">
          <span>{fechaFormateada}</span>
          <span aria-hidden className="h-3 w-px bg-line-light-2" />
          <span>{textoVistasVerbatim}</span>
          {n.categoria ? (
            <span className="border border-line-light-2 px-2 py-0.5">
              {n.categoria}
            </span>
          ) : null}
        </div>
        <h3 className="gm-display mt-3 line-clamp-2 text-xl leading-snug text-ink-0 transition-colors group-hover:text-petrol-deep sm:text-2xl">
          {n.titulo}
        </h3>
        {n.resumen ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-1">
            {n.resumen}
          </p>
        ) : null}
        <span className="gm-label gm-underline mt-4 inline-flex w-fit items-center gap-2 text-petrol-deep">
          {textoLeerMasVerbatim}
          <ArrowUpRight className="size-4" strokeWidth={1.75} />
        </span>
      </div>
    </Link>
  );
}
