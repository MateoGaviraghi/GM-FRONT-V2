/**
 * Utilidad de debug para verificar los datos del vehículo usado
 * Incluye información sobre las fotos sin fondo
 */

import { Usados } from "@/types";

export const debugUsadoData = (usado: Usados) => {
  console.group("🔍 DEBUG: Datos del Vehículo Usado");

  console.log("ID:", usado._id);
  console.log("Título:", usado.titulo);
  console.log("Marca:", usado.marca);
  console.log("Modelo:", usado.modelo);

  console.group("📸 Imágenes");
  console.log("Total imágenes:", usado.imagenes?.length || 0);
  if (usado.imagenes && usado.imagenes.length > 0) {
    usado.imagenes.forEach((img, i) => {
      console.log(`Imagen ${i + 1}:`, img.secure_url);
    });
  }
  console.groupEnd();

  console.group("🎨 Fotos Sin Fondo (para PDF)");
  console.log("¿Tiene fotoSinFondo1?", !!usado.fotoSinFondo1);
  console.log("¿Tiene fotoSinFondo2?", !!usado.fotoSinFondo2);

  if (usado.fotoSinFondo1) {
    console.log("fotoSinFondo1 URL:", usado.fotoSinFondo1.secure_url);
    console.log("fotoSinFondo1 public_id:", usado.fotoSinFondo1.public_id);
  } else {
    console.warn("⚠️ No hay fotoSinFondo1 - El PDF usará imagen normal");
  }

  if (usado.fotoSinFondo2) {
    console.log("fotoSinFondo2 URL:", usado.fotoSinFondo2.secure_url);
    console.log("fotoSinFondo2 public_id:", usado.fotoSinFondo2.public_id);
  } else {
    console.warn(
      "⚠️ No hay fotoSinFondo2 - El PDF solo tendrá 1 foto sin fondo"
    );
  }
  console.groupEnd();

  console.log(
    "📄 URL del PDF:",
    `${process.env.NEXT_PUBLIC_API_URL}/usados/public/${usado._id}/ficha-tecnica`
  );

  console.groupEnd();
};

export const debugPDFRequest = (usadoId: string) => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/usados/public/${usadoId}/ficha-tecnica`;
  console.log("🔗 Abriendo PDF:", url);
  console.log(
    "💡 Tip: Abre las DevTools del navegador en la nueva pestaña para ver errores del PDF"
  );
};
