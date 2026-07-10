"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ClienteService, type CreateClienteRequest } from "@/services";
import { SectionHeading } from "@/components/cliente/home/gm/section-heading";
import { Reveal } from "@/components/cliente/home/gm/reveal";
import { GmButton } from "@/components/cliente/home/gm/gm-button";
import { MagicCard } from "@/components/ui/magic-card";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ---- Campos sobre placa carbón: caja visible, foco petrol ---- */

const inputCls =
  "h-12 w-full border border-line-dark-2 bg-carbon-2/70 px-4 text-base text-platinum transition-colors duration-300 placeholder:text-steel focus:border-petrol-bright focus:bg-carbon-2 focus:outline-none";
const selectCls = cn(inputCls, "appearance-none cursor-pointer pr-11");

function Field({
  label,
  required,
  htmlFor,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group/field", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-[13px] font-medium text-silver transition-colors duration-300 group-focus-within/field:text-petrol-bright"
      >
        {label}
        {required ? <span className="ml-1 text-petrol-bright">*</span> : null}
      </label>
      {children}
    </div>
  );
}

function GroupTitle({ index, children }: { index: string; children: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="gm-label text-petrol-bright">{index}</span>
      <span className="gm-label text-silver">{children}</span>
      <span aria-hidden className="h-px flex-1 bg-line-dark" />
    </div>
  );
}

/* ---- Tarjetas de canales — spotlight que sigue al cursor ---- */

function ChannelCard({
  href,
  external,
  icon,
  title,
  description,
  children,
}: {
  href?: string;
  external?: boolean;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const inner = (
    <div className="flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <span className="flex size-11 items-center justify-center border border-line-dark-2 bg-carbon-2 text-petrol-bright">
          {icon}
        </span>
        {href ? (
          <ArrowUpRight
            aria-hidden
            strokeWidth={1.5}
            className="size-4 text-petrol-bright opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
          />
        ) : null}
      </div>
      <h3 className="gm-display mt-5 text-lg text-platinum">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-silver">{description}</p>
      <div className="mt-auto pt-5">{children}</div>
    </div>
  );

  return (
    <MagicCard
      gradientSize={190}
      gradientColor="rgba(56, 132, 160, 0.22)"
      gradientFrom="var(--gm-petrol-bright)"
      gradientTo="var(--gm-petrol-deep)"
      className="h-full"
    >
      {href ? (
        external ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            {inner}
          </a>
        ) : (
          <a href={href} className="block h-full">
            {inner}
          </a>
        )
      ) : (
        inner
      )}
    </MagicCard>
  );
}

