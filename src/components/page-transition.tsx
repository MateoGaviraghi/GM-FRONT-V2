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
  const [isVisible, setIsVisible] = useState(true); // Iniciar visible (splash solo primera visita)
  const [animationState, setAnimationState] = useState<"entering" | "leaving">(
    "entering"
  );
  const prevPathname = useRef(pathname);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Splash SOLO en la primera visita de la sesión — nunca al navegar.
    if (isInitialMount.current) {
      isInitialMount.current = false;

      let alreadyShown = false;
      try {
        alreadyShown = sessionStorage.getItem("gm-splash") === "1";
      } catch {
        /* storage bloqueado: mostrar splash igual */
      }

      if (alreadyShown) {
        setIsVisible(false);
        prevPathname.current = pathname;
        return;
      }

      try {
        sessionStorage.setItem("gm-splash", "1");
      } catch {
        /* noop */
      }

      setIsVisible(true);
      setAnimationState("entering");

      const leaveTimer = setTimeout(() => {
        setAnimationState("leaving");
      }, 450);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        prevPathname.current = pathname;
      }, 800);

      return () => {
        clearTimeout(leaveTimer);
        clearTimeout(hideTimer);
      };
    }

    // Cambio de ruta: sin telón, solo scroll al inicio.
    if (pathname !== prevPathname.current) {
      window.scrollTo({ top: 0, behavior: "instant" });
      prevPathname.current = pathname;
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
          {/* Telón carbón */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              animationState === "entering" ? "opacity-100" : "opacity-0"
            }`}
            style={{ background: "var(--gm-carbon-0)" }}
          />

          {/* Marca centrada — sobria, técnica */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={`flex flex-col items-center transition-all duration-500 ease-in-out ${
                animationState === "entering"
                  ? "scale-100 opacity-100"
                  : "scale-[0.97] opacity-0"
              }`}
            >
              <div className="relative h-20 w-20 sm:h-24 sm:w-24">
                <Image
                  src="/images/logo/logoGM-Photoroom.png"
                  alt="Guzman Motors"
                  fill
                  sizes="96px"
                  className="object-contain"
                  style={{ mixBlendMode: "screen" }}
                  priority
                />
              </div>

              {/* Línea de progreso técnica */}
              <div
                className="relative mt-8 h-px w-44 overflow-hidden sm:w-56"
                style={{ background: "var(--gm-line-dark)" }}
              >
                <span
                  className="absolute inset-y-0 left-0 w-full origin-left"
                  style={{
                    background: "var(--gm-petrol-bright)",
                    animation:
                      animationState === "entering"
                        ? "gm-loadbar 0.85s cubic-bezier(0.16,1,0.3,1) forwards"
                        : "none",
                    transform:
                      animationState === "leaving" ? "scaleX(1)" : undefined,
                  }}
                />
              </div>

              <span
                className="mt-5 font-mono text-[0.625rem] font-medium uppercase"
                style={{
                  color: "var(--gm-steel)",
                  letterSpacing: "0.28em",
                }}
              >
                Guzman Motors
              </span>
            </div>
          </div>

          <style jsx>{`
            @keyframes gm-loadbar {
              from {
                transform: scaleX(0);
              }
              to {
                transform: scaleX(1);
              }
            }
          `}</style>
        </div>
      )}
    </TransitionContext.Provider>
  );
}
