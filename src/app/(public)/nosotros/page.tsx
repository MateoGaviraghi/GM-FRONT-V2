import {
  Users,
  Truck,
  Clock,
  MapPin,
  Calendar,
  Building2,
  Star,
} from "lucide-react";
import Image from "next/image";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/images/nosotros/equipo guzman motoros.webp"
            alt="Equipo Guzman Motors"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay para mejorar la legibilidad del texto */}
          <div className="absolute inset-0 bg-slate-900/70"></div>
        </div>

        {/* Efectos de fondo animados (más sutiles) */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center pt-8">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium">Desde 1987</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            NOSOTROS
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10">
            Más de 35 años de experiencia en el sector automotriz comercial,
            construyendo confianza y excelencia en cada operación
          </p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-cyan-400 mb-2">38+</div>
              <div className="text-sm text-slate-300">Años de Experiencia</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-blue-400 mb-2">1500+</div>
              <div className="text-sm text-slate-300">Unidades Vendidas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-green-400 mb-2">2</div>
              <div className="text-sm text-slate-300">Generaciones</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
              <div className="text-3xl font-bold text-teal-400 mb-2">2019</div>
              <div className="text-sm text-slate-300">Guzman Motors SRL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia - Timeline */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header de la sección */}
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">
                NUESTRA{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                  HISTORIA
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mb-8"></div>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Más de tres décadas construyendo confianza en el sector
                automotriz comercial
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-16">
              {/* Primera Etapa: Los Inicios (1987-1999) */}
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12 shadow-lg border border-blue-100">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                            LOS INICIOS
                          </h3>
                          <span className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-full">
                            1987 - 1999
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                              <strong className="text-blue-700">1987:</strong>{" "}
                              Héctor Guzmán inicia su actividad en Santo Tomé
                              (Ruta 19 y Bs As), especializándose en acoplados y
                              remolques Astivia, compra-venta y consignación de
                              camiones.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                              <strong className="text-cyan-700">1989:</strong>{" "}
                              Traslado al nuevo local propio en
                              <strong className="text-slate-800">
                                {" "}
                                Avda. Blas Parera 6422
                              </strong>
                              , Santa Fe.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                              Incorporación de camiones{" "}
                              <strong className="text-slate-800">
                                Fiat (hoy Iveco)
                              </strong>{" "}
                              como subagentes de{" "}
                              <strong className="text-blue-700">
                                Frencia y Rossi de Córdoba
                              </strong>{" "}
                              hasta 1999.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/images/nosotros/equipo guzman motoros.webp"
                          alt="Héctor Guzmán, Cristina y su hijo Leonardo"
                          width={500}
                          height={350}
                          className="w-full h-auto rounded-xl"
                        />
                        <div className="p-4">
                          <p className="text-sm text-slate-600 text-center font-medium">
                            Héctor y Cristina con su hijo Leonardo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Segunda Etapa: Era Volkswagen (1999-2019) */}
              <div className="relative">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 shadow-xl text-white">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="lg:order-2">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Truck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            ERA VOLKSWAGEN
                          </h3>
                          <span className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-full">
                            1999 - 2019
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-200 text-lg leading-relaxed">
                              <strong className="text-blue-400">1999:</strong>{" "}
                              Llegada de Volkswagen de camiones y buses al país.
                              Comenzamos como subagentes de{" "}
                              <strong className="text-blue-400">
                                Devol SA
                              </strong>{" "}
                              (concesionario oficial).
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-200 text-lg leading-relaxed">
                              <strong className="text-cyan-400">2016:</strong>{" "}
                              Devol SA se traslada a Blas Parera 10800 tras
                              haber vendido{" "}
                              <strong className="text-cyan-400">
                                más de 1500 unidades
                              </strong>{" "}
                              en la zona.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-200 text-lg leading-relaxed">
                              <strong className="text-blue-400">2019:</strong>{" "}
                              Leonardo, con 30 años de experiencia, decide
                              independizarse y reabrir el negocio familiar.
                              Ambos renuncian a Devol SA en abril.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:order-1 relative">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/images/nosotros/equipo guzman motros 2.webp"
                          alt="Oficina Guzman Motors - Equipo de trabajo"
                          width={500}
                          height={350}
                          className="w-full h-auto rounded-xl"
                        />
                        <div className="p-4">
                          <p className="text-sm text-slate-300 text-center font-medium">
                            El equipo en las oficinas de Blas Parera 6422
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tercera Etapa: Guzman Motors SRL (2019-Presente) */}
              <div className="relative">
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-lg border border-cyan-100">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Star className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
                            GUZMAN MOTORS SRL
                          </h3>
                          <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-sm font-semibold rounded-full">
                            2019 - Presente
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                              Nace{" "}
                              <strong className="text-cyan-700">
                                Guzman Motors SRL
                              </strong>{" "}
                              con Leonardo y Héctor como titulares, regresando
                              al histórico local de Blas Parera 6422.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                              Representamos a{" "}
                              <strong className="text-blue-700">
                                Red Alcorta
                              </strong>{" "}
                              en la venta de acoplados y semirremolques de las
                              marcas:{" "}
                              <strong className="text-slate-800">
                                Sola y Brusa, Lambert, Metagro, Aiello y
                                Cormetal
                              </strong>
                              .
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-3 h-3 bg-cyan-600 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="text-slate-700 text-lg leading-relaxed">
                              Somos subagentes de{" "}
                              <strong className="text-cyan-700">
                                LTA Motors
                              </strong>{" "}
                              para las marcas
                              <strong className="text-slate-800">
                                {" "}
                                Foton y Zanella
                              </strong>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="bg-white rounded-2xl p-4 shadow-xl transform hover:scale-105 transition-transform duration-300">
                        <Image
                          src="/images/nosotros/fachada guzman motors.jpeg"
                          alt="Fachada actual Guzman Motors SRL"
                          width={500}
                          height={350}
                          className="w-full h-auto rounded-xl"
                        />
                        <div className="p-4">
                          <p className="text-sm text-slate-600 text-center font-medium">
                            Nuestra fachada actual - Guzman Motors SRL
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-slate-800 via-slate-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                INFORMACIÓN DE{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text">
                  CONTACTO
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8"></div>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Estamos aquí para ayudarte. Visitanos, llamanos o escribenos.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Horarios */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    HORARIOS
                  </h3>
                </div>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-semibold text-cyan-300 text-lg mb-3">
                      Lunes - Viernes:
                    </p>
                    <p className="text-slate-200 text-lg">8:30 - 12:30 hs</p>
                    <p className="text-slate-200 text-lg">15:30 - 18:30 hs</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    ENCONTRANOS
                  </h3>
                </div>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-semibold text-green-300 text-lg mb-3">
                      Dirección:
                    </p>
                    <p className="text-slate-200 text-lg font-medium">
                      AV. Blas Parera 6422
                    </p>
                    <p className="text-slate-200 text-lg">Santa Fe</p>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    CONTACTO
                  </h3>
                </div>
                <div className="space-y-6 text-center">
                  <div>
                    <p className="font-semibold text-cyan-300 text-lg mb-3">
                      Teléfono:
                    </p>
                    <div className="space-y-2">
                      <p className="text-slate-200 text-lg hover:text-cyan-300 transition-colors cursor-pointer">
                        +54 9 342 421 6850
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-cyan-300 text-lg mb-3">
                      Email:
                    </p>
                    <p className="text-cyan-400 text-lg hover:text-cyan-300 transition-colors cursor-pointer font-medium">
                      hguzmanmotors@gmail.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
