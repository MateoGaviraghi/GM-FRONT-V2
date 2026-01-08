"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Car,
  ArrowLeft,
  Save,
  AlertCircle,
  RefreshCw,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { usadosService } from "@/services";
import { Usados, MediaFile } from "@/types";
import {
  DynamicUsadosAutocomplete,
  DynamicUsadosModeloAutocomplete,
} from "@/components/dynamic-usados-autocomplete";

interface FormData {
  titulo: string;
  marca: string;
  modelo: string;
  anio: string;
  kilometraje: string;
  estado: string;
  version: string;
  tipoVehiculo: string;
  tipoCombustible: string;
  motor: string;
  transmision: string;
  traccion: string;
  potencia: string;
  cilindrada: string;
  capacidadCarga: string;
  sistemaFrenado: string;
  color: string;
  cantidadPuertas: string;
  cantidadAsientos: string;
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

export default function EditarUsados() {
  const params = useParams();
  const router = useRouter();
  const usadosId = params?.id as string;

  // Estados principales
  const [usados, setUsados] = useState<Usados | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear().toString(),
    kilometraje: "",
    estado: "Disponible",
    version: "",
    tipoVehiculo: "",
    tipoCombustible: "",
    motor: "",
    transmision: "",
    traccion: "",
    potencia: "",
    cilindrada: "",
    capacidadCarga: "",
    sistemaFrenado: "",
    color: "",
    cantidadPuertas: "",
    cantidadAsientos: "",
    descripcion: "",
  });

  // Estados de archivos
  const [existingImages, setExistingImages] = useState<MediaFile[]>([]);
  const [existingVideos, setExistingVideos] = useState<MediaFile[]>([]);
  const [existingFotoSinFondo1, setExistingFotoSinFondo1] =
    useState<MediaFile | null>(null);
  const [existingFotoSinFondo2, setExistingFotoSinFondo2] =
    useState<MediaFile | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<FilePreview[]>([]);
  const [newVideoFiles, setNewVideoFiles] = useState<FilePreview[]>([]);
  const [newFotoSinFondo1, setNewFotoSinFondo1] = useState<File | null>(null);
  const [newFotoSinFondo2, setNewFotoSinFondo2] = useState<File | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videosToDelete, setVideosToDelete] = useState<string[]>([]);
  const [deleteFotoSinFondo1, setDeleteFotoSinFondo1] = useState(false);
  const [deleteFotoSinFondo2, setDeleteFotoSinFondo2] = useState(false);
  const [equipamiento, setEquipamiento] = useState<string[]>([]);

  // Estados de validación
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cargar datos del vehículo usado
  const loadUsados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await usadosService.getUsadosById(usadosId);

      setUsados(data);
      setExistingImages(data.imagenes || []);
      setExistingVideos(data.videos || []);
      setExistingFotoSinFondo1(data.fotoSinFondo1 || null);
      setExistingFotoSinFondo2(data.fotoSinFondo2 || null);
      setEquipamiento(data.equipamiento || []);

      // Pre-poblar formulario
      setFormData({
        titulo: data.titulo || "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        anio: data.anio?.toString() || new Date().getFullYear().toString(),
        kilometraje: data.kilometraje?.toString() || "",
        estado: data.estado || "Disponible",
        version: data.version || "",
        tipoVehiculo: data.tipoVehiculo || "",
        tipoCombustible: data.tipoCombustible || "",
        motor: data.motor || "",
        transmision: data.transmision || "",
        traccion: data.traccion || "",
        potencia: data.potencia || "",
        cilindrada: data.cilindrada || "",
        capacidadCarga: data.capacidadCarga || "",
        sistemaFrenado: data.sistemaFrenado || "",
        color: data.color || "",
        cantidadPuertas: data.cantidadPuertas?.toString() || "",
        cantidadAsientos: data.cantidadAsientos?.toString() || "",
        descripcion: data.descripcion || "",
      });
    } catch (err) {
      console.error("Error cargando vehículo usado:", err);
      setError("Error al cargar los datos del vehículo usado");
    } finally {
      setLoading(false);
    }
  }, [usadosId]);

  useEffect(() => {
    if (usadosId) {
      loadUsados();
    }
  }, [usadosId, loadUsados]);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Campos requeridos
    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido";
    if (!formData.anio.trim()) newErrors.anio = "El año es requerido";
    if (!formData.kilometraje.trim())
      newErrors.kilometraje = "El kilometraje es requerido";

    // Validar año
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (
      formData.anio &&
      (isNaN(year) || year < 1990 || year > currentYear + 1)
    ) {
      newErrors.anio = `El año debe estar entre 1990 y ${currentYear + 1}`;
    }

    // Validar kilometraje
    if (formData.kilometraje && parseInt(formData.kilometraje) < 0) {
      newErrors.kilometraje = "El kilometraje no puede ser negativo";
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
    console.log(`[handleInputChange] Campo: ${field}, Valor: "${value}"`);

    setFormData((prev) => {
      const newData = {
        ...prev,
        [field]: value,
      };
      console.log(
        `[handleInputChange] Nuevo formData.${field}:`,
        newData[field]
      );
      return newData;
    });

    // Limpiar error del campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
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

    if (errors.imagenes) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "",
      }));
    }
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

    if (errors.videos) {
      setErrors((prev) => ({
        ...prev,
        videos: "",
      }));
    }
  };

  // Marcar imagen existente para eliminar
  const markExistingImageForDeletion = (publicId: string) => {
    setImagesToDelete((prev) =>
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId]
    );
  };

  // Marcar video existente para eliminar
  const markExistingVideoForDeletion = (publicId: string) => {
    setVideosToDelete((prev) =>
      prev.includes(publicId)
        ? prev.filter((id) => id !== publicId)
        : [...prev, publicId]
    );
  };

  // Remover archivo nuevo
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

  // Guardar cambios
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Preparar FormData para actualización con multimedia
      const apiFormData = new FormData();

      // DEBUG: Verificar el valor del año antes de enviar
      console.log("=== DEBUG GUARDAR USADO ===");
      console.log(
        "formData.anio:",
        formData.anio,
        "tipo:",
        typeof formData.anio
      );

      // Campos obligatorios
      apiFormData.append("marca", formData.marca);
      apiFormData.append("modelo", formData.modelo);
      apiFormData.append("anio", formData.anio);
      apiFormData.append("kilometraje", formData.kilometraje.toString());
      apiFormData.append("estado", formData.estado);

      // Campos opcionales - solo agregar si tienen valor
      if (formData.titulo?.trim())
        apiFormData.append("titulo", formData.titulo.trim());
      if (formData.version?.trim())
        apiFormData.append("version", formData.version.trim());
      if (formData.tipoVehiculo?.trim())
        apiFormData.append("tipoVehiculo", formData.tipoVehiculo.trim());
      if (formData.tipoCombustible?.trim())
        apiFormData.append("tipoCombustible", formData.tipoCombustible.trim());
      if (formData.motor?.trim())
        apiFormData.append("motor", formData.motor.trim());
      if (formData.transmision?.trim())
        apiFormData.append("transmision", formData.transmision.trim());
      if (formData.traccion?.trim())
        apiFormData.append("traccion", formData.traccion.trim());
      if (formData.potencia?.trim())
        apiFormData.append("potencia", formData.potencia.trim());
      if (formData.cilindrada?.trim())
        apiFormData.append("cilindrada", formData.cilindrada.trim());
      if (formData.capacidadCarga?.trim())
        apiFormData.append("capacidadCarga", formData.capacidadCarga.trim());
      if (formData.sistemaFrenado?.trim())
        apiFormData.append("sistemaFrenado", formData.sistemaFrenado.trim());
      if (formData.color?.trim())
        apiFormData.append("color", formData.color.trim());
      if (formData.cantidadPuertas?.trim())
        apiFormData.append("cantidadPuertas", formData.cantidadPuertas);
      if (formData.cantidadAsientos?.trim())
        apiFormData.append("cantidadAsientos", formData.cantidadAsientos);
      if (formData.descripcion?.trim())
        apiFormData.append("descripcion", formData.descripcion.trim());

      // Equipamiento como JSON string (el backend lo transforma a array)
      if (equipamiento.length > 0)
        apiFormData.append("equipamiento", JSON.stringify(equipamiento));

      // Agregar nuevas imágenes
      newImageFiles.forEach((filePreview) => {
        apiFormData.append("imagenes", filePreview.file);
      });

      // Agregar nuevos videos
      newVideoFiles.forEach((filePreview) => {
        apiFormData.append("videos", filePreview.file);
      });

      // Agregar nuevas fotos sin fondo
      if (newFotoSinFondo1) {
        apiFormData.append("fotoSinFondo1", newFotoSinFondo1);
      }
      if (newFotoSinFondo2) {
        apiFormData.append("fotoSinFondo2", newFotoSinFondo2);
      }

      // Agregar IDs de archivos a eliminar (como JSON strings)
      if (imagesToDelete.length > 0) {
        apiFormData.append("imagenesAEliminar", JSON.stringify(imagesToDelete));
      }
      if (videosToDelete.length > 0) {
        apiFormData.append("videosAEliminar", JSON.stringify(videosToDelete));
      }
      if (deleteFotoSinFondo1) {
        apiFormData.append("eliminarFotoSinFondo1", "true");
      }
      if (deleteFotoSinFondo2) {
        apiFormData.append("eliminarFotoSinFondo2", "true");
      }

      console.log("🔍 Actualizando vehículo...");

      // Actualizar vehículo usado con multimedia
      await usadosService.updateUsadosWithMedia(usadosId, apiFormData);

      // Limpiar URLs de objetos nuevos
      newImageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      newVideoFiles.forEach((file) => URL.revokeObjectURL(file.url));

      // Redirigir al dashboard con mensaje de éxito
      router.push("/admin/usados?updated=true");
    } catch (err: any) {
      console.error("❌ Error actualizando vehículo usado:", err);
      console.error("📋 Respuesta del servidor:", err.response?.data);

      // Limpiar errores anteriores
      const fieldErrors: FormErrors = {};

      // Extraer mensajes de error
      if (err.response?.data?.message) {
        const messages = err.response.data.message;

        if (Array.isArray(messages)) {
          // Parsear errores de validación y asignarlos a campos específicos
          console.error("🔍 Errores de validación:", messages);

          let generalErrors: string[] = [];

          messages.forEach((msg: string) => {
            // Parsear mensajes como "property marca should not be empty"
            const fieldMatch = msg.match(/property (\w+) (.+)/);

            if (fieldMatch) {
              const fieldName = fieldMatch[1];
              const errorMsg = fieldMatch[2];

              // Traducir algunos mensajes comunes
              let translatedMsg = errorMsg;
              if (errorMsg.includes("should not be empty"))
                translatedMsg = "Este campo es requerido";
              else if (errorMsg.includes("must be a string"))
                translatedMsg = "Debe ser texto";
              else if (errorMsg.includes("must be a number"))
                translatedMsg = "Debe ser un número";
              else if (errorMsg.includes("must be an array"))
                translatedMsg = "Debe ser una lista";

              fieldErrors[fieldName] = translatedMsg;
            } else {
              generalErrors.push(msg);
            }
          });

          // Si hay errores generales, mostrarlos también
          if (generalErrors.length > 0) {
            fieldErrors.submit = generalErrors.join("\n• ");
          }

          // Si solo hay errores de campo, mostrar mensaje general
          if (
            Object.keys(fieldErrors).length > 0 &&
            generalErrors.length === 0
          ) {
            fieldErrors.submit =
              "Por favor, corrige los errores en el formulario";
          }
        } else {
          // Error simple
          fieldErrors.submit = messages;
        }
      } else if (err.response?.data?.error) {
        fieldErrors.submit = err.response.data.error;
      } else if (err.message) {
        fieldErrors.submit = err.message;
      } else {
        fieldErrors.submit = "Error al actualizar el vehículo usado.";
      }

      setErrors(fieldErrors);
    } finally {
      setSaving(false);
    }
  };

  // Eliminar vehículo usado
  const handleDelete = async () => {
    try {
      setSaving(true);
      await usadosService.deleteUsados(usadosId);

      // Limpiar URLs de objetos
      newImageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      newVideoFiles.forEach((file) => URL.revokeObjectURL(file.url));

      router.push("/admin/usados?deleted=true");
    } catch (err) {
      console.error("Error eliminando vehículo usado:", err);
      setErrors({
        submit:
          "Error al eliminar el vehículo usado. Por favor, inténtelo nuevamente.",
      });
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-cyan-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos del vehículo usado...</p>
        </div>
      </div>
    );
  }

  // Error al cargar
  if (error || !usados) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-red-800 font-semibold text-lg mb-2">
              Error al cargar el vehículo usado
            </h3>
            <p className="text-red-700">{error}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={loadUsados}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reintentar
              </button>
              <Link
                href="/admin/usados"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/usados"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Car className="h-6 w-6 text-cyan-600" />
            Editar Vehículo Usado
          </h1>
          <p className="text-gray-600 mt-1">
            {usados.titulo || `${usados.marca} ${usados.modelo}`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>

      {/* Errores globales */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">
              Error al guardar cambios
            </h4>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Formulario de Edición */}
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
                placeholder="Ej: Toyota Hilux 2020 SRV"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca <span className="text-red-500">*</span>
              </label>
              <DynamicUsadosAutocomplete
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={(value) => handleInputChange("marca", value)}
                field="marcas"
                placeholder="Escribir o seleccionar marca..."
                isAdmin={true}
                allowCustom={true}
                className={`px-4 py-3 ${
                  errors.marca ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.marca && (
                <p className="text-red-600 text-sm mt-1">{errors.marca}</p>
              )}
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo <span className="text-red-500">*</span>
              </label>
              <DynamicUsadosModeloAutocomplete
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={(value) => handleInputChange("modelo", value)}
                marca={formData.marca}
                placeholder="Escribir o seleccionar modelo..."
                isAdmin={true}
                allowCustom={true}
                className={`px-4 py-3 ${
                  errors.modelo ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
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
              <DynamicUsadosAutocomplete
                id="tipoVehiculo"
                name="tipoVehiculo"
                value={formData.tipoVehiculo}
                onChange={(value) => handleInputChange("tipoVehiculo", value)}
                field="tiposVehiculo"
                placeholder="Escribir o seleccionar tipo..."
                isAdmin={true}
                allowCustom={true}
                className="px-4 py-3"
              />
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año del Modelo
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={formData.anio}
                onChange={(e) => {
                  // Solo permitir números
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 4) {
                    handleInputChange("anio", value);
                  }
                }}
                placeholder={new Date().getFullYear().toString()}
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
                value={formData.kilometraje}
                onChange={(e) =>
                  handleInputChange("kilometraje", e.target.value)
                }
                placeholder="Ej: 45000"
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

            {/* Estado del Vehículo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado del Vehículo *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange("estado", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
              >
                <option value="Disponible">
                  Disponible (Visible en página pública)
                </option>
                <option value="Reservado">
                  Reservado (Oculto en página pública)
                </option>
                <option value="Vendido">
                  Vendido (Oculto en página pública)
                </option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Solo los vehículos "Disponibles" se muestran en la página
                pública
              </p>
            </div>

            {/* Versión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Versión
              </label>
              <DynamicUsadosAutocomplete
                id="version"
                name="version"
                value={formData.version}
                onChange={(value) => handleInputChange("version", value)}
                field="versiones"
                placeholder="Ej: XLT, SRV, Limited..."
                isAdmin={true}
                allowCustom={true}
                className="px-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* Especificaciones Técnicas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-600" />
            Especificaciones Técnicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tipo de Combustible */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Combustible
              </label>
              <DynamicUsadosAutocomplete
                id="tipoCombustible"
                name="tipoCombustible"
                value={formData.tipoCombustible}
                onChange={(value) =>
                  handleInputChange("tipoCombustible", value)
                }
                field="combustibles"
                placeholder="Escribir o seleccionar..."
                isAdmin={true}
                allowCustom={true}
                className="px-4 py-3"
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
                placeholder="Ej: 2.8L Turbo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Transmisión */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transmisión
              </label>
              <DynamicUsadosAutocomplete
                id="transmision"
                name="transmision"
                value={formData.transmision}
                onChange={(value) => handleInputChange("transmision", value)}
                field="transmisiones"
                placeholder="Escribir o seleccionar..."
                isAdmin={true}
                allowCustom={true}
                className="px-4 py-3"
              />
            </div>

            {/* Tracción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracción
              </label>
              <DynamicUsadosAutocomplete
                id="traccion"
                name="traccion"
                value={formData.traccion}
                onChange={(value) => handleInputChange("traccion", value)}
                field="tracciones"
                placeholder="Escribir o seleccionar..."
                isAdmin={true}
                allowCustom={true}
                className="px-4 py-3"
              />
            </div>

            {/* Potencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Potencia
              </label>
              <input
                type="text"
                value={formData.potencia}
                onChange={(e) => handleInputChange("potencia", e.target.value)}
                placeholder="Ej: 200 HP, 150 CV"
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
                placeholder="Ej: 1000 kg"
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
                placeholder="Ej: ABS + EBD"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Cilindrada */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cilindrada
              </label>
              <input
                type="text"
                value={formData.cilindrada}
                onChange={(e) =>
                  handleInputChange("cilindrada", e.target.value)
                }
                placeholder="Ej: 2.0L, 1800cc"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="Ej: Blanco, Rojo"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Cantidad de Puertas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Puertas
              </label>
              <input
                type="number"
                value={formData.cantidadPuertas}
                onChange={(e) =>
                  handleInputChange("cantidadPuertas", e.target.value)
                }
                placeholder="Ej: 4"
                min="2"
                max="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>

            {/* Cantidad de Asientos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Asientos
              </label>
              <input
                type="number"
                value={formData.cantidadAsientos}
                onChange={(e) =>
                  handleInputChange("cantidadAsientos", e.target.value)
                }
                placeholder="Ej: 5"
                min="2"
                max="9"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Equipamiento */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Equipamiento
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                "ABS",
                "Airbags frontales",
                "Airbags laterales",
                "Aire acondicionado",
                "Alarma",
                "Bluetooth",
                "Cámara de retroceso",
                "Cierre centralizado",
                "Control de crucero",
                "Control de estabilidad",
                "Control de tracción",
                "Cristales eléctricos",
                "Dirección asistida",
                "Espejos eléctricos",
                "Faros antiniebla",
                "Llantas de aleación",
                "Sensor de estacionamiento",
                "Techo solar",
              ].map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={equipamiento.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEquipamiento([...equipamiento, item]);
                      } else {
                        setEquipamiento(
                          equipamiento.filter((eq) => eq !== item)
                        );
                      }
                    }}
                    className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                  />
                  <span className="text-sm text-gray-700">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Multimedia */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-cyan-600" />
            Imágenes y Videos
          </h2>

          {/* Imágenes Existentes */}
          {existingImages.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Imágenes Actuales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {existingImages.map((image) => (
                  <div
                    key={image.public_id}
                    className={`relative group ${
                      imagesToDelete.includes(image.public_id)
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <Image
                      src={image.secure_url}
                      alt="Imagen existente"
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        markExistingImageForDeletion(image.public_id)
                      }
                      className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                        imagesToDelete.includes(image.public_id)
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {imagesToDelete.includes(image.public_id) ? (
                        <RefreshCw className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                    {imagesToDelete.includes(image.public_id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <span className="text-white text-xs font-medium">
                          Se eliminará
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevas Imágenes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Agregar Nuevas Imágenes
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 10 imágenes en total • Formatos: JPG, PNG, WEBP • Máx
                  5MB c/u
                </p>
              </div>
              <label className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Subir Imágenes
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {errors.imagenes && (
              <p className="text-red-600 text-sm mb-4">{errors.imagenes}</p>
            )}

            {newImageFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {newImageFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={file.url}
                      alt={`Nueva imagen ${index + 1}`}
                      width={300}
                      height={128}
                      className="w-full h-32 object-cover rounded-lg border border-green-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index, "image")}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                      Nueva
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos Existentes */}
          {existingVideos.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">
                Videos Actuales
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {existingVideos.map((video) => (
                  <div
                    key={video.public_id}
                    className={`relative group ${
                      videosToDelete.includes(video.public_id)
                        ? "opacity-50"
                        : ""
                    }`}
                  >
                    <video
                      src={video.secure_url}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        markExistingVideoForDeletion(video.public_id)
                      }
                      className={`absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                        videosToDelete.includes(video.public_id)
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {videosToDelete.includes(video.public_id) ? (
                        <RefreshCw className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                    {videosToDelete.includes(video.public_id) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <span className="text-white text-xs font-medium">
                          Se eliminará
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nuevos Videos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Agregar Nuevos Videos
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 5 videos en total • Formatos: MP4, MOV, AVI • Máx 50MB
                  c/u
                </p>
              </div>
              <label className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Subir Videos
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleNewVideoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {errors.videos && (
              <p className="text-red-600 text-sm mb-4">{errors.videos}</p>
            )}

            {newVideoFiles.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newVideoFiles.map((file, index) => (
                  <div key={index} className="relative group">
                    <video
                      src={file.url}
                      className="w-full h-32 object-cover rounded-lg border border-green-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index, "video")}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                      Nuevo
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Fotos sin Fondo (para PDF) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="h-5 w-5 text-cyan-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              Fotos sin Fondo para PDF
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Estas imágenes se usarán para generar la ficha técnica en PDF. Deben
            tener fondo transparente (PNG).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Foto sin Fondo 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Foto Principal sin Fondo
              </label>

              {/* Imagen existente */}
              {existingFotoSinFondo1 && !deleteFotoSinFondo1 && (
                <div className="relative group mb-4">
                  <Image
                    src={existingFotoSinFondo1.secure_url}
                    alt="Foto sin fondo 1"
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteFotoSinFondo1(true)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Actual
                  </div>
                </div>
              )}

              {/* Mensaje de eliminación */}
              {existingFotoSinFondo1 && deleteFotoSinFondo1 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">
                      Se eliminará la foto actual
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteFotoSinFondo1(false)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Nueva imagen */}
              {newFotoSinFondo1 && (
                <div className="relative group mb-4">
                  <Image
                    src={URL.createObjectURL(newFotoSinFondo1)}
                    alt="Nueva foto sin fondo 1"
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg border border-green-300 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setNewFotoSinFondo1(null)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                    Nueva
                  </div>
                </div>
              )}

              {/* Botón de carga */}
              {!newFotoSinFondo1 && (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Click para subir</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG con transparencia
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewFotoSinFondo1(file);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Foto sin Fondo 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Foto Secundaria sin Fondo
              </label>

              {/* Imagen existente */}
              {existingFotoSinFondo2 && !deleteFotoSinFondo2 && (
                <div className="relative group mb-4">
                  <Image
                    src={existingFotoSinFondo2.secure_url}
                    alt="Foto sin fondo 2"
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg border border-gray-200 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setDeleteFotoSinFondo2(true)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Actual
                  </div>
                </div>
              )}

              {/* Mensaje de eliminación */}
              {existingFotoSinFondo2 && deleteFotoSinFondo2 && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-700">
                      Se eliminará la foto actual
                    </span>
                    <button
                      type="button"
                      onClick={() => setDeleteFotoSinFondo2(false)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Nueva imagen */}
              {newFotoSinFondo2 && (
                <div className="relative group mb-4">
                  <Image
                    src={URL.createObjectURL(newFotoSinFondo2)}
                    alt="Nueva foto sin fondo 2"
                    width={400}
                    height={300}
                    className="w-full h-48 object-contain rounded-lg border border-green-300 bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setNewFotoSinFondo2(null)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                    Nueva
                  </div>
                </div>
              )}

              {/* Botón de carga */}
              {!newFotoSinFondo2 && (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="h-10 w-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Click para subir</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG con transparencia
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setNewFotoSinFondo2(file);
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Descripción
          </h2>

          <textarea
            value={formData.descripcion}
            onChange={(e) => handleInputChange("descripcion", e.target.value)}
            placeholder="Describa las características y condiciones del vehículo usado..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/usados"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Eliminar vehículo usado?
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Esta acción no se puede deshacer. El vehículo usado y todos
                  sus archivos multimedia serán eliminados permanentemente.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={saving}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
