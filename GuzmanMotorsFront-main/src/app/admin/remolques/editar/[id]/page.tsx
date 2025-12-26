"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Truck,
  ArrowLeft,
  Save,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { remolqueService } from "@/services";
import {
  CondicionRemolque,
  CategoriaRemolque,
  EstadoRemolque,
  UpdateRemolqueDto,
  ChasisRemolque,
  DimensionesRemolque,
  EjesSuspensionRemolque,
  CarroceriaRemolque,
  CONDICIONES_REMOLQUE,
  CATEGORIAS_REMOLQUE,
  TIPOS_CARROCERIA,
} from "@/types";

interface FormData {
  titulo: string;
  condicion: CondicionRemolque;
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

export default function EditarRemolque() {
  const params = useParams();
  const router = useRouter();
  const remolqueId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const [chasis, setChasis] = useState<ChasisRemolque>({});
  const [dimensiones, setDimensiones] = useState<DimensionesRemolque>({});
  const [ejesSuspension, setEjesSuspension] = useState<EjesSuspensionRemolque>(
    {}
  );
  const [carroceria, setCarroceria] = useState<CarroceriaRemolque>({});

  const [equipamientoSerie, setEquipamientoSerie] = useState<string[]>([]);
  const [equipamientoOpcional, setEquipamientoOpcional] = useState<string[]>(
    []
  );
  const [newEquipSerie, setNewEquipSerie] = useState("");
  const [newEquipOpcional, setNewEquipOpcional] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [acordeonesAbiertos, setAcordeonesAbiertos] = useState({
    chasis: false,
    dimensiones: false,
    ejesSuspension: false,
    carroceria: false,
  });

  const loadRemolque = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await remolqueService.getRemolqueById(remolqueId);

      // Pre-poblar formulario
      setFormData({
        titulo: data.titulo || "",
        condicion: data.condicion || "0KM",
        categoria: data.categoria || "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        anio: data.anio
          ? new Date(data.anio).getFullYear().toString()
          : new Date().getFullYear().toString(),
        tipoCarroceria: data.tipoCarroceria || "",
        cantidadEjes: data.cantidadEjes?.toString() || "",
        capacidadCarga: data.capacidadCarga || "",
        tara: data.tara?.toString() || "",
        pbtc: data.pbtc || "",
        kilometraje: data.kilometraje?.toString() || "",
        estado: data.estado || "Disponible",
        garantia: data.garantia || "",
        descripcion: data.descripcion || "",
      });

      // Pre-poblar especificaciones técnicas
      if (data.chasis) {
        setChasis(data.chasis);
        setAcordeonesAbiertos((prev) => ({ ...prev, chasis: true }));
      }
      if (data.dimensiones) {
        setDimensiones(data.dimensiones);
        setAcordeonesAbiertos((prev) => ({ ...prev, dimensiones: true }));
      }
      if (data.ejesSuspension) {
        setEjesSuspension(data.ejesSuspension);
        setAcordeonesAbiertos((prev) => ({ ...prev, ejesSuspension: true }));
      }
      if (data.carroceria) {
        setCarroceria(data.carroceria);
        setAcordeonesAbiertos((prev) => ({ ...prev, carroceria: true }));
      }

      // Pre-poblar equipamiento
      if (data.equipamientoSerie) setEquipamientoSerie(data.equipamientoSerie);
      if (data.equipamientoOpcional)
        setEquipamientoOpcional(data.equipamientoOpcional);
    } catch (err) {
      console.error("Error cargando remolque:", err);
      setError("Error al cargar los datos del remolque");
    } finally {
      setLoading(false);
    }
  }, [remolqueId]);

  useEffect(() => {
    if (remolqueId) {
      loadRemolque();
    }
  }, [remolqueId, loadRemolque]);

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

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (
      formData.anio &&
      (isNaN(year) || year < 1990 || year > currentYear + 1)
    ) {
      newErrors.anio = `El año debe estar entre 1990 y ${currentYear + 1}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const updateData: UpdateRemolqueDto = {
        titulo: formData.titulo,
        condicion: formData.condicion,
        categoria: formData.categoria || undefined,
        marca: formData.marca || undefined,
        modelo: formData.modelo || undefined,
        anio: formData.anio
          ? new Date(`${formData.anio}-06-15T12:00:00.000Z`)
          : undefined,
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
      };

      await remolqueService.updateRemolque(remolqueId, updateData);
      router.push("/admin/remolques?updated=true");
    } catch (error) {
      console.error("Error actualizando remolque:", error);
      setErrors({
        submit:
          "Error al actualizar el remolque. Por favor, inténtelo nuevamente.",
      });
    } finally {
      setSaving(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-cyan-600 mx-auto mb-2" />
          <p className="text-gray-600">Cargando remolque...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRemolque}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/remolques"
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <Truck className="h-6 w-6 text-cyan-600" />
            Editar Remolque
          </h1>
          <p className="text-gray-600 mt-1">
            Modifique la información del remolque
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
        {/* INFORMACIÓN PRINCIPAL */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Información Principal
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg ${
                  errors.titulo ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.titulo && (
                <p className="text-red-600 text-sm mt-1">{errors.titulo}</p>
              )}
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca
              </label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => handleInputChange("marca", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo
              </label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => handleInputChange("modelo", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año
              </label>
              <input
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange("anio", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tara (kg)
              </label>
              <input
                type="number"
                value={formData.tara}
                onChange={(e) => handleInputChange("tara", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PBTC
              </label>
              <input
                type="text"
                value={formData.pbtc}
                onChange={(e) => handleInputChange("pbtc", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Garantía
              </label>
              <input
                type="text"
                value={formData.garantia}
                onChange={(e) => handleInputChange("garantia", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

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
                <option value="Vendido">✔️ Vendido</option>
              </select>
            </div>

            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ESPECIFICACIONES TÉCNICAS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Especificaciones Técnicas
          </h2>

          {/* Chasis */}
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

          {/* Dimensiones */}
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

          {/* Ejes y Suspensión */}
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

          {/* Carrocería */}
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

        {/* EQUIPAMIENTO */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Equipamiento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Botones */}
        <div className="flex gap-4 justify-end">
          <Link
            href="/admin/remolques"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {saving ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" />
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
    </div>
  );
}
