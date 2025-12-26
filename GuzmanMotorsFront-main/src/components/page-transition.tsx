"use client";

import { useEffect, useState, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const TransitionContext = createContext<{ isTransitioning: boolean }>({
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

export function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true); // Iniciar visible
  const [animationState, setAnimationState] = useState<"entering" | "leaving">(
    "entering"
  );
  const prevPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Ejecutar transición en el montaje inicial también
    if (isInitialMount.current) {
      isInitialMount.current = false;

      // Mostrar transición inicial
      setIsVisible(true);
      setAnimationState("entering");

      // Después de mostrar la animación, cambiar a salida
      const leaveTimer = setTimeout(() => {
        setAnimationState("leaving");
      }, 800);

      // Ocultar completamente la transición
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        prevPathname.current = pathname;
      }, 1200);

      return () => {
        clearTimeout(leaveTimer);
        clearTimeout(hideTimer);
      };
    }

    // Ejecutar si cambió la ruta
    if (pathname !== prevPathname.current) {
      // Scroll al inicio inmediatamente
      window.scrollTo({ top: 0, behavior: "instant" });

      // Estado de entrada
      setAnimationState("entering");
      setIsVisible(true);

      // Después de mostrar la animación, cambiar a salida
      const leaveTimer = setTimeout(() => {
        setAnimationState("leaving");
      }, 800);

      // Ocultar completamente la transición
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        prevPathname.current = pathname;
      }, 1200);

      return () => {
        clearTimeout(leaveTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ isTransitioning: isVisible }}>
      {children}
      {isVisible && (
        <div
          className="fixed inset-0 z-[9999]"
          aria-hidden="true"
          style={{ pointerEvents: "none" }}
        >
          {/* Overlay animado con gradiente azul */}
          <div
            className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-950 transition-all duration-500 ease-in-out ${
              animationState === "entering" ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Efecto de onda azul */}
          <div
            className={`absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent transition-opacity duration-500 ease-in-out ${
              animationState === "entering" ? "opacity-100" : "opacity-0"
            }`}
            style={{
              animation:
                animationState === "entering"
                  ? "wave 1.0s cubic-bezier(0.45, 0, 0.55, 1)"
                  : "none",
            }}
          />

          {/* Logo central con animaciones */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative transition-all duration-500 ease-in-out ${
                animationState === "entering"
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-90"
              }`}
              style={{
                transitionDelay: animationState === "entering" ? "0.1s" : "0s",
              }}
            >
              {/* Anillos pulsantes alrededor del logo */}
              <div className="absolute inset-0 -m-8">
                <div
                  className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping"
                  style={{ animationDuration: "1.2s" }}
                />
                <div
                  className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping"
                  style={{ animationDuration: "1.5s", animationDelay: "0.1s" }}
                />
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 -m-16 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />

              {/* Contenedor del logo */}
              <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-3xl p-8 border-4 border-cyan-500/40 shadow-2xl shadow-cyan-500/50">
                <div className="relative w-32 h-32">
                  <Image
                    src="/images/logo/logoGM-Photoroom.png"
                    alt="Guzman Motors"
                    fill
                    className="object-contain animate-float"
                    style={{ mixBlendMode: "screen" }}
                    priority
                  />

                  {/* Brillo rotativo */}
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent"
                    style={{
                      animation: "shine 1.0s infinite linear",
                    }}
                  />
                </div>
              </div>

              {/* Partículas decorativas */}
              <div className="absolute -top-4 -left-4 w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
              <div
                className="absolute -top-6 -right-6 w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="absolute -bottom-4 -right-4 w-3 h-3 bg-cyan-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="absolute -bottom-6 -left-6 w-2 h-2 bg-cyan-300 rounded-full animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>

            {/* Texto de carga opcional */}
            <div
              className={`absolute bottom-1/3 text-cyan-400 font-bold text-lg tracking-wider transition-all duration-500 ease-in-out ${
                animationState === "entering"
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: animationState === "entering" ? "0.2s" : "0s",
              }}
            >
              <div className="flex gap-1">
                <span className="animate-pulse">●</span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "0.1s" }}
                >
                  ●
                </span>
                <span
                  className="animate-pulse"
                  style={{ animationDelay: "0.2s" }}
                >
                  ●
                </span>
              </div>
            </div>
          </div>

          {/* Estilos globales para animaciones */}
          <style jsx>{`
            @keyframes wave {
              0% {
                transform: translateX(-100%) skewX(-12deg);
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              80% {
                opacity: 1;
              }
              100% {
                transform: translateX(100%) skewX(-12deg);
                opacity: 0;
              }
            }

            @keyframes shine {
              0% {
                transform: translateX(-100%) rotate(45deg);
                opacity: 0;
              }
              50% {
                opacity: 0.6;
              }
              100% {
                transform: translateX(100%) rotate(45deg);
                opacity: 0;
              }
            }

            @keyframes float {
              0%,
              100% {
                transform: translateY(0) rotate(0deg);
              }
              50% {
                transform: translateY(-8px) rotate(3deg);
              }
            }

            .animate-float {
              animation: float 2.0s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </TransitionContext.Provider>
  );
}
