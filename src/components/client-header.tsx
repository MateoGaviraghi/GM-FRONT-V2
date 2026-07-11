"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Menu, X, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "INICIO" },
  { href: "/foton", label: "FOTON" },
  { href: "/remolques", label: "REMOLQUES" },
  { href: "/usados", label: "USADOS" },
  { href: "/novedades", label: "NOVEDADES" },
  { href: "/nosotros", label: "NOSOTROS" },
  { href: "/contacto", label: "CONTACTO" },
];

export function ClientHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  /* Publica la altura real del header (expandido) como --gm-header-h,
     para que los heros calculen 100svh - header sin números mágicos. */
  useEffect(() => {
    const setVar = () => {
      if (window.scrollY > 10 || !headerRef.current) return;
      document.documentElement.style.setProperty(
        "--gm-header-h",
        `${Math.round(headerRef.current.getBoundingClientRect().height)}px`
      );
    };
    setVar();
    window.addEventListener("resize", setVar);
    return () => window.removeEventListener("resize", setVar);
  }, []);

  /* Altura VIVA del header (--gm-header-h-live): el header encoge al scrollear,
     así que los elementos sticky (tabs de secciones) se anclan a esta variable
     para quedar siempre pegados al borde real del header, sin gap. */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const setLive = () => {
      document.documentElement.style.setProperty(
        "--gm-header-h-live",
        `${Math.round(el.getBoundingClientRect().height)}px`
      );
    };
    setLive();
    const ro = new ResizeObserver(setLive);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      // Limpiar el timeout anterior
      clearTimeout(timeoutId);

      // Pequeño delay con histéresis para evitar parpadeo
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 50 && !isScrolled) {
          setIsScrolled(true);
        } else if (scrollPosition <= 30 && isScrolled) {
          setIsScrolled(false);
        }
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [isScrolled]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 border-b border-line-dark text-platinum transition-colors duration-300",
        isScrolled ? "bg-carbon-0/92 backdrop-blur-md" : "bg-carbon-0"
      )}
    >
      {/* Barra técnica superior — oculta en móvil */}
      <div
        className={cn(
          "hidden border-b border-line-dark transition-all duration-300 md:block",
          isScrolled ? "py-1.5" : "py-2"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <div className="gm-label flex items-center gap-6 text-steel">
            <span className="flex items-center gap-2">
              <MapPin className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              Av. Blas Parera 6422, Santa Fe
            </span>
            <span aria-hidden className="h-3 w-px bg-line-dark" />
            <span className="hidden items-center gap-2 lg:flex">
              <Clock className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              Lun - Vie: 8:30 - 12:30 y 15:30 - 18:30 | Sáb - Dom: Cerrado
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+5493424216850"
              className="gm-label gm-underline flex items-center gap-2 whitespace-nowrap text-silver transition-colors hover:text-platinum"
            >
              <Phone className="size-3.5 text-petrol-bright" strokeWidth={1.5} />
              +54 9 342 421 6850
            </a>
            <span aria-hidden className="h-3 w-px bg-line-dark" />
            <div className="flex">
              <a
                href="https://www.facebook.com/guzmanmotors19/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex size-7 items-center justify-center border border-line-dark text-silver transition-colors duration-300 hover:bg-platinum hover:text-carbon-0"
              >
                <FaFacebookF className="size-3" />
              </a>
              <a
                href="https://www.instagram.com/guzmanmotors/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="-ml-px flex size-7 items-center justify-center border border-line-dark text-silver transition-colors duration-300 hover:bg-platinum hover:text-carbon-0"
              >
                <FaInstagram className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <div
        className={cn(
          "transition-all duration-300",
          isScrolled ? "py-2.5" : "py-4"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Marca */}
          <Link href="/" className="group flex shrink-0 items-center gap-3.5">
            <Image
              src="/images/logo/logoGM-Photoroom.png"
              alt="Guzman Motors Logo"
              width={64}
              height={64}
              priority
              style={{ mixBlendMode: "screen" }}
              className={cn(
                // -ml-3 compensa el padding transparente interno del PNG (27% a la izq.)
                "-ml-3 w-auto object-contain transition-all duration-300",
                isScrolled ? "h-10" : "h-12"
              )}
            />
            <Image
              src="/images/logo/letrasGuzmanMotors-Photoroom.png"
              alt="Guzman Motors"
              width={220}
              height={60}
              priority
              style={{ mixBlendMode: "screen" }}
              className={cn(
                "w-auto object-contain transition-all duration-300",
                isScrolled ? "h-8" : "h-10"
              )}
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "gm-label gm-underline py-2 transition-colors duration-300",
                  isActive(item.href)
                    ? "text-petrol-bright"
                    : "text-silver hover:text-platinum"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Hamburguesa */}
          <button
            onClick={toggleMenu}
            className="flex size-11 items-center justify-center border border-line-dark-2 text-platinum transition-colors duration-300 hover:bg-platinum hover:text-carbon-0 lg:hidden"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="size-5" strokeWidth={1.5} />
            ) : (
              <Menu className="size-5" strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <nav className="border-t border-line-dark lg:hidden">
            <div className="mx-auto w-full max-w-[1480px] px-5 pb-8 pt-4 sm:px-8">
              <div className="flex flex-col">
                {NAV_ITEMS.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    style={{ animationDelay: `${i * 45}ms` }}
                    className={cn(
                      "animate-fade-in flex min-h-11 items-center gap-4 border-b border-line-dark",
                      isActive(item.href) ? "text-petrol-bright" : "text-platinum"
                    )}
                  >
                    <span className="gm-label text-steel">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="gm-display text-2xl">{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Contacto en móvil */}
              <div className="mt-6 flex flex-col gap-4">
                <a
                  href="tel:+5493424216850"
                  className="gm-label flex items-center gap-3 text-silver"
                >
                  <Phone className="size-4 text-petrol-bright" strokeWidth={1.5} />
                  +54 9 342 421 6850
                </a>
                <p className="gm-label flex items-center gap-3 text-silver">
                  <MapPin className="size-4 text-petrol-bright" strokeWidth={1.5} />
                  Av. Blas Parera 6422, Santa Fe
                </p>
                <div className="mt-2 flex">
                  <a
                    href="https://www.facebook.com/guzmanmotors19/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-11 flex-1 items-center justify-center border border-line-dark text-silver transition-colors duration-300 hover:bg-platinum hover:text-carbon-0"
                  >
                    <FaFacebookF className="size-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/guzmanmotors/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="-ml-px flex h-11 flex-1 items-center justify-center border border-line-dark text-silver transition-colors duration-300 hover:bg-platinum hover:text-carbon-0"
                  >
                    <FaInstagram className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
