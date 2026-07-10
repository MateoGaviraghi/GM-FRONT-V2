"use client";

import { useRef, useState, useEffect } from "react";
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { Novedad, UpdateNovedadDto, NovedadLink } from "@/types";
import {
  AdminButton,
  Badge,
  Breadcrumb,
  ConfirmDialog,
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

export default function EditarNovedadPage() {
  const router = useRouter();
  const params = useParams();
  const novedadId = params.id as string;
  const { categorias } = useNovedadOptions();
  const { showToast } = useToast();

  // Estados de la novedad existente
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loadingNovedad, setLoadingNovedad] = useState(true);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Estados de archivos
  const [newImageFiles, setNewImageFiles] = useState<FilePreview[]>([]);
  const [deletingImageIds, setDeletingImageIds] = useState<string[]>([]);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

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

  // Borrador (elderly-first: nunca perder una edición a mitad de hacer)
  const { hasDraft, restoreDraft, dismissDraft, clearDraft } =
    useFormDraft<DraftShape>(
      `novedad-editar-${novedadId}`,
      { formData, links },
      (draft) => {
        setFormData(draft.formData ?? INITIAL_FORM_DATA);
        setLinks(draft.links ?? []);
      },
    );

  const initialSnapshotRef = useRef<string>("");
  const isDirty =
    initialSnapshotRef.current !== "" &&
    (JSON.stringify(formData) !== initialSnapshotRef.current ||
      newImageFiles.length > 0);

  useUnsavedGuard(isDirty);

  // Cargar datos de la novedad
  useEffect(() => {
    if (novedadId) {
      cargarNovedad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [novedadId]);

  const cargarNovedad = async () => {
    try {
      setLoadingNovedad(true);
      const data = await novedadService.admin.list({
        includeDeleted: true,
      });

      const novedadEncontrada = data.items.find((n) => n._id === novedadId);

      if (!novedadEncontrada) {
        setErrors({ load: "Novedad no encontrada" });
        return;
      }

      setNovedad(novedadEncontrada);

      const loadedFormData: FormData = {
        titulo: novedadEncontrada.titulo,
        contenido: novedadEncontrada.contenido,
        resumen: novedadEncontrada.resumen || "",
        categoria: novedadEncontrada.categoria || "",
        destacada: novedadEncontrada.destacada,
        fechaPublicacion: new Date(novedadEncontrada.fechaPublicacion)
          .toISOString()
          .split("T")[0],
      };

      setFormData(loadedFormData);
      initialSnapshotRef.current = JSON.stringify(loadedFormData);

      if (novedadEncontrada.links && novedadEncontrada.links.length > 0) {
        setLinks(novedadEncontrada.links);
      }
    } catch (err) {
      console.error("Error cargando novedad:", err);
      setErrors({ load: "Error al cargar la novedad" });
    } finally {
      setLoadingNovedad(false);
    }
  };

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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

    // Validar total de imágenes (existentes + nuevas)
    const totalImages =
      (novedad?.imagenes.length || 0) -
      deletingImageIds.length +
      newImageFiles.length;
    if (totalImages > 10) {
      newErrors.imagenes = "Máximo 10 imágenes permitidas en total";
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Manejar selección de nuevas imágenes — adaptador: MediaUploadZone entrega File[] ya comprimidos.
  const handleImageFilesSelected = (files: File[]) => {
    const totalImages =
      (novedad?.imagenes.length || 0) -
      deletingImageIds.length +
      newImageFiles.length +
      files.length;

    if (totalImages > 10) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Máximo 10 imágenes permitidas en total",
      }));
      return;
    }

    const newPreviews: FilePreview[] = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setNewImageFiles((prev) => [...prev, ...newPreviews]);
    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: "" }));
    }
  };

  // Eliminar nueva imagen (antes de subir)
  const removeNewImage = (index: number) => {
    setNewImageFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Eliminar imagen existente (confirmada vía ConfirmDialog)
  const handleDeleteExistingImage = async (publicId: string) => {
    try {
      setDeletingImageIds((prev) => [...prev, publicId]);
      await novedadService.admin.deleteImage(novedadId, publicId);

      if (novedad) {
        setNovedad({
          ...novedad,
          imagenes: novedad.imagenes.filter(
            (img) => img.public_id !== publicId
          ),
        });
      }

      showToast({ message: "La imagen se eliminó correctamente.", variant: "success" });
      setDeletingImageIds((prev) => prev.filter((id) => id !== publicId));
    } catch (err) {
      console.error("Error eliminando imagen:", err);
      showToast({
        title: "No se pudo eliminar la imagen",
        message: mapApiError(err),
        variant: "danger",
      });
      setDeletingImageIds((prev) => prev.filter((id) => id !== publicId));
    }
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

      const updates: UpdateNovedadDto = {
        titulo: formData.titulo.trim(),
        contenido: formData.contenido.trim(),
        resumen: formData.resumen.trim() || undefined,
        categoria: formData.categoria.trim() || undefined,
        destacada: formData.destacada,
        fechaPublicacion: new Date(formData.fechaPublicacion).toISOString(),
        links: links.length > 0 ? links : undefined,
      };

      const newImages = newImageFiles.map((preview) => preview.file);

      await novedadService.admin.update(novedadId, updates, newImages);

      setSuccess(true);

      newImageFiles.forEach((preview) => URL.revokeObjectURL(preview.url));

      clearDraft();
      showToast({
        message: "Los cambios se guardaron correctamente.",
        variant: "success",
      });

      setTimeout(() => {
        router.push("/admin/novedades?updated=true");
      }, 1000);
    } catch (err: unknown) {
      console.error("Error actualizando novedad:", err);
      showToast({
        title: "No se pudo guardar la novedad",
        message: mapApiError(err),
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Loading inicial
  if (loadingNovedad) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[17px] text-gray-500">
          <Loader2 className="size-6 animate-spin text-gray-400" strokeWidth={2} aria-hidden />
          Cargando novedad...
        </div>
      </div>
    );
  }

  // Error al cargar
  if (errors.load) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md space-y-4 rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-[20px] font-bold text-gray-900">No pudimos cargar la novedad</h2>
          <p className="text-[17px] text-gray-500">{errors.load}</p>
          <AdminButton variant="primary" href="/admin/novedades">
            Volver a novedades
          </AdminButton>
        </div>
      </div>
    );
  }

  if (!novedad) {
    return null;
  }

  const existingPreviews: MediaPreview[] = novedad.imagenes.map((img) => ({
    id: img.public_id,
    url: img.thumbnails?.medium || img.secure_url,
    type: "image",
  }));

  const newPreviews: MediaPreview[] = newImageFiles.map((f, idx) => ({
    id: String(idx),
    url: f.url,
    type: "image",
  }));

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Novedades", href: "/admin/novedades" },
          { label: "Editar novedad" },
        ]}
      />

      {hasDraft ? (
        <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} />
      ) : null}

      {novedad.deleted ? (
        <div className="flex items-center gap-2">
          <Badge variant="danger">Eliminada</Badge>
          <span className="text-[16px] text-gray-500">
            Esta novedad está en la papelera. Podés restaurarla desde la lista de eliminadas.
          </span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <FormShell
          title="Editar novedad"
          description="Modificá la información, las imágenes y los enlaces. Los campos con * son obligatorios."
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

          <FormSection title="Imágenes existentes">
            <div className="col-span-full space-y-2">
              {existingPreviews.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {existingPreviews.map((preview, index) => (
                    <div
                      key={preview.id}
                      className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview.url} alt="" className="size-full object-cover" />
                      <span className="absolute left-1.5 top-1.5 inline-flex items-center rounded-full border border-gray-200 bg-white/95 px-2.5 py-0.5 text-[13px] font-medium text-gray-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <AdminButton
                        variant="danger"
                        icon={deletingImageIds.includes(preview.id) ? Loader2 : Trash2}
                        className={
                          "absolute right-1.5 top-1.5 h-9 border border-red-100 bg-red-50 px-2.5 text-[15px] text-red-600 hover:bg-red-100 " +
                          (deletingImageIds.includes(preview.id) ? "[&_svg]:animate-spin" : "")
                        }
                        disabled={deletingImageIds.includes(preview.id)}
                        onClick={() => setImageToDelete(preview.id)}
                        ariaLabel={`Eliminar imagen ${index + 1}`}
                      >
                        Quitar
                      </AdminButton>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[16px] text-gray-500">Esta novedad no tiene imágenes cargadas.</p>
              )}
            </div>
          </FormSection>

          <FormSection title="Agregar nuevas imágenes">
            <div className="col-span-full space-y-2">
              <span className="text-[16px] font-semibold text-gray-800">
                Nuevas imágenes ({newImageFiles.length})
              </span>
              <MediaUploadZone
                previews={newPreviews}
                onFilesSelected={handleImageFilesSelected}
                onRemove={(id) => removeNewImage(Number(id))}
                max={10}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                maxSizeMB={15}
                instruccion="Arrastrá las fotos acá o hacé clic — JPG, PNG o WEBP, máximo 15 MB cada una (10 en total)"
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
              {loading ? "Guardando cambios..." : "Guardar cambios"}
            </AdminButton>
          </div>
        </FormShell>
      </form>

      <ConfirmDialog
        open={imageToDelete !== null}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => imageToDelete && handleDeleteExistingImage(imageToDelete)}
        title="Eliminar imagen"
        message="¿Eliminar esta imagen? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
