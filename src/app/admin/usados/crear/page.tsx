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
  Image as ImageIcon,
  Video,
  Settings,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usadosService } from "@/services";
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

export default function CrearUsados() {
  const router = useRouter();

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear().toString(),
    kilometraje: "",
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
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);
  const [fotoSinFondo1, setFotoSinFondo1] = useState<File | null>(null);
  const [fotoSinFondo2, setFotoSinFondo2] = useState<File | null>(null);
  const [equipamiento, setEquipamiento] = useState<string[]>([]);

  // Estados de validación y UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Campos requeridos según API
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
      (field === "marca" ||
        field === "modelo" ||
        field === "tipoVehiculo" ||
        field === "anio") &&
      !formData.titulo
    ) {
      const newTitulo = [
        field === "marca" ? value : formData.marca,
        field === "modelo" ? value : formData.modelo,
        field === "tipoVehiculo" ? value : formData.tipoVehiculo,
        field === "anio" ? value : formData.anio,
      ]
        .filter(Boolean)
        .join(" ");

      setFormData((prev) => ({
        ...prev,
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
      // Preparar FormData según API
      const apiFormData = new FormData();

      // Campos obligatorios
      apiFormData.append("marca", formData.marca);
      apiFormData.append("modelo", formData.modelo);
      apiFormData.append("anio", formData.anio);
      apiFormData.append("kilometraje", formData.kilometraje.toString());

      // Estado por defecto: Disponible (para que se muestre en la página pública)
      apiFormData.append("estado", "Disponible");

      // Campos opcionales
      if (formData.titulo) apiFormData.append("titulo", formData.titulo);
      if (formData.version) apiFormData.append("version", formData.version);
      if (formData.tipoVehiculo)
        apiFormData.append("tipoVehiculo", formData.tipoVehiculo);
      if (formData.tipoCombustible)
        apiFormData.append("tipoCombustible", formData.tipoCombustible);
      if (formData.motor) apiFormData.append("motor", formData.motor);
      if (formData.transmision)
        apiFormData.append("transmision", formData.transmision);
      if (formData.traccion) apiFormData.append("traccion", formData.traccion);
      if (formData.potencia) apiFormData.append("potencia", formData.potencia);
      if (formData.cilindrada)
        apiFormData.append("cilindrada", formData.cilindrada);
      if (formData.capacidadCarga)
        apiFormData.append("capacidadCarga", formData.capacidadCarga);
      if (formData.sistemaFrenado)
        apiFormData.append("sistemaFrenado", formData.sistemaFrenado);
      if (formData.color) apiFormData.append("color", formData.color);
      if (formData.cantidadPuertas)
        apiFormData.append("cantidadPuertas", formData.cantidadPuertas);
      if (formData.cantidadAsientos)
        apiFormData.append("cantidadAsientos", formData.cantidadAsientos);
      if (formData.descripcion)
        apiFormData.append("descripcion", formData.descripcion);

      // Agregar equipamiento como JSON si existe
      if (equipamiento.length > 0) {
        apiFormData.append("equipamiento", JSON.stringify(equipamiento));
      }

      // Agregar imágenes (máximo 10)
      imageFiles.forEach((filePreview) => {
        apiFormData.append("imagenes", filePreview.file);
      });

      // Agregar videos (máximo 5)
      videoFiles.forEach((filePreview) => {
        apiFormData.append("videos", filePreview.file);
      });

      // Agregar fotos sin fondo para PDFs
      if (fotoSinFondo1) {
        apiFormData.append("fotoSinFondo1", fotoSinFondo1);
      }
      if (fotoSinFondo2) {
        apiFormData.append("fotoSinFondo2", fotoSinFondo2);
      }

      // Crear vehículo usado con media usando el endpoint especificado
      await usadosService.createUsadosWithMedia(apiFormData);

      // Limpiar URLs de objetos
      imageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      videoFiles.forEach((file) => URL.revokeObjectURL(file.url));

      // Redirigir al dashboard con mensaje de éxito
      router.push("/admin/usados?created=true");
    } catch (error: any) {
      console.error("❌ Error creando vehículo usado:", error);
      console.error("📋 Respuesta del servidor:", error.response?.data);

      // Limpiar errores anteriores
      const fieldErrors: FormErrors = {};

      // Extraer mensajes de error
      if (error.response?.data?.message) {
        const messages = error.response.data.message;

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
      } else if (error.response?.data?.error) {
        fieldErrors.submit = error.response.data.error;
      } else if (error.message) {
        fieldErrors.submit = error.message;
      } else {
        fieldErrors.submit = "Error al crear el vehículo usado.";
      }

      setErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  };

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
            Crear Nuevo Vehículo Usado
          </h1>
          <p className="text-gray-600 mt-1">
            Complete la información del vehículo usado y suba las
            imágenes/videos
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
              Error al crear vehículo usado
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
              <p className="text-xs text-gray-500 mt-1">
                Se genera automáticamente si se deja vacío
              </p>
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
                Año del Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange("anio", e.target.value)}
                placeholder={new Date().getFullYear().toString()}
                min="1990"
                max={new Date().getFullYear() + 1}
                required
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
                Kilometraje (km) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.kilometraje}
                onChange={(e) =>
                  handleInputChange("kilometraje", e.target.value)
                }
                placeholder="Ej: 45000"
                min="0"
                required
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

          {/* Imágenes */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Imágenes del Vehículo
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 10 imágenes • Formatos: JPG, PNG, WEBP • Máx 20MB c/u
                </p>
              </div>
              <label className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Subir Imágenes
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {errors.imagenes && (
              <p className="text-red-600 text-sm mb-4">{errors.imagenes}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={file.url}
                    alt={`Preview ${index + 1}`}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index, "image")}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {imageFiles.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay imágenes cargadas</p>
              </div>
            )}
          </div>

          {/* Videos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  Videos del Vehículo
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Máximo 5 videos • Formatos: MP4, MOV, AVI • Máx 50MB c/u
                </p>
              </div>
              <label className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Subir Videos
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {errors.videos && (
              <p className="text-red-600 text-sm mb-4">{errors.videos}</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {videoFiles.map((file, index) => (
                <div key={index} className="relative group">
                  <video
                    src={file.url}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index, "video")}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {videoFiles.length === 0 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No hay videos cargados</p>
              </div>
            )}
          </div>

          {/* Fotos sin fondo para PDFs */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              Fotos sin Fondo (Para Ficha Técnica PDF)
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Fotos del vehículo con fondo transparente (PNG) para generar PDFs
              profesionales
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foto sin fondo 1 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto sin Fondo #1
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 transition-colors cursor-pointer text-center">
                    <Upload className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">
                      {fotoSinFondo1 ? fotoSinFondo1.name : "Subir foto"}
                    </span>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFotoSinFondo1(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  {fotoSinFondo1 && (
                    <button
                      type="button"
                      onClick={() => setFotoSinFondo1(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Foto sin fondo 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto sin Fondo #2
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-cyan-500 transition-colors cursor-pointer text-center">
                    <Upload className="h-5 w-5 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600">
                      {fotoSinFondo2 ? fotoSinFondo2.name : "Subir foto"}
                    </span>
                    <input
                      type="file"
                      accept="image/png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFotoSinFondo2(file);
                      }}
                      className="hidden"
                    />
                  </label>
                  {fotoSinFondo2 && (
                    <button
                      type="button"
                      onClick={() => setFotoSinFondo2(null)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
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
            disabled={loading}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Creando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Crear Vehículo Usado
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
