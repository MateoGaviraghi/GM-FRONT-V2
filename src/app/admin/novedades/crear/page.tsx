"use client";

import { useRef, useState } from "react";
import { AlertCircle, ExternalLink, Loader2, Plus, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { CreateNovedadDto, NovedadLink } from "@/types";
import {
  AdminButton,
  Breadcrumb,
  DraftBanner,
  Field,
  FormSection,
  FormShell,
  mapApiError,
  MediaUploadZone,
  type MediaPreview,
  SelectField,
  SwitchField,
  TextareaField,
  TextInput,
  useFormDraft,
  useToast,
  useUnsavedGuard,
} from "@/components/admin/kit";

interface FormData {
  titulo: string;
  contenido: string;
  resumen: string;
  categoria: string;
  destacada: boolean;
  fechaPublicacion: string;
}

interface LinkFormData {
  titulo: string;
  url: string;
  descripcion: string;
}

interface FilePreview {
  file: File;
  url: string;
}

interface FormErrors {
  [key: string]: string;
}

const INITIAL_FORM_DATA: FormData = {
  titulo: "",
  contenido: "",
  resumen: "",
  categoria: "",
  destacada: false,
  fechaPublicacion: new Date().toISOString().split("T")[0],
};

type DraftShape = {
  formData: FormData;
  links: NovedadLink[];
};

export default function CrearNovedadPage() {
  const router = useRouter();
  const { categorias } = useNovedadOptions();
  const { showToast } = useToast();

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Estados de archivos
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);

  // Estados de links
  const [links, setLinks] = useState<NovedadLink[]>([]);
  const [currentLink, setCurrentLink] = useState<LinkFormData>({
    titulo: "",
    url: "",
    descripcion: "",
  });
  const [showLinkForm, setShowLinkForm] = useState(false);

  // Estados de validación y UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCategoriaInput, setShowCategoriaInput] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  // Borrador (elderly-first: nunca perder una carga a mitad de hacer)
  const { hasDraft, restoreDraft, dismissDraft, clearDraft } =
    useFormDraft<DraftShape>(
      "novedad-crear",
      { formData, links },
      (draft) => {
        setFormData(draft.formData ?? INITIAL_FORM_DATA);
        setLinks(draft.links ?? []);
      },
    );

  const initialSnapshotRef = useRef(JSON.stringify(INITIAL_FORM_DATA));
  const isDirty =
    JSON.stringify(formData) !== initialSnapshotRef.current ||
    links.length > 0 ||
    imageFiles.length > 0;

  useUnsavedGuard(isDirty);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Campos requeridos
    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    } else if (formData.titulo.length > 200) {
      newErrors.titulo = "El título no puede exceder 200 caracteres";
    }

    if (!formData.contenido.trim()) {
      newErrors.contenido = "El contenido es requerido";
    }

    if (formData.resumen && formData.resumen.length > 500) {
      newErrors.resumen = "El resumen no puede exceder 500 caracteres";
    }

    if (formData.categoria && formData.categoria.length > 100) {
      newErrors.categoria = "La categoría no puede exceder 100 caracteres";
    }

    // Validar imágenes (máximo 10)
    if (imageFiles.length > 10) {
      newErrors.imagenes = "Máximo 10 imágenes permitidas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en campos de texto
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Manejar selección de imágenes — adaptador: MediaUploadZone entrega File[] ya comprimidos.
  const handleImageFilesSelected = (files: File[]) => {
    if (imageFiles.length + files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Máximo 10 imágenes permitidas",
      }));
      return;
    }

    const newPreviews: FilePreview[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImageFiles((prev) => [...prev, ...newPreviews]);
    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: "" }));
    }
  };

  // Eliminar imagen
  const removeImage = (index: number) => {
    setImageFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Agregar nueva categoría
  const handleAddCategoria = () => {
    if (nuevaCategoria.trim()) {
      setFormData((prev) => ({ ...prev, categoria: nuevaCategoria.trim() }));
      setShowCategoriaInput(false);
      setNuevaCategoria("");
    }
  };

  // Manejar cambios en el formulario de link
  const handleLinkInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentLink((prev) => ({ ...prev, [name]: value }));
  };

  // Agregar link a la lista
  const handleAddLink = () => {
    if (!currentLink.titulo.trim() || !currentLink.url.trim()) {
      showToast({
        title: "Faltan datos del enlace",
        message: "El título y la URL son requeridos.",
        variant: "warn",
      });
      return;
    }

    // Validar URL
    try {
      new URL(currentLink.url);
    } catch {
      showToast({
        title: "URL inválida",
        message: "Por favor ingresá una URL válida (ej: https://ejemplo.com).",
        variant: "warn",
      });
      return;
    }

    const newLink: NovedadLink = {
      titulo: currentLink.titulo.trim(),
      url: currentLink.url.trim(),
      descripcion: currentLink.descripcion.trim() || undefined,
    };

    setLinks((prev) => [...prev, newLink]);
    setCurrentLink({ titulo: "", url: "", descripcion: "" });
    setShowLinkForm(false);
  };

  // Eliminar link
  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  // Enviar formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const novedadData: CreateNovedadDto = {
        titulo: formData.titulo.trim(),
        contenido: formData.contenido.trim(),
        resumen: formData.resumen.trim() || undefined,
        categoria: formData.categoria.trim() || undefined,
        destacada: formData.destacada,
        fechaPublicacion: new Date(formData.fechaPublicacion).toISOString(),
        links: links.length > 0 ? links : undefined,
      };

      const images = imageFiles.map((preview) => preview.file);

      if (images.length > 0) {
        await novedadService.admin.createWithMedia(novedadData, images);
      } else {
        await novedadService.admin.create(novedadData);
      }

      setSuccess(true);

      // Limpiar URLs de objeto
      imageFiles.forEach((preview) => URL.revokeObjectURL(preview.url));

      clearDraft();
      showToast({
        message: "La novedad se creó correctamente.",
        variant: "success",
      });

      // Redirigir después de 1 segundo
      setTimeout(() => {
        router.push("/admin/novedades?created=true");
      }, 1000);
    } catch (err: unknown) {
      console.error("Error creando novedad:", err);
      showToast({
        title: "No se pudo crear la novedad",
        message: mapApiError(err),
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const imagePreviews: MediaPreview[] = imageFiles.map((f, idx) => ({
    id: String(idx),
    url: f.url,
    type: "image",
  }));

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Novedades", href: "/admin/novedades" },
          { label: "Crear novedad" },
        ]}
      />

      {hasDraft ? (
        <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} />
      ) : null}

      <form onSubmit={handleSubmit}>
        <FormShell
          title="Crear novedad"
          description="Publicá una nueva noticia, evento o actualización. Los campos con * son obligatorios."
        >
          <FormSection title="Información básica">
            <Field
              label="Título"
              htmlFor="titulo"
              required
              error={errors.titulo}
              hint={`${formData.titulo.length}/200`}
              className="md:col-span-2"
            >
              <TextInput
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                maxLength={200}
                placeholder="Ej: Nuevo Modelo de Camión Disponible"
                invalid={Boolean(errors.titulo)}
              />
            </Field>

            <Field
              label="Resumen"
              htmlFor="resumen"
              error={errors.resumen}
              hint={
                errors.resumen ? undefined : `${formData.resumen.length}/500 (opcional)`
              }
              className="md:col-span-2"
            >
              <TextareaField
                id="resumen"
                name="resumen"
                value={formData.resumen}
                onChange={handleInputChange}
                maxLength={500}
                rows={3}
                placeholder="Breve resumen de la novedad (opcional)"
                invalid={Boolean(errors.resumen)}
              />
            </Field>

            <Field
              label="Contenido"
              htmlFor="contenido"
              required
              error={errors.contenido}
              hint={errors.contenido ? undefined : `${formData.contenido.length} caracteres`}
              className="md:col-span-2"
            >
              <TextareaField
                id="contenido"
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChange}
                rows={12}
                placeholder="Contenido completo de la novedad..."
                invalid={Boolean(errors.contenido)}
              />
            </Field>
          </FormSection>

          <FormSection title="Categorización y opciones">
            <Field label="Categoría" htmlFor="categoria" error={errors.categoria}>
              {!showCategoriaInput ? (
                <div className="space-y-2">
                  <SelectField
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    {formData.categoria &&
                      !categorias.includes(formData.categoria) && (
                        <option value={formData.categoria}>
                          {formData.categoria} (nueva)
                        </option>
                      )}
                  </SelectField>
                  <button
                    type="button"
                    onClick={() => setShowCategoriaInput(true)}
                    className="text-[16px] font-semibold text-gray-700 transition-colors duration-150 hover:text-gray-900 hover:underline"
                  >
                    + Crear nueva categoría
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <TextInput
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    maxLength={100}
                    placeholder="Nueva categoría"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategoria();
                      }
                    }}
                  />
                  <AdminButton variant="primary" onClick={handleAddCategoria}>
                    Agregar
                  </AdminButton>
                  <AdminButton
                    variant="secondary"
                    icon={X}
                    ariaLabel="Cancelar nueva categoría"
                    onClick={() => {
                      setShowCategoriaInput(false);
                      setNuevaCategoria("");
                    }}
                  >
                    Cancelar
                  </AdminButton>
                </div>
              )}
            </Field>

            <Field label="Fecha de publicación" htmlFor="fechaPublicacion">
              <TextInput
                id="fechaPublicacion"
                name="fechaPublicacion"
                type="date"
                value={formData.fechaPublicacion}
                onChange={handleInputChange}
              />
            </Field>

            <Field
              label="Destacada"
              hint="Aparecerá en la portada principal del sitio."
              className="md:col-span-2"
            >
              <SwitchField
                checked={formData.destacada}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, destacada: checked }))
                }
                label={formData.destacada ? "Marcada como destacada" : "No destacada"}
              />
            </Field>
          </FormSection>

          <FormSection title="Imágenes">
            <div className="col-span-full space-y-2">
              <span className="text-[16px] font-semibold text-gray-800">
                Imágenes ({imageFiles.length}/10)
              </span>
              <MediaUploadZone
                previews={imagePreviews}
                onFilesSelected={handleImageFilesSelected}
                onRemove={(id) => removeImage(Number(id))}
                max={10}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                maxSizeMB={15}
                instruccion="Arrastrá las fotos acá o hacé clic — JPG, PNG o WEBP, máximo 15 MB cada una"
              />
              {errors.imagenes ? (
                <span className="flex items-start gap-1.5 text-[15px] font-medium text-red-600">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                  {errors.imagenes}
                </span>
              ) : null}
            </div>
          </FormSection>

          <FormSection title="Enlaces externos">
            <div className="col-span-full space-y-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-[16px] text-gray-500">
                  Agregá enlaces a formularios, documentos, videos, páginas web, etc.
                </p>
                <AdminButton
                  variant="primary"
                  icon={Plus}
                  onClick={() => setShowLinkForm((v) => !v)}
                >
                  Agregar enlace
                </AdminButton>
              </div>

              {showLinkForm ? (
                <div className="grid gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4 md:grid-cols-2">
                  <Field
                    label="Título del enlace"
                    htmlFor="link-titulo"
                    required
                    hint={`${currentLink.titulo.length}/200`}
                    className="md:col-span-2"
                  >
                    <TextInput
                      id="link-titulo"
                      name="titulo"
                      value={currentLink.titulo}
                      onChange={handleLinkInputChange}
                      maxLength={200}
                      placeholder="Ej: Formulario de Contacto"
                    />
                  </Field>

                  <Field label="URL" htmlFor="link-url" required className="md:col-span-2">
                    <TextInput
                      id="link-url"
                      name="url"
                      type="url"
                      value={currentLink.url}
                      onChange={handleLinkInputChange}
                      placeholder="https://ejemplo.com/formulario"
                    />
                  </Field>

                  <Field
                    label="Descripción (opcional)"
                    htmlFor="link-descripcion"
                    hint={`${currentLink.descripcion.length}/500`}
                    className="md:col-span-2"
                  >
                    <TextareaField
                      id="link-descripcion"
                      name="descripcion"
                      value={currentLink.descripcion}
                      onChange={handleLinkInputChange}
                      maxLength={500}
                      rows={2}
                      placeholder="Descripción breve del enlace..."
                    />
                  </Field>

                  <div className="flex gap-3 md:col-span-2">
                    <AdminButton variant="primary" onClick={handleAddLink}>
                      Agregar
                    </AdminButton>
                    <AdminButton
                      variant="secondary"
                      onClick={() => {
                        setShowLinkForm(false);
                        setCurrentLink({ titulo: "", url: "", descripcion: "" });
                      }}
                    >
                      Cancelar
                    </AdminButton>
                  </div>
                </div>
              ) : null}

              {links.length > 0 ? (
                <div className="space-y-3">
                  {links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 bg-white p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">{link.titulo}</p>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 break-all text-[16px] text-gray-700 hover:text-gray-900 hover:underline"
                        >
                          <ExternalLink className="size-4 shrink-0" strokeWidth={2} aria-hidden />
                          {link.url}
                        </a>
                        {link.descripcion ? (
                          <p className="mt-1 text-[16px] text-gray-500">{link.descripcion}</p>
                        ) : null}
                      </div>
                      <AdminButton
                        variant="danger"
                        icon={X}
                        className="h-10 border border-red-100 bg-red-50 px-4 text-[15px] text-red-600 hover:bg-red-100"
                        onClick={() => removeLink(index)}
                        ariaLabel={`Quitar enlace ${link.titulo}`}
                      >
                        Quitar
                      </AdminButton>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[16px] text-gray-500">
                  No hay enlaces agregados. Los enlaces aparecerán en la novedad para
                  que los usuarios puedan acceder rápidamente.
                </p>
              )}
            </div>
          </FormSection>

          <div className="col-span-full flex justify-end gap-3 border-t border-gray-100 pt-6">
            <AdminButton variant="secondary" href="/admin/novedades">
              Cancelar
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              icon={loading ? Loader2 : Save}
              disabled={loading || success}
              className={loading ? "[&_svg]:animate-spin" : undefined}
            >
              {loading ? "Creando novedad..." : "Crear novedad"}
            </AdminButton>
          </div>
        </FormShell>
      </form>
    </div>
  );
}
