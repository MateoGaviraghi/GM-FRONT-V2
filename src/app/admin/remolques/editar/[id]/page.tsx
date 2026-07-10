"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";
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
  MediaFile,
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

export default function EditarRemolque() {
  const params = useParams();
  const router = useRouter();
  const remolqueId = params?.id as string;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const [chasis, setChasis] = useState<ChasisRemolque>({});
  const [dimensiones, setDimensiones] = useState<DimensionesRemolque>({});
  const [ejesSuspension, setEjesSuspension] = useState<EjesSuspensionRemolque>(
    {},
  );
  const [carroceria, setCarroceria] = useState<CarroceriaRemolque>({});

  const [equipamientoSerie, setEquipamientoSerie] = useState<string[]>([]);
  const [equipamientoOpcional, setEquipamientoOpcional] = useState<string[]>(
    [],
  );
  const [newEquipSerie, setNewEquipSerie] = useState("");
  const [newEquipOpcional, setNewEquipOpcional] = useState("");

  // Archivos ya subidos a Cloudinary (vienen del remolque cargado)
  const [existingImages, setExistingImages] = useState<MediaFile[]>([]);
  const [existingVideos, setExistingVideos] = useState<MediaFile[]>([]);
  const [existingFotoSinFondo1, setExistingFotoSinFondo1] =
    useState<MediaFile | null>(null);
  const [existingFotoSinFondo2, setExistingFotoSinFondo2] =
    useState<MediaFile | null>(null);
  const [imagenesAEliminar, setImagenesAEliminar] = useState<string[]>([]);
  const [videosAEliminar, setVideosAEliminar] = useState<string[]>([]);
  const [eliminarFotoSinFondo1, setEliminarFotoSinFondo1] = useState(false);
  const [eliminarFotoSinFondo2, setEliminarFotoSinFondo2] = useState(false);

  // Archivos nuevos — adaptador mínimo: MediaUploadZone entrega File[] ya comprimidos.
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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Se abren solos si el remolque ya tenía datos cargados en esa sección
  // (se lee una sola vez, al montar el acordeón — no necesita ser estado).
  const seccionesConDatosRef = useRef({
    chasis: false,
    dimensiones: false,
    ejesSuspension: false,
    carroceria: false,
  });

  const loadedSnapshotRef = useRef<string | null>(null);

  const loadRemolque = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await remolqueService.getRemolqueById(remolqueId);

      // Pre-poblar formulario
      const loadedFormData: FormData = {
        titulo: data.titulo || "",
        condicion: data.condicion || "0KM",
        categoria: data.categoria || "",
        marca: data.marca || "",
        modelo: data.modelo || "",
        anio: data.anio?.toString() || new Date().getFullYear().toString(),
        tipoCarroceria: data.tipoCarroceria || "",
        cantidadEjes: data.cantidadEjes?.toString() || "",
        capacidadCarga: data.capacidadCarga || "",
        tara: data.tara?.toString() || "",
        pbtc: data.pbtc || "",
        kilometraje: data.kilometraje?.toString() || "",
        estado: data.estado || "Disponible",
        garantia: data.garantia || "",
        descripcion: data.descripcion || "",
      };
      setFormData(loadedFormData);

      // Pre-poblar especificaciones técnicas
      const loadedChasis = data.chasis || {};
      const loadedDimensiones = data.dimensiones || {};
      const loadedEjesSuspension = data.ejesSuspension || {};
      const loadedCarroceria = data.carroceria || {};
      setChasis(loadedChasis);
      setDimensiones(loadedDimensiones);
      setEjesSuspension(loadedEjesSuspension);
      setCarroceria(loadedCarroceria);
      seccionesConDatosRef.current = {
        chasis: Boolean(data.chasis),
        dimensiones: Boolean(data.dimensiones),
        ejesSuspension: Boolean(data.ejesSuspension),
        carroceria: Boolean(data.carroceria),
      };

      // Pre-poblar equipamiento
      const loadedEquipSerie = data.equipamientoSerie || [];
      const loadedEquipOpcional = data.equipamientoOpcional || [];
      setEquipamientoSerie(loadedEquipSerie);
      setEquipamientoOpcional(loadedEquipOpcional);

      // Pre-poblar multimedia ya subida a Cloudinary
      setExistingImages(data.imagenes || []);
      setExistingVideos(data.videos || []);
      setExistingFotoSinFondo1(data.fotoSinFondo1 || null);
      setExistingFotoSinFondo2(data.fotoSinFondo2 || null);
      setImagenesAEliminar([]);
      setVideosAEliminar([]);
      setEliminarFotoSinFondo1(false);
      setEliminarFotoSinFondo2(false);

      loadedSnapshotRef.current = JSON.stringify({
        formData: loadedFormData,
        chasis: loadedChasis,
        dimensiones: loadedDimensiones,
        ejesSuspension: loadedEjesSuspension,
        carroceria: loadedCarroceria,
        equipamientoSerie: loadedEquipSerie,
        equipamientoOpcional: loadedEquipOpcional,
      });
    } catch (err) {
      console.error("Error cargando remolque:", err);
      setError(mapApiError(err));
    } finally {
      setLoading(false);
    }
  }, [remolqueId]);

  useEffect(() => {
    if (remolqueId) {
      loadRemolque();
    }
  }, [remolqueId, loadRemolque]);

  // Borrador (elderly-first: nunca perder cambios sin guardar)
  const { hasDraft, restoreDraft, dismissDraft, clearDraft } =
    useFormDraft<DraftShape>(
      `remolque-editar-${remolqueId}`,
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

  const currentSnapshot = JSON.stringify({
    formData,
    chasis,
    dimensiones,
    ejesSuspension,
    carroceria,
    equipamientoSerie,
    equipamientoOpcional,
  });
  const isDirty =
    !loading &&
    loadedSnapshotRef.current !== null &&
    (currentSnapshot !== loadedSnapshotRef.current ||
      imageFiles.length > 0 ||
      videoFiles.length > 0 ||
      Boolean(fotoSinFondo1) ||
      Boolean(fotoSinFondo2) ||
      imagenesAEliminar.length > 0 ||
      videosAEliminar.length > 0 ||
      eliminarFotoSinFondo1 ||
      eliminarFotoSinFondo2);

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

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (
      formData.anio &&
      (isNaN(year) || year < 1990 || year > currentYear + 1)
    ) {
      newErrors.anio = `El año debe estar entre 1990 y ${currentYear + 1}`;
    }

    const totalImagenes =
      existingImages.filter((img) => !imagenesAEliminar.includes(img.public_id))
        .length + imageFiles.length;
    if (totalImagenes > 10) {
      newErrors.imagenes = "Máximo 10 imágenes permitidas (incluyendo existentes)";
    }

    const totalVideos =
      existingVideos.filter((vid) => !videosAEliminar.includes(vid.public_id))
        .length + videoFiles.length;
    if (totalVideos > 5) {
      newErrors.videos = "Máximo 5 videos permitidos (incluyendo existentes)";
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
      };

      await remolqueService.updateRemolque(remolqueId, updateData);
      clearDraft();
      router.push("/admin/remolques?updated=true");
    } catch (error) {
      console.error("Error actualizando remolque:", error);
      showToast({
        title: "No se pudieron guardar los cambios",
        message: mapApiError(error),
        variant: "danger",
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

  // Manejo de archivos — adaptador mínimo: MediaUploadZone entrega File[] ya comprimidos.
  const handleImageFilesSelected = (files: File[]) => {
    const totalActuales =
      existingImages.filter((img) => !imagenesAEliminar.includes(img.public_id))
        .length + imageFiles.length;

    if (totalActuales + files.length > 10) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Máximo 10 imágenes permitidas (incluyendo existentes)",
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
    const totalActuales =
      existingVideos.filter((vid) => !videosAEliminar.includes(vid.public_id))
        .length + videoFiles.length;

    if (totalActuales + files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        videos: "Máximo 5 videos permitidos (incluyendo existentes)",
      }));
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

  const removeNewFile = (index: number, type: "image" | "video") => {
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

  // Marca una imagen/video YA subido para eliminar al guardar (no la vuelve a mostrar).
  const markExistingImageForDeletion = (publicId: string) => {
    setImagenesAEliminar((prev) =>
      prev.includes(publicId) ? prev : [...prev, publicId],
    );
    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: "" }));
    }
  };

  const markExistingVideoForDeletion = (publicId: string) => {
    setVideosAEliminar((prev) =>
      prev.includes(publicId) ? prev : [...prev, publicId],
    );
    if (errors.videos) {
      setErrors((prev) => ({ ...prev, videos: "" }));
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

  // previews combinadas: imágenes/videos ya subidos (Cloudinary) + archivos nuevos.
  // El botón "Quitar" de cada preview usa el id para decidir si marca la existente
  // para eliminar o si descarta el archivo nuevo recién seleccionado.
  const imagePreviews: MediaPreview[] = [
    ...existingImages
      .filter((img) => !imagenesAEliminar.includes(img.public_id))
      .map((img) => ({
        id: `existing:${img.public_id}`,
        url: img.secure_url,
        type: "image" as const,
      })),
    ...imageFiles.map((f, idx) => ({
      id: `new:${idx}`,
      url: f.url,
      type: "image" as const,
    })),
  ];

  const videoPreviews: MediaPreview[] = [
    ...existingVideos
      .filter((vid) => !videosAEliminar.includes(vid.public_id))
      .map((vid) => ({
        id: `existing:${vid.public_id}`,
        url: vid.secure_url,
        type: "video" as const,
      })),
    ...videoFiles.map((f, idx) => ({
      id: `new:${idx}`,
      url: f.url,
      type: "video" as const,
    })),
  ];

  const handleRemoveImagePreview = (id: string) => {
    if (id.startsWith("existing:")) {
      markExistingImageForDeletion(id.slice("existing:".length));
    } else {
      removeNewFile(Number(id.slice("new:".length)), "image");
    }
  };

  const handleRemoveVideoPreview = (id: string) => {
    if (id.startsWith("existing:")) {
      markExistingVideoForDeletion(id.slice("existing:".length));
    } else {
      removeNewFile(Number(id.slice("new:".length)), "video");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-[17px] text-gray-500">
          <Loader2 className="size-6 animate-spin text-gray-900" strokeWidth={2} aria-hidden />
          Cargando remolque...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md space-y-4 rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-[20px] font-semibold text-gray-900">
            No pudimos cargar el remolque
          </h2>
          <p className="text-[17px] text-gray-500">{error}</p>
          <AdminButton variant="primary" onClick={loadRemolque}>
            Reintentar
          </AdminButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Remolques", href: "/admin/remolques" },
          { label: "Editar remolque" },
        ]}
      />

      {hasDraft ? (
        <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} />
      ) : null}

      <form onSubmit={handleSubmit}>
        <FormShell
          eyebrow="Remolques"
          title="Editar remolque"
          description="Modificá la información del remolque. Los campos con * son obligatorios."
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
              />
            </Field>

            <Field label="Modelo" htmlFor="modelo">
              <TextInput
                id="modelo"
                value={formData.modelo}
                onChange={(e) => handleInputChange("modelo", e.target.value)}
              />
            </Field>

            <Field label="Año" htmlFor="anio" error={errors.anio}>
              <TextInput
                id="anio"
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange("anio", e.target.value)}
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

            <Field label="Cantidad de ejes" htmlFor="cantidadEjes">
              <TextInput
                id="cantidadEjes"
                type="number"
                value={formData.cantidadEjes}
                onChange={(e) =>
                  handleInputChange("cantidadEjes", e.target.value)
                }
              />
            </Field>

            <Field label="Capacidad de carga" htmlFor="capacidadCarga">
              <TextInput
                id="capacidadCarga"
                value={formData.capacidadCarga}
                onChange={(e) =>
                  handleInputChange("capacidadCarga", e.target.value)
                }
              />
            </Field>

            <Field label="Tara (kg)" htmlFor="tara">
              <TextInput
                id="tara"
                type="number"
                value={formData.tara}
                onChange={(e) => handleInputChange("tara", e.target.value)}
              />
            </Field>

            <Field label="PBTC" htmlFor="pbtc">
              <TextInput
                id="pbtc"
                value={formData.pbtc}
                onChange={(e) => handleInputChange("pbtc", e.target.value)}
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
                />
              </Field>
            ) : null}

            <Field label="Garantía" htmlFor="garantia">
              <TextInput
                id="garantia"
                value={formData.garantia}
                onChange={(e) => handleInputChange("garantia", e.target.value)}
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
                <option value="Vendido">Vendido</option>
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
                rows={4}
              />
            </Field>
          </FormSection>

          <FormSection index={2} title="Especificaciones técnicas">
            <AccordionSection
              title="Chasis"
              defaultOpen={seccionesConDatosRef.current.chasis}
              className="col-span-full"
            >
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

            <AccordionSection
              title="Dimensiones"
              defaultOpen={seccionesConDatosRef.current.dimensiones}
              className="col-span-full"
            >
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

            <AccordionSection
              title="Ejes y suspensión"
              defaultOpen={seccionesConDatosRef.current.ejesSuspension}
              className="col-span-full"
            >
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

            <AccordionSection
              title="Carrocería"
              defaultOpen={seccionesConDatosRef.current.carroceria}
              className="col-span-full"
            >
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

          <FormSection index={3} title="Equipamiento">
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
                Imágenes normales (
                {existingImages.filter(
                  (img) => !imagenesAEliminar.includes(img.public_id),
                ).length + imageFiles.length}
                /10)
              </span>
              <MediaUploadZone
                previews={imagePreviews}
                onFilesSelected={handleImageFilesSelected}
                onRemove={handleRemoveImagePreview}
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
                Videos (
                {existingVideos.filter(
                  (vid) => !videosAEliminar.includes(vid.public_id),
                ).length + videoFiles.length}
                /5)
              </span>
              <MediaUploadZone
                previews={videoPreviews}
                onFilesSelected={handleVideoFilesSelected}
                onRemove={handleRemoveVideoPreview}
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
                  {fotoSinFondo1Preview ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fotoSinFondo1Preview}
                        alt=""
                        className="size-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFotoSinFondo1(null);
                          setFotoSinFondo1Preview(null);
                        }}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : existingFotoSinFondo1 && !eliminarFotoSinFondo1 ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={existingFotoSinFondo1.secure_url}
                        alt=""
                        className="size-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setEliminarFotoSinFondo1(true)}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                      <ImageIcon
                        className="size-6 text-gray-400"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className="px-3 text-[16px] text-gray-500">
                        Clic para subir
                      </span>
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
                  )}
                </div>

                <div className="space-y-1.5">
                  <span className="text-[15.5px] font-semibold text-gray-800">
                    Foto 2 (página 3 PDF)
                  </span>
                  {fotoSinFondo2Preview ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={fotoSinFondo2Preview}
                        alt=""
                        className="size-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFotoSinFondo2(null);
                          setFotoSinFondo2Preview(null);
                        }}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : existingFotoSinFondo2 && !eliminarFotoSinFondo2 ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={existingFotoSinFondo2.secure_url}
                        alt=""
                        className="size-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setEliminarFotoSinFondo2(true)}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-red-100 bg-red-50 px-2.5 py-1 text-[15px] font-semibold text-red-600 transition-colors duration-150 hover:bg-red-100"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                      <ImageIcon
                        className="size-6 text-gray-400"
                        strokeWidth={1.75}
                        aria-hidden
                      />
                      <span className="px-3 text-[16px] text-gray-500">
                        Clic para subir
                      </span>
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
                  )}
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
              icon={saving ? Loader2 : Save}
              disabled={saving}
              className={saving ? "[&_svg]:animate-spin" : undefined}
            >
              {saving ? "Guardando cambios..." : "Guardar cambios"}
            </AdminButton>
          </div>
        </FormShell>
      </form>
    </div>
  );
}
