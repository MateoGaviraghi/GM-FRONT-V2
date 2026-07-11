"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, Download, Share2, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { remolqueService } from "@/services";
import type { Remolque } from "@/types";
import { GmButton } from "@/components/cliente/home/gm/gm-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { RemolqueShareModal } from "@/components/remolque-share-modal";
import { RemolqueGallery } from "./remolque-gallery";
import { RemolqueCard } from "./remolque-card";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type KV = { label: string; value: string };

function collect(obj: object | undefined, map: [string, string][]): KV[] {
  if (!obj) return [];
  const rec = obj as Record<string, unknown>;
  return map
    .map(([key, label]) => {
      const v = rec[key];
      return v || v === 0 ? { label, value: String(v) } : null;
    })
    .filter(Boolean) as KV[];
}

export function RemolqueDetalle() {
  const params = useParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const [remolque, setRemolque] = useState<Remolque | null>(null);
  const [loading, setLoading] = useState(true);
  const [relacionados, setRelacionados] = useState<Remolque[]>([]);
  const [activeSection, setActiveSection] = useState("general");
  const [shareOpen, setShareOpen] = useState(false);

  /* ----- Carga ----- */
  useEffect(() => {
    const id = params?.id;
    if (!id || Array.isArray(id)) return;
    let alive = true;
    (async () => {
      try {
        const data = await remolqueService.getPublicRemolqueById(id);
        if (alive) setRemolque(data);
      } catch (err) {
        console.error("Error cargando remolque:", err);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [params?.id]);

  /* ----- Relacionados ----- */
  useEffect(() => {
    if (!remolque) return;
    let alive = true;
    (async () => {
      try {
        const res = await remolqueService.getPublicRemolques({ limit: 20 });
        const items: Remolque[] = res?.items || [];
        let rel = items.filter(
          (r) =>
            r._id !== remolque._id &&
            r.tipoCarroceria === remolque.tipoCarroceria
        );
        if (rel.length < 3) {
          const otros = items.filter((r) => r._id !== remolque._id);
          rel = [...rel, ...otros].slice(0, 3);
        } else {
          rel = rel.slice(0, 3);
        }
        if (alive) setRelacionados(rel);
      } catch (err) {
        console.error("Error cargando relacionados:", err);
      }
    })();
    return () => {
      alive = false;
    };
  }, [remolque]);

  /* ----- Secciones (según datos disponibles) ----- */
  const sectionData = useMemo(() => {
    if (!remolque) return null;
    const general: KV[] = [
      remolque.marca && { label: "Marca", value: remolque.marca },
      remolque.modelo && { label: "Modelo", value: remolque.modelo },
      remolque.anio && { label: "Año", value: String(remolque.anio) },
      remolque.condicion && { label: "Condición", value: remolque.condicion },
      remolque.categoria && { label: "Categoría", value: remolque.categoria },
      remolque.tipoCarroceria && {
        label: "Carrocería",
        value: remolque.tipoCarroceria,
      },
      remolque.cantidadEjes && {
        label: "Ejes",
        value: String(remolque.cantidadEjes),
      },
      remolque.capacidadCarga && {
        label: "Capacidad de carga",
        value: remolque.capacidadCarga,
      },
      remolque.tara && { label: "Tara", value: String(remolque.tara) },
      remolque.pbtc && { label: "PBTC", value: remolque.pbtc },
      remolque.kilometraje && {
        label: "Kilometraje",
        value: String(remolque.kilometraje),
      },
      remolque.estado && { label: "Estado", value: remolque.estado },
      remolque.garantia && { label: "Garantía", value: remolque.garantia },
    ].filter(Boolean) as KV[];

    const chasis = collect(remolque.chasis, [
      ["tipo", "Tipo de chasis"],
      ["material", "Material"],
      ["pisoChapaEspesor", "Espesor de piso"],
      ["ejesTubularesDiametro", "Diámetro ejes tubulares"],
      ["paragolpe", "Paragolpe"],
      ["engancheEmergencia", "Enganche de emergencia"],
      ["otros", "Otros"],
    ]);
    const dimensiones = collect(remolque.dimensiones, [
      ["largoInterior", "Largo interior"],
      ["anchoExterior", "Ancho exterior"],
      ["alturaBaranda", "Altura de baranda"],
      ["alturaFrente", "Altura frente"],
      ["alturaContrafrente", "Altura contrafrente"],
      ["alturaPisoAlPiso", "Altura piso a piso"],
    ]);
    const ejes = collect(remolque.ejesSuspension, [
      ["tipoEjes", "Tipo de ejes"],
      ["llantas", "Llantas"],
      ["suspension", "Suspensión"],
      ["frenos", "Frenos"],
    ]);
    const carroceria = collect(remolque.carroceria, [
      ["tipo", "Tipo de carrocería"],
      ["material", "Material"],
      ["pintura", "Pintura"],
      ["tratamiento", "Tratamiento"],
    ]);
    const equipSerie = remolque.equipamientoSerie?.filter(Boolean) || [];
    const equipOpcional = remolque.equipamientoOpcional?.filter(Boolean) || [];

    return {
      general,
      chasis,
      dimensiones,
      ejes,
      carroceria,
      equipSerie,
      equipOpcional,
    };
  }, [remolque]);

  const sections = useMemo(() => {
    if (!sectionData) return [];
    const s: { id: string; label: string }[] = [
      { id: "general", label: "General" },
    ];
    if (sectionData.chasis.length) s.push({ id: "chasis", label: "Chasis" });
    if (sectionData.dimensiones.length)
      s.push({ id: "dimensiones", label: "Dimensiones" });
    if (sectionData.ejes.length)
      s.push({ id: "ejes", label: "Ejes y suspensión" });
    if (sectionData.carroceria.length)
      s.push({ id: "carroceria", label: "Carrocería" });
    if (sectionData.equipSerie.length || sectionData.equipOpcional.length)
      s.push({ id: "equipamiento", label: "Equipamiento" });
    s.push({ id: "contacto", label: "Contacto" });
    return s;
  }, [sectionData]);

  /* ----- Scroll-spy ----- */
  useEffect(() => {
    if (!remolque || sections.length === 0) return;
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
  }, [remolque, sections]);

  /* ----- Coreografía: apertura del hero + parallax + reveals ----- */
  useGSAP(
    () => {
      if (!remolque) return;
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

      /* Entrada: fondo asienta + título se descubre en diagonal (firma del patio) */
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

      /* Hoja datasheet: entrada "impresión" */
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

      /* Cota blueprint: la línea de cota se dibuja al entrar */
      gsap.utils.toArray<HTMLElement>("[data-dim-line]", root).forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.9,
            ease: "power3.inOut",
            transformOrigin: "left center",
            scrollTrigger: { trigger: line, start: "top 88%", once: true },
          }
        );
      });

      /* Equipamiento: stagger de ítems */
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
    { scope: rootRef, dependencies: [remolque] }
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
      <div className="flex min-h-screen items-center justify-center bg-carbon-0">
        <div className="size-12 animate-spin rounded-full border-2 border-line-dark border-t-petrol-bright" />
      </div>
    );
  }
  if (!remolque || !sectionData) {
    notFound();
  }

  const heroImg = remolque.imagenes?.[0]?.secure_url;
  const quick = [
    remolque.anio && { label: "Año", value: String(remolque.anio) },
    remolque.tipoCarroceria && {
      label: "Carrocería",
      value: remolque.tipoCarroceria,
    },
    remolque.capacidadCarga && {
      label: "Capacidad",
      value: remolque.capacidadCarga,
    },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div ref={rootRef} className="min-h-screen bg-carbon-0">
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
            href="/remolques"
            data-hero-soft
            className="group relative inline-flex w-fit items-center gap-2.5 py-3 -my-3 text-silver transition-colors hover:text-platinum"
          >
            <ArrowLeft
              strokeWidth={1.5}
              className="size-4 text-petrol-bright transition-transform group-hover:-translate-x-1"
            />
            <span className="gm-label">Volver a Remolques</span>
          </Link>

          <div className="mt-10">
            <div data-hero-soft className="flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">
                {remolque.categoria || "Remolque"}
              </span>
            </div>
            <h1
              data-hero-title
              className="gm-display text-display-1 mt-5 max-w-[16ch]"
            >
              {remolque.titulo}
            </h1>
            {remolque.descripcion ? (
              <p
                data-hero-soft
                className="mt-5 max-w-2xl text-base leading-relaxed text-silver"
              >
                {remolque.descripcion}
              </p>
            ) : null}

            {/* Quick specs: franja inline */}
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

            <div data-hero-soft className="mt-8">
              <GmButton
                tone="solidLight"
                icon={Download}
                onClick={() =>
                  remolque._id &&
                  remolqueService.descargarFichaTecnica(remolque._id)
                }
              >
                Ficha Técnica
              </GmButton>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TABS STICKY ============ */}
      {sections.length > 1 ? (
        <nav className="sticky top-[var(--gm-header-h-live,68px)] z-30 border-y border-line-dark bg-carbon-0/90 backdrop-blur-md">
          <div className="scrollbar-hide mx-auto flex max-w-[1480px] gap-1 overflow-x-auto px-5 sm:px-8 lg:px-12">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToSection(s.id)}
                className={`gm-label whitespace-nowrap border-b-2 px-4 py-4 transition-colors ${
                  activeSection === s.id
                    ? "border-petrol-bright text-petrol-bright"
                    : "border-transparent text-steel hover:text-silver"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </nav>
      ) : null}

      {/* ============ GENERAL ============ */}
      <section
        id="general"
        className="scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] border-t border-line-dark bg-carbon-0 py-20 sm:py-24"
      >
        <div className="mx-auto grid max-w-[1480px] items-start gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-12">
          <div data-reveal>
            <RemolqueGallery
              images={remolque.imagenes || []}
              videos={remolque.videos || []}
              title={remolque.titulo}
            />
          </div>
          <div data-reveal>
            <SectionEyebrow index="01" label="Información general" />
            <h2 className="gm-display text-display-2 mt-5 text-platinum">
              Detalles del{" "}
              <span className="text-petrol-bright">remolque</span>
            </h2>
            <DatasheetList items={sectionData.general} className="mt-8" />
          </div>
        </div>
      </section>

      {/* ============ CHASIS ============ */}
      {sectionData.chasis.length ? (
        <TechSection
          id="chasis"
          index="02"
          label="Chasis y estructura"
          heading={
            <>
              Estructura <span className="text-petrol-bright">portante</span>
            </>
          }
          dark
        >
          <DatasheetList items={sectionData.chasis} twoCol />
        </TechSection>
      ) : null}

      {/* ============ DIMENSIONES ============ */}
      {sectionData.dimensiones.length ? (
        <TechSection
          id="dimensiones"
          index="03"
          label="Dimensiones"
          heading={
            <>
              Medidas <span className="text-petrol-bright">exactas</span>
            </>
          }
        >
          <DimensionesGrid items={sectionData.dimensiones} />
        </TechSection>
      ) : null}

      {/* ============ EJES ============ */}
      {sectionData.ejes.length ? (
        <TechSection
          id="ejes"
          index="04"
          label="Ejes y suspensión"
          heading={
            <>
              Tren <span className="text-petrol-bright">rodante</span>
            </>
          }
          dark
        >
          <IndexedRows items={sectionData.ejes} />
        </TechSection>
      ) : null}

      {/* ============ CARROCERÍA ============ */}
      {sectionData.carroceria.length ? (
        <TechSection
          id="carroceria"
          index="05"
          label="Carrocería"
          heading={
            <>
              Terminación <span className="text-petrol-bright">de fábrica</span>
            </>
          }
        >
          <DatasheetList items={sectionData.carroceria} twoCol />
        </TechSection>
      ) : null}

      {/* ============ EQUIPAMIENTO ============ */}
      {sectionData.equipSerie.length || sectionData.equipOpcional.length ? (
        <TechSection
          id="equipamiento"
          index="06"
          label="Equipamiento"
          heading={
            <>
              Listo <span className="text-petrol-bright">para trabajar</span>
            </>
          }
          dark
        >
          <div className="grid gap-10 md:grid-cols-2">
            {sectionData.equipSerie.length ? (
              <EquipGroup title="De serie" items={sectionData.equipSerie} />
            ) : null}
            {sectionData.equipOpcional.length ? (
              <EquipGroup title="Opcional" items={sectionData.equipOpcional} />
            ) : null}
          </div>
        </TechSection>
      ) : null}

      {/* ============ CONTACTO ============ */}
      <section
        id="contacto"
        className="scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] border-t border-line-dark bg-carbon-1 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div data-reveal className="mx-auto max-w-4xl text-center">
            <h2 className="gm-display text-display-2 text-platinum">
              ¿Te interesa este remolque?
            </h2>
            <p className="mt-4 text-lg text-silver">
              Contáctanos para más información o para solicitar un presupuesto.
            </p>
          </div>

          <div data-reveal className="mx-auto mt-12 grid max-w-4xl gap-px border border-line-dark bg-line-dark md:grid-cols-3">
            <a
              href={`https://wa.me/5493424216850?text=${encodeURIComponent(
                `Hola! Me interesa consultar sobre el remolque: ${remolque.titulo}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-3 bg-carbon-1 px-6 py-10 text-center transition-colors hover:bg-carbon-2"
            >
              <FaWhatsapp className="size-7 text-petrol-bright" />
              <span className="gm-display text-lg text-platinum">WhatsApp</span>
              <span className="gm-label text-steel">Respuesta rápida</span>
            </a>
            <a
              href={`mailto:info@guzmanmotors.com?subject=${encodeURIComponent(
                `Consulta sobre ${remolque.titulo}`
              )}`}
              className="group flex flex-col items-center gap-3 bg-carbon-1 px-6 py-10 text-center transition-colors hover:bg-carbon-2"
            >
              <MailIcon />
              <span className="gm-display text-lg text-platinum">Email</span>
              <span className="gm-label text-steel">Envíanos un correo</span>
            </a>
            <button
              onClick={() => setShareOpen(true)}
              className="group flex flex-col items-center gap-3 bg-carbon-1 px-6 py-10 text-center transition-colors hover:bg-carbon-2"
            >
              <Share2 className="size-7 text-petrol-bright" strokeWidth={1.5} />
              <span className="gm-display text-lg text-platinum">Compartir</span>
              <span className="gm-label text-steel">En redes sociales</span>
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-steel">
            <MapPin className="size-4 text-petrol-bright" strokeWidth={1.5} />
            <span className="text-sm">Av. Principal 123, Centro, Ciudad</span>
          </div>
        </div>
      </section>

      {/* ============ RELACIONADOS ============ */}
      {relacionados.length ? (
        <section className="border-t border-line-dark bg-carbon-0 py-20 sm:py-24">
          <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              <span className="gm-plus text-petrol-bright" aria-hidden />
              <span className="gm-label text-silver">
                También te puede interesar
              </span>
              <span aria-hidden className="h-px flex-1 bg-line-dark" />
            </div>
            <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((r, i) => (
                <RemolqueCard key={r._id} remolque={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <RemolqueShareModal
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        remolqueName={remolque.titulo}
        remolqueUrl={`/remolques/${remolque._id}`}
        remolqueId={remolque._id}
      />
    </div>
  );
}

/* ---------------- Subcomponentes ---------------- */

function SectionEyebrow({ index, label }: { index: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="gm-label text-petrol-bright">{index}</span>
      <span className="gm-label text-silver">{label}</span>
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
      className={`scroll-mt-[calc(var(--gm-header-h-live,68px)+56px)] border-t border-line-dark py-20 sm:py-24 ${
        dark ? "bg-carbon-1" : "bg-carbon-0"
      }`}
    >
      <div className="mx-auto max-w-[1480px] px-5 sm:px-8 lg:px-12">
        <div data-reveal className="relative max-w-4xl">
          {/* Índice fantasma EN FLUJO: bloque propio, imposible que tape texto */}
          <span
            aria-hidden
            className="gm-display pointer-events-none block select-none text-7xl leading-[0.85] text-platinum/[0.06] sm:text-8xl"
          >
            {index}
          </span>
          <div className="relative mt-4 flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label text-silver">{label}</span>
          </div>
          <h2 className="gm-display text-display-2 mt-5 text-platinum">
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

/* Hoja datasheet — filas dt/dd separadas por hairline */
function DatasheetList({
  items,
  twoCol = false,
  className,
}: {
  items: KV[];
  twoCol?: boolean;
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
          className="flex justify-between gap-6 border-b border-line-dark py-3"
        >
          <dt className="gm-label shrink-0 text-steel">{it.label}</dt>
          <dd className="min-w-0 break-words text-right text-sm text-platinum">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Plano técnico — cada medida como cota blueprint */
function DimensionesGrid({ items }: { items: KV[] }) {
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it) => (
        <CotaBlueprint key={it.label} label={it.label} value={it.value} />
      ))}
    </div>
  );
}

function CotaBlueprint({ label, value }: { label: string; value: string }) {
  const num = Number(value);
  const isNumeric = value.trim() !== "" && !Number.isNaN(num);
  return (
    <div>
      <div className="flex items-baseline gap-2">
        {isNumeric ? (
          <NumberTicker
            value={num}
            className="gm-display text-4xl text-platinum sm:text-5xl"
          />
        ) : (
          <span className="gm-display text-4xl text-platinum sm:text-5xl">
            {value}
          </span>
        )}
        <span className="gm-label text-steel">mm</span>
      </div>
      <div data-dim-line className="relative mt-5 h-px bg-line-dark-2">
        <span
          aria-hidden
          className="absolute left-0 top-1/2 h-[7px] w-px -translate-y-1/2 bg-line-dark-2"
        />
        <span
          aria-hidden
          className="absolute right-0 top-1/2 h-[7px] w-px -translate-y-1/2 bg-line-dark-2"
        />
      </div>
      <p className="gm-label mt-3 text-steel">{label}</p>
    </div>
  );
}

/* Tren rodante — filas indexadas 01…04 */
function IndexedRows({ items }: { items: KV[] }) {
  return (
    <div>
      {items.map((it, i) => (
        <div
          key={it.label}
          className={`flex items-center gap-6 py-4 ${
            i > 0 ? "border-t border-line-dark" : ""
          }`}
        >
          <span className="gm-label w-9 shrink-0 text-petrol-bright">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="gm-label flex-1 shrink-0 text-steel">{it.label}</span>
          <span className="min-w-0 break-words text-right text-sm text-platinum">{it.value}</span>
        </div>
      ))}
    </div>
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

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="size-7 text-petrol-bright"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
