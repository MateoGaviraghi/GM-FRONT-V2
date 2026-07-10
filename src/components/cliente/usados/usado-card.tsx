"use client";

import Image from "next/image";
import Link from "next/link";
import { CarFront, ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Usados } from "@/types";
import { cn } from "@/lib/utils";
import { usadoWhatsAppHref } from "./lib";

export function UsadoCard({
  usado,
  index,
}: {
  usado: Usados;
  index?: number;
}) {
  const cover = usado.imagenes?.[0]?.secure_url;
  const curtain = usado.imagenes?.[1]?.secure_url;
  const soloUnaFoto = !!cover && !curtain;

  const title =
    usado.titulo ||
    `${usado.marca} ${usado.modelo}${usado.version ? ` ${usado.version}` : ""}`;

  /* Franja técnica: km, combustible, transmisión, versión (el año vive en el badge-flip) */
  const specs = (
    [
      usado.kilometraje != null
        ? { label: "Km", value: String(usado.kilometraje) }
        : null,
      usado.tipoCombustible
        ? { label: "Comb.", value: usado.tipoCombustible }
        : null,
      usado.transmision
        ? { label: "Trans.", value: usado.transmision }
        : null,
      usado.version ? { label: "Versión", value: usado.version } : null,
    ].filter(Boolean) as { label: string; value: string }[]
  ).slice(0, 4);

  return (
    <article
      data-card
      data-flip-id={usado._id}
      className="group relative flex h-full flex-col border border-line-light bg-paper-1 transition-colors duration-300 hover:border-line-light-2"
    >
      {/* Hairline superior que se enciende al hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-px w-full origin-left scale-x-0 bg-petrol-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      {/* Foto full-bleed con identidad superpuesta */}
      <Link
        href={`/usados/${usado._id}`}
        className="relative block aspect-[16/10] overflow-hidden border-b border-line-light bg-paper-2"
      >
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className={cn(
              "object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              soloUnaFoto &&
                "group-hover:scale-[1.06] group-hover:object-[58%_50%]"
            )}
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <CarFront className="size-16 text-ink-2/40" strokeWidth={1} />
          </span>
        )}

        {/* Cortina hover: la 2ª foto de la unidad entra desde la derecha */}
        {curtain ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 [clip-path:inset(0_0_0_100%)] transition-[clip-path] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:[clip-path:inset(0_0_0_0%)]"
          >
            <Image
              src={curtain}
              alt=""
              fill
              sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
              className="object-cover"
            />
          </span>
        ) : null}

        {/* Scrim para la identidad */}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-carbon-0/85 via-carbon-0/40 to-transparent"
        />

        {/* Badge año — flip 3D (rotationX -90 -> 0 al entrar al viewport, orquestado en el listado) */}
        {usado.anio ? (
          <span
            data-year-badge
            className="gm-label absolute left-4 top-4 origin-bottom border border-white/25 bg-carbon-0/55 px-2.5 py-1 text-petrol-bright backdrop-blur-sm"
          >
            {usado.anio}
          </span>
        ) : null}

        {typeof index === "number" ? (
          <span
            aria-hidden
            className="gm-display absolute right-4 top-3 text-2xl text-white/35 transition-colors duration-500 group-hover:text-petrol-bright/70"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}

        {/* Identidad sobre la foto */}
        <span className="absolute inset-x-0 bottom-0 block p-5">
          <span className="gm-label block text-petrol-bright">
            {usado.marca || "—"}
          </span>
          <span className="gm-display mt-1.5 block text-xl leading-tight text-white">
            {title}
          </span>
        </span>
      </Link>

      {/* Franja técnica compacta */}
      {specs.length ? (
        <dl className="grid grid-cols-4 divide-x divide-line-light border-b border-line-light max-sm:grid-cols-2">
          {specs.map((s, i) => (
            <div
              key={s.label}
              className={
                "px-3.5 py-3 " +
                (i >= 2 ? "max-sm:border-t max-sm:border-line-light" : "")
              }
            >
              <dt className="gm-label text-[0.6rem] text-ink-2">{s.label}</dt>
              <dd className="mt-1 truncate text-sm text-ink-0">{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/* Acciones en línea — sweep que pinta la barra (misma mecánica que GmButton) */}
      <div className="mt-auto grid grid-cols-2 divide-x divide-line-light">
        <a
          href={usadoWhatsAppHref(usado)}
          target="_blank"
          rel="noopener noreferrer"
          className="group/wa relative flex items-center justify-center gap-2 overflow-hidden px-3 py-3.5 text-ink-1"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[101%] bg-ink-0 transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/wa:translate-x-0"
          />
          <FaWhatsapp className="relative z-10 size-4 text-petrol-deep transition-colors duration-300 group-hover/wa:text-paper-1" />
          <span className="gm-label relative z-10 transition-colors duration-300 group-hover/wa:text-paper-1">
            Contáctanos
          </span>
        </a>
        <Link
          href={`/usados/${usado._id}`}
          className="group/btn relative flex items-center justify-center gap-2 overflow-hidden px-3 py-3.5 text-ink-0"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-[101%] bg-ink-0 transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0"
          />
          <span className="gm-label relative z-10 transition-colors duration-300 group-hover/btn:text-paper-1">
            Ver más
          </span>
          <ArrowUpRight
            className="relative z-10 size-4 transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-paper-1"
            strokeWidth={2}
          />
        </Link>
      </div>
    </article>
  );
}
