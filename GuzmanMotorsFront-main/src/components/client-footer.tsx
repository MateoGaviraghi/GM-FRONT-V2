import Link from "next/link";
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Globe,
  ArrowRight,
  Heart,
} from "lucide-react";

export function ClientFooter() {
  return (
    <footer className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Efectos de fondo modernos */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* Contenido principal del footer */}
      <div className="relative py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Información de la empresa - Mejorada */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
                  GUZMAN MOTORS
                </h3>
                <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
              </div>

              <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                Concesionaria especializada en camiones, utilitarios y
                remolques. Años de experiencia en el sector automotriz
                comercial.
              </p>

              {/* Redes sociales mejoradas */}
              <div className="flex gap-3">
                <a
                  href="https://facebook.com/guzmanmotors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-11 h-11 bg-slate-800 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-slate-700 group-hover:border-cyan-400">
                    <Facebook className="w-5 h-5 group-hover:text-white transition-colors" />
                  </div>
                </a>

                <a
                  href="https://instagram.com/guzmanmotors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-11 h-11 bg-slate-800 hover:bg-gradient-to-br hover:from-pink-500 hover:to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-slate-700 group-hover:border-pink-400">
                    <Instagram className="w-5 h-5 group-hover:text-white transition-colors" />
                  </div>
                </a>

                <a
                  href="https://guzmanmotors.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative w-11 h-11 bg-slate-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-cyan-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border border-slate-700 group-hover:border-blue-400">
                    <Globe className="w-5 h-5 group-hover:text-white transition-colors" />
                  </div>
                </a>
              </div>
            </div>

            {/* Sobre Nosotros - NUEVA SECCIÓN */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-cyan-500 to-blue-500 rounded-full"></div>
                Sobre Nosotros
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/cliente", label: "Inicio" },
                  { href: "/nosotros", label: "Nosotros" },
                  { href: "/novedades", label: "Novedades" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nuestros Vehículos - NUEVA SECCIÓN */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                Nuestros Vehículos
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/foton", label: "FOTON" },
                  { href: "/remolques", label: "Remolques" },
                  { href: "/usados", label: "Usados" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-slate-400 hover:text-green-400 transition-all duration-300"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios Financieros - NUEVA SECCIÓN */}
            <div>
              <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                Servicios Financieros
              </h4>

              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Consultános sobre nuestras opciones de financiación y
                consignación para tu vehículo.
              </p>

              {/* Botón de contacto destacado */}
              <Link href="/contacto" className="group relative block">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl px-6 py-3 text-center transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-sm flex items-center justify-center gap-2">
                    Contactanos
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Información de contacto - NUEVA BARRA INFERIOR */}
          <div className="mt-16 pt-8 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dirección */}
              <div className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    Dirección
                  </p>
                  <p className="text-white text-sm leading-relaxed">
                    Av. Blas Parera 6422
                    <br />
                    Santa Fe, Argentina
                  </p>
                </div>
              </div>

              {/* Teléfono */}
              <div className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    Teléfono
                  </p>
                  <a
                    href="tel:+5493424216850"
                    className="text-white text-sm hover:text-green-400 transition-colors"
                  >
                    +54 9 342 421 6850
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    Email
                  </p>
                  <a
                    href="mailto:hguzmanmotors@gmail.com"
                    className="text-white text-sm hover:text-purple-400 transition-colors"
                  >
                    hguzmanmotors@gmail.com
                  </a>
                </div>
              </div>

              {/* Horarios */}
              <div className="group flex items-start gap-3 p-4 rounded-xl hover:bg-slate-800/50 transition-all duration-300">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1">
                    Horarios
                  </p>
                  <div className="text-white text-sm leading-relaxed">
                    <div>Lun - Vie: 8:30 - 12:30</div>
                    <div>y 15:30 - 18:30</div>
                    <div>Sábados y Domingos: Cerrado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separador con gradiente */}
      <div className="relative">
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </div>

      {/* Copyright - Ultra Moderno */}
      <div className="relative py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-slate-400">
              <span>© 2025 Guzman Motors.</span>
              <span className="hidden sm:inline">
                Todos los derechos reservados.
              </span>
            </div>

            {/* Desarrollado con amor */}
            <div className="flex items-center gap-2 text-slate-400">
              <span>Desarrollado con</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
              <span>para el sector automotriz</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
