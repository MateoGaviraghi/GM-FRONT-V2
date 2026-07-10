"use client";

import { useRef, useState } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
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
import {
  AccordionSection,
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
  TextareaField,
  TextInput,
  useFormDraft,
  useToast,
  useUnsavedGuard,
} from "@/components/admin/kit";

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

const INITIAL_FORM_DATA: FormData = {
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
};

type DraftShape = {
  formData: FormData;
  chasis: ChasisRemolque;
  dimensiones: DimensionesRemolque;
  ejesSuspension: EjesSuspensionRemolque;
  carroceria: CarroceriaRemolque;
  equipamientoSerie: string[];
  equipamientoOpcional: string[];
};

export default function CrearRemolque() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Especificaciones técnicas
  const [chasis, setChasis] = useState<ChasisRemolque>({});
  const [dimensiones, setDimensiones] = useState<DimensionesRemolque>({});
  const [ejesSuspension, setEjesSuspension] = useState<EjesSuspensionRemolque>(
    {},
  );
  const [carroceria, setCarroceria] = useState<CarroceriaRemolque>({});

  // Equipamiento
  const [equipamientoSerie, setEquipamientoSerie] = useState<string[]>([]);
  const [equipamientoOpcional, setEquipamientoOpcional] = useState<string[]>(
    [],
  );
  const [newEquipSerie, setNewEquipSerie] = useState("");
  const [newEquipOpcional, setNewEquipOpcional] = useState("");

  // Archivos
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);
  const [fotoSinFondo1, setFotoSinFondo1] = useState<File | null>(null);
  const [fotoSinFondo2, setFotoSinFondo2] = useState<File | null>(null);
  const [fotoSinFondo1Preview, setFotoSinFondo1Preview] = useState<
    string | null
  >(null);
  const [fotoSinFondo2Preview, setFotoSinFondo2Preview] = useState<
    string | null
  >(null);

  // UI
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  // Borrador (elderly-first: nunca perder una carga a mitad de hacer)
  const { hasDraft, restoreDraft, dismissDraft, clearDraft } =
    useFormDraft<DraftShape>(
      "remolque-crear",
      {
        formData,
        chasis,
        dimensiones,
        ejesSuspension,
        carroceria,
        equipamientoSerie,
        equipamientoOpcional,
      },
      (draft) => {
        setFormData(draft.formData ?? INITIAL_FORM_DATA);
        setChasis(draft.chasis ?? {});
        setDimensiones(draft.dimensiones ?? {});
        setEjesSuspension(draft.ejesSuspension ?? {});
        setCarroceria(draft.carroceria ?? {});
        setEquipamientoSerie(draft.equipamientoSerie ?? []);
        setEquipamientoOpcional(draft.equipamientoOpcional ?? []);
      },
    );

  const initialSnapshotRef = useRef(JSON.stringify(INITIAL_FORM_DATA));
  const isDirty =
    JSON.stringify(formData) !== initialSnapshotRef.current ||
    Object.keys(chasis).length > 0 ||
    Object.keys(dimensiones).length > 0 ||
    Object.keys(ejesSuspension).length > 0 ||
    Object.keys(carroceria).length > 0 ||
    equipamientoSerie.length > 0 ||
    equipamientoOpcional.length > 0 ||
    imageFiles.length > 0 ||
    videoFiles.length > 0 ||
    Boolean(fotoSinFondo1) ||
    Boolean(fotoSinFondo2);

  useUnsavedGuard(isDirty);

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

      clearDraft();
      router.push("/admin/remolques?created=true");
    } catch (error: unknown) {
      console.error("Error creando remolque:", error);
      showToast({
        title: "No se pudo crear el remolque",
        message: mapApiError(error),
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  // Manejo de archivos — adaptador mínimo: MediaUploadZone entrega File[] ya comprimidos.
  const handleImageFilesSelected = (files: File[]) => {
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

  const handleVideoFilesSelected = (files: File[]) => {
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

  const handleSlotSelected = (
    slot: "fotoSinFondo1" | "fotoSinFondo2",
    file: File,
  ) => {
    const url = URL.createObjectURL(file);
    if (slot === "fotoSinFondo1") {
      setFotoSinFondo1(file);
      setFotoSinFondo1Preview(url);
    } else {
      setFotoSinFondo2(file);
      setFotoSinFondo2Preview(url);
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

  const imagePreviews: MediaPreview[] = imageFiles.map((f, idx) => ({
    id: String(idx),
    url: f.url,
    type: "image",
  }));

  const videoPreviews: MediaPreview[] = videoFiles.map((f, idx) => ({
    id: String(idx),
    url: f.url,
    type: "video",
  }));

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Remolques", href: "/admin/remolques" },
          { label: "Crear remolque" },
        ]}
      />

      {hasDraft ? (
        <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} />
      ) : null}

      <form onSubmit={handleSubmit}>
        <FormShell
          eyebrow="Remolques"
          title="Crear remolque"
          description="Completá la información del remolque. Los campos con * son obligatorios."
        >
          <FormSection index={1} title="Información principal">
            <Field
              label="Título"
              htmlFor="titulo"
              required
              error={errors.titulo}
              className="md:col-span-2"
            >
              <TextInput
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                placeholder="Ej: ACOPLADO 4 EJES BARANDA VOLCABLE"
                invalid={Boolean(errors.titulo)}
              />
            </Field>

            <Field label="Condición" htmlFor="condicion" required>
              <SelectField
                id="condicion"
                value={formData.condicion}
                onChange={(e) => handleInputChange("condicion", e.target.value)}
              >
                {CONDICIONES_REMOLQUE.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
            </Field>

            <Field label="Categoría" htmlFor="categoria">
              <SelectField
                id="categoria"
                value={formData.categoria}
                onChange={(e) => handleInputChange("categoria", e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {CATEGORIAS_REMOLQUE.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
            </Field>

            <Field label="Marca" htmlFor="marca">
              <TextInput
                id="marca"
                value={formData.marca}
                onChange={(e) => handleInputChange("marca", e.target.value)}
                placeholder="Ej: LAMBERT"
              />
            </Field>

            <Field label="Modelo" htmlFor="modelo">
              <TextInput
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleInputChange("modelo", e.target.value)}
                placeholder="Ej: A4BV"
              />
            </Field>

            <Field label="Año" htmlFor="anio" error={errors.anio}>
              <TextInput
                id="anio"
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange("anio", e.target.value)}
                min="1990"
                max={new Date().getFullYear() + 1}
                invalid={Boolean(errors.anio)}
              />
            </Field>

            <Field label="Tipo de carrocería" htmlFor="tipoCarroceria">
              <SelectField
                id="tipoCarroceria"
                value={formData.tipoCarroceria}
                onChange={(e) =>
                  handleInputChange("tipoCarroceria", e.target.value)
                }
              >
                <option value="">Seleccionar...</option>
                {TIPOS_CARROCERIA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </SelectField>
            </Field>

            <Field
              label="Cantidad de ejes"
              htmlFor="cantidadEjes"
              error={errors.cantidadEjes}
            >
              <TextInput
                id="cantidadEjes"
                type="number"
                value={formData.cantidadEjes}
                onChange={(e) =>
                  handleInputChange("cantidadEjes", e.target.value)
                }
                min="1"
                max="20"
                placeholder="Ej: 4"
                invalid={Boolean(errors.cantidadEjes)}
              />
            </Field>

            <Field label="Capacidad de carga" htmlFor="capacidadCarga">
              <TextInput
                id="capacidadCarga"
                value={formData.capacidadCarga}
                onChange={(e) =>
                  handleInputChange("capacidadCarga", e.target.value)
                }
                placeholder="Ej: 18 pallets"
              />
            </Field>

            <Field label="Tara (kg)" htmlFor="tara">
              <TextInput
                id="tara"
                type="number"
                value={formData.tara}
                onChange={(e) => handleInputChange("tara", e.target.value)}
                placeholder="Ej: 7700"
              />
            </Field>

            <Field label="PBTC" htmlFor="pbtc">
              <TextInput
                id="pbtc"
                value={formData.pbtc}
                onChange={(e) => handleInputChange("pbtc", e.target.value)}
                placeholder="Ej: 45 Tn (4x2) / 52,5 Tn (6x2)"
              />
            </Field>

            {formData.condicion === "USADO" ? (
              <Field label="Kilometraje" htmlFor="kilometraje">
                <TextInput
                  id="kilometraje"
                  type="number"
                  value={formData.kilometraje}
                  onChange={(e) =>
                    handleInputChange("kilometraje", e.target.value)
                  }
                  placeholder="Ej: 15000"
                />
              </Field>
            ) : null}

            <Field label="Garantía" htmlFor="garantia">
              <TextInput
                id="garantia"
                value={formData.garantia}
                onChange={(e) => handleInputChange("garantia", e.target.value)}
                placeholder="Ej: 12 meses"
              />
            </Field>

            <Field label="Estado" htmlFor="estado">
              <SelectField
                id="estado"
                value={formData.estado}
                onChange={(e) =>
                  handleInputChange("estado", e.target.value as EstadoRemolque)
                }
              >
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
              </SelectField>
            </Field>

            <Field
              label="Descripción"
              htmlFor="descripcion"
              className="md:col-span-2"
            >
              <TextareaField
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  handleInputChange("descripcion", e.target.value)
                }
                placeholder="Descripción general del remolque..."
                rows={4}
              />
            </Field>
          </FormSection>

          <FormSection index={2} title="Especificaciones técnicas (opcional)">
            <AccordionSection title="Chasis" className="col-span-full">
              <Field label="Tipo">
                <TextInput
                  value={chasis.tipo || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                />
              </Field>
              <Field label="Material">
                <TextInput
                  value={chasis.material || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({ ...prev, material: e.target.value }))
                  }
                />
              </Field>
              <Field label="Piso chapa espesor">
                <TextInput
                  value={chasis.pisoChapaEspesor || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({
                      ...prev,
                      pisoChapaEspesor: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Paragolpe">
                <TextInput
                  value={chasis.paragolpe || ""}
                  onChange={(e) =>
                    setChasis((prev) => ({
                      ...prev,
                      paragolpe: e.target.value,
                    }))
                  }
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Dimensiones" className="col-span-full">
              <Field label="Largo interior (mm)">
                <TextInput
                  type="number"
                  value={dimensiones.largoInterior || ""}
                  onChange={(e) =>
                    setDimensiones((prev) => ({
                      ...prev,
                      largoInterior: parseInt(e.target.value) || undefined,
                    }))
                  }
                />
              </Field>
              <Field label="Ancho exterior (mm)">
                <TextInput
                  type="number"
                  value={dimensiones.anchoExterior || ""}
                  onChange={(e) =>
                    setDimensiones((prev) => ({
                      ...prev,
                      anchoExterior: parseInt(e.target.value) || undefined,
                    }))
                  }
                />
              </Field>
              <Field label="Altura baranda (mm)">
                <TextInput
                  type="number"
                  value={dimensiones.alturaBaranda || ""}
                  onChange={(e) =>
                    setDimensiones((prev) => ({
                      ...prev,
                      alturaBaranda: parseInt(e.target.value) || undefined,
                    }))
                  }
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Ejes y suspensión" className="col-span-full">
              <Field label="Tipo de ejes">
                <TextInput
                  value={ejesSuspension.tipoEjes || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      tipoEjes: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Llantas">
                <TextInput
                  value={ejesSuspension.llantas || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      llantas: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Suspensión">
                <TextInput
                  value={ejesSuspension.suspension || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      suspension: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Frenos">
                <TextInput
                  value={ejesSuspension.frenos || ""}
                  onChange={(e) =>
                    setEjesSuspension((prev) => ({
                      ...prev,
                      frenos: e.target.value,
                    }))
                  }
                />
              </Field>
            </AccordionSection>

            <AccordionSection title="Carrocería" className="col-span-full">
              <Field label="Tipo">
                <TextInput
                  value={carroceria.tipo || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({ ...prev, tipo: e.target.value }))
                  }
                />
              </Field>
              <Field label="Material">
                <TextInput
                  value={carroceria.material || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({
                      ...prev,
                      material: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Pintura">
                <TextInput
                  value={carroceria.pintura || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({
                      ...prev,
                      pintura: e.target.value,
                    }))
                  }
                />
              </Field>
              <Field label="Tratamiento">
                <TextInput
                  value={carroceria.tratamiento || ""}
                  onChange={(e) =>
                    setCarroceria((prev) => ({
                      ...prev,
                      tratamiento: e.target.value,
                    }))
                  }
                />
              </Field>
            </AccordionSection>
          </FormSection>

          <FormSection index={3} title="Equipamiento (opcional)">
            <div className="space-y-3">
              <span className="text-[15.5px] font-semibold text-gray-800">
                Equipamiento de serie
              </span>
              <div className="flex gap-2">
                <TextInput
                  value={newEquipSerie}
                  onChange={(e) => setNewEquipSerie(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addEquipamientoSerie())
                  }
                  placeholder="Agregar item..."
                  className="flex-1"
                />
                <AdminButton
                  variant="secondary"
                  icon={Plus}
                  onClick={addEquipamientoSerie}
                >
                  Agregar
                </AdminButton>
              </div>
              <ul className="space-y-2">
                {equipamientoSerie.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5"
                  >
                    <span className="text-[16px] text-gray-900">{item}</span>
                    <AdminButton
                      variant="danger"
                      icon={Trash2}
                      className="h-10 border border-red-100 bg-red-50 px-4 text-[15px] text-red-600 hover:bg-red-100"
                      onClick={() =>
                        setEquipamientoSerie((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      ariaLabel={`Quitar ${item}`}
                    >
                      Quitar
                    </AdminButton>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <span className="text-[15.5px] font-semibold text-gray-800">
                Equipamiento opcional
              </span>
              <div className="flex gap-2">
                <TextInput
                  value={newEquipOpcional}
                  onChange={(e) => setNewEquipOpcional(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(), addEquipamientoOpcional())
                  }
                  placeholder="Agregar item..."
                  className="flex-1"
                />
                <AdminButton
                  variant="secondary"
                  icon={Plus}
                  onClick={addEquipamientoOpcional}
                >
                  Agregar
                </AdminButton>
              </div>
              <ul className="space-y-2">
                {equipamientoOpcional.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5"
                  >
                    <span className="text-[16px] text-gray-900">{item}</span>
                    <AdminButton
                      variant="danger"
                      icon={Trash2}
                      className="h-10 border border-red-100 bg-red-50 px-4 text-[15px] text-red-600 hover:bg-red-100"
                      onClick={() =>
                        setEquipamientoOpcional((prev) =>
                          prev.filter((_, i) => i !== idx),
                        )
                      }
                      ariaLabel={`Quitar ${item}`}
                    >
                      Quitar
                    </AdminButton>
                  </li>
                ))}
              </ul>
            </div>
          </FormSection>

          <FormSection index={4} title="Imágenes y videos">
            <div className="col-span-full space-y-2">
              <span className="text-[15.5px] font-semibold text-gray-800">
                Imágenes normales ({imageFiles.length}/10)
              </span>
              <MediaUploadZone
                previews={imagePreviews}
                onFilesSelected={handleImageFilesSelected}
                onRemove={(id) => removeFile(Number(id), "image")}
                max={10}
                acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
                maxSizeMB={20}
                instruccion="Arrastrá las fotos acá o hacé clic — JPG, PNG o WEBP, máximo 20 MB cada una"
              />
              {errors.imagenes ? (
                <span className="flex items-start gap-1.5 text-[15px] font-medium text-red-600">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                  {errors.imagenes}
                </span>
              ) : null}
            </div>

            <div className="col-span-full space-y-2">
              <span className="text-[15.5px] font-semibold text-gray-800">
                Videos ({videoFiles.length}/5)
              </span>
              <MediaUploadZone
                previews={videoPreviews}
                onFilesSelected={handleVideoFilesSelected}
                onRemove={(id) => removeFile(Number(id), "video")}
                max={5}
                acceptedTypes={[
                  "video/mp4",
                  "video/quicktime",
                  "video/x-msvideo",
                  "video/webm",
                ]}
                maxSizeMB={50}
                instruccion="Arrastrá los videos acá o hacé clic — MP4, MOV o AVI, máximo 50 MB cada uno"
              />
              {errors.videos ? (
                <span className="flex items-start gap-1.5 text-[15px] font-medium text-red-600">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                  {errors.videos}
                </span>
              ) : null}
            </div>

            <div className="col-span-full space-y-3 border-t border-gray-100 pt-6">
              <span className="text-[15.5px] font-semibold text-gray-800">
                Fotos sin fondo (para PDF, opcional)
              </span>
              <p className="text-[16px] text-gray-500">
                Subí imágenes sin fondo para armar fichas técnicas más
                profesionales.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-[15.5px] font-semibold text-gray-800">
                    Foto 1 (portada PDF)
                  </span>
                  <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                    {fotoSinFondo1Preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fotoSinFondo1Preview}
                        alt=""
                        className="size-full object-contain"
                      />
                    ) : (
                      <>
                        <ImageIcon
                          className="size-6 text-gray-400"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span className="px-3 text-[16px] text-gray-500">
                          Clic para subir
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSlotSelected("fotoSinFondo1", file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[15.5px] font-semibold text-gray-800">
                    Foto 2 (página 3 PDF)
                  </span>
                  <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                    {fotoSinFondo2Preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={fotoSinFondo2Preview}
                        alt=""
                        className="size-full object-contain"
                      />
                    ) : (
                      <>
                        <ImageIcon
                          className="size-6 text-gray-400"
                          strokeWidth={1.75}
                          aria-hidden
                        />
                        <span className="px-3 text-[16px] text-gray-500">
                          Clic para subir
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSlotSelected("fotoSinFondo2", file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </FormSection>

          <div className="col-span-full flex justify-end gap-3 border-t border-gray-100 pt-6">
            <AdminButton variant="secondary" href="/admin/remolques">
              Cancelar
            </AdminButton>
            <AdminButton
              type="submit"
              variant="primary"
              icon={loading ? Loader2 : Save}
              disabled={loading}
              className={loading ? "[&_svg]:animate-spin" : undefined}
            >
              {loading ? "Creando remolque..." : "Crear remolque"}
            </AdminButton>
          </div>
        </FormShell>
      </form>
    </div>
  );
}
