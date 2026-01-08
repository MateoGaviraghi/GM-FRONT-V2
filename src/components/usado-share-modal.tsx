"use client";

import { useState } from "react";
import {
  X,
  Share2,
  Link as LinkIcon,
  Copy,
  MessageCircle,
  Mail,
  Check,
} from "lucide-react";

import { Usados } from "@/types";
import { getYearFromDate } from "@/lib/date-utils";

interface UsadoShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  usado: Usados | null;
}

export function UsadoShareModal({
  isOpen,
  onClose,
  usado,
}: UsadoShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareOption, setShareOption] = useState<"link" | "whatsapp" | "email">(
    "whatsapp"
  );

  if (!isOpen || !usado) return null;

  const vehicleTitle =
    usado.titulo ||
    `${usado.marca} ${usado.modelo}${usado.version ? ` ${usado.version}` : ""}`;

  // Generar mensaje para compartir
  const generateShareMessage = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${baseUrl}/usados/${usado._id}`;

    let message = `*${vehicleTitle}*\n\n`;

    if (usado.anio) message += `📅 Año: ${usado.anio}\n`;
    if (usado.kilometraje)
      message += `🛣️ Km: ${usado.kilometraje.toLocaleString()}\n`;

    message += `\nVer vehículo completo:\n`;
    message += `${fullUrl}\n\n`;

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
    const subject = `${vehicleTitle} - Información`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Compartir Vehículo</h2>
              <p className="text-sm text-cyan-100 mt-0.5">{vehicleTitle}</p>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Opciones de compartir */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              ¿Cómo querés compartir?
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setShareOption("whatsapp")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  shareOption === "whatsapp"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-slate-200 hover:border-green-300 text-slate-600"
                }`}
              >
                <MessageCircle className="w-6 h-6" />
                <span className="text-sm font-medium">WhatsApp</span>
              </button>

              <button
                onClick={() => setShareOption("email")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  shareOption === "email"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 hover:border-blue-300 text-slate-600"
                }`}
              >
                <Mail className="w-6 h-6" />
                <span className="text-sm font-medium">Email</span>
              </button>

              <button
                onClick={() => setShareOption("link")}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  shareOption === "link"
                    ? "border-cyan-500 bg-cyan-50 text-cyan-700"
                    : "border-slate-200 hover:border-cyan-300 text-slate-600"
                }`}
              >
                <LinkIcon className="w-6 h-6" />
                <span className="text-sm font-medium">Copiar</span>
              </button>
            </div>
          </div>

          {/* Preview del mensaje */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">
              Vista previa del mensaje
            </p>
            <div className="bg-white rounded-lg p-4 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
              {generateShareMessage()}
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleShare}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            {shareOption === "whatsapp" && (
              <>
                <MessageCircle className="w-5 h-5" />
                Compartir por WhatsApp
              </>
            )}
            {shareOption === "email" && (
              <>
                <Mail className="w-5 h-5" />
                Compartir por Email
              </>
            )}
            {shareOption === "link" && (
              <>
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    ¡Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
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
