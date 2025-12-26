"use client";

import { useState, useEffect } from "react";
import {
  Newspaper,
  ArrowLeft,
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Star,
  Calendar,
  Tag,
  Trash2,
  Loader,
  Link as LinkIcon,
  ExternalLink,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { novedadService } from "@/services";
import { useNovedadOptions } from "@/hooks";
import type { Novedad, UpdateNovedadDto, NovedadLink } from "@/types";

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

export default function EditarNovedadPage() {
  const router = useRouter();
  const params = useParams();
  const novedadId = params.id as string;
  const { categorias } = useNovedadOptions();

  // Estados de la novedad existente
  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [loadingNovedad, setLoadingNovedad] = useState(true);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    contenido: "",
    resumen: "",
    categoria: "",
    destacada: false,
    fechaPublicacion: new Date().toISOString().split("T")[0],
  });

  // Estados de archivos
  const [newImageFiles, setNewImageFiles] = useState<FilePreview[]>([]);
  const [deletingImageIds, setDeletingImageIds] = useState<string[]>([]);

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

      // Llenar formulario con datos existentes
      setFormData({
        titulo: novedadEncontrada.titulo,
        contenido: novedadEncontrada.contenido,
        resumen: novedadEncontrada.resumen || "",
        categoria: novedadEncontrada.categoria || "",
        destacada: novedadEncontrada.destacada,
        fechaPublicacion: new Date(novedadEncontrada.fechaPublicacion)
          .toISOString()
          .split("T")[0],
      });

      // Cargar links existentes
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

  // Manejar cambios en checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Manejar selección de nuevas imágenes
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const totalImages =
      (novedad?.imagenes.length || 0) -
      deletingImageIds.length +
      newImageFiles.length +
      files.length;

    if (totalImages > 10) {
      alert("Máximo 10 imágenes permitidas en total");
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

  // Eliminar imagen existente
  const handleDeleteExistingImage = async (publicId: string) => {
    if (!confirm("¿Eliminar esta imagen permanentemente?")) {
      return;
    }

    try {
      setDeletingImageIds((prev) => [...prev, publicId]);
      await novedadService.admin.deleteImage(novedadId, publicId);

      // Actualizar estado local
      if (novedad) {
        setNovedad({
          ...novedad,
          imagenes: novedad.imagenes.filter(
            (img) => img.public_id !== publicId
          ),
        });
      }

      setDeletingImageIds((prev) => prev.filter((id) => id !== publicId));
    } catch (err) {
      console.error("Error eliminando imagen:", err);
      alert("Error al eliminar la imagen");
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
      alert("El título y la URL son requeridos");
      return;
    }

    // Validar URL
    try {
      new URL(currentLink.url);
    } catch {
      alert("Por favor ingresa una URL válida");
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
        links: links.length > 0 ? links : undefined, // ← NUEVO: Incluir links
      };

      const newImages = newImageFiles.map((preview) => preview.file);

      await novedadService.admin.update(novedadId, updates, newImages);

      setSuccess(true);

      // Limpiar URLs de objeto
      newImageFiles.forEach((preview) => URL.revokeObjectURL(preview.url));

      // Redirigir después de 1 segundo
      setTimeout(() => {
        router.push("/admin/novedades?updated=true");
      }, 1000);
    } catch (err: unknown) {
      console.error("Error actualizando novedad:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar la novedad";
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Loading inicial
  if (loadingNovedad) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando novedad...</p>
        </div>
      </div>
    );
  }

  // Error al cargar
  if (errors.load) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{errors.load}</p>
          <Link
            href="/admin/novedades"
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!novedad) {
    return null;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/novedades"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Newspaper className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Editar Novedad
              </h1>
              <p className="text-gray-600 mt-1">
                Modifica la información y las imágenes
              </p>
            </div>
          </div>

          {/* Badge de estado */}
          {novedad.deleted && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded">
              <Trash2 className="h-4 w-4" />
              Eliminada
            </span>
          )}
        </div>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-green-800 font-medium">
              ¡Novedad actualizada exitosamente!
            </h4>
            <p className="text-green-700 text-sm mt-1">
              Redirigiendo al dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Error general */}
      {errors.submit && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Información Básica
          </h2>

          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                maxLength={200}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.titulo ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ej: Nuevo Modelo de Camión Disponible"
              />
              <div className="flex justify-between mt-1">
                {errors.titulo && (
                  <p className="text-red-500 text-sm">{errors.titulo}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.titulo.length}/200
                </p>
              </div>
            </div>

            {/* Resumen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resumen
              </label>
              <textarea
                name="resumen"
                value={formData.resumen}
                onChange={handleInputChange}
                maxLength={500}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                  errors.resumen ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Breve resumen de la novedad (opcional)"
              />
              <div className="flex justify-between mt-1">
                {errors.resumen && (
                  <p className="text-red-500 text-sm">{errors.resumen}</p>
                )}
                <p className="text-gray-500 text-sm ml-auto">
                  {formData.resumen.length}/500
                </p>
              </div>
            </div>

            {/* Contenido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenido <span className="text-red-500">*</span>
              </label>
              <textarea
                name="contenido"
                value={formData.contenido}
                onChange={handleInputChange}
                rows={12}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm ${
                  errors.contenido ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Contenido completo de la novedad..."
              />
              {errors.contenido && (
                <p className="text-red-500 text-sm mt-1">{errors.contenido}</p>
              )}
              <p className="text-gray-500 text-sm mt-1">
                {formData.contenido.length} caracteres
              </p>
            </div>
          </div>
        </div>

        {/* Categorización y Opciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categorización y Opciones
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              {!showCategoriaInput ? (
                <div className="space-y-2">
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowCategoriaInput(true)}
                    className="text-sm text-cyan-600 hover:text-cyan-700"
                  >
                    + Crear nueva categoría
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    maxLength={100}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Nueva categoría"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCategoria();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategoria}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoriaInput(false);
                      setNuevaCategoria("");
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Fecha de Publicación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Publicación
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  name="fechaPublicacion"
                  value={formData.fechaPublicacion}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Destacada */}
            <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg">
              <input
                type="checkbox"
                id="destacada"
                name="destacada"
                checked={formData.destacada}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label
                htmlFor="destacada"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Marcar como destacada
                  </p>
                  <p className="text-xs text-gray-500">
                    Aparecerá en la portada principal
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Imágenes Existentes */}
        {novedad.imagenes && novedad.imagenes.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Imágenes Existentes ({novedad.imagenes.length})
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {novedad.imagenes.map((imagen, index) => (
                <div key={imagen.public_id} className="relative group">
                  <Image
                    src={imagen.thumbnails?.medium || imagen.secure_url}
                    alt={`Imagen ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(imagen.public_id)}
                    disabled={deletingImageIds.includes(imagen.public_id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                  >
                    {deletingImageIds.includes(imagen.public_id) ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    Imagen {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nuevas Imágenes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Agregar Nuevas Imágenes
          </h2>

          <div className="mb-4">
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium mb-1">
                  Click para seleccionar imágenes
                </p>
                <p className="text-gray-500 text-sm">
                  PNG, JPG, WEBP (máximo 10 imágenes en total)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
            {errors.imagenes && (
              <p className="text-red-500 text-sm mt-2">{errors.imagenes}</p>
            )}
          </div>

          {newImageFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newImageFiles.map((preview, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={preview.url}
                    alt={`Nueva imagen ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                    Nueva {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {newImageFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No hay nuevas imágenes para agregar</p>
            </div>
          )}
        </div>

        {/* Enlaces/Links Externos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Enlaces Externos
            </h2>
            <button
              type="button"
              onClick={() => setShowLinkForm(!showLinkForm)}
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Agregar Enlace
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Agrega enlaces a formularios, documentos, videos, páginas web, etc.
          </p>

          {/* Formulario para agregar link */}
          {showLinkForm && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="font-medium text-gray-800 mb-3">Nuevo Enlace</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título del Enlace <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={currentLink.titulo}
                    onChange={handleLinkInputChange}
                    maxLength={200}
                    placeholder="Ej: Formulario de Contacto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {currentLink.titulo.length}/200
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={currentLink.url}
                    onChange={handleLinkInputChange}
                    placeholder="https://ejemplo.com/formulario"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    name="descripcion"
                    value={currentLink.descripcion}
                    onChange={handleLinkInputChange}
                    maxLength={500}
                    rows={2}
                    placeholder="Descripción breve del enlace..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    {currentLink.descripcion.length}/500
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddLink}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLinkForm(false);
                      setCurrentLink({ titulo: "", url: "", descripcion: "" });
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Lista de links agregados */}
          {links.length > 0 ? (
            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-cyan-300 transition-colors"
                >
                  <ExternalLink className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800">{link.titulo}</h4>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-600 hover:text-cyan-700 text-sm break-all"
                    >
                      {link.url}
                    </a>
                    {link.descripcion && (
                      <p className="text-gray-600 text-sm mt-1">
                        {link.descripcion}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <LinkIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <p>No hay enlaces agregados</p>
              <p className="text-sm mt-1">
                Los enlaces aparecerán en la novedad para que los usuarios
                puedan acceder rápidamente
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Link
            href="/admin/novedades"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading || success}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Actualizando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