export default function ContactoPage() {
  const heroRef = useRef<HTMLElement>(null);

  const [formData, setFormData] = useState({
    // Información personal
    nombreCompleto: "",
    correoElectronico: "",
    telefonoCelular: "",
    telefonoFijo: "",

    // Ubicación
    provincia: "",
    localidad: "",
    direccion: "",
    fechaNacimiento: "",

    // Información vehicular
    tipoVehiculo: "",
    marca: "",
    modelo: "",
    anioCompra: "",

    // Información de negocio
    tipoCliente: "",

    // Observaciones
    observaciones: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError("");

    /* Solo enviamos los campos completados */
    const payload: CreateClienteRequest = {};
    if (formData.nombreCompleto) payload.nombreCompleto = formData.nombreCompleto;
    if (formData.correoElectronico)
      payload.correoElectronico = formData.correoElectronico;
    if (formData.telefonoCelular)
      payload.telefonoCelular = formData.telefonoCelular;
    if (formData.telefonoFijo) payload.telefonoFijo = formData.telefonoFijo;
    if (formData.provincia) payload.provincia = formData.provincia;
    if (formData.localidad) payload.localidad = formData.localidad;
    if (formData.direccion) payload.direccion = formData.direccion;
    if (formData.fechaNacimiento)
      payload.fechaNacimiento = formData.fechaNacimiento;
    if (formData.tipoVehiculo) payload.tipoVehiculo = formData.tipoVehiculo;
    if (formData.marca) payload.marca = formData.marca;
    if (formData.modelo) payload.modelo = formData.modelo;
    if (formData.anioCompra) payload.anioCompra = Number(formData.anioCompra);
    if (formData.tipoCliente) payload.tipoCliente = formData.tipoCliente;
    if (formData.observaciones) payload.observaciones = formData.observaciones;

    try {
      await ClienteService.create(payload);
      setSubmitStatus("success");
      setFormData({
        nombreCompleto: "",
        correoElectronico: "",
        telefonoCelular: "",
        telefonoFijo: "",
        provincia: "",
        localidad: "",
        direccion: "",
        fechaNacimiento: "",
        tipoVehiculo: "",
        marca: "",
        modelo: "",
        anioCompra: "",
        tipoCliente: "",
        observaciones: "",
      });
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      console.error("Error registrando cliente:", error);
      setSubmitStatus("error");
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos procesar tu registro. Intentá nuevamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero) return;

      const aperture = hero.querySelector<HTMLElement>("[data-hero-aperture]");
      const img = hero.querySelector<HTMLElement>("[data-hero-img]");
      const title = hero.querySelector<HTMLElement>("[data-hero-title]");
      const soft = hero.querySelectorAll<HTMLElement>("[data-hero-soft]");
      const signal = hero.querySelector<HTMLElement>("[data-signal]");
      const rings = signal
        ? gsap.utils.toArray<HTMLElement>("[data-ring]", signal)
        : [];

      /* Reduced motion: abrir el iris de una y salir (señal decorativa off) */
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (aperture) gsap.set(aperture, { clipPath: "none" });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* Apertura de iris: la señal se abre desde el punto de Santa Fe */
      if (aperture) {
        tl.fromTo(
          aperture,
          { clipPath: "circle(0% at 70% 45%)" },
          {
            clipPath: "circle(150% at 70% 45%)",
            duration: 1.3,
            ease: "power4.inOut",
          },
          0
        );
      }

      /* Título: aparece dentro del iris (escala + desenfoque) */
      if (title) {
        tl.fromTo(
          title,
          { scale: 1.06, autoAlpha: 0, filter: "blur(6px)" },
          {
            scale: 1,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            transformOrigin: "left center",
          },
          0.5
        );
      }

      if (soft.length) {
        tl.fromTo(
          soft,
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.85, stagger: 0.1 },
          0.7
        );
      }

      /* Señal: la onda radial empieza a emanar desde Santa Fe */
      if (signal) {
        tl.fromTo(signal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, 1);
        rings.forEach((r, i) =>
          gsap.fromTo(
            r,
            { scale: 0.5, opacity: 0.4 },
            {
              scale: 2.3,
              opacity: 0,
              duration: 4.2,
              ease: "sine.out",
              repeat: -1,
              delay: 1.2 + i * 1.4,
            }
          )
        );
      }

      /* Parallax suave */
      if (img) {
        gsap.to(img, {
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
    },
    { dependencies: [] }
  );

  return (
    <div className="min-h-screen bg-carbon-0">
      {/* ============ HERO — fachada real, acción directa ============ */}
      <section
        ref={heroRef}
        className="gm-grain relative flex min-h-[calc(100svh-var(--gm-header-h,102px))] flex-col overflow-hidden bg-carbon-0 text-platinum"
      >
        {/* Backdrop con apertura de iris (clip-path circular) */}
        <div
          data-hero-aperture
          aria-hidden
          className="absolute inset-0"
          style={{ clipPath: "circle(0% at 70% 45%)" }}
        >
          <div
            data-hero-img
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src="/images/contacto/equipo guzman motros 2.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          {/* Scrim lateral: texto legible a la izquierda, foto a la derecha */}
          <div className="absolute inset-0 bg-gradient-to-r from-carbon-0 via-carbon-0/55 to-carbon-0/10" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-carbon-0 to-transparent" />
        </div>

        {/* Señal: onda radial que emana desde el punto de Santa Fe */}
        <div
          data-signal
          aria-hidden
          className="pointer-events-none absolute z-[3] hidden opacity-0 sm:block"
          style={{ left: "70%", top: "45%" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              data-ring
              className="absolute left-0 top-0 size-28 -translate-x-1/2 -translate-y-1/2 border border-petrol-bright/40"
            />
          ))}
          <span className="gm-plus absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-petrol-bright" />
          <span className="gm-label absolute left-4 top-0 -translate-y-1/2 whitespace-nowrap text-petrol-bright">
            Santa Fe
          </span>
        </div>

        {/* Marca técnica vertical */}
        <div
          aria-hidden
          className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 items-center gap-5 [writing-mode:vertical-rl] xl:flex"
        >
          <span className="h-16 w-px bg-line-dark" />
          <span className="gm-label whitespace-nowrap text-steel">
            Blas Parera 6422
          </span>
          <span className="h-16 w-px bg-line-dark" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-[1480px] flex-1 flex-col justify-center px-5 py-16 sm:px-8 lg:px-12">
          <div data-hero-soft className="mb-8 flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <span className="gm-label text-silver">Estamos para ayudarte</span>
          </div>

          <h1
            data-hero-title
            className="gm-display text-[clamp(2.4rem,9.5vw,7rem)] leading-[0.97] tracking-[-0.015em] will-change-[transform,filter]"
          >
            Contactanos
          </h1>

          <p
            data-hero-soft
            className="mt-7 max-w-2xl text-lg leading-relaxed text-silver sm:text-xl"
          >
            Ponete en contacto con nosotros. Estamos listos para asesorarte en
            tu próxima compra.
          </p>

          <div
            data-hero-soft
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <GmButton
              href="tel:+5493424216850"
              external
              tone="solidLight"
              icon={Phone}
            >
              Llamar Ahora
            </GmButton>
            <GmButton
              href="https://wa.me/5493424216850"
              external
              tone="outlineDark"
              icon={FaWhatsapp}
            >
              WhatsApp
            </GmButton>
          </div>
        </div>
      </section>

      {/* ============ REGISTRO + OTRAS FORMAS DE CONTACTO ============ */}
      <section className="relative overflow-hidden bg-paper-0 py-20 text-ink-0 sm:py-24 lg:py-28">
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <SectionHeading
            index="01"
            label="Registro de clientes"
            theme="light"
            title={
              <>
                Regístrate como{" "}
                <span className="text-petrol-deep">Cliente</span>
              </>
            }
            sub="Completa tus datos para registrarte en nuestro sistema y recibir atención personalizada"
          />

          <div className="mt-14 grid gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            {/* ---- Formulario — placa carbón con borde de brillo ---- */}
            <Reveal stagger={0.08}>
              <div className="gm-grain relative bg-carbon-0 text-platinum">
                <ShineBorder
                  borderWidth={1}
                  duration={11}
                  shineColor={[
                    "var(--gm-petrol-bright)",
                    "rgba(255,255,255,0.85)",
                    "var(--gm-petrol-deep)",
                  ]}
                  className="z-30"
                />
                <form
                  onSubmit={handleSubmit}
                  className="relative z-10 p-6 sm:p-9"
                >
                  {/* Estados de envío */}
                  <div aria-live="polite">
                    {submitStatus === "success" && (
                      <div className="mb-9 flex items-start gap-3 border border-petrol-bright/50 bg-petrol-dim px-5 py-4">
                        <CheckCircle
                          className="mt-0.5 size-5 shrink-0 text-petrol-bright"
                          strokeWidth={1.75}
                        />
                        <p className="text-sm leading-relaxed text-platinum">
                          ¡Registro exitoso! Te contactaremos pronto para
                          continuar con el proceso.
                        </p>
                      </div>
                    )}
                    {submitStatus === "error" && (
                      <div className="mb-9 flex items-start gap-3 border border-red-400/40 bg-red-500/10 px-5 py-4">
                        <AlertTriangle
                          className="mt-0.5 size-5 shrink-0 text-red-400"
                          strokeWidth={1.75}
                        />
                        <p className="text-sm leading-relaxed text-platinum">
                          {submitError}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 01.1 Datos personales */}
                  <div data-reveal>
                    <GroupTitle index="01.1">Datos personales</GroupTitle>
                    <div className="mt-7 grid gap-x-6 gap-y-6 md:grid-cols-2">
                      <Field
                        label="Nombre completo"
                        required
                        htmlFor="nombreCompleto"
                        className="md:col-span-2"
                      >
                        <input
                          id="nombreCompleto"
                          type="text"
                          name="nombreCompleto"
                          value={formData.nombreCompleto}
                          onChange={handleChange}
                          required
                          className={inputCls}
                          placeholder="Tu nombre y apellido"
                        />
                      </Field>
                      <Field
                        label="Email"
                        required
                        htmlFor="correoElectronico"
                      >
                        <input
                          id="correoElectronico"
                          type="email"
                          name="correoElectronico"
                          value={formData.correoElectronico}
                          onChange={handleChange}
                          required
                          className={inputCls}
                          placeholder="tu@email.com"
                        />
                      </Field>
                      <Field label="Teléfono" htmlFor="telefonoCelular">
                        <input
                          id="telefonoCelular"
                          type="tel"
                          name="telefonoCelular"
                          value={formData.telefonoCelular}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder="+54 9 342 123 4567"
                        />
                      </Field>
                    </div>
                  </div>

                  {/* 01.2 Ubicación */}
                  <div data-reveal className="mt-11">
                    <GroupTitle index="01.2">Ubicación</GroupTitle>
                    <div className="mt-7 grid gap-x-6 gap-y-6 md:grid-cols-2">
                      <Field label="Provincia" htmlFor="provincia">
                        <input
                          id="provincia"
                          type="text"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder="Ej: Buenos Aires"
                        />
                      </Field>
                      <Field label="Localidad" htmlFor="localidad">
                        <input
                          id="localidad"
                          type="text"
                          name="localidad"
                          value={formData.localidad}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder="Ej: CABA"
                        />
                      </Field>
                    </div>
                  </div>

                  {/* 01.3 Vehículo */}
                  <div data-reveal className="mt-11">
                    <GroupTitle index="01.3">
                      Información del Vehículo (Opcional)
                    </GroupTitle>
                    <div className="mt-7 grid gap-x-6 gap-y-6 md:grid-cols-2">
                      <Field label="Marca del vehículo" htmlFor="marca">
                        <input
                          id="marca"
                          type="text"
                          name="marca"
                          value={formData.marca}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder="Ej: Ford, Chevrolet"
                        />
                      </Field>
                      <Field label="Modelo del vehículo" htmlFor="modelo">
                        <input
                          id="modelo"
                          type="text"
                          name="modelo"
                          value={formData.modelo}
                          onChange={handleChange}
                          className={inputCls}
                          placeholder="Ej: Focus, Cruze"
                        />
                      </Field>
                      <Field label="Tipo de vehículo" htmlFor="tipoVehiculo">
                        <div className="relative">
                          <select
                            id="tipoVehiculo"
                            name="tipoVehiculo"
                            value={formData.tipoVehiculo}
                            onChange={handleChange}
                            className={selectCls}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="auto">Auto</option>
                            <option value="suv">SUV</option>
                            <option value="pickup">Pickup</option>
                            <option value="moto">Moto</option>
                            <option value="comercial">
                              Vehículo Comercial
                            </option>
                          </select>
                          <ChevronDown
                            aria-hidden
                            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-steel"
                            strokeWidth={1.5}
                          />
                        </div>
                      </Field>
                      <Field label="Año de compra" htmlFor="anioCompra">
                        <input
                          id="anioCompra"
                          type="number"
                          name="anioCompra"
                          value={formData.anioCompra}
                          onChange={handleChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className={inputCls}
                          placeholder="Ej: 2020"
                        />
                      </Field>
                    </div>
                  </div>

                  {/* 01.4 Perfil */}
                  <div data-reveal className="mt-11">
                    <GroupTitle index="01.4">Perfil</GroupTitle>
                    <div className="mt-7 grid gap-y-6">
                      <Field label="Tipo de cliente" htmlFor="tipoCliente">
                        <div className="relative md:max-w-sm">
                          <select
                            id="tipoCliente"
                            name="tipoCliente"
                            value={formData.tipoCliente}
                            onChange={handleChange}
                            className={selectCls}
                          >
                            <option value="">Seleccionar tipo</option>
                            <option value="Comprador">Comprador</option>
                            <option value="Vendedor">Vendedor</option>
                            <option value="Consultor">Consultor</option>
                          </select>
                          <ChevronDown
                            aria-hidden
                            className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-steel"
                            strokeWidth={1.5}
                          />
                        </div>
                      </Field>
                      <Field label="Observaciones" htmlFor="observaciones">
                        <textarea
                          id="observaciones"
                          name="observaciones"
                          value={formData.observaciones}
                          onChange={handleChange}
                          rows={5}
                          className="w-full resize-none border border-line-dark-2 bg-carbon-2/70 p-4 text-base text-platinum transition-colors duration-300 placeholder:text-steel focus:border-petrol-bright focus:bg-carbon-2 focus:outline-none"
                          placeholder="Cuéntanos sobre tu negocio, necesidades específicas, consultas o cualquier información que consideres importante..."
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Envío */}
                  <div
                    data-reveal
                    className="mt-11 flex flex-col items-stretch gap-5 border-t border-line-dark pt-8 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="gm-label text-steel">
                      <span className="text-petrol-bright">*</span> Campos
                      obligatorios
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group/btn relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden border border-platinum bg-platinum px-9 text-carbon-0 transition-colors duration-300 disabled:opacity-60"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -translate-x-[101%] bg-petrol-deep transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0"
                      />
                      {isSubmitting ? (
                        <>
                          <span
                            aria-hidden
                            className="relative z-10 size-4 animate-spin border border-carbon-0/30 border-t-carbon-0"
                          />
                          <span className="gm-label relative z-10">
                            Enviando...
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="gm-label relative z-10 transition-colors duration-300 group-hover/btn:text-white">
                            Registrarme como Cliente
                          </span>
                          <Send
                            aria-hidden
                            className="relative z-10 size-4 transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white"
                            strokeWidth={1.75}
                          />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>

            {/* ---- Otras formas de contacto — spotlight cards ---- */}
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal stagger={0.1}>
                <div data-reveal>
                  <h2 className="gm-display text-display-3 text-ink-0">
                    Otras formas de contacto
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-ink-1">
                    Elige la opción que más te convenga para ponerte en
                    contacto con nosotros
                  </p>
                </div>

                <div
                  data-reveal
                  className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2"
                >
                  <ChannelCard
                    href="tel:+5493424216850"
                    icon={<Phone className="size-4" strokeWidth={1.5} />}
                    title="Teléfono"
                    description="Llamanos directamente para consultas inmediatas"
                  >
                    <span className="gm-underline gm-label text-petrol-bright">
                      +54 9 342 421 6850
                    </span>
                  </ChannelCard>

                  <ChannelCard
                    href="https://wa.me/5493424216850"
                    external
                    icon={<FaWhatsapp className="size-4" />}
                    title="WhatsApp"
                    description="Chatea con nosotros para respuestas rápidas"
                  >
                    <span className="gm-underline gm-label text-petrol-bright">
                      Iniciar chat
                    </span>
                  </ChannelCard>

                  <ChannelCard
                    icon={<MapPin className="size-4" strokeWidth={1.5} />}
                    title="Visitanos"
                    description="Conoce nuestras instalaciones y stock"
                  >
                    <p className="text-sm font-semibold text-platinum">
                      Av. Blas Parera 6422
                    </p>
                    <p className="text-sm text-silver">Santa Fe, Argentina</p>
                  </ChannelCard>

                  <ChannelCard
                    icon={<Clock className="size-4" strokeWidth={1.5} />}
                    title="Horarios"
                    description="Estamos abiertos de:"
                  >
                    <p className="text-sm font-semibold text-platinum">
                      Lunes a Viernes
                    </p>
                    <p className="text-sm text-silver">8:30 - 12:30 hs</p>
                    <p className="text-sm text-silver">15:30 - 18:30 hs</p>
                  </ChannelCard>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
