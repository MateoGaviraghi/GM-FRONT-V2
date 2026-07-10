"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar/ocultar botón basado en scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="animate-fade-in fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center border backdrop-blur-sm transition-colors duration-300"
          style={{
            background: "color-mix(in oklab, var(--gm-carbon-0) 85%, transparent)",
            borderColor: "var(--gm-line-dark-2)",
            color: "var(--gm-platinum)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--gm-platinum)";
            e.currentTarget.style.color = "var(--gm-carbon-0)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              "color-mix(in oklab, var(--gm-carbon-0) 85%, transparent)";
            e.currentTarget.style.color = "var(--gm-platinum)";
          }}
          aria-label="Volver arriba"
        >
          <ArrowUp className="size-5" strokeWidth={1.5} />
        </button>
      )}
    </>
  );
}
