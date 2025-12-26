"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Car,
  ArrowLeft,
  Upload,
  X,
  Save,
  Eye,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Video,
  RefreshCw,
  Trash2,
  Plus,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { vehiculoService } from "@/services";
import { EstadoVehiculo, Vehiculo0km, MediaFile } from "@/types";
import { SmartAutocomplete } from "@/components/dynamic-autocomplete";

interface FormData {
  titulo: string;
  tipos: string;
  variantes: string;
  marca: string;
  modelo: string;
  kilometraje: string;
  tipoCombustible: string;
  motor: string;
  anio: string;
  transmisiones: string;
  tracciones: string;
  potenciaMaxima: string;
  capacidadCarga: string;
  sistemaFrenado: string;
  ejes: string;
  estado: EstadoVehiculo;
  descripcion: string;
}

interface FilePreview {
  file: File;
  url: string;
  type: "image" | "video";
}

interface FormErrors {
  [key: string]: string;
}

export default function EditarVehiculo() {
  const params = useParams();
  const router = useRouter();
  const vehiculoId = params?.id as string;

  // Estados principales
  const [vehiculo, setVehiculo] = useState<Vehiculo0km | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    tipos: "",
    variantes: "",
    marca: "",
    modelo: "",
    kilometraje: "0",
    tipoCombustible: "",
    motor: "",
    anio: new Date().getFullYear().toString(),
    transmisiones: "",
    tracciones: "",
    potenciaMaxima: "",
    capacidadCarga: "",
    sistemaFrenado: "",
    ejes: "",
    estado: "Disponible",
    descripcion: "",
  });

  // Estados de archivos
  const [existingImages, setExistingImages] = useState<MediaFile[]>([]);
  const [existingVideos, setExistingVideos] = useState<MediaFile[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<FilePreview[]>([]);
  const [newVideoFiles, setNewVideoFiles] = useState<FilePreview[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videosToDelete, setVideosToDelete] = useState<string[]>([]);

  // Estados de validación
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showStatusChangeConfirm, setShowStatusChangeConfirm] = useState<{
    show: boolean;
    newStatus: EstadoVehiculo;
  }>({ show: false, newStatus: "Disponible" });

  const loadVehiculo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await vehiculoService.getVehiculoById(vehiculoId);

      setVehiculo(data);
      setExistingImages(data.imagenes || []);
      setExistingVideos(data.videos || []);

      // Pre-poblar formulario
      setFormData({
        titulo: data.titulo || "",
        tipos: data.tipos || "",
        variantes: data.variantes || "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        kilometraje: data.kilometraje?.toString() || "0",
        tipoCombustible: data.tipoCombustible || "",
        motor: data.motor || "",
        anio: data.anio
          ? new Date(data.anio).getFullYear().toString()
          : new Date().getFullYear().toString(),
        transmisiones: data.transmisiones || "",
        tracciones: data.tracciones || "",
        potenciaMaxima: data.potenciaMaxima || "",
        capacidadCarga: data.capacidadCarga || "",
        sistemaFrenado: data.sistemaFrenado || "",
        ejes: data.ejes || "",
        estado: data.estado,
        descripcion: data.descripcion || "",
      });
    } catch (err) {
      console.error("Error cargando vehículo:", err);
      setError("Error al cargar los datos del vehículo");
    } finally {
      setLoading(false);
    }
  }, [vehiculoId]);

  // Cargar datos del vehículo
  useEffect(() => {
    if (vehiculoId) {
      loadVehiculo();
    }
  }, [vehiculoId, loadVehiculo]);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validar kilometraje solo si se proporciona
    if (formData.kilometraje && formData.kilometraje.trim()) {
      const km = parseFloat(formData.kilometraje);
      if (isNaN(km) || km < 0) {
        newErrors.kilometraje =
          "El kilometraje debe ser un número válido mayor o igual a 0";
      }
    }

    // Validar año (opcional)
    if (formData.anio.trim()) {
      const currentYear = new Date().getFullYear();
      const year = parseInt(formData.anio);
      if (isNaN(year) || year < 2020 || year > currentYear + 1) {
        newErrors.anio = `El año debe estar entre 2020 y ${currentYear + 1}`;
      }
    }

    // Validar límites de archivos
    const totalImages =
      existingImages.filter((img) => !imagesToDelete.includes(img.public_id))
        .length + newImageFiles.length;
    const totalVideos =
      existingVideos.filter((vid) => !videosToDelete.includes(vid.public_id))
        .length + newVideoFiles.length;

    if (totalImages > 10) {
      newErrors.imagenes =
        "Máximo 10 imágenes permitidas (incluyendo existentes)";
    }
    if (totalVideos > 5) {
      newErrors.videos = "Máximo 5 videos permitidos (incluyendo existentes)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    // Detectar cambio de estado crítico
    if (
      field === "estado" &&
      value === "Vendido" &&
      formData.estado !== "Vendido"
    ) {
      setShowStatusChangeConfirm({
        show: true,
        newStatus: value as EstadoVehiculo,
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Auto-actualizar título si está vacío o coincide con el patrón anterior
    if (
      (field === "marca" || field === "modelo" || field === "variantes") &&
      (!formData.titulo ||
        formData.titulo ===
          `${formData.marca} ${formData.modelo} ${formData.variantes} ${formData.anio}`.trim())
    ) {
      const newTitulo = [
        field === "marca" ? value : formData.marca,
        field === "modelo" ? value : formData.modelo,
        field === "variantes" ? value : formData.variantes,
        formData.anio,
      ]
        .filter(Boolean)
        .join(" ");

      setFormData((prev) => ({
        ...prev,
        [field]: value,
        titulo: newTitulo,
      }));
    }
  };

  // Confirmar cambio de estado a Vendido
  const confirmStatusChange = () => {
    setFormData((prev) => ({
      ...prev,
      estado: showStatusChangeConfirm.newStatus,
    }));
    setShowStatusChangeConfirm({ show: false, newStatus: "Disponible" });
  };

  // Validar archivos nuevos
  const validateFile = (file: File, type: "image" | "video"): string | null => {
    const maxSizes = {
      image: 20 * 1024 * 1024, // 20MB (actualizado para Cloudinary)
      video: 50 * 1024 * 1024, // 50MB
    };

    const allowedFormats = {
      image: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      video: ["video/mp4", "video/mov", "video/avi"],
    };

    if (file.size > maxSizes[type]) {
      return `El archivo excede el tamaño máximo de ${
        type === "image" ? "20MB" : "50MB"
      }`;
    }

    if (!allowedFormats[type].includes(file.type)) {
      return `Formato no permitido. Use: ${allowedFormats[type].join(", ")}`;
    }

    return null;
  };

  // Agregar nuevas imágenes
  const handleNewImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentTotal = existingImages.filter(
      (img) => !imagesToDelete.includes(img.public_id)
    ).length;

    if (currentTotal + newImageFiles.length + files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Máximo 10 imágenes permitidas",
      }));
      return;
    }

    const validFiles: FilePreview[] = [];

    files.forEach((file) => {
      const error = validateFile(file, "image");
      if (error) {
        setErrors((prev) => ({
          ...prev,
          imagenes: error,
        }));
        return;
      }

      validFiles.push({
        file,
        url: URL.createObjectURL(file),
        type: "image",
      });
    });

    setNewImageFiles((prev) => [...prev, ...validFiles]);
  };

  // Marcar imagen existente para eliminar
  const markImageForDeletion = (publicId: string) => {
    setImagesToDelete((prev) => [...prev, publicId]);
  };

  // Restaurar imagen marcada para eliminar
  const restoreImage = (publicId: string) => {
    setImagesToDelete((prev) => prev.filter((id) => id !== publicId));
  };

  // Agregar nuevos videos
  const handleNewVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentTotal = existingVideos.filter(
      (vid) => !videosToDelete.includes(vid.public_id)
    ).length;

    if (currentTotal + newVideoFiles.length + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        videos: "Máximo 5 videos permitidos",
      }));
      return;
    }

    const validFiles: FilePreview[] = [];

    files.forEach((file) => {
      const error = validateFile(file, "video");
      if (error) {
        setErrors((prev) => ({
          ...prev,
          videos: error,
        }));
        return;
      }

      validFiles.push({
        file,
        url: URL.createObjectURL(file),
        type: "video",
      });
    });

    setNewVideoFiles((prev) => [...prev, ...validFiles]);
  };

  // Marcar video existente para eliminar
  const markVideoForDeletion = (publicId: string) => {
    setVideosToDelete((prev) => [...prev, publicId]);
  };

  // Restaurar video marcado para eliminar
  const restoreVideo = (publicId: string) => {
    setVideosToDelete((prev) => prev.filter((id) => id !== publicId));
  };

  // Eliminar archivo nuevo (imagen o video)
  const removeNewFile = (index: number, type: "image" | "video") => {
    if (type === "image") {
      const newFiles = [...newImageFiles];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      setNewImageFiles(newFiles);
    } else {
      const newFiles = [...newVideoFiles];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      setNewVideoFiles(newFiles);
    }
  };

  // Enviar actualización
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Actualizar información básica
      const updateData = {
        ...formData,
        anio: new Date(`${formData.anio}-01-01`),
        kilometraje: parseFloat(formData.kilometraje),
      };

      await vehiculoService.updateVehiculo(vehiculoId, updateData);

      // Si hay nuevos archivos multimedia, usar el endpoint con media
      if (newImageFiles.length > 0 || newVideoFiles.length > 0) {
        const formDataWithMedia = new FormData();

        // Agregar nuevas imágenes
        newImageFiles.forEach((filePreview) => {
          formDataWithMedia.append("imagenes", filePreview.file);
        });

        // Agregar nuevos videos
        newVideoFiles.forEach((filePreview) => {
          formDataWithMedia.append("videos", filePreview.file);
        });

        // Usar endpoint de actualización con media (necesitaríamos implementarlo en el servicio)
        // await vehiculoService.updateVehiculoMedia(vehiculoId, formDataWithMedia);
      }

      // Eliminar archivos marcados para eliminación
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const imageId of imagesToDelete) {
        // await vehiculoService.deleteVehiculoImage(vehiculoId, imageId);
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const videoId of videosToDelete) {
        // await vehiculoService.deleteVehiculoVideo(vehiculoId, videoId);
      }

      // Limpiar URLs de objetos
      newImageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      newVideoFiles.forEach((file) => URL.revokeObjectURL(file.url)); // Redirigir con mensaje de éxito
      router.push("/admin/vehiculos?updated=true");
    } catch (error) {
      console.error("Error actualizando vehículo:", error);
      setErrors({
        submit:
          "Error al actualizar el vehículo. Por favor, inténtelo nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Eliminar vehículo completamente
  const handleDelete = async () => {
    try {
      await vehiculoService.deleteVehiculo(vehiculoId);
      router.push("/admin/vehiculos?deleted=true");
    } catch (error) {
      console.error("Error eliminando vehículo:", error);
      setError("Error al eliminar el vehículo");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
            <p className="text-gray-600">Cargando datos del vehículo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-red-800 font-medium mb-2">
            Error cargando vehículo
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={loadVehiculo}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Reintentar
            </button>
            <Link
              href="/admin/vehiculos"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-yellow-800 font-medium mb-2">
            Vehículo no encontrado
          </h3>
          <p className="text-yellow-700 mb-4">
            El vehículo con ID {vehiculoId} no existe o no tienes permisos para
            editarlo.
          </p>
          <Link
            href="/admin/vehiculos"
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vehiculos/lista-avanzada"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Car className="h-6 w-6 text-cyan-600" />
            Editar Vehículo
          </h1>
          <p className="text-gray-600 mt-1">
            {vehiculo.titulo || `${vehiculo.marca} ${vehiculo.modelo}`} • ID:{" "}
            {vehiculoId}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {preview ? "Editar" : "Vista Previa"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      </div>

      {/* Errores globales */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">
              Error al actualizar vehículo
            </h4>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      {preview ? (
        /* Vista Previa - Similar al componente de creación pero con datos actuales */
        <PreviewEditComponent
          vehiculo={vehiculo}
          formData={formData}
          existingImages={existingImages.filter(
            (img) => !imagesToDelete.includes(img.public_id)
          )}
          existingVideos={existingVideos.filter(
            (vid) => !videosToDelete.includes(vid.public_id)
          )}
          newImageFiles={newImageFiles}
          newVideoFiles={newVideoFiles}
          onEdit={() => setPreview(false)}
          onSubmit={handleSubmit}
          loading={saving}
        />
      ) : (
        /* Formulario de Edición */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica - Similar al formulario de creación pero pre-poblado */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Car className="h-5 w-5 text-cyan-600" />
              Información Básica del Vehículo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Título */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Vehículo
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange("titulo", e.target.value)}
                  placeholder="Ej: Toyota Corolla Cross XEI CVT 2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Marca */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <SmartAutocomplete
                  id="marca"
                  name="marca"
                  field="marcas"
                  value={formData.marca}
                  onChange={(value: string) => {
                    handleInputChange("marca", value);
                    // Limpiar modelo cuando cambia la marca
                    handleInputChange("modelo", "");
                  }}
                  placeholder="Escribir o seleccionar marca..."
                  className={`px-4 py-3 ${
                    errors.marca
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  allowCustom={true}
                  isAdmin={true}
                />
                {errors.marca && (
                  <p className="text-red-600 text-sm mt-1">{errors.marca}</p>
                )}
              </div>

              {/* Modelo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo
                </label>
                <SmartAutocomplete
                  id="modelo"
                  name="modelo"
                  field="modelos"
                  marca={formData.marca}
                  value={formData.modelo}
                  onChange={(value: string) =>
                    handleInputChange("modelo", value)
                  }
                  placeholder="Escribir o seleccionar modelo..."
                  className={`px-4 py-3 ${
                    errors.modelo
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  allowCustom={true}
                  isAdmin={true}
                />
                {errors.modelo && (
                  <p className="text-red-600 text-sm mt-1">{errors.modelo}</p>
                )}
              </div>

              {/* Tipo de Vehículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Vehículo
                </label>
                <SmartAutocomplete
                  id="tipos"
                  name="tipos"
                  field="tipos"
                  value={formData.tipos}
                  onChange={(value: string) =>
                    handleInputChange("tipos", value)
                  }
                  placeholder="Escribir o seleccionar tipo de vehículo..."
                  className={`px-4 py-3 ${
                    errors.tipos
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  allowCustom={true}
                  isAdmin={true}
                />
                {errors.tipos && (
                  <p className="text-red-600 text-sm mt-1">{errors.tipos}</p>
                )}
              </div>

              {/* Variante */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variante
                </label>
                <input
                  type="text"
                  value={formData.variantes}
                  onChange={(e) =>
                    handleInputChange("variantes", e.target.value)
                  }
                  placeholder="Ej: XEI, SE, Limited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año
                </label>
                <input
                  type="number"
                  min="2020"
                  max={new Date().getFullYear() + 1}
                  value={formData.anio}
                  onChange={(e) => handleInputChange("anio", e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.anio ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.anio && (
                  <p className="text-red-600 text-sm mt-1">{errors.anio}</p>
                )}
              </div>

              {/* Kilometraje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraje (km)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.kilometraje}
                  onChange={(e) =>
                    handleInputChange("kilometraje", e.target.value)
                  }
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.kilometraje
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.kilometraje && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.kilometraje}
                  </p>
                )}
              </div>

              {/* Combustible */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Combustible
                </label>
                <SmartAutocomplete
                  id="tipoCombustible"
                  name="tipoCombustible"
                  field="combustibles"
                  value={formData.tipoCombustible}
                  onChange={(value: string) =>
                    handleInputChange("tipoCombustible", value)
                  }
                  placeholder="Escribir o seleccionar combustible..."
                  className={`px-4 py-3 ${
                    errors.tipoCombustible
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  allowCustom={true}
                  isAdmin={true}
                />
                {errors.tipoCombustible && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.tipoCombustible}
                  </p>
                )}
              </div>

              {/* Transmisión */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmisión
                </label>
                <SmartAutocomplete
                  id="transmisiones"
                  name="transmisiones"
                  field="transmisiones"
                  value={formData.transmisiones}
                  onChange={(value: string) =>
                    handleInputChange("transmisiones", value)
                  }
                  placeholder="Escribir o seleccionar transmisión..."
                  className={`px-4 py-3 ${
                    errors.transmisiones
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  allowCustom={true}
                  isAdmin={true}
                />
                {errors.transmisiones && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.transmisiones}
                  </p>
                )}
              </div>

              {/* Tracción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracción
                </label>
                <SmartAutocomplete
                  id="tracciones"
                  name="tracciones"
                  field="tracciones"
                  value={formData.tracciones}
                  onChange={(value: string) =>
                    handleInputChange("tracciones", value)
                  }
                  placeholder="Escribir o seleccionar tracción..."
                  className="px-4 py-3 border-gray-300"
                  allowCustom={true}
                  isAdmin={true}
                />
              </div>

              {/* Motor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motor
                </label>
                <input
                  type="text"
                  value={formData.motor}
                  onChange={(e) => handleInputChange("motor", e.target.value)}
                  placeholder="Ej: 2.0L, 1.8L Híbrido"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Potencia Máxima */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potencia Máxima
                </label>
                <input
                  type="text"
                  value={formData.potenciaMaxima}
                  onChange={(e) =>
                    handleInputChange("potenciaMaxima", e.target.value)
                  }
                  placeholder="Ej: 150 HP, 200 CV"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Capacidad de Carga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad de Carga
                </label>
                <input
                  type="text"
                  value={formData.capacidadCarga}
                  onChange={(e) =>
                    handleInputChange("capacidadCarga", e.target.value)
                  }
                  placeholder="Ej: 1500 kg, 5 pasajeros"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Sistema de Frenado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistema de Frenado
                </label>
                <input
                  type="text"
                  value={formData.sistemaFrenado}
                  onChange={(e) =>
                    handleInputChange("sistemaFrenado", e.target.value)
                  }
                  placeholder="Ej: Frenos a disco"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Ejes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ejes
                </label>
                <input
                  type="text"
                  value={formData.ejes}
                  onChange={(e) => handleInputChange("ejes", e.target.value)}
                  placeholder="Ej: 2 ejes, 3 ejes"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Vehículo
                </label>
                <SmartAutocomplete
                  id="estado"
                  name="estado"
                  field="estados"
                  value={formData.estado}
                  onChange={(value: string) =>
                    handleInputChange("estado", value)
                  }
                  placeholder="Escribir o seleccionar estado..."
                  className={`px-4 py-3 ${
                    errors.estado
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  allowCustom={true}
                  isAdmin={true}
                />
                {errors.estado && (
                  <p className="text-red-600 text-sm mt-1">{errors.estado}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  value={formData.descripcion}
                  onChange={(e) =>
                    handleInputChange("descripcion", e.target.value)
                  }
                  placeholder="Descripción detallada del vehículo, características especiales, equipamiento..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-vertical"
                />
              </div>
            </div>
          </div>

          {/* Gestión de Archivos Multimedia */}
          <MediaManagementSection
            existingImages={existingImages}
            existingVideos={existingVideos}
            imagesToDelete={imagesToDelete}
            videosToDelete={videosToDelete}
            newImageFiles={newImageFiles}
            newVideoFiles={newVideoFiles}
            onNewImageUpload={handleNewImageUpload}
            onNewVideoUpload={handleNewVideoUpload}
            onMarkImageForDeletion={markImageForDeletion}
            onMarkVideoForDeletion={markVideoForDeletion}
            onRestoreImage={restoreImage}
            onRestoreVideo={restoreVideo}
            onRemoveNewFile={removeNewFile}
            errors={errors}
          />

          {/* Botones de Acción */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                href="/admin/vehiculos/lista-avanzada"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Guardando Cambios...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Modal de confirmación de cambio de estado */}
      {showStatusChangeConfirm.show && (
        <ConfirmStatusChangeModal
          currentStatus={formData.estado}
          newStatus={showStatusChangeConfirm.newStatus}
          onConfirm={confirmStatusChange}
          onCancel={() =>
            setShowStatusChangeConfirm({ show: false, newStatus: "Disponible" })
          }
        />
      )}
    </div>
  );
}

// Componente para gestión de imágenes
function MediaManagementSection({
  existingImages,
  existingVideos,
  imagesToDelete,
  videosToDelete,
  newImageFiles,
  newVideoFiles,
  onNewImageUpload,
  onNewVideoUpload,
  onMarkImageForDeletion,
  onMarkVideoForDeletion,
  onRestoreImage,
  onRestoreVideo,
  onRemoveNewFile,
  errors,
}: {
  existingImages: MediaFile[];
  existingVideos: MediaFile[];
  imagesToDelete: string[];
  videosToDelete: string[];
  newImageFiles: FilePreview[];
  newVideoFiles: FilePreview[];
  onNewImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNewVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onMarkImageForDeletion: (publicId: string) => void;
  onMarkVideoForDeletion: (publicId: string) => void;
  onRestoreImage: (publicId: string) => void;
  onRestoreVideo: (publicId: string) => void;
  onRemoveNewFile: (index: number, type: "image" | "video") => void;
  errors: FormErrors;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="h-5 w-5 text-cyan-600" />
        Gestión de Imágenes y Videos
      </h2>

      <div className="space-y-8">
        {/* Imágenes Existentes */}
        {existingImages.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Imágenes Actuales (
              {
                existingImages.filter(
                  (img) => !imagesToDelete.includes(img.public_id)
                ).length
              }
              )
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImages.map((image) => (
                <div
                  key={image.public_id}
                  className={`relative group ${
                    imagesToDelete.includes(image.public_id) ? "opacity-50" : ""
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.thumbnails?.medium || image.secure_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      type="button"
                      onClick={() => window.open(image.secure_url, "_blank")}
                      className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      title="Ver en tamaño completo"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>

                    {imagesToDelete.includes(image.public_id) ? (
                      <button
                        type="button"
                        onClick={() => onRestoreImage(image.public_id)}
                        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                        title="Restaurar imagen"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onMarkImageForDeletion(image.public_id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Marcar para eliminar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {imagesToDelete.includes(image.public_id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <span className="text-white text-sm font-medium">
                        Se eliminará
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload de Nuevas Imágenes */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Agregar Nuevas Imágenes
          </h3>

          <div className="relative">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                errors.imagenes
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
              }`}
              onClick={() =>
                document.getElementById("new-image-upload")?.click()
              }
            >
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">
                Haz clic para agregar más imágenes
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, WEBP hasta 5MB cada una
              </p>
            </div>
            <input
              id="new-image-upload"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onNewImageUpload}
              className="hidden"
            />
          </div>

          {/* Preview de Nuevas Imágenes */}
          {newImageFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newImageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={`Nueva imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveNewFile(index, "image")}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    Nuevo
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Videos Existentes */}
        {existingVideos.length > 0 && (
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-4">
              Videos Actuales (
              {
                existingVideos.filter(
                  (vid) => !videosToDelete.includes(vid.public_id)
                ).length
              }
              )
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingVideos.map((video) => (
                <div
                  key={video.public_id}
                  className={`relative group ${
                    videosToDelete.includes(video.public_id) ? "opacity-50" : ""
                  }`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={video.secure_url}
                      className="w-full h-full object-cover"
                      controls={false}
                      muted
                      playsInline
                    />
                  </div>

                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      type="button"
                      onClick={() => window.open(video.secure_url, "_blank")}
                      className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                      title="Ver video completo"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </button>

                    {videosToDelete.includes(video.public_id) ? (
                      <button
                        type="button"
                        onClick={() => onRestoreVideo(video.public_id)}
                        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
                        title="Restaurar video"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onMarkVideoForDeletion(video.public_id)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        title="Marcar para eliminar"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {videosToDelete.includes(video.public_id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <span className="text-white text-sm font-medium">
                        Se eliminará
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload de Nuevos Videos */}
        <div>
          <h3 className="text-md font-medium text-gray-700 mb-4">
            Agregar Nuevos Videos
          </h3>

          <div className="relative">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                errors.videos
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
              }`}
              onClick={() =>
                document.getElementById("new-video-upload")?.click()
              }
            >
              <Video className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">
                Haz clic para agregar más videos
              </p>
              <p className="text-xs text-gray-500">
                MP4, MOV, AVI hasta 50MB cada uno
              </p>
            </div>
            <input
              id="new-video-upload"
              type="file"
              multiple
              accept="video/mp4,video/mov,video/avi"
              onChange={onNewVideoUpload}
              className="hidden"
            />
          </div>

          {errors.videos && (
            <p className="text-red-600 text-sm mt-2">{errors.videos}</p>
          )}

          {/* Preview de Nuevos Videos */}
          {newVideoFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {newVideoFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      controls={false}
                      muted
                      playsInline
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveNewFile(index, "video")}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                    Nuevo
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de vista previa
function PreviewEditComponent({
  vehiculo,
  formData,
  existingImages,
  existingVideos,
  newImageFiles,
  newVideoFiles,
  onEdit,
  onSubmit,
  loading,
}: {
  vehiculo: Vehiculo0km;
  formData: FormData;
  existingImages: MediaFile[];
  existingVideos: MediaFile[];
  newImageFiles: FilePreview[];
  newVideoFiles: FilePreview[];
  onEdit: () => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
}) {
  const allImages = [
    ...existingImages,
    ...newImageFiles.map((f) => ({
      public_id: `new-${Date.now()}`,
      secure_url: f.url,
      width: 800,
      height: 600,
      format: "jpg",
      bytes: f.file.size,
      thumbnails: { medium: f.url, small: f.url, large: f.url },
    })),
  ];

  const allVideos = [
    ...existingVideos,
    ...newVideoFiles.map((f) => ({
      public_id: `new-video-${Date.now()}`,
      secure_url: f.url,
      width: 1280,
      height: 720,
      format: "mp4",
      bytes: f.file.size,
      duration: 30, // Placeholder duration
      thumbnail: f.url, // Use same URL as placeholder thumbnail
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header de Preview */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="h-6 w-6 text-cyan-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Vista Previa de Cambios
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Revisa las modificaciones antes de guardar los cambios
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Continuar Editando
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Confirmar Cambios
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vista del vehículo actualizado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Similar al preview del formulario de creación pero mostrando cambios */}
        {allImages.length > 0 && (
          <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={allImages[0].thumbnails?.medium || allImages[0].secure_url}
              alt={formData.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full border ${
                  formData.estado === "Disponible"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : formData.estado === "Reservado"
                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                    : "bg-red-100 text-red-800 border-red-200"
                }`}
              >
                {formData.estado}
              </span>
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {allImages.length}
              </span>
              {allVideos.length > 0 && (
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  {allVideos.length}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {formData.titulo ||
              `${formData.marca} ${formData.modelo} ${formData.variantes} ${formData.anio}`}
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            {formData.marca} • {formData.tipos} • {formData.anio}
          </p>

          {/* Mostrar cambios específicos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h3 className="text-blue-800 font-medium mb-2">
              📝 Resumen de Cambios:
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              {formData.titulo !== vehiculo.titulo && (
                <li>• Título actualizado</li>
              )}
              {formData.estado !== vehiculo.estado && (
                <li>
                  • Estado cambiado de &quot;{vehiculo.estado}&quot; a &quot;
                  {formData.estado}&quot;
                </li>
              )}
              {newImageFiles.length > 0 && (
                <li>
                  • {newImageFiles.length} nueva(s) imagen(es) agregada(s)
                </li>
              )}
              {newVideoFiles.length > 0 && (
                <li>• {newVideoFiles.length} nuevo(s) video(s) agregado(s)</li>
              )}
            </ul>
          </div>

          {/* Información técnica actualizada */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Kilometraje</p>
              <p className="font-medium text-gray-800">
                {formData.kilometraje} km
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Combustible</p>
              <p className="font-medium text-gray-800">
                {formData.tipoCombustible}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Transmisión</p>
              <p className="font-medium text-gray-800">
                {formData.transmisiones}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Tracción</p>
              <p className="font-medium text-gray-800">
                {formData.tracciones || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Modal de confirmación de eliminación
function ConfirmDeleteModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Eliminar Vehículo
          </h3>
        </div>

        <p className="text-gray-600 mb-4">
          ¿Estás seguro de que deseas eliminar completamente este vehículo?
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 font-medium text-sm">
            🚨 Esta acción no se puede deshacer
          </p>
          <p className="text-red-700 text-sm mt-1">
            • Se eliminará toda la información del vehículo
            <br />
            • Se borrarán todas las imágenes y videos de Cloudinary
            <br />• El vehículo desaparecerá completamente del sistema
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Sí, Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal de confirmación de cambio de estado
function ConfirmStatusChangeModal({
  currentStatus,
  newStatus,
  onConfirm,
  onCancel,
}: {
  currentStatus: EstadoVehiculo;
  newStatus: EstadoVehiculo;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const isChangingToSold = newStatus === "Vendido";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isChangingToSold ? "bg-red-100" : "bg-yellow-100"
            }`}
          >
            <AlertTriangle
              className={`h-5 w-5 ${
                isChangingToSold ? "text-red-600" : "text-yellow-600"
              }`}
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            Cambiar Estado
          </h3>
        </div>

        <p className="text-gray-600 mb-4">
          ¿Confirmas el cambio de estado de &quot;{currentStatus}&quot; a &quot;
          {newStatus}&quot;?
        </p>

        {isChangingToSold && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-800 font-medium text-sm">
              ⚠️ Importante: Cambiar a &quot;Vendido&quot;
            </p>
            <p className="text-red-700 text-sm mt-1">
              • Se eliminarán automáticamente todas las imágenes
              <br />
              • Se eliminarán automáticamente todos los videos
              <br />• El vehículo se ocultará de las búsquedas públicas
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
              isChangingToSold
                ? "bg-red-600 hover:bg-red-700"
                : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            Confirmar Cambio
          </button>
        </div>
      </div>
    </div>
  );
}
