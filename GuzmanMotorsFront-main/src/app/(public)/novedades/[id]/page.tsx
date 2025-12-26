"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Newspaper,
  Calendar,
  Eye,
  Tag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Clock,
  Share2,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { novedadService } from "@/services";
import type { Novedad } from "@/types";

export default function NovedadDetallePage() {
  const params = useParams();
  const novedadId = params.id as string;

  const [novedad, setNovedad] = useState<Novedad | null>(null);
  const [relacionadas, setRelacionadas] = useState<Novedad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (novedadId) {
      cargarNovedad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [novedadId]);

  // Actualizar meta tags para compartir en redes sociales
  useEffect(() => {
    if (novedad) {
      const baseUrl = window.location.origin;
      const currentUrl = window.location.href;
      const imageUrl =
        novedad.imagenes?.[0]?.thumbnails?.large || `${baseUrl}/logo.png`;

      // Actualizar meta tags
      document.title = `${novedad.titulo} | Guzman Motors`;

      // Open Graph
      updateMetaTag("og:title", novedad.titulo);
      updateMetaTag("og:description", novedad.resumen || novedad.titulo);
      updateMetaTag("og:image", imageUrl);
      updateMetaTag("og:url", currentUrl);
      updateMetaTag("og:type", "article");

      // Twitter Card
      updateMetaTag("twitter:card", "summary_large_image");
      updateMetaTag("twitter:title", novedad.titulo);
      updateMetaTag("twitter:description", novedad.resumen || novedad.titulo);
      updateMetaTag("twitter:image", imageUrl);

      // Description
      updateMetaTag("description", novedad.resumen || novedad.titulo);
    }
  }, [novedad]);

  const updateMetaTag = (property: string, content: string) => {
    let element = document.querySelector(
      `meta[property="${property}"]`
    ) as HTMLMetaElement;
    if (!element) {
      element = document.querySelector(
        `meta[name="${property}"]`
      ) as HTMLMetaElement;
    }
    if (!element) {
      element = document.createElement("meta");
      if (property.startsWith("og:") || property.startsWith("article:")) {
        element.setAttribute("property", property);
      } else {
        element.setAttribute("name", property);
      }
      document.head.appendChild(element);
    }
    element.setAttribute("content", content);
  };

  const cargarNovedad = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await novedadService.public.getById(novedadId);
      setNovedad(data);

      // Cargar novedades relacionadas (misma categoría)
      if (data.categoria) {
        try {
          const relacionadasData = await novedadService.public.getByCategoria(
            data.categoria,
            1,
            3
          );
          // Filtrar la novedad actual
          setRelacionadas(
            relacionadasData.items.filter((n) => n._id !== novedadId)
          );
        } catch (err) {
          console.error("Error cargando relacionadas:", err);
        }
      }
    } catch (err) {
      console.error("Error cargando novedad:", err);
      setError("Error al cargar la novedad");
    } finally {
      setLoading(false);
    }
  };

  const copyLinkToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Error copiando enlace:", err);
    }
  };

  const shareToWhatsApp = () => {
    const text = `${novedad?.titulo}\n\n${novedad?.resumen || ""}\n\nVer más: ${
      window.location.href
    }`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const shareToInstagram = () => {
    // Instagram no tiene una API directa para compartir URLs desde web
    // Abrimos el perfil de Instagram de la empresa o copiamos el enlace
    alert(
      "Para compartir en Instagram, copia este enlace y pégalo en tu historia o publicación:\n\n" +
        window.location.href
    );
  };

  const shareToFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const nextImage = () => {
    if (novedad && novedad.imagenes.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === novedad.imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (novedad && novedad.imagenes.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? novedad.imagenes.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Cargando novedad...</p>
        </div>
      </div>
    );
  }

  if (error || !novedad) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl p-12 border border-slate-200">
            <AlertCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Novedad no encontrada
            </h2>
            <p className="text-slate-600 mb-8">
              {error || "La novedad no existe o fue eliminada"}
            </p>
            <Link
              href="/novedades"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 font-semibold"
            >
              <ArrowLeft className="h-5 w-5" />
              Ver todas las novedades
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section con Breadcrumb */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white py-12 overflow-hidden">
        {/* Efectos de fondo */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        </div>

        <div className="relative container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6">
            <Link
              href="/"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Inicio
            </Link>
            <span className="text-slate-600">/</span>
            <Link
              href="/novedades"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Novedades
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-medium truncate max-w-md">
              {novedad.titulo}
            </span>
          </nav>

          {/* Botón volver */}
          <Link
            href="/novedades"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl text-white hover:bg-slate-700/50 transition-all text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
        </div>
      </section>

      {/* Contenido principal */}
      <article className="container mx-auto px-4 -mt-8">
        <div className="max-w-5xl mx-auto">
          {/* Tarjeta principal */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 mb-8">
            {/* Header del artículo */}
            <div className="p-8 md:p-12">
              {/* Metadatos */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {novedad.categoria && (
                  <Link
                    href={`/novedades?categoria=${encodeURIComponent(
                      novedad.categoria
                    )}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition-colors font-semibold text-sm"
                  >
                    <Tag className="h-4 w-4" />
                    {novedad.categoria}
                  </Link>
                )}
                {novedad.destacada && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-bold text-sm shadow-lg">
                    <Sparkles className="h-4 w-4" />
                    Destacada
                  </span>
                )}
                <span className="flex items-center gap-1.5 text-slate-600 text-sm">
                  <Calendar className="h-4 w-4" />
                  {formatDate(novedad.fechaPublicacion)}
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 text-sm">
                  <Eye className="h-4 w-4" />
                  {novedad.vistas} {novedad.vistas === 1 ? "vista" : "vistas"}
                </span>
              </div>

              {/* Título - muy cerca de las imágenes */}
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 leading-tight">
                {novedad.titulo}
              </h1>

              {/* Resumen - pegado al título */}
              {novedad.resumen && (
                <p className="text-xl text-slate-600 leading-relaxed mb-4">
                  {novedad.resumen}
                </p>
              )}

              {/* Botones de compartir - Simplificado */}
              <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-slate-200">
                {/* Botón Compartir en: - Copia el enlace */}
                <button
                  onClick={copyLinkToClipboard}
                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                >
                  <Share2 className="h-5 w-5" />
                  <span>{copiedLink ? "¡Copiado!" : "Compartir"}</span>
                </button>

                {/* WhatsApp */}
                <button
                  onClick={shareToWhatsApp}
                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span>WhatsApp</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={shareToInstagram}
                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] hover:opacity-90 text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={shareToFacebook}
                  className="group relative inline-flex items-center gap-2 px-4 py-2.5 bg-[#1877F2] hover:bg-[#0C63D4] text-white rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </button>
              </div>
            </div>

            {/* Galería de imágenes - MUY CERCA del título */}
            {novedad.imagenes &&
              novedad.imagenes.length > 0 &&
              novedad.imagenes[0].thumbnails?.large && (
                <div className="px-8 md:px-12 pb-8">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                    {/* Imagen principal con mejor calidad */}
                    <div
                      className="relative w-full bg-gradient-to-br from-slate-100 to-slate-200 cursor-pointer group"
                      style={{ height: "500px" }}
                      onClick={() => setShowImageModal(true)}
                    >
                      {novedad.imagenes[currentImageIndex]?.thumbnails
                        ?.large ? (
                        <Image
                          src={
                            novedad.imagenes[currentImageIndex].thumbnails.large
                          }
                          alt={`${novedad.titulo} - Imagen ${
                            currentImageIndex + 1
                          }`}
                          fill
                          className="object-cover relative z-10 group-hover:scale-105 transition-transform duration-700"
                          quality={100}
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                          <Newspaper className="h-20 w-20 text-slate-400" />
                        </div>
                      )}

                      {/* Overlay para indicar que se puede ampliar */}
                      <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/30 transition-all duration-300 flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-slate-900 font-semibold text-sm shadow-xl">
                          Click para ampliar
                        </span>
                      </div>

                      {/* Controles de navegación delicados y visibles */}
                      {novedad.imagenes.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              prevImage();
                            }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-cyan-400 hover:scale-110 z-20"
                          >
                            <ChevronLeft
                              className="h-5 w-5 text-slate-600 hover:text-cyan-600"
                              strokeWidth={2}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              nextImage();
                            }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/80 hover:bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-cyan-400 hover:scale-110 z-20"
                          >
                            <ChevronRight
                              className="h-5 w-5 text-slate-600 hover:text-cyan-600"
                              strokeWidth={2}
                            />
                          </button>

                          {/* Contador */}
                          <div className="absolute bottom-4 right-4 px-4 py-2 bg-slate-900/80 backdrop-blur-sm text-white text-sm rounded-xl font-semibold">
                            {currentImageIndex + 1} / {novedad.imagenes.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnails mejorados - Carousel profesional centrado */}
                    {novedad.imagenes.length > 1 && (
                      <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 py-4 px-6">
                        <div className="flex items-center justify-center gap-3 max-w-4xl mx-auto">
                          {novedad.imagenes
                            .filter((img) => img.thumbnails?.small)
                            .map((imagen, index) => (
                              <button
                                key={imagen.public_id}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                                  currentImageIndex === index
                                    ? "ring-4 ring-cyan-500 border-cyan-500 shadow-xl shadow-cyan-500/50 scale-105"
                                    : "opacity-60 hover:opacity-100 border-slate-300 hover:border-cyan-400 hover:scale-105 shadow-md"
                                }`}
                                style={{
                                  width:
                                    currentImageIndex === index
                                      ? "120px"
                                      : "90px",
                                  height:
                                    currentImageIndex === index
                                      ? "90px"
                                      : "70px",
                                }}
                              >
                                <Image
                                  src={imagen.thumbnails!.small}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover"
                                  quality={100}
                                  unoptimized
                                />
                                {currentImageIndex === index && (
                                  <div className="absolute inset-0 bg-cyan-500/10 pointer-events-none" />
                                )}
                              </button>
                            ))}
                        </div>

                        {/* Indicador de posición */}
                        <div className="flex justify-center gap-1.5 mt-3">
                          {novedad.imagenes.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`transition-all duration-300 rounded-full ${
                                currentImageIndex === index
                                  ? "w-8 h-2 bg-cyan-500"
                                  : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* Enlaces externos - DESPUÉS de la galería, compactos en grid */}
            {novedad.links && novedad.links.length > 0 && (
              <div className="px-8 md:px-12 pb-8">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 border-2 border-cyan-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
                      <ExternalLink className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Enlaces Relacionados
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {novedad.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 p-3 bg-white hover:bg-gradient-to-r hover:from-white hover:to-cyan-50 rounded-xl transition-all border border-slate-200 hover:border-cyan-400 hover:shadow-md"
                      >
                        <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg group-hover:scale-110 transition-transform flex-shrink-0">
                          <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition-colors truncate">
                            {link.titulo}
                          </h4>
                          {link.descripcion && (
                            <p className="text-xs text-slate-600 truncate">
                              {link.descripcion}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-cyan-600 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Contenido del artículo */}
            <div className="px-8 md:px-12 pb-12">
              <div className="prose prose-lg prose-slate max-w-none">
                <div className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                  {novedad.contenido}
                </div>
              </div>
            </div>
          </div>

          {/* Novedades relacionadas mejoradas */}
          {relacionadas.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-200">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl shadow-cyan-500/30">
                  <Newspaper className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-3xl font-black text-slate-900">
                  Novedades relacionadas
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relacionadas.map((relacionada) => (
                  <Link
                    key={relacionada._id}
                    href={`/novedades/${relacionada._id}`}
                    className="group"
                  >
                    <article className="bg-gradient-to-br from-slate-50 to-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-200 hover:border-cyan-400 hover:-translate-y-2">
                      <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                        {relacionada.imagenes &&
                        relacionada.imagenes.length > 0 &&
                        relacionada.imagenes[0].thumbnails?.medium ? (
                          <Image
                            src={relacionada.imagenes[0].thumbnails.medium}
                            alt={relacionada.titulo}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            quality={100}
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 to-slate-300">
                            <Newspaper className="h-14 w-14 text-slate-400" />
                          </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2 mb-3 leading-tight">
                          {relacionada.titulo}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {formatDate(relacionada.fechaPublicacion)}
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Modal de imagen ampliada mejorado */}
      {showImageModal &&
        novedad.imagenes &&
        novedad.imagenes.length > 0 &&
        novedad.imagenes[currentImageIndex]?.thumbnails?.large && (
          <div
            className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setShowImageModal(false)}
          >
            <div className="relative max-w-7xl w-full h-full flex items-center justify-center">
              <Image
                src={novedad.imagenes[currentImageIndex].thumbnails!.large}
                alt={`${novedad.titulo} - Imagen ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                onClick={(e) => e.stopPropagation()}
                quality={100}
                unoptimized
                sizes="100vw"
              />

              {/* Botón cerrar mejorado */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-6 right-6 p-4 bg-white rounded-2xl shadow-2xl hover:bg-slate-100 transition-all duration-300 hover:scale-110 z-10"
              >
                <svg
                  className="h-6 w-6 text-slate-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Controles mejorados */}
              {novedad.imagenes.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-6 p-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                  >
                    <ChevronLeft className="h-8 w-8 text-slate-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-6 p-5 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 z-10"
                  >
                    <ChevronRight className="h-8 w-8 text-slate-900" />
                  </button>

                  {/* Contador modal mejorado */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl z-10">
                    <span className="text-slate-900 font-bold text-lg">
                      {currentImageIndex + 1} / {novedad.imagenes.length}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
}
