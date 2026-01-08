"use client";

import { useState } from "react";
import {
  Truck,
  ArrowLeft,
  Upload,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon,
  Play,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { remolqueService } from "@/services";
import {
  CondicionRemolque,
  CategoriaRemolque,
  EstadoRemolque,
  RemolqueFormData,
  ChasisRemolque,
  DimensionesRemolque,
  EjesSuspensionRemolque,
  CarroceriaRemolque,
  CONDICIONES_REMOLQUE,
  CATEGORIAS_REMOLQUE,
  TIPOS_CARROCERIA,
} from "@/types";

interface FormData {
  // OBLIGATORIOS
  titulo: string;
  condicion: CondicionRemolque;

  // OPCIONALES
  categoria: CategoriaRemolque | "";
  marca: string;
  modelo: string;
  anio: string;
  tipoCarroceria: string;
  cantidadEjes: string;
  capacidadCarga: string;
  tara: string;
  pbtc: string;
  kilometraje: string;
  estado: EstadoRemolque;
  garantia: string;
  descripcion: string;
}

interface FilePreview {
  file: File;
  url: string;
  type: "image" | "video";
}

export default function CrearRemolque() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    condicion: "0KM",
    categoria: "",
    marca: "",
    modelo: "",
    anio: new Date().getFullYear().toString(),
    tipoCarroceria: "",
    cantidadEjes: "",
    capacidadCarga: "",
    tara: "",
    pbtc: "",
    kilometraje: "",
    estado: "Disponible",
    garantia: "",
    descripcion: "",
  });

  // Especificaciones técnicas
  const [chasis, setChasis] = useState<ChasisRemolque>({});
  const [dimensiones, setDimensiones] = useState<DimensionesRemolque>({});
  const [ejesSuspension, setEjesSuspension] = useState<EjesSuspensionRemolque>(
    {}
  );
  const [carroceria, setCarroceria] = useState<CarroceriaRemolque>({});

  // Equipamiento
  const [equipamientoSerie, setEquipamientoSerie] = useState<string[]>([]);
  const [equipamientoOpcional, setEquipamientoOpcional] = useState<string[]>(
    []
  );
  const [newEquipSerie, setNewEquipSerie] = useState("");
  const [newEquipOpcional, setNewEquipOpcional] = useState("");

  // Archivos
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);
  const [fotoSinFondo1, setFotoSinFondo1] = useState<File | null>(null);
  const [fotoSinFondo2, setFotoSinFondo2] = useState<File | null>(null);

  // UI
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    chasis: false,
    dimensiones: false,
    ejesSuspension: false,
    carroceria: false,
  });

  const toggleAcordeon = (key: keyof typeof acordeonesAbiertos) => {
    setAcordeonesAbiertos((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio";
    }

    if (!formData.condicion) {
      newErrors.condicion = "La condición es obligatoria";
    }

    // Validaciones opcionales
    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (
      formData.anio &&
      (isNaN(year) || year < 1990 || year > currentYear + 1)
    ) {
      newErrors.anio = `El año debe estar entre 1990 y ${currentYear + 1}`;
    }

    if (
      formData.cantidadEjes &&
      (parseInt(formData.cantidadEjes) < 1 ||
        parseInt(formData.cantidadEjes) > 20)
    ) {
      newErrors.cantidadEjes = "La cantidad de ejes debe estar entre 1 y 20";
    }

    if (imageFiles.length > 10) {
      newErrors.imagenes = "Máximo 10 imágenes permitidas";
    }

    if (videoFiles.length > 5) {
      newErrors.videos = "Máximo 5 videos permitidos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const remolqueData: RemolqueFormData = {
        titulo: formData.titulo,
        condicion: formData.condicion,
        categoria: formData.categoria || undefined,
        marca: formData.marca || undefined,
        modelo: formData.modelo || undefined,
        anio: formData.anio ? parseInt(formData.anio) : undefined,
        tipoCarroceria: formData.tipoCarroceria || undefined,
        cantidadEjes: formData.cantidadEjes
          ? parseInt(formData.cantidadEjes)
          : undefined,
        capacidadCarga: formData.capacidadCarga || undefined,
        tara: formData.tara ? parseInt(formData.tara) : undefined,
        pbtc: formData.pbtc || undefined,
        kilometraje: formData.kilometraje
          ? parseInt(formData.kilometraje)
          : undefined,
        estado: formData.estado,
        garantia: formData.garantia || undefined,
        descripcion: formData.descripcion || undefined,
        chasis: Object.keys(chasis).length > 0 ? chasis : undefined,
        dimensiones:
          Object.keys(dimensiones).length > 0 ? dimensiones : undefined,
        ejesSuspension:
          Object.keys(ejesSuspension).length > 0 ? ejesSuspension : undefined,
        carroceria: Object.keys(carroceria).length > 0 ? carroceria : undefined,
        equipamientoSerie:
          equipamientoSerie.length > 0 ? equipamientoSerie : undefined,
        equipamientoOpcional:
          equipamientoOpcional.length > 0 ? equipamientoOpcional : undefined,
        imagenes: imageFiles.map((f) => f.file),
        videos: videoFiles.map((f) => f.file),
        fotoSinFondo1: fotoSinFondo1 || undefined,
        fotoSinFondo2: fotoSinFondo2 || undefined,
      };

      await remolqueService.createRemolqueWithMedia(remolqueData);

      // Limpiar URLs
      imageFiles.forEach((f) => URL.revokeObjectURL(f.url));
      videoFiles.forEach((f) => URL.revokeObjectURL(f.url));

      router.push("/admin/remolques?created=true");
    } catch (error) {
      console.error("Error creando remolque:", error);
      setErrors({
        submit: "Error al crear el remolque. Por favor, inténtelo nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejo de archivos
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Máximo 10 imágenes permitidas",
      }));
      return;
    }

    const validFiles: FilePreview[] = [];
    files.forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          imagenes: "Las imágenes no pueden superar 20MB",
        }));
        return;
      }
      validFiles.push({ file, url: URL.createObjectURL(file), type: "image" });
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (videoFiles.length + files.length > 5) {
      setErrors((prev) => ({ ...prev, videos: "Máximo 5 videos permitidos" }));
      return;
    }

    const validFiles: FilePreview[] = [];
    files.forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          videos: "Los videos no pueden superar 50MB",
        }));
        return;
      }
      validFiles.push({ file, url: URL.createObjectURL(file), type: "video" });
    });

    setVideoFiles((prev) => [...prev, ...validFiles]);
  };

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

  // Manejo de equipamiento
  const addEquipamientoSerie = () => {
    if (newEquipSerie.trim()) {
      setEquipamientoSerie((prev) => [...prev, newEquipSerie.trim()]);
      setNewEquipSerie("");
    }
  };

  const addEquipamientoOpcional = () => {
    if (newEquipOpcional.trim()) {
      setEquipamientoOpcional((prev) => [...prev, newEquipOpcional.trim()]);
      setNewEquipOpcional("");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/remolques"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Truck className="h-6 w-6 text-cyan-600" />
            Crear Nuevo Remolque
          </h1>
          <p className="text-gray-600 mt-1">
            Complete la información del remolque
          </p>
        </div>
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Error</h4>
            <p className="text-red-700 text-sm mt-1">{errors.submit}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECCIÓN 1: INFORMACIÓN PRINCIPAL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Información Principal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Título */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                placeholder="Ej: ACOPLADO 4 EJES BARANDA VOLCABLE"
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.titulo ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.titulo && (
                <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>
              )}
            </div>

            {/* Condición */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condición <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.condicion}
                onChange={(e) => handleInputChange("condicion", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                {CONDICIONES_REMOLQUE.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.categoria}
                onChange={(e) => handleInputChange("categoria", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS_REMOLQUE.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => handleInputChange("marca", e.target.value)}
                placeholder="Ej: LAMBERT"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => handleInputChange("modelo", e.target.value)}
                placeholder="Ej: A4BV"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <input
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange("anio", e.target.value)}
                min="1990"
                max={new Date().getFullYear() + 1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Tipo Carrocería */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Carrocería
              </label>
              <select
                value={formData.tipoCarroceria}
                onChange={(e) =>
                  handleInputChange("tipoCarroceria", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Seleccionar...</option>
                {TIPOS_CARROCERIA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Cantidad Ejes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad de Ejes
              </label>
              <input
                type="number"
                value={formData.cantidadEjes}
                onChange={(e) =>
                  handleInputChange("cantidadEjes", e.target.value)
                }
                min="1"
                max="20"
                placeholder="Ej: 4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Capacidad Carga */}
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
                placeholder="Ej: 18 pallets"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Tara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tara (kg)
              </label>
              <input
                type="number"
                value={formData.tara}
                onChange={(e) => handleInputChange("tara", e.target.value)}
                placeholder="Ej: 7700"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* PBTC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PBTC
              </label>
              <input
                type="text"
                value={formData.pbtc}
                onChange={(e) => handleInputChange("pbtc", e.target.value)}
                placeholder="Ej: 45 Tn (4x2) / 52,5 Tn (6x2)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Kilometraje (solo si es USADO) */}
            {formData.condicion === "USADO" && (
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
                  placeholder="Ej: 15000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            {/* Garantía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Garantía
              </label>
              <input
                type="text"
                value={formData.garantia}
                onChange={(e) => handleInputChange("garantia", e.target.value)}
                placeholder="Ej: 12 meses"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) =>
                  handleInputChange("estado", e.target.value as EstadoRemolque)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="Disponible">✅ Disponible</option>
                <option value="Reservado">⏳ Reservado</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                placeholder="Descripción general del remolque..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: ESPECIFICACIONES TÉCNICAS (Acordeones) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Especificaciones Técnicas (Opcional)
          </h2>

          {/* Acordeón Chasis */}
          <div className="border border-gray-200 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => toggleAcordeon("chasis")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-medium">Chasis</span>
              {acordeonesAbiertos.chasis ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.chasis && (
              <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tipo"
                  value={chasis.tipo || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Material"
                  value={chasis.material || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({ ...prev, material: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Piso Chapa Espesor"
                  value={chasis.pisoChapaEspesor || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({
                      ...prev,
                      pisoChapaEspesor: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Paragolpe"
                  value={chasis.paragolpe || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({
                      ...prev,
                      paragolpe: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Acordeón Dimensiones */}
          <div className="border border-gray-200 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => toggleAcordeon("dimensiones")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-medium">Dimensiones</span>
              {acordeonesAbiertos.dimensiones ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.dimensiones && (
              <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Largo Interior (mm)"
                  value={dimensiones.largoInterior || ""}
                  onChange={(e) =>
                    setDimensiones((prev) => ({
                      ...prev,
                      largoInterior: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Ancho Exterior (mm)"
                  value={dimensiones.anchoExterior || ""}
                  onChange={(e) =>
                    setDimensiones((prev) => ({
                      ...prev,
                      anchoExterior: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Altura Baranda (mm)"
                  value={dimensiones.alturaBaranda || ""}
                  onChange={(e) =>
                    setDimensiones((prev) => ({
                      ...prev,
                      alturaBaranda: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Acordeón Ejes y Suspensión */}
          <div className="border border-gray-200 rounded-lg mb-4">
            <button
              type="button"
              onClick={() => toggleAcordeon("ejesSuspension")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-medium">Ejes y Suspensión</span>
              {acordeonesAbiertos.ejesSuspension ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.ejesSuspension && (
              <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tipo de Ejes"
                  value={ejesSuspension.tipoEjes || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      tipoEjes: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Llantas"
                  value={ejesSuspension.llantas || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      llantas: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Suspensión"
                  value={ejesSuspension.suspension || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      suspension: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Frenos"
                  value={ejesSuspension.frenos || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      frenos: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Acordeón Carrocería */}
          <div className="border border-gray-200 rounded-lg">
            <button
              type="button"
              onClick={() => toggleAcordeon("carroceria")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <span className="font-medium">Carrocería</span>
              {acordeonesAbiertos.carroceria ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            {acordeonesAbiertos.carroceria && (
              <div className="p-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Tipo"
                  value={carroceria.tipo || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Material"
                  value={carroceria.material || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({
                      ...prev,
                      material: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Pintura"
                  value={carroceria.pintura || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({
                      ...prev,
                      pintura: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Tratamiento"
                  value={carroceria.tratamiento || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({
                      ...prev,
                      tratamiento: e.target.value,
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN 3: EQUIPAMIENTO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Equipamiento (Opcional)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Equipamiento de Serie */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">
                Equipamiento de Serie
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newEquipSerie}
                  onChange={(e) => setNewEquipSerie(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addEquipamientoSerie())
                  }
                  placeholder="Agregar item..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addEquipamientoSerie}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {equipamientoSerie.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEquipamientoSerie((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Equipamiento Opcional */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">
                Equipamiento Opcional
              </h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newEquipOpcional}
                  onChange={(e) => setNewEquipOpcional(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addEquipamientoOpcional())
                  }
                  placeholder="Agregar item..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={addEquipamientoOpcional}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <ul className="space-y-2">
                {equipamientoOpcional.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">{item}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setEquipamientoOpcional((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: MULTIMEDIA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Imágenes y Videos
          </h2>

          {/* Imágenes normales */}
          <div className="mb-6">
            <label className="block mb-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">
                  📸 Imágenes Normales
                </h3>
                <span className="text-sm text-gray-500">
                  ({imageFiles.length}/10 imágenes)
                </span>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-all cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Haz clic aquí para subir imágenes
                </p>
                <p className="text-xs text-gray-500">
                  o arrastra y suelta las imágenes
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  PNG, JPG, WEBP - Máximo 10 imágenes (5MB cada una)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </label>
            {errors.imagenes && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.imagenes}
              </p>
            )}
            {imageFiles.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {imageFiles.map((f, idx) => (
                  <div key={idx} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.url}
                      alt=""
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(idx, "image")}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="mb-6">
            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">🎥 Videos</h3>
                <span className="text-sm text-gray-500">
                  ({videoFiles.length}/5 videos)
                </span>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 hover:bg-cyan-50 transition-all cursor-pointer">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  Haz clic aquí para subir videos
                </p>
                <p className="text-xs text-gray-500">
                  o arrastra y suelta los videos
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  MP4, MOV, AVI - Máximo 5 videos (50MB cada uno)
                </p>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
            </label>
            {errors.videos && (
              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors.videos}
              </p>
            )}
            {videoFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                {videoFiles.map((v, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Play className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {v.file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({(v.file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(idx, "video")}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Fotos sin fondo para PDF */}
          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-700 mb-3">
              🎨 Fotos sin Fondo (Para PDF)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Opcional: Sube imágenes sin fondo para fichas técnicas
              profesionales
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Foto 1 (Portada PDF)
                  </div>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                    {fotoSinFondo1 ? (
                      <div>
                        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {fotoSinFondo1.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Haz clic para cambiar
                        </p>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-10 w-10 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Subir foto sin fondo
                        </p>
                        <p className="text-xs text-gray-500">
                          Para la portada del PDF
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFotoSinFondo1(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className="block">
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Foto 2 (Página 3 PDF)
                  </div>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
                    {fotoSinFondo2 ? (
                      <div>
                        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {fotoSinFondo2.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Haz clic para cambiar
                        </p>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="h-10 w-10 text-purple-400 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Subir foto sin fondo
                        </p>
                        <p className="text-xs text-gray-500">
                          Para la página 3 del PDF
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFotoSinFondo2(e.target.files?.[0] || null)
                      }
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <Link
            href="/dashboard/remolques"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Upload className="h-5 w-5 animate-spin" />
                Creando...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                Crear Remolque
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
