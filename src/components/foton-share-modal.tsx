"use client";

import { useState } from "react";
import {
  X,
  Share2,
  Link as LinkIcon,
  FileText,
  Check,
  Copy,
  MessageCircle,
  Mail,
} from "lucide-react";

interface Version {
  id: string;
  nombre: string;
  pdf?: string;
}

interface FotonShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleName: string;
  vehicleUrl: string;
  versions?: Version[];
}

export function FotonShareModal({
  isOpen,
  onClose,
  vehicleName,
  vehicleUrl,
  versions = [],
}: FotonShareModalProps) {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [shareOption, setShareOption] = useState<"link" | "whatsapp" | "email">(
    "whatsapp"
  );

  if (!isOpen) return null;

  const hasValidVersions = versions.some((v) => v.pdf);

  // Toggle selección de versión
  const toggleVersion = (versionId: string) => {
    setSelectedVersions((prev) =>
      prev.includes(versionId)
        ? prev.filter((id) => id !== versionId)
        : [...prev, versionId]
    );
  };

  // Seleccionar/deseleccionar todas
  const toggleAll = () => {
    if (selectedVersions.length === versions.filter((v) => v.pdf).length) {
      setSelectedVersions([]);
    } else {
      setSelectedVersions(versions.filter((v) => v.pdf).map((v) => v.id));
    }
  };

  // Generar mensaje para compartir
  const generateShareMessage = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const fullUrl = `${baseUrl}${vehicleUrl}`;

    let message = `*${vehicleName}*\n\n`;
    message += `Ver vehiculo completo:\n`;
    message += `${fullUrl}\n\n`;

    if (selectedVersions.length > 0) {
      message += `-----------------------------------\n`;
      message += `FICHAS TECNICAS DISPONIBLES:\n`;
      message += `-----------------------------------\n`;

      selectedVersions.forEach((versionId) => {
        const version = versions.find((v) => v.id === versionId);
        if (version && version.pdf) {
          const pdfUrl = `${baseUrl}${version.pdf}`;
          message += `\n${version.nombre}\n`;
          message += `Descargar PDF: ${pdfUrl}\n`;
        }
      });
    }

    message += `\n-----------------------------------\n`;
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
    const subject = `FOTON ${vehicleName} - Información`;
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
              <p className="text-sm text-cyan-100 mt-0.5">{vehicleName}</p>
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

          {/* Selección de versiones/PDFs */}
          {hasValidVersions && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-slate-700">
                  Fichas técnicas (PDFs)
                </label>
                <button
                  onClick={toggleAll}
                  className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  {selectedVersions.length ===
                  versions.filter((v) => v.pdf).length
                    ? "Deseleccionar todas"
                    : "Seleccionar todas"}
                </button>
              </div>

              <div className="space-y-2">
                {versions.map((version) => {
                  if (!version.pdf) return null;

                  const isSelected = selectedVersions.includes(version.id);

                  return (
                    <button
                      key={version.id}
                      onClick={() => toggleVersion(version.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-slate-200 hover:border-cyan-200"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-cyan-600 border-cyan-600"
                            : "border-slate-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>

                      {/* Icono PDF */}
                      <div className="flex-shrink-0 bg-red-100 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-red-600" />
                      </div>

                      {/* Nombre */}
                      <span className="font-medium text-slate-700 flex-1">
                        {version.nombre}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedVersions.length === 0 && (
                <p className="text-sm text-slate-500 mt-3 text-center">
                  💡 Seleccioná las versiones que querés compartir
                </p>
              )}
            </div>
          )}

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
