"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  Send,
  CheckCircle,
  User,
  MessageSquare,
  Car,
  Building2,
} from "lucide-react";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    // Información personal
    nombreCompleto: "",
    correoElectronico: "",
    telefonoCelular: "",
    telefonoFijo: "",

    // Ubicación
    provincia: "",
    localidad: "",
    direccion: "",
    fechaNacimiento: "",

    // Información vehicular
    tipoVehiculo: "",
    marca: "",
    modelo: "",
    anioCompra: "",

    // Información de negocio
    tipoCliente: "",

    // Observaciones
    observaciones: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulación de envío - aquí conectarías con tu backend
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        nombreCompleto: "",
        correoElectronico: "",
        telefonoCelular: "",
        telefonoFijo: "",
        provincia: "",
        localidad: "",
        direccion: "",
        fechaNacimiento: "",
        tipoVehiculo: "",
        marca: "",
        modelo: "",
        anioCompra: "",
        tipoCliente: "",
        observaciones: "",
      });

      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section Premium */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/contacto/equipo guzman motros 2.webp"
            alt="Equipo Guzman Motors - Contacto"
            fill
            className="object-cover"
            quality={100}
            priority
          />
          {/* Overlay para mejorar la legibilidad del texto */}
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        {/* Efectos de fondo animados */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center pt-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium">
              Estamos para ayudarte
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            CONTACTANOS
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Ponete en contacto con nosotros. Estamos listos para asesorarte en
            tu próxima compra.
          </p>

          {/* CTA rápidos */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+5493424216850"
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 group-hover:animate-pulse" />
                <span>Llamar Ahora</span>
              </div>
            </a>
            <a
              href="https://wa.me/5493424216850"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 group-hover:animate-pulse" />
                <span>WhatsApp</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Formulario Premium */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
              {/* Efecto de gradiente sutil */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full blur-3xl opacity-30"></div>

              <div className="relative">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">
                  Regístrate como Cliente
                </h2>
                <p className="text-slate-600 mb-8">
                  Completa tus datos para registrarte en nuestro sistema y
                  recibir atención personalizada
                </p>

                {/* Estado de éxito */}
                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      ¡Registro exitoso! Te contactaremos pronto para continuar
                      con el proceso.
                    </span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombre completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                      <input
                        type="text"
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white"
                        placeholder="Tu nombre y apellido"
                      />
                    </div>
                  </div>

                  {/* Email y Teléfono en fila */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="email"
                          name="correoElectronico"
                          value={formData.correoElectronico}
                          onChange={handleChange}
                          required
                          className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white"
                          placeholder="tu@email.com"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="tel"
                          name="telefonoCelular"
                          value={formData.telefonoCelular}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white"
                          placeholder="+54 9 342 123 4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Provincia
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="text"
                          name="provincia"
                          value={formData.provincia}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white"
                          placeholder="Ej: Buenos Aires"
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Localidad
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                        <input
                          type="text"
                          name="localidad"
                          value={formData.localidad}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white"
                          placeholder="Ej: CABA"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Información del vehículo */}
                  <div className="bg-gradient-to-br from-slate-50 to-cyan-50 p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                      <Car className="w-5 h-5 mr-2 text-cyan-600" />
                      Información del Vehículo (Opcional)
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Marca del vehículo
                        </label>
                        <input
                          type="text"
                          name="marca"
                          value={formData.marca}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-white"
                          placeholder="Ej: Ford, Chevrolet"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Modelo del vehículo
                        </label>
                        <input
                          type="text"
                          name="modelo"
                          value={formData.modelo}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-white"
                          placeholder="Ej: Focus, Cruze"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Tipo de vehículo
                        </label>
                        <select
                          name="tipoVehiculo"
                          value={formData.tipoVehiculo}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-white"
                        >
                          <option value="">Seleccionar tipo</option>
                          <option value="auto">Auto</option>
                          <option value="suv">SUV</option>
                          <option value="pickup">Pickup</option>
                          <option value="moto">Moto</option>
                          <option value="comercial">Vehículo Comercial</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Año de compra
                        </label>
                        <input
                          type="number"
                          name="anioCompra"
                          value={formData.anioCompra}
                          onChange={handleChange}
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-white"
                          placeholder="Ej: 2020"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tipo de cliente */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tipo de cliente
                    </label>
                    <select
                      name="tipoCliente"
                      value={formData.tipoCliente}
                      onChange={handleChange}
                      className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white"
                    >
                      <option value="">Seleccionar tipo</option>
                      <option value="Comprador">Comprador</option>
                      <option value="Vendedor">Vendedor</option>
                      <option value="Consultor">Consultor</option>
                    </select>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Observaciones
                    </label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 bg-slate-50 focus:bg-white resize-none"
                      placeholder="Cuéntanos sobre tu negocio, necesidades específicas, consultas o cualquier información que consideres importante..."
                    />
                  </div>

                  {/* Botón de envío premium */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Registrarme como Cliente</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Información de contacto premium */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">
                Otras formas de contacto
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Elige la opción que más te convenga para ponerte en contacto con
                nosotros
              </p>
            </div>

            {/* Cards de contacto premium */}
            <div className="space-y-6">
              <div className="group bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Teléfono
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Llamanos directamente para consultas inmediatas
                    </p>
                    <a
                      href="tel:+5493424216850"
                      className="text-cyan-600 hover:text-cyan-800 font-semibold text-lg transition-colors"
                    >
                      +54 9 342 421 6850
                    </a>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      WhatsApp
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Chatea con nosotros para respuestas rápidas
                    </p>
                    <a
                      href="https://wa.me/5493424216850"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 font-semibold text-lg transition-colors"
                    >
                      Iniciar chat
                    </a>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Visitanos
                    </h3>
                    <p className="text-slate-600 mb-3">
                      Conoce nuestras instalaciones y stock
                    </p>
                    <p className="text-slate-800 font-semibold">
                      Av. Blas Parera 6422
                    </p>
                    <p className="text-slate-600">Santa Fe, Argentina</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-white to-slate-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">
                      Horarios
                    </h3>
                    <p className="text-slate-600 mb-3">Estamos abiertos de:</p>
                    <div className="space-y-1">
                      <p className="text-slate-800 font-semibold">
                        Lunes a Viernes
                      </p>
                      <p className="text-slate-600">8:30 - 12:30 hs</p>
                      <p className="text-slate-600">15:30 - 18:30 hs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Llamada a la acción final */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border border-cyan-100">
              <h3 className="text-xl font-bold text-slate-800 mb-3">
                ¿Necesitas una cotización rápida?
              </h3>
              <p className="text-slate-600 mb-4">
                Nuestro equipo de ventas está listo para asesorarte y encontrar
                el vehículo perfecto para tu negocio.
              </p>
              <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                Solicitar Cotización
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
