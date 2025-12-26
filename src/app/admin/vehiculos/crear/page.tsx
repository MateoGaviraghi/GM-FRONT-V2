"use client";

import { useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { vehiculoService } from "@/services";
import { EstadoVehiculo, VehiculoFormData } from "@/types";
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

export default function CrearVehiculo() {
  const router = useRouter();

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
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);

  // Estados de validación y UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Campos requeridos
    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido";
    if (!formData.tipos.trim())
      newErrors.tipos = "El tipo de vehículo es requerido";
    if (!formData.tipoCombustible.trim())
      newErrors.tipoCombustible = "El tipo de combustible es requerido";
    if (!formData.transmisiones.trim())
      newErrors.transmisiones = "El tipo de transmisión es requerido";

    // Validar kilometraje
    const km = parseFloat(formData.kilometraje);
    if (isNaN(km) || km < 0) {
      newErrors.kilometraje =
        "El kilometraje debe ser un número válido mayor o igual a 0";
    }

    // Validar año
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (isNaN(year) || year < 2020 || year > currentYear + 1) {
      newErrors.anio = `El año debe estar entre 2020 y ${currentYear + 1}`;
    }

    // Validar archivos
    if (imageFiles.length > 10) {
      newErrors.imagenes = "Máximo 10 imágenes permitidas";
    }
    if (videoFiles.length > 5) {
      newErrors.videos = "Máximo 5 videos permitidos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
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

    // Auto-generar título si está vacío
    if (
      (field === "marca" || field === "modelo" || field === "variantes") &&
      !formData.titulo
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

  // Validar archivos antes de agregarlos
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

  // Manejar subida de imágenes
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (imageFiles.length + files.length > 10) {
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

    setImageFiles((prev) => [...prev, ...validFiles]);

    // Limpiar error si había
    if (errors.imagenes) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "",
      }));
    }
  };

  // Manejar subida de videos
  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (videoFiles.length + files.length > 5) {
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

    setVideoFiles((prev) => [...prev, ...validFiles]);

    // Limpiar error si había
    if (errors.videos) {
      setErrors((prev) => ({
        ...prev,
        videos: "",
      }));
    }
  };

  // Remover archivo
  const removeFile = (index: number, type: "image" | "video") => {
    if (type === "image") {
      const newFiles = [...imageFiles];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      setImageFiles(newFiles);
    } else {
      const newFiles = [...videoFiles];
      URL.revokeObjectURL(newFiles[index].url);
      newFiles.splice(index, 1);
      setVideoFiles(newFiles);
    }
  };

  // Enviar formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos según especificación de VehiculoFormData
      const vehiculoData: VehiculoFormData = {
        ...formData,
        anio: new Date(`${formData.anio}-01-01`), // Convertir año a Date
        kilometraje: parseFloat(formData.kilometraje), // Convertir a número
        imagenes: imageFiles.map((file) => file.file), // Extraer archivos File
        videos: videoFiles.map((file) => file.file), // Extraer archivos File
      };

      // Crear vehículo con media usando el endpoint especificado
      await vehiculoService.createVehiculoWithMedia(vehiculoData);

      // Limpiar URLs de objetos
      imageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      videoFiles.forEach((file) => URL.revokeObjectURL(file.url));

      // Redirigir al dashboard con mensaje de éxito
      router.push("/admin/vehiculos?created=true");
    } catch (error) {
      console.error("Error creando vehículo:", error);
      setErrors({
        submit: "Error al crear el vehículo. Por favor, inténtelo nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vehiculos"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Car className="h-6 w-6 text-cyan-600" />
            Crear Nuevo Vehículo 0KM
          </h1>
          <p className="text-gray-600 mt-1">
            Complete la información del vehículo y suba las imágenes/videos
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
        </div>
      </div>

      {/* Errores globales */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">
              Error al crear vehículo
            </h4>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      {preview ? (
        /* Vista Previa */
        <PreviewComponent
          formData={formData}
          imageFiles={imageFiles}
          videoFiles={videoFiles}
          onEdit={() => setPreview(false)}
          onSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        /* Formulario de Edición */
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Información Básica */}
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
                <p className="text-xs text-gray-500 mt-1">
                  Se genera automáticamente si se deja vacío
                </p>
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
                  placeholder="Ej: XEI, GLS, Limited"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Kilometraje */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilometraje
                </label>
                <input
                  type="number"
                  value={formData.kilometraje}
                  onChange={(e) =>
                    handleInputChange("kilometraje", e.target.value)
                  }
                  placeholder="0"
                  min="0"
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

              {/* Año */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año del Modelo <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.anio}
                  onChange={(e) => handleInputChange("anio", e.target.value)}
                  placeholder={new Date().getFullYear().toString()}
                  min="2020"
                  max={new Date().getFullYear() + 1}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 ${
                    errors.anio ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.anio && (
                  <p className="text-red-600 text-sm mt-1">{errors.anio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Especificaciones Técnicas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <Car className="h-5 w-5 text-cyan-600" />
              Especificaciones Técnicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tipo de Combustible */}
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
                  placeholder="Ej: 2.0L 16V DOHC"
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
                  placeholder="Ej: 150 CV @ 6000 RPM"
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
                  placeholder="Ej: 1200 kg"
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
                  placeholder="Ej: ABS + ESP"
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
                  placeholder="Ej: Eje rígido trasero"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Vehículo
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) =>
                    handleInputChange(
                      "estado",
                      e.target.value as EstadoVehiculo
                    )
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="Disponible">✅ Disponible</option>
                  <option value="Reservado">⏳ Reservado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Descripción Detallada
            </h2>

            <textarea
              value={formData.descripcion}
              onChange={(e) => handleInputChange("descripcion", e.target.value)}
              placeholder="Describa las características destacadas del vehículo, equipamiento, condiciones especiales, etc."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-vertical"
            />
          </div>

          {/* Upload de Archivos */}
          <MediaUploadSection
            imageFiles={imageFiles}
            videoFiles={videoFiles}
            onImageUpload={handleImageUpload}
            onVideoUpload={handleVideoUpload}
            onRemoveFile={removeFile}
            errors={errors}
          />

          {/* Botones de Acción */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Link
                href="/admin/vehiculos"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                Cancelar
              </Link>

              <button
                type="button"
                onClick={() => setPreview(true)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Vista Previa
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Creando Vehículo...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Crear Vehículo
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// Componente para la sección de upload de archivos
function MediaUploadSection({
  imageFiles,
  videoFiles,
  onImageUpload,
  onVideoUpload,
  onRemoveFile,
  errors,
}: {
  imageFiles: FilePreview[];
  videoFiles: FilePreview[];
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVideoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number, type: "image" | "video") => void;
  errors: FormErrors;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="h-5 w-5 text-cyan-600" />
        Imágenes y Videos
      </h2>

      <div className="space-y-8">
        {/* Upload de Imágenes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Imágenes del Vehículo (Máximo 10)
            </h3>
            <span className="text-sm text-gray-500">
              {imageFiles.length}/10 imágenes
            </span>
          </div>

          {/* Drag & Drop Zone */}
          <div className="relative">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                errors.imagenes
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
              }`}
              onClick={() =>
                document.getElementById("image-upload-input")?.click()
              }
            >
              <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Arrastra imágenes aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG, WEBP hasta 5MB cada una
                </p>
              </div>
            </div>
            <input
              id="image-upload-input"
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={onImageUpload}
              disabled={imageFiles.length >= 10}
              className="hidden"
            />
          </div>

          {errors.imagenes && (
            <p className="text-red-600 text-sm mt-2">{errors.imagenes}</p>
          )}

          {/* Preview de Imágenes */}
          {imageFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Imágenes Seleccionadas
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={file.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index, "image")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                      {(file.file.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Upload de Videos */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-700 flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos del Vehículo (Máximo 5)
            </h3>
            <span className="text-sm text-gray-500">
              {videoFiles.length}/5 videos
            </span>
          </div>

          {/* Drag & Drop Zone */}
          <div className="relative">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                errors.videos
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 hover:border-cyan-400 hover:bg-cyan-50"
              }`}
              onClick={() =>
                document.getElementById("video-upload-input")?.click()
              }
            >
              <Video className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Arrastra videos aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  MP4, MOV, AVI hasta 50MB cada uno
                </p>
              </div>
            </div>
            <input
              id="video-upload-input"
              type="file"
              multiple
              accept="video/mp4,video/mov,video/avi"
              onChange={onVideoUpload}
              disabled={videoFiles.length >= 5}
              className="hidden"
            />
          </div>

          {errors.videos && (
            <p className="text-red-600 text-sm mt-2">{errors.videos}</p>
          )}

          {/* Preview de Videos */}
          {videoFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Videos Seleccionados
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <video
                        src={file.url}
                        className="w-full h-full object-cover"
                        controls
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFile(index, "video")}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">
                      {(file.file.size / 1024 / 1024).toFixed(1)}MB
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de Vista Previa
function PreviewComponent({
  formData,
  imageFiles,
  videoFiles,
  onEdit,
  onSubmit,
  loading,
}: {
  formData: FormData;
  imageFiles: FilePreview[];
  videoFiles: FilePreview[];
  onEdit: () => void;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Header de Preview */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="h-6 w-6 text-cyan-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Vista Previa del Vehículo
          </h2>
        </div>
        <p className="text-gray-600 mb-4">
          Revisa la información antes de crear el vehículo en el sistema
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Editar Información
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Confirmar y Crear
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card del Vehículo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Galería de Imágenes */}
        {imageFiles.length > 0 && (
          <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageFiles[0].url}
              alt={formData.titulo}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 text-sm font-semibold rounded-full">
                {formData.estado}
              </span>
              <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <ImageIcon className="h-3 w-3" />
                {imageFiles.length}
              </span>
              {videoFiles.length > 0 && (
                <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  {videoFiles.length}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Información del Vehículo */}
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {formData.titulo ||
                `${formData.marca} ${formData.modelo} ${formData.variantes} ${formData.anio}`}
            </h1>
            <p className="text-lg text-gray-600">
              {formData.marca} • {formData.tipos} • {formData.anio}
            </p>
          </div>

          {/* Especificaciones en Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {formData.tipoCombustible && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Combustible</p>
                <p className="font-medium text-gray-800">
                  {formData.tipoCombustible}
                </p>
              </div>
            )}
            {formData.transmisiones && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Transmisión</p>
                <p className="font-medium text-gray-800">
                  {formData.transmisiones}
                </p>
              </div>
            )}
            {formData.tracciones && (
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Tracción</p>
                <p className="font-medium text-gray-800">
                  {formData.tracciones}
                </p>
              </div>
            )}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Kilometraje</p>
              <p className="font-medium text-gray-800">
                {formData.kilometraje} km
              </p>
            </div>
          </div>

          {/* Descripción */}
          {formData.descripcion && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Descripción
              </h3>
              <p className="text-gray-600 whitespace-pre-wrap">
                {formData.descripcion}
              </p>
            </div>
          )}

          {/* Especificaciones Técnicas Adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {formData.motor && (
              <div>
                <span className="font-medium text-gray-700">Motor:</span>
                <span className="text-gray-600 ml-2">{formData.motor}</span>
              </div>
            )}
            {formData.potenciaMaxima && (
              <div>
                <span className="font-medium text-gray-700">Potencia:</span>
                <span className="text-gray-600 ml-2">
                  {formData.potenciaMaxima}
                </span>
              </div>
            )}
            {formData.capacidadCarga && (
              <div>
                <span className="font-medium text-gray-700">Carga:</span>
                <span className="text-gray-600 ml-2">
                  {formData.capacidadCarga}
                </span>
              </div>
            )}
            {formData.sistemaFrenado && (
              <div>
                <span className="font-medium text-gray-700">Frenos:</span>
                <span className="text-gray-600 ml-2">
                  {formData.sistemaFrenado}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Galería Adicional */}
      {imageFiles.length > 1 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Galería de Imágenes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {imageFiles.slice(1).map((file, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={`Imagen ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videoFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoFiles.map((file, index) => (
              <div
                key={index}
                className="aspect-video rounded-lg overflow-hidden"
              >
                <video
                  src={file.url}
                  className="w-full h-full object-cover"
                  controls
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
