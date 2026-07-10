import Link from "next/link";
import { Phone, MapPin, Mail, Clock, ArrowUpRight, Heart } from "lucide-react";
import { FaFacebookF, FaInstagram, FaGlobeAmericas } from "react-icons/fa";

const NAV_GROUPS = [
  {
    title: "Sobre Nosotros",
    links: [
      { href: "/cliente", label: "Inicio" },
      { href: "/nosotros", label: "Nosotros" },
      { href: "/novedades", label: "Novedades" },
    ],
  },
  {
    title: "Nuestros Vehículos",
    links: [
      { href: "/foton", label: "FOTON" },
      { href: "/remolques", label: "Remolques" },
      { href: "/usados", label: "Usados" },
    ],
  },
];

const SOCIALS = [
  {
    href: "https://www.facebook.com/guzmanmotors19/",
    label: "Facebook",
    Icon: FaFacebookF,
  },
  {
    href: "https://instagram.com/guzmanmotors",
    label: "Instagram",
    Icon: FaInstagram,
  },
  {
    href: "https://guzmanmotors.com",
    label: "Sitio web",
    Icon: FaGlobeAmericas,
  },
];

export function ClientFooter() {
  return (
    <footer className="gm-grain relative overflow-hidden border-t border-line-dark bg-carbon-0 text-platinum">
      <div className="relative z-10 mx-auto w-full max-w-[1480px] px-5 pt-16 sm:px-8 md:pt-20 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div>
            <p className="gm-display text-2xl leading-tight">
              Guzman
              <br />
              Motors
            </p>
            <span
              aria-hidden
              className="mt-4 block h-px w-14 bg-petrol-bright"
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-silver">
              Concesionaria especializada en camiones, utilitarios y remolques.
              Años de experiencia en el sector automotriz comercial.
            </p>

            <div className="mt-7 flex">
              {SOCIALS.map(({ href, label, Icon }, i) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={
                    "flex size-11 items-center justify-center border border-line-dark text-silver transition-colors duration-300 hover:bg-platinum hover:text-carbon-0" +
                    (i > 0 ? " -ml-px" : "")
                  }
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Grupos de navegación */}
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="gm-label text-steel">{group.title}</h4>
              <ul className="mt-6 space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-silver transition-colors duration-300 hover:text-platinum"
                    >
                      <span className="gm-underline">{link.label}</span>
                      <ArrowUpRight
                        aria-hidden
                        strokeWidth={1.5}
                        className="size-3.5 text-petrol-bright opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Servicios financieros */}
          <div>
            <h4 className="gm-label text-steel">Servicios Financieros</h4>
            <p className="mt-6 text-sm leading-relaxed text-silver">
              Consultános sobre nuestras opciones de financiación y consignación
              para tu vehículo.
            </p>
            <Link
              href="/contacto"
              className="group/btn relative mt-7 inline-flex h-12 items-center justify-center gap-3 overflow-hidden border border-platinum bg-platinum px-7 text-carbon-0"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-[101%] bg-petrol-deep transition-transform duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/btn:translate-x-0"
              />
              <span className="gm-label relative z-10 transition-colors duration-300 group-hover/btn:text-white">
                Contactanos
              </span>
              <ArrowUpRight
                aria-hidden
                strokeWidth={1.75}
                className="relative z-10 size-4 transition-all duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 group-hover/btn:text-white"
              />
            </Link>
          </div>
        </div>

        {/* Datos de contacto — banda técnica */}
        <div className="mt-16 grid grid-cols-1 border-t border-line-dark sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-line-dark py-6 sm:border-r sm:pr-6">
            <p className="gm-label flex items-center gap-2 text-steel">
              <MapPin className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              Dirección
            </p>
            <p className="mt-3 text-sm leading-relaxed text-silver">
              Av. Blas Parera 6422
              <br />
              Santa Fe, Argentina
            </p>
          </div>
          <div className="border-t border-line-dark py-6 sm:border-t-0 sm:pl-6 lg:border-r lg:pr-6">
            <p className="gm-label flex items-center gap-2 text-steel">
              <Phone className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              Teléfono
            </p>
            <a
              href="tel:+5493424216850"
              className="gm-underline mt-3 inline-block text-sm text-silver transition-colors hover:text-platinum"
            >
              +54 9 342 421 6850
            </a>
          </div>
          <div className="border-t border-line-dark py-6 sm:border-r sm:pr-6 lg:border-t-0 lg:pl-6">
            <p className="gm-label flex items-center gap-2 text-steel">
              <Mail className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              Email
            </p>
            <a
              href="mailto:hguzmanmotors@gmail.com"
              className="gm-underline mt-3 inline-block text-sm text-silver transition-colors hover:text-platinum"
            >
              hguzmanmotors@gmail.com
            </a>
          </div>
          <div className="border-t border-line-dark py-6 sm:pl-6 lg:border-t-0">
            <p className="gm-label flex items-center gap-2 text-steel">
              <Clock className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              Horarios
            </p>
            <div className="mt-3 text-sm leading-relaxed text-silver">
              <div>Lun - Vie: 8:30 - 12:30</div>
              <div>y 15:30 - 18:30</div>
              <div>Sábados y Domingos: Cerrado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative z-10 mt-14 border-t border-line-dark py-6">
        <div className="mx-auto flex w-full max-w-[1480px] flex-col items-center justify-between gap-3 px-5 sm:px-8 md:flex-row lg:px-12">
          <p className="gm-label text-steel">
            © 2025 Guzman Motors.{" "}
            <span className="hidden sm:inline">
              Todos los derechos reservados.
            </span>
          </p>
          <p className="gm-label flex items-center gap-2 text-steel">
            Desarrollado con
            <Heart
              className="size-3.5 fill-petrol-bright text-petrol-bright"
              aria-hidden
            />
            para el sector automotriz
          </p>
        </div>
      </div>
    </footer>
  );
}
