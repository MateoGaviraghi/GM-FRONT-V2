"use client";

import Image from "next/image";
import Link from "next/link";
import { Truck, ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Remolque } from "@/types";
import { remolqueWhatsAppHref } from "./lib";

export function RemolqueCard({
  remolque,
  index,
}: {
  remolque: Remolque;
  index?: number;
}) {
  const specs = (
    [
      remolque.anio ? { label: "Año", value: String(remolque.anio) } : null,
      remolque.cantidadEjes
        ? { label: "Ejes", value: String(remolque.cantidadEjes) }
        : null,
      remolque.capacidadCarga
        ? { label: "Cap.", value: remolque.capacidadCarga }
        : null,
      remolque.tipoCarroceria
        ? { label: "Tipo", value: remolque.tipoCarroceria }
        : null,
    ].filter(Boolean) as { label: string; value: string }[]
  ).slice(0, 4);

  /* La foto real llena el marco; la silueta sin fondo queda para el folleto */
  const cover =
    remolque.imagenes?.[0]?.secure_url || remolque.fotoSinFondo1?.secure_url;

  return (
    <article
      data-card
      data-flip-id={remolque._id}
      className="group relative flex h-full flex-col border border-line-dark bg-carbon-1 transition-colors duration-300 hover:border-line-dark-2"
    >
      {/* Hairline superior que se enciende al hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-px w-full origin-left scale-x-0 bg-petrol-bright transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      {/* Foto full-bleed con identidad superpuesta */}
      <Link
        href={`/remolques/${remolque._id}`}
        className="relative block aspect-[16/11] overflow-hidden border-b border-line-dark bg-carbon-2"
      >
        {cover ? (
          <Image
            src={cover}
            alt={remolque.titulo}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <Truck className="size-16 text-steel/40" strokeWidth={1} />
          </span>
        )}

        {/* Scrim para la identidad */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-carbon-0/95 via-carbon-0/45 to-transparent"
        />

        {remolque.condicion ? (
          <span className="gm-label absolute left-4 top-4 border border-line-dark-2 bg-carbon-0/60 px-2.5 py-1 text-petrol-bright backdrop-blur-sm">
            {remolque.condicion}
          </span>
        ) : null}

        {typeof index === "number" ? (
          <span
            aria-hidden
            className="gm-display absolute right-4 top-3 text-2xl text-platinum/35 transition-colors duration-500 group-hover:text-petrol-bright/70"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}

        {/* Identidad sobre la foto */}
        <span className="absolute inset-x-0 bottom-0 block p-5">
          <span className="gm-label block text-petrol-bright">
            {remolque.marca || "—"}
          </span>
          <span className="gm-display mt-1.5 block text-xl leading-tight text-platinum">
            {remolque.titulo}
          </span>
        </span>
      </Link>

      {/* Franja técnica compacta */}
      {specs.length ? (
        <dl className="grid grid-cols-4 divide-x divide-line-dark border-b border-line-dark max-sm:grid-cols-2">
          {specs.map((s, i) => (
            <div
              key={s.label}
              className={
                "px-3.5 py-3 " +
                (i >= 2 ? "max-sm:border-t max-sm:border-line-dark" : "")
              }
            >
              <dt className="gm-label text-[0.6rem] text-steel">{s.label}</dt>
              <dd className="mt-1 truncate text-sm text-platinum">{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/* Acciones en línea — sweep que pinta la barra (misma mecánica que GmButton) */}
      <div className="mt-auto grid grid-cols-2 divide-x divide-line-dark">
        <a
          href={remolqueWhatsAppHref(remolque)}
          target="_blank"
          rel="noopener noreferrer"
          className="group/wa relative flex items-center justify-center gap-2 overflow-hidden px-3 py-3.5 text-silver"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[101%] bg-platinum transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wa:translate-x-0"
          />
          <FaWhatsapp className="relative z-10 size-4 text-petrol-bright transition-colors duration-300 group-hover/wa:text-carbon-0" />
          <span className="gm-label relative z-10 transition-colors duration-300 group-hover/wa:text-carbon-0">
            Contáctanos
          </span>
        </a>
        <Link
          href={`/remolques/${remolque._id}`}
          className="group/btn relative flex items-center justify-center gap-2 overflow-hidden px-3 py-3.5 text-platinum"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[101%] bg-platinum transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0"
          />
          <span className="gm-label relative z-10 transition-colors duration-300 group-hover/btn:text-carbon-0">
            Ver más
          </span>
          <ArrowUpRight
            className="relative z-10 size-4 transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-carbon-0"
            strokeWidth={2}
          />
        </Link>
      </div>
    </article>
  );
}
