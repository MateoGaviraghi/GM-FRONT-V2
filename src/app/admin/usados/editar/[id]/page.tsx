"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Save, Loader2, AlertCircle, Trash2, Image as ImageIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { usadosService } from "@/services";
import { MediaFile } from "@/types";
import {
  DynamicUsadosAutocomplete,
  DynamicUsadosModeloAutocomplete,
} from "@/components/dynamic-usados-autocomplete";
import {
  AdminButton,
  AutocompleteFieldShell,
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
  TextareaField,
  TextInput,
  useFormDraft,
  useToast,
  useUnsavedGuard,
} from "@/components/admin/kit";

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

const EQUIPAMIENTO_OPCIONES = [
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
];

const INITIAL_FORM_DATA: FormData = {
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
};

type DraftShape = {
  formData: FormData;
  equipamiento: string[];
};

const AUTOCOMPLETE_CLASSNAME =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[16px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-150 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 focus:outline-none focus-visible:outline-none";

export default function EditarUsados() {
  const params = useParams();
  const router = useRouter();
  const usadosId = params?.id as string;
  const { showToast } = useToast();

  // Estados principales
  const [tituloActual, setTituloActual] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Estados de archivos
  const [existingImages, setExistingImages] = useState<MediaFile[]>([]);
  const [existingVideos, setExistingVideos] = useState<MediaFile[]>([]);
  const [existingFotoSinFondo1, setExistingFotoSinFondo1] = useState<MediaFile | null>(null);
  const [existingFotoSinFondo2, setExistingFotoSinFondo2] = useState<MediaFile | null>(null);
  const [newImageFiles, setNewImageFiles] = useState<FilePreview[]>([]);
  const [newVideoFiles, setNewVideoFiles] = useState<FilePreview[]>([]);
  const [newFotoSinFondo1, setNewFotoSinFondo1] = useState<File | null>(null);
  const [newFotoSinFondo2, setNewFotoSinFondo2] = useState<File | null>(null);
  const [fotoSinFondo1Preview, setFotoSinFondo1Preview] = useState<string | null>(null);
  const [fotoSinFondo2Preview, setFotoSinFondo2Preview] = useState<string | null>(null);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [videosToDelete, setVideosToDelete] = useState<string[]>([]);
  const [deleteFotoSinFondo1, setDeleteFotoSinFondo1] = useState(false);
  const [deleteFotoSinFondo2, setDeleteFotoSinFondo2] = useState(false);
  const [equipamiento, setEquipamiento] = useState<string[]>([]);

  // Estados de validación
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadedSnapshotRef = useRef<string | null>(null);

  // Cargar datos del vehículo usado
  const loadUsados = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await usadosService.getUsadosById(usadosId);

      setTituloActual(data.titulo || `${data.marca} ${data.modelo}`);
      setExistingImages(data.imagenes || []);
      setExistingVideos(data.videos || []);
      setExistingFotoSinFondo1(data.fotoSinFondo1 || null);
      setExistingFotoSinFondo2(data.fotoSinFondo2 || null);
      setImagesToDelete([]);
      setVideosToDelete([]);
      setDeleteFotoSinFondo1(false);
      setDeleteFotoSinFondo2(false);

      const loadedEquipamiento = data.equipamiento || [];
      setEquipamiento(loadedEquipamiento);

      // Pre-poblar formulario
      const loadedFormData: FormData = {
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
      };
      setFormData(loadedFormData);

      loadedSnapshotRef.current = JSON.stringify({
        formData: loadedFormData,
        equipamiento: loadedEquipamiento,
      });
    } catch (err) {
      console.error("Error cargando vehículo usado:", err);
      setError(mapApiError(err));
    } finally {
      setLoading(false);
    }
  }, [usadosId]);

  useEffect(() => {
    if (usadosId) {
      loadUsados();
    }
  }, [usadosId, loadUsados]);

  // Borrador (elderly-first: nunca perder cambios sin guardar)
  const { hasDraft, restoreDraft, dismissDraft, clearDraft } =
    useFormDraft<DraftShape>(
      `usado-editar-${usadosId}`,
      { formData, equipamiento },
      (draft) => {
        setFormData(draft.formData ?? INITIAL_FORM_DATA);
        setEquipamiento(draft.equipamiento ?? []);
      },
    );

  const currentSnapshot = JSON.stringify({ formData, equipamiento });
  const isDirty =
    !loading &&
    loadedSnapshotRef.current !== null &&
    (currentSnapshot !== loadedSnapshotRef.current ||
      newImageFiles.length > 0 ||
      newVideoFiles.length > 0 ||
      Boolean(newFotoSinFondo1) ||
      Boolean(newFotoSinFondo2) ||
      imagesToDelete.length > 0 ||
      videosToDelete.length > 0 ||
      deleteFotoSinFondo1 ||
      deleteFotoSinFondo2);

  useUnsavedGuard(isDirty);

  // Validaciones
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.marca.trim()) newErrors.marca = "La marca es requerida";
    if (!formData.modelo.trim()) newErrors.modelo = "El modelo es requerido";
    if (!formData.anio.trim()) newErrors.anio = "El año es requerido";
    if (!formData.kilometraje.trim())
      newErrors.kilometraje = "El kilometraje es requerido";

    const currentYear = new Date().getFullYear();
    const year = parseInt(formData.anio);
    if (
      formData.anio &&
      (isNaN(year) || year < 1990 || year > currentYear + 1)
    ) {
      newErrors.anio = `El año debe estar entre 1990 y ${currentYear + 1}`;
    }

    if (formData.kilometraje && parseInt(formData.kilometraje) < 0) {
      newErrors.kilometraje = "El kilometraje no puede ser negativo";
    }

    const totalImages =
      existingImages.filter((img) => !imagesToDelete.includes(img.public_id))
        .length + newImageFiles.length;
    const totalVideos =
      existingVideos.filter((vid) => !videosToDelete.includes(vid.public_id))
        .length + newVideoFiles.length;

    if (totalImages > 10) {
      newErrors.imagenes = "Máximo 10 imágenes permitidas (incluyendo existentes)";
    }
    if (totalVideos > 5) {
      newErrors.videos = "Máximo 5 videos permitidos (incluyendo existentes)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en inputs
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Manejo de archivos — adaptador mínimo: MediaUploadZone entrega File[] ya comprimidos.
  const handleImageFilesSelected = (files: File[]) => {
    const currentTotal =
      existingImages.filter((img) => !imagesToDelete.includes(img.public_id)).length +
      newImageFiles.length;

    if (currentTotal + files.length > 10) {
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

    setNewImageFiles((prev) => [...prev, ...validFiles]);

    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: "" }));
    }
  };

  const handleVideoFilesSelected = (files: File[]) => {
    const currentTotal =
      existingVideos.filter((vid) => !videosToDelete.includes(vid.public_id)).length +
      newVideoFiles.length;

    if (currentTotal + files.length > 5) {
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

    setNewVideoFiles((prev) => [...prev, ...validFiles]);

    if (errors.videos) {
      setErrors((prev) => ({ ...prev, videos: "" }));
    }
  };

  // Marcar imagen/video existente para eliminar
  const markExistingImageForDeletion = (publicId: string) => {
    setImagesToDelete((prev) => (prev.includes(publicId) ? prev : [...prev, publicId]));
    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: "" }));
    }
  };

  const markExistingVideoForDeletion = (publicId: string) => {
    setVideosToDelete((prev) => (prev.includes(publicId) ? prev : [...prev, publicId]));
    if (errors.videos) {
      setErrors((prev) => ({ ...prev, videos: "" }));
    }
  };

  // Remover archivo nuevo
  const removeNewFile = (index: number, type: "image" | "video") => {
    if (type === "image") {
      const files = [...newImageFiles];
      URL.revokeObjectURL(files[index].url);
      files.splice(index, 1);
      setNewImageFiles(files);
    } else {
      const files = [...newVideoFiles];
      URL.revokeObjectURL(files[index].url);
      files.splice(index, 1);
      setNewVideoFiles(files);
    }
  };

  const handleSlotSelected = (
    slot: "fotoSinFondo1" | "fotoSinFondo2",
    file: File,
  ) => {
    const url = URL.createObjectURL(file);
    if (slot === "fotoSinFondo1") {
      setNewFotoSinFondo1(file);
      setFotoSinFondo1Preview(url);
    } else {
      setNewFotoSinFondo2(file);
      setFotoSinFondo2Preview(url);
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

      // Actualizar vehículo usado con multimedia
      await usadosService.updateUsadosWithMedia(usadosId, apiFormData);

      // Limpiar URLs de objetos nuevos
      newImageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      newVideoFiles.forEach((file) => URL.revokeObjectURL(file.url));

      clearDraft();

      // Redirigir al dashboard con mensaje de éxito
      router.push("/admin/usados?updated=true");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string | string[]; error?: string } };
      };
      console.error("Error actualizando vehículo usado:", error);
      console.error("Respuesta del servidor:", err.response?.data);

      const fieldErrors: FormErrors = {};

      if (err.response?.data?.message) {
        const messages = err.response.data.message;

        if (Array.isArray(messages)) {
          const generalErrors: string[] = [];

          messages.forEach((msg: string) => {
            const fieldMatch = msg.match(/property (\w+) (.+)/);

            if (fieldMatch) {
              const fieldName = fieldMatch[1];
              const errorMsg = fieldMatch[2];

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

          if (generalErrors.length > 0) {
            fieldErrors.submit = generalErrors.join("\n• ");
          }

          if (
            Object.keys(fieldErrors).length > 0 &&
            generalErrors.length === 0
          ) {
            fieldErrors.submit =
              "Por favor, corrige los errores en el formulario";
          }
        } else {
          fieldErrors.submit = messages;
        }
      } else if (err.response?.data?.error) {
        fieldErrors.submit = err.response.data.error;
      } else if ((error as Error).message) {
        fieldErrors.submit = (error as Error).message;
      } else {
        fieldErrors.submit = "Error al actualizar el vehículo usado.";
      }

      setErrors(fieldErrors);
      showToast({
        title: "No se pudieron guardar los cambios",
        message: mapApiError(error),
        variant: "danger",
      });
    } finally {
      setSaving(false);
    }
  };

  // Eliminar vehículo usado
  const handleDelete = async () => {
    try {
      setSaving(true);
      await usadosService.deleteUsados(usadosId);

      newImageFiles.forEach((file) => URL.revokeObjectURL(file.url));
      newVideoFiles.forEach((file) => URL.revokeObjectURL(file.url));

      router.push("/admin/usados?deleted=true");
    } catch (err) {
      console.error("Error eliminando vehículo usado:", err);
      showToast({
        title: "No se pudo eliminar el vehículo usado",
        message: mapApiError(err),
        variant: "danger",
      });
    } finally {
      setSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // previews combinadas: media ya subida (Cloudinary) + archivos nuevos.
  const imagePreviews: MediaPreview[] = [
    ...existingImages
      .filter((img) => !imagesToDelete.includes(img.public_id))
      .map((img) => ({
        id: `existing:${img.public_id}`,
        url: img.secure_url,
        type: "image" as const,
      })),
    ...newImageFiles.map((f, idx) => ({
      id: `new:${idx}`,
      url: f.url,
      type: "image" as const,
    })),
  ];

  const videoPreviews: MediaPreview[] = [
    ...existingVideos
      .filter((vid) => !videosToDelete.includes(vid.public_id))
      .map((vid) => ({
        id: `existing:${vid.public_id}`,
        url: vid.secure_url,
        type: "video" as const,
      })),
    ...newVideoFiles.map((f, idx) => ({
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
        <div className="flex items-center gap-3 text-[16px] text-gray-500">
          <Loader2 className="size-6 animate-spin text-gray-400" strokeWidth={2} aria-hidden />
          Cargando vehículo usado...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="max-w-md space-y-4 rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h2 className="text-[20px] font-semibold text-gray-900">
            No pudimos cargar el vehículo usado
          </h2>
          <p className="text-[16px] text-gray-500">{error}</p>
          <AdminButton variant="primary" onClick={loadUsados}>
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
          { label: "Usados", href: "/admin/usados" },
          { label: "Editar vehículo usado" },
        ]}
      />

      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em] text-gray-900">Editar vehículo usado</h1>
          <p className="mt-1.5 text-[16px] text-gray-500">{tituloActual}</p>
        </div>
        <AdminButton
          variant="danger"
          icon={Trash2}
          className="rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Eliminar
        </AdminButton>
      </div>

      {hasDraft ? (
        <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} />
      ) : null}

      {errors.submit ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />
          <div>
            <h4 className="text-[16px] font-semibold text-red-700">
              No se pudieron guardar los cambios
            </h4>
            <p className="whitespace-pre-line text-[15.5px] text-red-600">{errors.submit}</p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <FormShell
          title="Editar vehículo usado"
          description="Modificá la información del vehículo. Los campos con * son obligatorios."
        >
          <FormSection title="Información básica del vehículo" index={1}>
            <Field
              label="Título del vehículo"
              htmlFor="titulo"
              className="md:col-span-2"
            >
              <TextInput
                id="titulo"
                value={formData.titulo}
                onChange={(e) => handleInputChange("titulo", e.target.value)}
                placeholder="Ej: Toyota Hilux 2020 SRV"
              />
            </Field>

            <AutocompleteFieldShell label="Marca" htmlFor="marca" required error={errors.marca}>
              <DynamicUsadosAutocomplete
                id="marca"
                name="marca"
                value={formData.marca}
                onChange={(value) => handleInputChange("marca", value)}
                field="marcas"
                placeholder="Escribir o seleccionar marca..."
                isAdmin
                allowCustom
                className={`${AUTOCOMPLETE_CLASSNAME} ${errors.marca ? "border-red-500" : ""}`}
              />
            </AutocompleteFieldShell>

            <AutocompleteFieldShell label="Modelo" htmlFor="modelo" required error={errors.modelo}>
              <DynamicUsadosModeloAutocomplete
                id="modelo"
                name="modelo"
                value={formData.modelo}
                onChange={(value) => handleInputChange("modelo", value)}
                marca={formData.marca}
                placeholder="Escribir o seleccionar modelo..."
                isAdmin
                allowCustom
                className={`${AUTOCOMPLETE_CLASSNAME} ${errors.modelo ? "border-red-500" : ""}`}
              />
            </AutocompleteFieldShell>

            <AutocompleteFieldShell label="Tipo de vehículo" htmlFor="tipoVehiculo">
              <DynamicUsadosAutocomplete
                id="tipoVehiculo"
                name="tipoVehiculo"
                value={formData.tipoVehiculo}
                onChange={(value) => handleInputChange("tipoVehiculo", value)}
                field="tiposVehiculo"
                placeholder="Escribir o seleccionar tipo..."
                isAdmin
                allowCustom
                className={AUTOCOMPLETE_CLASSNAME}
              />
            </AutocompleteFieldShell>

            <Field label="Año del modelo" htmlFor="anio" error={errors.anio}>
              <TextInput
                id="anio"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={formData.anio}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "");
                  if (value.length <= 4) {
                    handleInputChange("anio", value);
                  }
                }}
                placeholder={new Date().getFullYear().toString()}
                invalid={Boolean(errors.anio)}
              />
            </Field>

            <Field label="Kilometraje (km)" htmlFor="kilometraje" error={errors.kilometraje}>
              <TextInput
                id="kilometraje"
                type="number"
                value={formData.kilometraje}
                onChange={(e) => handleInputChange("kilometraje", e.target.value)}
                placeholder="Ej: 45000"
                min="0"
                invalid={Boolean(errors.kilometraje)}
              />
            </Field>

            <Field
              label="Estado del vehículo"
              htmlFor="estado"
              required
              hint='Solo los vehículos "Disponibles" se muestran en la página pública'
            >
              <SelectField
                id="estado"
                value={formData.estado}
                onChange={(e) => handleInputChange("estado", e.target.value)}
              >
                <option value="Disponible">Disponible (Visible en página pública)</option>
                <option value="Reservado">Reservado (Oculto en página pública)</option>
                <option value="Vendido">Vendido (Oculto en página pública)</option>
              </SelectField>
            </Field>

            <AutocompleteFieldShell label="Versión" htmlFor="version">
              <DynamicUsadosAutocomplete
                id="version"
                name="version"
                value={formData.version}
                onChange={(value) => handleInputChange("version", value)}
                field="versiones"
                placeholder="Ej: XLT, SRV, Limited..."
                isAdmin
                allowCustom
                className={AUTOCOMPLETE_CLASSNAME}
              />
            </AutocompleteFieldShell>
          </FormSection>

          <FormSection title="Especificaciones técnicas" index={2}>
            <AutocompleteFieldShell label="Tipo de combustible" htmlFor="tipoCombustible">
              <DynamicUsadosAutocomplete
                id="tipoCombustible"
                name="tipoCombustible"
                value={formData.tipoCombustible}
                onChange={(value) => handleInputChange("tipoCombustible", value)}
                field="combustibles"
                placeholder="Escribir o seleccionar..."
                isAdmin
                allowCustom
                className={AUTOCOMPLETE_CLASSNAME}
              />
            </AutocompleteFieldShell>

            <Field label="Motor" htmlFor="motor">
              <TextInput
                id="motor"
                value={formData.motor}
                onChange={(e) => handleInputChange("motor", e.target.value)}
                placeholder="Ej: 2.8L Turbo"
              />
            </Field>

            <AutocompleteFieldShell label="Transmisión" htmlFor="transmision">
              <DynamicUsadosAutocomplete
                id="transmision"
                name="transmision"
                value={formData.transmision}
                onChange={(value) => handleInputChange("transmision", value)}
                field="transmisiones"
                placeholder="Escribir o seleccionar..."
                isAdmin
                allowCustom
                className={AUTOCOMPLETE_CLASSNAME}
              />
            </AutocompleteFieldShell>

            <AutocompleteFieldShell label="Tracción" htmlFor="traccion">
              <DynamicUsadosAutocomplete
                id="traccion"
                name="traccion"
                value={formData.traccion}
                onChange={(value) => handleInputChange("traccion", value)}
                field="tracciones"
                placeholder="Escribir o seleccionar..."
                isAdmin
                allowCustom
                className={AUTOCOMPLETE_CLASSNAME}
              />
            </AutocompleteFieldShell>

            <Field label="Potencia" htmlFor="potencia">
              <TextInput
                id="potencia"
                value={formData.potencia}
                onChange={(e) => handleInputChange("potencia", e.target.value)}
                placeholder="Ej: 200 HP, 150 CV"
              />
            </Field>

            <Field label="Capacidad de carga" htmlFor="capacidadCarga">
              <TextInput
                id="capacidadCarga"
                value={formData.capacidadCarga}
                onChange={(e) => handleInputChange("capacidadCarga", e.target.value)}
                placeholder="Ej: 1000 kg"
              />
            </Field>

            <Field label="Sistema de frenado" htmlFor="sistemaFrenado">
              <TextInput
                id="sistemaFrenado"
                value={formData.sistemaFrenado}
                onChange={(e) => handleInputChange("sistemaFrenado", e.target.value)}
                placeholder="Ej: ABS + EBD"
              />
            </Field>

            <Field label="Cilindrada" htmlFor="cilindrada">
              <TextInput
                id="cilindrada"
                value={formData.cilindrada}
                onChange={(e) => handleInputChange("cilindrada", e.target.value)}
                placeholder="Ej: 2.0L, 1800cc"
              />
            </Field>

            <Field label="Color" htmlFor="color">
              <TextInput
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="Ej: Blanco, Rojo"
              />
            </Field>

            <Field label="Cantidad de puertas" htmlFor="cantidadPuertas">
              <TextInput
                id="cantidadPuertas"
                type="number"
                value={formData.cantidadPuertas}
                onChange={(e) => handleInputChange("cantidadPuertas", e.target.value)}
                placeholder="Ej: 4"
                min="2"
                max="5"
              />
            </Field>

            <Field label="Cantidad de asientos" htmlFor="cantidadAsientos">
              <TextInput
                id="cantidadAsientos"
                type="number"
                value={formData.cantidadAsientos}
                onChange={(e) => handleInputChange("cantidadAsientos", e.target.value)}
                placeholder="Ej: 5"
                min="2"
                max="9"
              />
            </Field>
          </FormSection>

          <FormSection title="Equipamiento (opcional)" index={3}>
            <div className="col-span-full grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EQUIPAMIENTO_OPCIONES.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-colors duration-150 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={equipamiento.includes(item)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEquipamiento([...equipamiento, item]);
                      } else {
                        setEquipamiento(equipamiento.filter((eq) => eq !== item));
                      }
                    }}
                    className="size-5 shrink-0 accent-gray-900"
                  />
                  <span className="text-[16px] text-gray-900">{item}</span>
                </label>
              ))}
            </div>
          </FormSection>

          <FormSection title="Imágenes y videos" index={4}>
            <div className="col-span-full space-y-2">
              <span className="text-[15.5px] font-semibold text-gray-800">
                Imágenes del vehículo (
                {existingImages.filter((img) => !imagesToDelete.includes(img.public_id)).length +
                  newImageFiles.length}
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
                Videos del vehículo (
                {existingVideos.filter((vid) => !videosToDelete.includes(vid.public_id)).length +
                  newVideoFiles.length}
                /5)
              </span>
              <MediaUploadZone
                previews={videoPreviews}
                onFilesSelected={handleVideoFilesSelected}
                onRemove={handleRemoveVideoPreview}
                max={5}
                acceptedTypes={["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"]}
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
                Fotos sin fondo (para ficha técnica PDF, opcional)
              </span>
              <p className="text-[14.5px] text-gray-500">
                Se usan para generar la ficha técnica en PDF. Deben tener fondo
                transparente (PNG).
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-[15.5px] font-semibold text-gray-800">
                    Foto principal sin fondo
                  </span>
                  {fotoSinFondo1Preview ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={fotoSinFondo1Preview} alt="" className="size-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewFotoSinFondo1(null);
                          setFotoSinFondo1Preview(null);
                        }}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1 text-[15px] font-semibold text-gray-700 transition-colors duration-150 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : existingFotoSinFondo1 && !deleteFotoSinFondo1 ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={existingFotoSinFondo1.secure_url}
                        alt=""
                        className="size-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setDeleteFotoSinFondo1(true)}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1 text-[15px] font-semibold text-gray-700 transition-colors duration-150 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                      <ImageIcon className="size-6 text-gray-400" strokeWidth={1.75} aria-hidden />
                      <span className="px-3 text-[15px] text-gray-500">Clic para subir</span>
                      <input
                        type="file"
                        accept="image/png"
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
                    Foto secundaria sin fondo
                  </span>
                  {fotoSinFondo2Preview ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={fotoSinFondo2Preview} alt="" className="size-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setNewFotoSinFondo2(null);
                          setFotoSinFondo2Preview(null);
                        }}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1 text-[15px] font-semibold text-gray-700 transition-colors duration-150 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : existingFotoSinFondo2 && !deleteFotoSinFondo2 ? (
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={existingFotoSinFondo2.secure_url}
                        alt=""
                        className="size-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setDeleteFotoSinFondo2(true)}
                        className="absolute right-1.5 top-1.5 flex items-center gap-1 rounded-lg border border-gray-200 bg-white/95 px-2.5 py-1 text-[15px] font-semibold text-gray-700 transition-colors duration-150 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                      <ImageIcon className="size-6 text-gray-400" strokeWidth={1.75} aria-hidden />
                      <span className="px-3 text-[15px] text-gray-500">Clic para subir</span>
                      <input
                        type="file"
                        accept="image/png"
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

          <FormSection title="Descripción" index={5}>
            <Field label="Descripción" htmlFor="descripcion" className="md:col-span-2">
              <TextareaField
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => handleInputChange("descripcion", e.target.value)}
                placeholder="Describí las características y condiciones del vehículo usado..."
                rows={6}
              />
            </Field>
          </FormSection>

          <div className="col-span-full flex justify-end gap-3 border-t border-gray-100 pt-6">
            <AdminButton variant="secondary" href="/admin/usados">
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

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar vehículo usado"
        message="¿Eliminar este vehículo usado? Esta acción no se puede deshacer. El vehículo y todos sus archivos multimedia se eliminarán permanentemente."
        confirmLabel="Eliminar"
        danger
      />
    </div>
  );
}
