import {
  Users,
  Truck,
  Clock,
  MapPin,
  Calendar,
  Building2,
  Handshake,
  Star,
} from "lucide-react";
import Image from "next/image";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white py-20 md:py-32 overflow-hidden">
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-medium">Desde 1987</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
            NOSOTROS
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-8">
            Más de 35 años de experiencia en el sector automotriz comercial,
            construyendo confianza y excelencia
          </p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-cyan-400">35+</div>
              <div className="text-sm text-slate-300">Años de Experiencia</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-blue-400">1500+</div>
              <div className="text-sm text-slate-300">Unidades Vendidas</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-slate-400">2</div>
              <div className="text-sm text-slate-300">Generaciones</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="text-2xl font-bold text-teal-400">2019</div>
              <div className="text-sm text-slate-300">Guzman Motors SRL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reseña de Nuestra Trayectoria */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                RESEÑA DE NUESTRA{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
                  TRAYECTORIA
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8"></div>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Una historia de pasión, dedicación y crecimiento familiar en el
                mundo automotriz
              </p>
            </div>

            {/* Historia Completa */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-slate-200">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Columna de texto */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          Los Inicios - 1987
                        </h3>
                        <p className="text-lg text-slate-500">
                          Santo Tomé, Ruta 19 y Bs As
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-lg leading-relaxed">
                      En el año <strong className="text-cyan-600">1987</strong>{" "}
                      inicia su actividad{" "}
                      <strong className="text-slate-800">Héctor Guzmán</strong>{" "}
                      en local propio en la ciudad de{" "}
                      <strong className="text-cyan-600">
                        Santo Tomé, Ruta 19 y Bs As
                      </strong>
                      , desarrollando como actividades principales la
                      representación de{" "}
                      <strong className="text-cyan-600">
                        acoplados y remolques Astivia
                      </strong>{" "}
                      en la zona, también la compra-venta y consignación de
                      camiones nuevos y usados.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          Expansión - 1989
                        </h3>
                        <p className="text-lg text-slate-500">
                          Avda Blas Parera 6422, Santa Fe
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-lg leading-relaxed">
                      En el año <strong className="text-blue-600">1989</strong>{" "}
                      se traslada al nuevo local propio en{" "}
                      <strong className="text-blue-600">
                        Avda Blas Parera 6422
                      </strong>{" "}
                      de la ciudad de Santa Fe. Siguiendo la cronología y la
                      misma actividad incorporamos camiones{" "}
                      <strong className="text-slate-800">
                        Fiat (hoy Iveco)
                      </strong>{" "}
                      como Sub agentes de la firma{" "}
                      <strong className="text-purple-600">
                        Frencia y Rossi de Córdoba
                      </strong>
                      , representantes oficiales de la marca hasta el año 1999.
                    </p>
                  </div>
                </div>

                {/* Columna de imagen */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-4 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    <Image
                      src="/images/nosotros/equipo guzman motoros.webp"
                      alt="Equipo Guzman Motors - Héctor, Leonardo y Andrea"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-xl"
                    />
                    <div className="p-4">
                      <p className="text-sm text-slate-600 text-center font-medium">
                        Héctor Guzmán junto a sus hijos Leonardo y Andrea,
                        continuando la tradición familiar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Era Volkswagen */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-3xl p-8 md:p-12 mb-16">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center">
                    <Truck className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold">VOLKSWAGEN</h2>
                    <p className="text-2xl text-slate-300">1999 - 2019</p>
                  </div>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mb-8"></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <p className="text-slate-200 leading-relaxed text-xl">
                    A fines de ese año llega al país la empresa{" "}
                    <strong className="text-blue-400">
                      Volkswagen de camiones y buses
                    </strong>
                    , tomando dicha marca como concesionario oficial en Santa Fe
                    y Entre Ríos la firma{" "}
                    <strong className="text-blue-400">Devol SA</strong> de la
                    cual fuimos sub agentes hasta el año 2016.
                  </p>

                  <p className="text-slate-200 leading-relaxed text-xl">
                    Devol SA pasa a tener su local propio en{" "}
                    <strong className="text-blue-400">
                      Avda Blas Parera 10800
                    </strong>{" "}
                    por solicitud de Volkswagen Argentina ya que en la zona
                    habíamos vendido{" "}
                    <strong className="text-cyan-400">
                      más de 1500 unidades
                    </strong>
                    . Todos estos años acompañado por mis hijos{" "}
                    <strong className="text-white">Andrea y Leonardo</strong>.
                  </p>

                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-white mb-4">
                      20 Años de Trayectoria
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-cyan-400">
                          1500+
                        </div>
                        <div className="text-sm text-slate-300">
                          Unidades Vendidas
                        </div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-400">
                          20
                        </div>
                        <div className="text-sm text-slate-300">
                          Años de Experiencia
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <Image
                      src="/images/nosotros/equipo guzman motros 2.webp"
                      alt="Oficina Guzman Motors - Equipo de trabajo"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-xl"
                    />
                    <div className="p-4">
                      <p className="text-sm text-slate-300 text-center">
                        El equipo trabajando en las oficinas de Blas Parera 6422
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nueva Generación */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-slate-200">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
                    <Image
                      src="/images/nosotros/entrada neogcio gumzan motors.webp"
                      alt="Local Guzman Motors SRL - Blas Parera 6422"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-xl"
                    />
                    <div className="p-4">
                      <p className="text-sm text-slate-600 text-center font-medium">
                        Nuestro local en Av. Blas Parera 6422, Santa Fe
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-8 order-1 lg:order-2">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <Users className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800">
                          Independencia - 2019
                        </h3>
                        <p className="text-lg text-slate-500">
                          Leonardo toma las riendas
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-700 text-lg leading-relaxed">
                      En el año 2019 mi hijo{" "}
                      <strong className="text-green-600">Leonardo</strong> ya
                      con 30 años de experiencia decide independizarse y volver
                      a reabrir su propio negocio siempre en la misma actividad
                      y en el mismo local de{" "}
                      <strong className="text-slate-800">
                        calle Blas Parera 6422
                      </strong>{" "}
                      en el que funcionamos durante tantos años, renunciando
                      para tal fin a la firma{" "}
                      <strong className="text-green-600">Devol SA</strong> el 30
                      de Abril de 2019.
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                    <div className="flex items-center gap-4 mb-4">
                      <Handshake className="w-8 h-8 text-green-600" />
                      <h4 className="text-xl font-bold text-green-800">
                        Apoyo Familiar
                      </h4>
                    </div>
                    <p className="text-green-700 leading-relaxed text-lg">
                      A los 30 días siguiendo sus pasos y apoyando su
                      emprendimiento,{" "}
                      <strong className="text-green-800">Héctor</strong>{" "}
                      presentó la renuncia a dicha empresa para acompañar a su
                      hijo en esta nueva etapa.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guzman Motors SRL */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 text-white rounded-3xl p-8 md:p-12 mb-16">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
                  <Star className="w-5 h-5 text-cyan-400" />
                  <span className="text-cyan-200 font-medium">Presente</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  GUZMAN MOTORS <span className="text-cyan-400">SRL</span>
                </h2>
                <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8"></div>
              </div>

              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <p className="text-xl text-slate-200 leading-relaxed">
                    Es así como nace{" "}
                    <strong className="text-white">Guzman Motors SRL</strong>,
                    siendo sus titulares{" "}
                    <strong className="text-cyan-400">Leonardo y Héctor</strong>
                    .
                  </p>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                    <h4 className="text-lg font-bold text-white mb-4">
                      Nuestras Representaciones Actuales:
                    </h4>
                    <ul className="space-y-3 text-slate-200">
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <strong className="text-cyan-400">Red Alcorta</strong> -
                        Venta de acoplados y semirremolques
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        Marcas{" "}
                        <strong className="text-blue-400">Sola y Brusa</strong>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <strong className="text-green-400">
                          Lambert, Metagro, Aiello y Cormetal
                        </strong>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        Sub agentes{" "}
                        <strong className="text-orange-400">LTA Motors</strong>{" "}
                        - Marcas Foton y Zanella
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                    <Image
                      src="/images/nosotros/fachada guzman motors.jpeg"
                      alt="Fachada actual Guzman Motors SRL"
                      width={600}
                      height={400}
                      className="w-full h-auto rounded-xl"
                    />
                    <div className="p-4">
                      <p className="text-sm text-slate-300 text-center">
                        Nuestra fachada actual - Guzman Motors SRL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información de Contacto */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                INFORMACIÓN DE{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text">
                  CONTACTO
                </span>
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-8"></div>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Estamos aquí para ayudarte. Visitanos, llamanos o escribenos.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Horarios */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">HORARIOS</h3>
                </div>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-semibold text-slate-800">
                      Lunes - Viernes:
                    </p>
                    <p className="text-slate-600">8:30 - 12:30 hs</p>
                    <p className="text-slate-600">15:30 - 18:30 hs</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    ENCONTRANOS
                  </h3>
                </div>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-semibold text-slate-800">Dirección:</p>
                    <p className="text-slate-600">AV. Blas Parera 6422</p>
                    <p className="text-slate-600">Santa Fe</p>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">CONTACTO</h3>
                </div>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="font-semibold text-slate-800">Teléfono:</p>
                    <p className="text-slate-600">+54 9 342 421 6850</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Email:</p>
                    <p className="text-cyan-600">hguzmanmotors@gmail.com</p>
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
