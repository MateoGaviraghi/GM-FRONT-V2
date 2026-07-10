"use client";

/**
 * MediaUploadZone v2 — Soft SaaS (4R3). Wrapper presentacional/controlado del
 * flujo de subida (drag-drop + previews + fotoSinFondo1/2). La lógica de
 * Cloudinary sigue afuera: el módulo pasa callbacks.
 *
 * Novedades elderly-first: zona GRANDE con instrucción SIEMPRE visible,
 * validación de tipo/peso ANTES de subir con mensaje claro, compresión
 * automática client-side (compressImage) y progreso por archivo con check
 * verde de éxito.
 */

import { useRef, useState, type DragEvent } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MediaPreview = {
  id: string;
  url: string;
  type?: "image" | "video";
};

export type MediaUploadSlots = {
  fotoSinFondo1?: MediaPreview | null;
  fotoSinFondo2?: MediaPreview | null;
};

const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png"];
const DEFAULT_MAX_SIZE_MB = 5;

/* ---------- compressImage: canvas → máx 1920px, JPEG calidad 0.85 ---------- */

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo leer la imagen"));
    img.src = url;
  });
}

export async function compressImage(file: File, maxDim = 1920, quality = 0.85): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml") return file;

  try {
    const img = await loadImage(file);
    const { naturalWidth: width, naturalHeight: height } = img;
    const scale = Math.min(1, maxDim / Math.max(width, height));
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, targetW, targetH);
    URL.revokeObjectURL(img.src);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) return file;

    const newName = file.name.replace(/\.\w+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg", lastModified: Date.now() });
  } catch {
    return file;
  }
}

/* ---------- validación previa (tipo + peso) ---------- */

function validateFile(file: File, acceptedTypes: string[], maxSizeMB: number): string | null {
  if (!acceptedTypes.includes(file.type)) {
    return `"${file.name}" no es un archivo JPG o PNG. Elegí otro archivo.`;
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `"${file.name}" pesa demasiado (máximo ${maxSizeMB} MB). Elegí una foto más liviana.`;
  }
  return null;
}

export type MediaUploadZoneProps = {
  previews: MediaPreview[];
  onFilesSelected: (files: File[]) => void;
  onRemove: (id: string) => void;
  max?: number;
  /** Instrucción SIEMPRE visible dentro de la zona (elderly-first: nunca depender de un ícono solo). */
  instruccion?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  /** Progreso de subida 0-100 por id de preview (lo maneja el módulo real). */
  progress?: Record<string, number>;
  slots?: MediaUploadSlots;
  onSlotSelected?: (slot: "fotoSinFondo1" | "fotoSinFondo2", file: File) => void;
  className?: string;
};

export function MediaUploadZone({
  previews,
  onFilesSelected,
  onRemove,
  max,
  instruccion = "Arrastrá las fotos acá o hacé clic — JPG o PNG, máximo 5 MB",
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  progress,
  slots,
  onSlotSelected,
  className,
}: MediaUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function processFiles(fileList: FileList) {
    const files = Array.from(fileList);
    const errors: string[] = [];
    const valid: File[] = [];

    for (const file of files) {
      const err = validateFile(file, acceptedTypes, maxSizeMB);
      if (err) errors.push(err);
      else valid.push(file);
    }

    setValidationErrors(errors);
    if (valid.length === 0) return;

    setProcessing(true);
    try {
      const compressed = await Promise.all(valid.map((f) => compressImage(f)));
      onFilesSelected(compressed);
    } finally {
      setProcessing(false);
    }
  }

  function handleDrop(e: DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) processFiles(e.dataTransfer.files);
  }

  return (
    <div className={cn("space-y-4", className)}>
      <label
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors duration-150",
          dragOver
            ? "border-gray-900 bg-gray-100"
            : "border-gray-200 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <span className="flex size-12 items-center justify-center rounded-xl bg-white text-gray-500 shadow-sm" aria-hidden>
          <ImagePlus className="size-6" strokeWidth={1.75} />
        </span>
        <span className="max-w-md text-[15.5px] text-gray-600">
          {processing ? "Preparando las fotos, un momento…" : instruccion}
        </span>
        {max ? <span className="text-[15.5px] text-gray-500">Máximo {max} archivos</span> : null}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) processFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>

      {validationErrors.length > 0 ? (
        <div className="space-y-1.5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          {validationErrors.map((msg, i) => (
            <p key={i} className="flex items-start gap-2 text-[15px] font-medium text-red-600">
              <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
              {msg}
            </p>
          ))}
        </div>
      ) : null}

      {previews.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((preview, index) => {
            const pct = progress?.[preview.id];
            const uploading = typeof pct === "number" && pct < 100;
            const done = pct === 100;
            return (
              <div
                key={preview.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
              >
                {preview.type === "video" ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video src={preview.url} className="size-full object-cover" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview.url} alt="" className="size-full object-cover" />
                )}
                <span className="absolute left-1.5 top-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[16px] font-semibold text-gray-900 shadow-sm">
                  {String(index + 1).padStart(2, "0")}
                </span>

                {uploading ? (
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-900 transition-[width] duration-200"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                ) : null}

                {done ? (
                  <span className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[16px] font-semibold text-emerald-600 shadow-sm">
                    <CheckCircle2 className="size-4" strokeWidth={2} aria-hidden />
                    Listo
                  </span>
                ) : null}

                <button
                  type="button"
                  onClick={() => onRemove(preview.id)}
                  className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[16px] font-semibold text-gray-700 shadow-sm transition-colors duration-150 hover:text-red-600"
                >
                  <X className="size-4" strokeWidth={2} />
                  Quitar
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {slots ? (
        <div className="grid grid-cols-2 gap-3">
          {(["fotoSinFondo1", "fotoSinFondo2"] as const).map((slotKey, i) => {
            const preview = slots[slotKey];
            return (
              <div key={slotKey} className="space-y-1.5">
                <span className="text-[15.5px] font-semibold text-gray-800">Foto sin fondo {i + 1}</span>
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400 hover:bg-gray-50">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={preview.url} alt="" className="size-full object-contain" />
                  ) : (
                    <>
                      <span className="flex size-10 items-center justify-center rounded-lg bg-white text-gray-500 shadow-sm" aria-hidden>
                        <ImagePlus className="size-5" strokeWidth={1.75} />
                      </span>
                      <span className="px-3 text-[15.5px] text-gray-600">Clic para subir</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) onSlotSelected?.(slotKey, await compressImage(file));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
