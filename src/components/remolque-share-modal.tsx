"use client";

import { useState } from "react";
import {
  X,
  Link as LinkIcon,
  FileText,
  Check,
  Copy,
  MessageCircle,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RemolqueShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  remolqueName: string;
  remolqueUrl: string;
  remolqueId?: string;
}

export function RemolqueShareModal({
  isOpen,
  onClose,
  remolqueName,
  remolqueUrl,
  remolqueId,
}: RemolqueShareModalProps) {
  const [includePdf, setIncludePdf] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareOption, setShareOption] = useState<"link" | "whatsapp" | "email">(
    "whatsapp"
  );

  if (!isOpen) return null;

  // Generar mensaje para compartir
  const generateShareMessage = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${baseUrl}${remolqueUrl}`;

    let message = `*${remolqueName}*\n\n`;
    message += `Ver remolque completo:\n`;
    message += `${fullUrl}\n\n`;

    if (includePdf && remolqueId) {
      message += `-----------------------------------\n`;
      message += `FICHA TECNICA:\n`;
      message += `-----------------------------------\n\n`;
      message += `Descargar PDF: ${baseUrl}/api/remolques/${remolqueId}/ficha-tecnica\n\n`;
    }

    message += `-----------------------------------\n`;
    message += `Consultas? Escribinos sin compromiso!`;

    return message;
  };

  // Copiar al portapapeles
  const copyToClipboard = async () => {
    const message = generateShareMessage();
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  // Compartir por WhatsApp
  const shareViaWhatsApp = () => {
    const message = generateShareMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  // Compartir por Email
  const shareViaEmail = () => {
    const message = generateShareMessage();
    const subject = `${remolqueName} - Información`;
    const body = encodeURIComponent(message);
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  // Ejecutar acción según opción seleccionada
  const handleShare = () => {
    if (shareOption === "whatsapp") {
      shareViaWhatsApp();
    } else if (shareOption === "email") {
      shareViaEmail();
    } else {
      copyToClipboard();
    }
  };

  const options: {
    id: "whatsapp" | "email" | "link";
    label: string;
    Icon: typeof MessageCircle;
  }[] = [
    { id: "whatsapp", label: "WhatsApp", Icon: MessageCircle },
    { id: "email", label: "Email", Icon: Mail },
    { id: "link", label: "Copiar", Icon: LinkIcon },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-carbon-0/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden border border-line-dark-2 bg-carbon-1 text-platinum"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line-dark px-6 py-5">
          <div className="flex items-center gap-4">
            <span className="gm-plus text-petrol-bright" aria-hidden />
            <div>
              <h2 className="gm-display text-lg leading-none text-platinum">
                Compartir remolque
              </h2>
              <p className="gm-label mt-2 text-steel">{remolqueName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-10 items-center justify-center border border-line-dark-2 text-silver transition-colors hover:bg-platinum hover:text-carbon-0"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Contenido */}
        <div className="overflow-y-auto px-6 py-6">
          {/* Opciones de compartir */}
          <div className="mb-8">
            <p className="gm-label mb-3 text-steel">¿Cómo querés compartir?</p>
            <div className="grid grid-cols-3 gap-px border border-line-dark bg-line-dark">
              {options.map(({ id, label, Icon }) => {
                const selected = shareOption === id;
                return (
                  <button
                    key={id}
                    onClick={() => setShareOption(id)}
                    className={cn(
                      "flex flex-col items-center gap-2.5 px-3 py-5 transition-colors",
                      selected
                        ? "bg-petrol-dim text-petrol-bright"
                        : "bg-carbon-2 text-steel hover:text-platinum"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-6",
                        selected ? "text-petrol-bright" : "text-silver"
                      )}
                      strokeWidth={1.5}
                    />
                    <span className="gm-label">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opción de incluir PDF */}
          {remolqueId && (
            <div className="mb-8">
              <p className="gm-label mb-3 text-steel">Incluir ficha técnica</p>

              <button
                onClick={() => setIncludePdf(!includePdf)}
                className={cn(
                  "flex w-full items-center gap-3 border px-4 py-3.5 text-left transition-colors",
                  includePdf
                    ? "border-petrol-bright bg-petrol-dim"
                    : "border-line-dark-2 bg-carbon-2 hover:bg-carbon-3"
                )}
              >
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center border transition-colors",
                    includePdf
                      ? "border-petrol-bright bg-petrol-bright text-carbon-0"
                      : "border-line-dark-2"
                  )}
                >
                  {includePdf ? (
                    <Check className="size-3.5" strokeWidth={2.5} />
                  ) : null}
                </span>
                <FileText
                  className="size-4 shrink-0 text-petrol-bright"
                  strokeWidth={1.5}
                />
                <span className="flex-1 text-sm text-platinum">
                  Ficha Técnica (PDF)
                </span>
              </button>

              {!includePdf && (
                <p className="gm-label mt-3 text-steel">
                  💡 Incluí la ficha técnica para más detalles
                </p>
              )}
            </div>
          )}

          {/* Preview del mensaje */}
          <div>
            <p className="gm-label mb-3 text-steel">Vista previa del mensaje</p>
            <div className="max-h-64 overflow-y-auto whitespace-pre-wrap border border-line-dark bg-carbon-0 p-4 text-xs leading-relaxed text-silver [font-family:var(--font-plex-mono)]">
              {generateShareMessage()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-line-dark px-6 py-4">
          <button
            onClick={onClose}
            className="gm-label flex-1 border border-line-dark-2 px-4 py-3 text-silver transition-colors hover:border-platinum hover:text-platinum"
          >
            Cancelar
          </button>
          <button
            onClick={handleShare}
            className="gm-label flex flex-1 items-center justify-center gap-2 bg-petrol-bright px-4 py-3 text-carbon-0 transition-colors hover:bg-platinum"
          >
            {shareOption === "whatsapp" && (
              <>
                <MessageCircle className="size-4" strokeWidth={2} />
                Compartir por WhatsApp
              </>
            )}
            {shareOption === "email" && (
              <>
                <Mail className="size-4" strokeWidth={2} />
                Compartir por Email
              </>
            )}
            {shareOption === "link" && (
              <>
                {copied ? (
                  <>
                    <Check className="size-4" strokeWidth={2} />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="size-4" strokeWidth={2} />
                    Copiar mensaje
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
