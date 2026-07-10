"use client";

import { useRef, useState } from "react";
import { Save, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { usadosService } from "@/services";
import {
  DynamicUsadosAutocomplete,
  DynamicUsadosModeloAutocomplete,
} from "@/components/dynamic-usados-autocomplete";
import {
  AdminButton,
  AutocompleteFieldShell,
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

// Estilo de campo compartido para que los autocompletes existentes (que
// aceptan className) calcen con el resto de los inputs del kit Soft SaaS (4R3).
const AUTOCOMPLETE_CLASSNAME =
  "h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-[16px] text-gray-900 placeholder:text-gray-400 transition-[border-color,box-shadow] duration-150 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 focus:outline-none focus-visible:outline-none";

export default function CrearUsados() {
  const router = useRouter();
  const { showToast } = useToast();

  // Estados del formulario
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  // Estados de archivos
  const [imageFiles, setImageFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);
  const [fotoSinFondo1, setFotoSinFondo1] = useState<File | null>(null);
  const [fotoSinFondo2, setFotoSinFondo2] = useState<File | null>(null);
  const [fotoSinFondo1Preview, setFotoSinFondo1Preview] = useState<string | null>(null);
  const [fotoSinFondo2Preview, setFotoSinFondo2Preview] = useState<string | null>(null);
  const [equipamiento, setEquipamiento] = useState<string[]>([]);

  // Estados de validación y UI
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Borrador (elderly-first: nunca perder una carga a mitad de hacer)
  const { hasDraft, restoreDraft, dismissDraft, clearDraft } =
    useFormDraft<DraftShape>(
      "usado-crear",
      { formData, equipamiento },
      (draft) => {
        setFormData(draft.formData ?? INITIAL_FORM_DATA);
        setEquipamiento(draft.equipamiento ?? []);
      },
    );

  const initialSnapshotRef = useRef(JSON.stringify(INITIAL_FORM_DATA));
  const isDirty =
    JSON.stringify(formData) !== initialSnapshotRef.current ||
    equipamiento.length > 0 ||
    imageFiles.length > 0 ||
    videoFiles.length > 0 ||
    Boolean(fotoSinFondo1) ||
    Boolean(fotoSinFondo2);

  useUnsavedGuard(isDirty);

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

    if (errors.imagenes) {
      setErrors((prev) => ({ ...prev, imagenes: "" }));
    }
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

    if (errors.videos) {
      setErrors((prev) => ({ ...prev, videos: "" }));
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

      clearDraft();

      // Redirigir al dashboard con mensaje de éxito
      router.push("/admin/usados?created=true");
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string | string[]; error?: string } };
      };
      console.error("Error creando vehículo usado:", error);
      console.error("Respuesta del servidor:", err.response?.data);

      // Limpiar errores anteriores
      const fieldErrors: FormErrors = {};

      // Extraer mensajes de error
      if (err.response?.data?.message) {
        const messages = err.response.data.message;

        if (Array.isArray(messages)) {
          const generalErrors: string[] = [];

          messages.forEach((msg: string) => {
            // Parsear mensajes como "property marca should not be empty"
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
        fieldErrors.submit = "Error al crear el vehículo usado.";
      }

      setErrors(fieldErrors);
      showToast({
        title: "No se pudo crear el vehículo usado",
        message: mapApiError(error),
        variant: "danger",
      });
    } finally {
      setLoading(false);
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
          { label: "Usados", href: "/admin/usados" },
          { label: "Crear vehículo usado" },
        ]}
      />

      {hasDraft ? (
        <DraftBanner onRestore={restoreDraft} onDismiss={dismissDraft} />
      ) : null}

      {errors.submit ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" strokeWidth={2} aria-hidden />
          <div>
            <h4 className="text-[16px] font-semibold text-red-700">
              No se pudo crear el vehículo usado
            </h4>
            <p className="whitespace-pre-line text-[15.5px] text-red-600">{errors.submit}</p>
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit}>
        <FormShell
          title="Crear vehículo usado"
          description="Completá la información del vehículo. Los campos con * son obligatorios."
        >
          <FormSection title="Información básica del vehículo" index={1}>
            <Field
              label="Título del vehículo"
              htmlFor="titulo"
              hint="Se genera automáticamente si se deja vacío"
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

            <Field label="Año del modelo" htmlFor="anio" required error={errors.anio}>
              <TextInput
                id="anio"
                type="number"
                value={formData.anio}
                onChange={(e) => handleInputChange("anio", e.target.value)}
                placeholder={new Date().getFullYear().toString()}
                min="1990"
                max={new Date().getFullYear() + 1}
                invalid={Boolean(errors.anio)}
              />
            </Field>

            <Field
              label="Kilometraje (km)"
              htmlFor="kilometraje"
              required
              error={errors.kilometraje}
            >
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
                Imágenes del vehículo ({imageFiles.length}/10)
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
                Videos del vehículo ({videoFiles.length}/5)
              </span>
              <MediaUploadZone
                previews={videoPreviews}
                onFilesSelected={handleVideoFilesSelected}
                onRemove={(id) => removeFile(Number(id), "video")}
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
                Subí imágenes con fondo transparente (PNG) para generar PDFs más
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
                      <img src={fotoSinFondo1Preview} alt="" className="size-full object-contain" />
                    ) : (
                      <>
                        <ImageIcon className="size-6 text-gray-400" strokeWidth={1.75} aria-hidden />
                        <span className="px-3 text-[15px] text-gray-500">Clic para subir</span>
                      </>
                    )}
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
                </div>

                <div className="space-y-1.5">
                  <span className="text-[15.5px] font-semibold text-gray-800">
                    Foto 2 (página 3 PDF)
                  </span>
                  <label className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-center transition-colors duration-150 hover:border-gray-400">
                    {fotoSinFondo2Preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={fotoSinFondo2Preview} alt="" className="size-full object-contain" />
                    ) : (
                      <>
                        <ImageIcon className="size-6 text-gray-400" strokeWidth={1.75} aria-hidden />
                        <span className="px-3 text-[15px] text-gray-500">Clic para subir</span>
                      </>
                    )}
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
              icon={loading ? Loader2 : Save}
              disabled={loading}
              className={loading ? "[&_svg]:animate-spin" : undefined}
            >
              {loading ? "Creando vehículo usado..." : "Crear vehículo usado"}
            </AdminButton>
          </div>
        </FormShell>
      </form>
    </div>
  );
}
