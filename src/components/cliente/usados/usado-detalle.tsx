"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, Download, Mail, MapPin, Share2, Truck } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { usadosService } from "@/services";
import { useFichaTecnicaPDF } from "@/hooks";
import { UsadoShareModal } from "@/components";
import { debugUsadoData, debugPDFRequest } from "@/lib/debug-usado";
import type { Usados } from "@/types";
import { GmButton } from "@/components/cliente/home/gm/gm-button";
import { RemolqueGallery } from "@/components/cliente/remolques/remolque-gallery";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WHATSAPP_NUMBER = "5493424216850";

type KV = { label: string; value: string };

function vehicleTitleOf(u: Usados): string {
  return u.titulo || `${u.marca} ${u.modelo}${u.version ? ` ${u.version}` : ""}`;
}

export function UsadoDetalle() {
  const params = useParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const [usado, setUsado] = useState<Usados | null>(null);
  const [loading, setLoading] = useState(true);
  const [relacionados, setRelacionados] = useState<Usados[]>([]);
  const [activeSection, setActiveSection] = useState("general");
  const [shareOpen, setShareOpen] = useState(false);

  const { downloading: downloadingPDF, openInNewTab } = useFichaTecnicaPDF({
    onSuccess: () => {
      console.log("PDF descargado exitosamente");
    },
    onError: (error) => {
      console.error("Error al descargar PDF:", error);
      alert(
        "Error al descargar la ficha técnica. Por favor, intente nuevamente."
      );
    },
  });

  /* ----- Carga ----- */
  useEffect(() => {
    const id = params?.id;
    if (!id || Array.isArray(id)) return;
    let alive = true;
    (async () => {
      try {
        const data = await usadosService.getPublicUsadosById(id);
        if (alive) setUsado(data);
      } catch (err) {
        console.error("Error cargando vehículo usado:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params?.id]);

  /* ----- Relacionados (misma lógica que el original) ----- */
  useEffect(() => {
    if (!usado) return;
    let alive = true;
    (async () => {
      try {
        const response = await usadosService.getPublicUsados();

        // Primero intenta filtrar por misma marca
        let rel = response.items.filter(
          (u: Usados) => u._id !== usado._id && u.marca === usado.marca
        );

        // Si no hay suficientes, toma cualquier otro usado
        if (rel.length < 3) {
          const idsYaIncluidos = new Set(rel.map((r: Usados) => r._id));
          const otros = response.items.filter(
            (u: Usados) => u._id !== usado._id && !idsYaIncluidos.has(u._id)
          );
          rel = [...rel, ...otros].slice(0, 3);
        } else {
          rel = rel.slice(0, 3);
        }

        if (alive) setRelacionados(rel);
      } catch (err) {
        console.error("Error cargando vehículos usados relacionados:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [usado]);

  /* ----- Ficha técnica en PDF (lógica verbatim del original) ----- */
  const descargarFichaTecnica = () => {
    if (!usado?._id) return;
    debugUsadoData(usado);
    debugPDFRequest(usado._id);
    openInNewTab(usado._id);
  };

  /* ----- Datasheet completo: TODOS los campos poblados ----- */
  const sectionData = useMemo(() => {
    if (!usado) return null;

    const general: KV[] = [
      usado.marca && { label: "Marca", value: usado.marca },
      usado.modelo && { label: "Modelo", value: usado.modelo },
      usado.version && { label: "Versión", value: usado.version },
      (usado.anio || usado.anio === 0) && {
        label: "Año",
        value: String(usado.anio),
      },
      (usado.kilometraje || usado.kilometraje === 0) && {
        label: "Kilometraje",
        value: `${usado.kilometraje.toLocaleString("es-AR")} km`,
      },
      usado.tipoVehiculo && { label: "Tipo de vehículo", value: usado.tipoVehiculo },
      usado.estado && { label: "Estado", value: usado.estado },
      usado.color && { label: "Color", value: usado.color },
      usado.transmision && { label: "Transmisión", value: usado.transmision },
    ].filter(Boolean) as KV[];

    const motor: KV[] = [
      usado.motor && { label: "Motor", value: usado.motor },
      usado.potencia && { label: "Potencia", value: usado.potencia },
      usado.cilindrada && { label: "Cilindrada", value: usado.cilindrada },
      usado.traccion && { label: "Tracción", value: usado.traccion },
      usado.tipoCombustible && {
        label: "Combustible",
        value: usado.tipoCombustible,
      },
    ].filter(Boolean) as KV[];

    const capacidades: KV[] = [
      usado.capacidadCarga && {
        label: "Capacidad de carga",
        value: usado.capacidadCarga,
      },
      (usado.cantidadPuertas || usado.cantidadPuertas === 0) && {
        label: "Puertas",
        value: String(usado.cantidadPuertas),
      },
      (usado.cantidadAsientos || usado.cantidadAsientos === 0) && {
        label: "Asientos",
        value: String(usado.cantidadAsientos),
      },
    ].filter(Boolean) as KV[];

    const equipamiento: KV[] = [
      usado.sistemaFrenado && {
        label: "Sistema de frenado",
        value: usado.sistemaFrenado,
      },
    ].filter(Boolean) as KV[];

    const equipItems = (usado.equipamiento || []).filter(Boolean);

    return { general, motor, capacidades, equipamiento, equipItems };
  }, [usado]);

  const sections = [
    { id: "general", label: "GENERAL" },
    { id: "motor", label: "MOTOR" },
    { id: "capacidades", label: "CAPACIDADES" },
    { id: "equipamiento", label: "EQUIPAMIENTO" },
    { id: "contacto", label: "CONTACTO" },
  ];

  /* ----- Scroll-spy ----- */
  useEffect(() => {
    if (!usado) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usado]);

  /* ----- Coreografía: apertura del hero + reveals (firma "Segunda vida") ----- */
  useGSAP(
    () => {
      if (!usado) return;
      const root = rootRef.current;
      if (!root) return;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const hero = root.querySelector<HTMLElement>("[data-hero]");
      const bg = root.querySelector<HTMLElement>("[data-hero-bg]");
      const title = root.querySelector<HTMLElement>("[data-hero-title]");
      const soft = root.querySelectorAll<HTMLElement>("[data-hero-soft]");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (bg) {
        tl.fromTo(
          bg,
          { autoAlpha: 0, scale: 1.16 },
          { autoAlpha: 1, scale: 1, duration: 1.5, ease: "power2.out" },
          0
        );
      }
      if (title) {
        tl.fromTo(
          title,
          { autoAlpha: 0, clipPath: "inset(0 100% 100% 0)" },
          {
            autoAlpha: 1,
            clipPath: "inset(0 0% 0% 0)",
            duration: 1.1,
            ease: "power4.out",
          },
          0.3
        );
      }
      if (soft.length) {
        tl.fromTo(
          soft,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.85, stagger: 0.1 },
          0.55
        );
      }

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

      gsap.utils.toArray<HTMLElement>("[data-datasheet]", root).forEach((dl) => {
        const rows = dl.querySelectorAll<HTMLElement>("[data-datasheet-row]");
        if (!rows.length) return;
        gsap.fromTo(
          rows,
          { autoAlpha: 0, x: -18 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: dl, start: "top 85%", once: true },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-equip-group]", root).forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-equip-item]");
        if (!items.length) return;
        gsap.fromTo(
          items,
          { autoAlpha: 0, x: -14 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.45,
            stagger: 0.05,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          }
        );
      });
    },
    { scope: rootRef, dependencies: [usado] }
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 150;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper-0">
        <div className="size-12 animate-spin rounded-full border-2 border-line-light border-t-petrol-deep" />
      </div>
    );
  }
  if (!usado || !sectionData) {
    notFound();
  }

  const vehicleTitle = vehicleTitleOf(usado);
  const heroImg = usado.imagenes?.[0]?.secure_url;

  const quick = [
    (usado.anio || usado.anio === 0) && { label: "Año", value: String(usado.anio) },
    (usado.kilometraje || usado.kilometraje === 0) && {
      label: "Kilometraje",
      value: `${usado.kilometraje.toLocaleString("es-AR")} km`,
    },
    usado.tipoCombustible && { label: "Combustible", value: usado.tipoCombustible },
  ].filter(Boolean) as KV[];

  return (
    <div ref={rootRef} className="min-h-screen bg-paper-0">
      {/* ============ HERO ============ */}
      <section
        data-hero
        className="gm-grain relative flex min-h-[calc(88svh-var(--gm-header-h,102px))] flex-col justify-end overflow-hidden bg-carbon-0 text-platinum"
      >
        {heroImg ? (
          <div
            data-hero-bg
            className="absolute inset-[-5%] will-change-transform"
            aria-hidden
          >
            <Image
              src={heroImg}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 z-[2] bg-gradient-to-r from-carbon-0 via-carbon-0/60 to-carbon-0/20"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-[2] h-1/2 bg-gradient-to-t from-carbon-0 to-transparent"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 z-[2] h-32 bg-gradient-to-b from-carbon-0/40 to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pb-14 pt-24 sm:px-8 lg:px-12">
          <Link
            href="/usados"
            data-hero-soft
            className="group relative inline-flex w-fit items-center gap-2.5 py-3 -my-3 text-silver transition-colors hover:text-platinum"
          >
            <ArrowLeft
              strokeWidth={1.5}
              className="size-4 text-petrol-bright transition-transform group-hover:-translate-x-1"
            />
            <span className="gm-label">Volver a Usados</span>
          </Link>

          <div className="mt-10">
            <div data-hero-soft className="flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">
                {usado.tipoVehiculo || "Usado"}
              </span>
            </div>
            <h1
              data-hero-title
              className="gm-display text-display-1 mt-5 max-w-[16ch]"
            >
              {vehicleTitle}
            </h1>
            {usado.descripcion ? (
              <p
                data-hero-soft
                className="mt-5 max-w-2xl text-base leading-relaxed text-silver"
              >
                {usado.descripcion}
              </p>
            ) : null}

            {quick.length ? (
              <dl
                data-hero-soft
                className="mt-8 flex w-fit max-w-2xl flex-wrap divide-x divide-line-dark-2 border-y border-line-dark-2/60 bg-carbon-0/45 backdrop-blur-md [text-shadow:0_1px_14px_rgba(0,0,0,0.6)]"
              >
                {quick.map((q) => (
                  <div key={q.label} className="px-5 py-3">
                    <dt className="gm-label text-silver">{q.label}</dt>
                    <dd className="mt-1.5 text-sm text-platinum">{q.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div data-hero-soft className="mt-8 flex flex-wrap gap-4">
              <GmButton
                tone="solidLight"
                icon={Download}
                onClick={descargarFichaTecnica}
                className={downloadingPDF ? "pointer-events-none opacity-50" : ""}
              >
                Ficha Técnica
              </GmButton>
              <GmButton
                tone="outlineDark"
                icon={Share2}
                onClick={() => setShareOpen(true)}
              >
                Compartir
              </GmButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TABS STICKY ============ */}
      <nav className="sticky top-[var(--gm-header-h-live,68px)] z-30 border-y border-line-light-2 bg-paper-2/95 backdrop-blur-md">
        <div className="scrollbar-hide mx-auto flex max-w-[1480px] gap-1 overflow-x-auto px-5 sm:px-8 lg:px-12">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollToSection(s.id)}
              className={`gm-label whitespace-nowrap border-b-2 px-4 py-4 transition-colors ${
                activeSection === s.id
                  ? "border-petrol-deep text-petrol-deep"
                  : "border-transparent text-ink-1 hover:text-ink-0"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ============ GENERAL ============ */}
      <section
        id="general"
        className="scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] border-t border-line-light bg-paper-0 py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-[1480px] items-start gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12">
          <div data-reveal>
            <RemolqueGallery
              images={usado.imagenes || []}
              videos={usado.videos || []}
              title={vehicleTitle}
            />
          </div>
          <div data-reveal>
            <SectionEyebrow index="01" label="Información general" />
            <h2 className="gm-display text-display-2 mt-5 text-ink-0">
              Detalles del <span className="text-petrol-deep">vehículo</span>
            </h2>
            <DatasheetList items={sectionData.general} className="mt-8" />
          </div>
        </div>
      </section>

      {/* ============ MOTOR ============ */}
      <TechSection
        id="motor"
        index="02"
        label="Motor y rendimiento"
        heading={
          <>
            Motor y <span className="text-petrol-deep">rendimiento</span>
          </>
        }
        dark
      >
        {sectionData.motor.length ? (
          <DatasheetList items={sectionData.motor} twoCol dark />
        ) : (
          <EmptyNote dark />
        )}
      </TechSection>

      {/* ============ CAPACIDADES ============ */}
      <TechSection
        id="capacidades"
        index="03"
        label="Capacidades"
        heading={
          <>
            Hecho para <span className="text-petrol-deep">trabajar</span>
          </>
        }
      >
        {sectionData.capacidades.length ? (
          <DatasheetList items={sectionData.capacidades} twoCol />
        ) : (
          <EmptyNote />
        )}
      </TechSection>

      {/* ============ EQUIPAMIENTO ============ */}
      <TechSection
        id="equipamiento"
        index="04"
        label="Equipamiento"
        heading={
          <>
            Listo para <span className="text-petrol-deep">circular</span>
          </>
        }
        dark
      >
        <div className="grid gap-10 md:grid-cols-2">
          {sectionData.equipamiento.length ? (
            <DatasheetList items={sectionData.equipamiento} dark />
          ) : null}
          {sectionData.equipItems.length ? (
            <EquipGroup title="Equipamiento" items={sectionData.equipItems} />
          ) : null}
          {!sectionData.equipamiento.length && !sectionData.equipItems.length ? (
            <EmptyNote dark />
          ) : null}
        </div>
        {usado.descripcion ? (
          <div data-reveal className="mt-10 border-t border-line-dark pt-8">
            <span className="gm-label text-petrol-bright">
              Descripción adicional
            </span>
            <p className="mt-4 max-w-3xl whitespace-pre-line text-base leading-relaxed text-silver">
              {usado.descripcion}
            </p>
          </div>
        ) : null}
      </TechSection>

      {/* ============ CONTACTO ============ */}
      <section
        id="contacto"
        className="scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] border-t border-line-light bg-paper-1 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div data-reveal className="mx-auto max-w-4xl text-center">
            <h2 className="gm-display text-display-2 text-ink-0">
              ¿Te interesa este vehículo?
            </h2>
            <p className="mt-4 text-lg text-ink-1">
              Contáctanos para más información o para coordinar una visita.
            </p>
          </div>

          <div
            data-reveal
            className="mx-auto mt-12 grid max-w-4xl gap-px border border-line-light-2 bg-line-light-2 md:grid-cols-3"
          >
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hola! Me interesa consultar sobre el vehículo usado: ${vehicleTitle}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 bg-paper-1 px-6 py-10 text-center transition-colors hover:bg-paper-2"
            >
              <FaWhatsapp className="size-7 text-petrol-deep" />
              <span className="gm-display text-lg text-ink-0">WhatsApp</span>
              <span className="gm-label text-ink-2">Respuesta rápida</span>
            </a>
            <a
              href={`mailto:info@guzmanmotors.com?subject=${encodeURIComponent(
                `Consulta sobre ${vehicleTitle}`
              )}`}
              className="group flex flex-col items-center gap-3 bg-paper-1 px-6 py-10 text-center transition-colors hover:bg-paper-2"
            >
              <Mail className="size-7 text-petrol-deep" strokeWidth={1.5} />
              <span className="gm-display text-lg text-ink-0">Email</span>
              <span className="gm-label text-ink-2">Envíanos un correo</span>
            </a>
            <button
              onClick={() => setShareOpen(true)}
              className="group flex flex-col items-center gap-3 bg-paper-1 px-6 py-10 text-center transition-colors hover:bg-paper-2"
            >
              <Share2 className="size-7 text-petrol-deep" strokeWidth={1.5} />
              <span className="gm-display text-lg text-ink-0">Compartir</span>
              <span className="gm-label text-ink-2">En redes sociales</span>
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-ink-2">
            <MapPin className="size-4 text-petrol-deep" strokeWidth={1.5} />
            <span className="text-sm">Av. Principal 123, Centro, Ciudad</span>
          </div>
        </div>
      </section>

      {/* ============ RELACIONADOS ============ */}
      {relacionados.length ? (
        <section className="border-t border-line-light bg-paper-0 py-20 sm:py-24">
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-deep" aria-hidden />
              <span className="gm-label text-ink-2">
                También te puede interesar
              </span>
              <span aria-hidden className="h-px flex-1 bg-line-light" />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((r, i) => (
                <UsadoCard key={r._id} usado={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <UsadoShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        usado={usado}
      />
    </div>
  );
}

/* ---------------- Subcomponentes ---------------- */

function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="gm-label text-petrol-deep">{index}</span>
      <span className="gm-label text-ink-2">{label}</span>
    </div>
  );
}

function TechSection({
  id,
  index,
  label,
  heading,
  dark = false,
  children,
}: {
  id: string;
  index: string;
  label: string;
  heading: React.ReactNode;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] border-t py-20 sm:py-24 ${
        dark
          ? "border-line-dark bg-carbon-0"
          : "border-line-light bg-paper-0"
      }`}
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div data-reveal className="relative max-w-4xl">
          {/* Índice fantasma EN FLUJO: bloque propio, imposible que tape texto */}
          <span
            aria-hidden
            className={`gm-display pointer-events-none block select-none text-7xl leading-[0.85] sm:text-8xl ${
              dark ? "text-platinum/[0.06]" : "text-ink-0/[0.05]"
            }`}
          >
            {index}
          </span>
          <div className="relative mt-4 flex items-center gap-4">
            <span
              className={`gm-plus ${dark ? "text-petrol-bright" : "text-petrol-deep"}`}
              aria-hidden
            />
            <span className={`gm-label ${dark ? "text-silver" : "text-ink-2"}`}>
              {label}
            </span>
          </div>
          <h2
            className={`gm-display text-display-2 mt-5 ${
              dark ? "text-platinum" : "text-ink-0"
            }`}
          >
            {heading}
          </h2>
        </div>
        <div data-reveal className="mt-10">
          {children}
        </div>
      </div>
    </section>
  );
}

function EmptyNote({ dark = false }: { dark?: boolean }) {
  return (
    <p className={`gm-label ${dark ? "text-steel" : "text-ink-2"}`}>
      Sin datos cargados para esta sección.
    </p>
  );
}

/* Hoja datasheet — filas dt/dd separadas por hairline */
function DatasheetList({
  items,
  twoCol = false,
  dark = false,
  className,
}: {
  items: KV[];
  twoCol?: boolean;
  dark?: boolean;
  className?: string;
}) {
  if (!items.length) return null;
  return (
    <dl
      data-datasheet
      className={`grid gap-x-14 ${twoCol ? "lg:grid-cols-2" : ""} ${
        className || ""
      }`}
    >
      {items.map((it) => (
        <div
          key={it.label}
          data-datasheet-row
          className={`flex justify-between gap-6 border-b py-3 ${
            dark ? "border-line-dark" : "border-line-light"
          }`}
        >
          <dt className={`gm-label shrink-0 ${dark ? "text-steel" : "text-ink-2"}`}>
            {it.label}
          </dt>
          <dd
            className={`min-w-0 break-words text-right text-sm ${dark ? "text-platinum" : "text-ink-0"}`}
          >
            {it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* Equipamiento — sin caja, marcador cuadrado */
function EquipGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div data-equip-group className="border-t border-line-dark pt-6">
      <h3 className="gm-label text-petrol-bright">{title}</h3>
      <ul className="mt-4">
        {items.map((it, i) => (
          <li
            key={i}
            data-equip-item
            className="flex items-start gap-3 border-b border-line-dark py-2.5"
          >
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 bg-petrol-bright"
            />
            <span className="text-sm leading-relaxed text-silver">{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* Card de relacionado — la foto real llena el marco; NUNCA la foto sin fondo */
function UsadoCard({ usado, index }: { usado: Usados; index?: number }) {
  const title = vehicleTitleOf(usado);
  const cover = usado.imagenes?.[0]?.secure_url;
  const specs = (
    [
      (usado.anio || usado.anio === 0) && { label: "Año", value: String(usado.anio) },
      usado.tipoVehiculo && { label: "Tipo", value: usado.tipoVehiculo },
      usado.tipoCombustible && { label: "Comb.", value: usado.tipoCombustible },
      (usado.kilometraje || usado.kilometraje === 0) && {
        label: "Km",
        value: usado.kilometraje.toLocaleString("es-AR"),
      },
    ].filter(Boolean) as KV[]
  ).slice(0, 4);

  return (
    <article className="group relative flex h-full flex-col border border-line-light bg-paper-1 transition-colors duration-300 hover:border-line-light-2">
      <span
        aria-hidden
        className="absolute left-0 top-0 z-10 h-px w-full origin-left scale-x-0 bg-petrol-deep transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <Link
        href={`/usados/${usado._id}`}
        className="relative block aspect-[16/11] overflow-hidden border-b border-line-light bg-paper-2"
      >
        {cover ? (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <Truck className="size-16 text-ink-2/40" strokeWidth={1} />
          </span>
        )}

        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-carbon-0/90 via-carbon-0/35 to-transparent"
        />

        {typeof index === "number" ? (
          <span
            aria-hidden
            className="gm-display absolute right-4 top-3 text-2xl text-platinum/50 transition-colors duration-500 group-hover:text-petrol-bright/80"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}

        <span className="absolute inset-x-0 bottom-0 block p-5">
          <span className="gm-label block text-petrol-bright">
            {usado.marca || "—"}
          </span>
          <span className="gm-display mt-1.5 block text-xl leading-tight text-platinum">
            {title}
          </span>
        </span>
      </Link>

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

      <div className="mt-auto grid grid-cols-2 divide-x divide-line-light">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
            `Hola! Me interesa consultar sobre el vehículo usado: ${title}`
          )}`}
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
        </Link>
      </div>
    </article>
  );
}
