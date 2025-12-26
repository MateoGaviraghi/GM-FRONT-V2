// Opciones para los campos de autocompletado
// Estas listas pueden ser populadas desde la base de datos

export const PROVINCIAS_ARGENTINA = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Ciudad Autónoma de Buenos Aires",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export const LOCALIDADES_PRINCIPALES = [
  // Buenos Aires
  "La Plata",
  "Mar del Plata",
  "Bahía Blanca",
  "Tandil",
  "Olavarría",
  "Pergamino",
  "Junín",
  "Azul",
  "Necochea",
  "San Nicolás",

  // Córdoba
  "Córdoba",
  "Río Cuarto",
  "Villa María",
  "San Francisco",
  "Villa Carlos Paz",

  // Santa Fe
  "Rosario",
  "Santa Fe",
  "Rafaela",
  "Venado Tuerto",
  "Reconquista",

  // Entre Ríos
  "Paraná",
  "Concordia",
  "Gualeguaychú",
  "Concepción del Uruguay",

  // Mendoza
  "Mendoza",
  "San Rafael",
  "Godoy Cruz",
  "Maipú",
  "Las Heras",

  // Tucumán
  "San Miguel de Tucumán",
  "Yerba Buena",
  "Banda del Río Salí",

  // Salta
  "Salta",
  "San Ramón de la Nueva Orán",
  "Tartagal",

  // Misiones
  "Posadas",
  "Puerto Iguazú",
  "Oberá",
  "Eldorado",

  // Y más localidades principales...
];

export const MARCAS_VEHICULOS = [
  "Toyota",
  "Ford",
  "Chevrolet",
  "Volkswagen",
  "Fiat",
  "Peugeot",
  "Renault",
  "Nissan",
  "Honda",
  "Hyundai",
  "Kia",
  "Citroën",
  "Mercedes-Benz",
  "BMW",
  "Audi",
  "Volvo",
  "Scania",
  "Iveco",
  "MAN",
  "DAF",
  "Foton",
  "JAC",
  "Chery",
  "Geely",
  "BYD",
  "Great Wall",
  "Haval",
  "Dongfeng",
];

export const MODELOS_POR_MARCA: Record<string, string[]> = {
  Toyota: [
    "Corolla",
    "Camry",
    "RAV4",
    "Hilux",
    "Prius",
    "Yaris",
    "Etios",
    "SW4",
  ],
  Ford: [
    "Focus",
    "Fiesta",
    "Mustang",
    "F-150",
    "Ranger",
    "EcoSport",
    "Kuga",
    "Territory",
  ],
  Chevrolet: [
    "Cruze",
    "Onix",
    "Tracker",
    "S10",
    "Camaro",
    "Spin",
    "Prisma",
    "Captiva",
  ],
  Volkswagen: [
    "Golf",
    "Polo",
    "Passat",
    "Tiguan",
    "Amarok",
    "Up!",
    "Vento",
    "Suran",
  ],
  Fiat: ["Uno", "Palio", "Cronos", "Argo", "Toro", "Mobi", "Strada", "Ducato"],
  Peugeot: ["208", "308", "408", "2008", "3008", "5008", "Partner", "Boxer"],
  Renault: [
    "Clio",
    "Sandero",
    "Logan",
    "Duster",
    "Captur",
    "Kangoo",
    "Alaskan",
    "Koleos",
  ],
  Foton: ["Auman C", "Auman D", "Auman R", "Aumark", "eAumark", "TM"],
  // Agregar más modelos según necesidad...
};

export const TIPOS_VEHICULO = [
  "Sedan",
  "Hatchback",
  "SUV",
  "Pickup",
  "Comercial",
  "Camión",
  "Ómnibus",
  "Coupe",
  "Convertible",
  "Station Wagon",
  "Crossover",
  "Van",
  "Minivan",
];

export const TIPOS_COMBUSTIBLE = [
  "Nafta",
  "Diesel",
  "GNC",
  "Eléctrico",
  "Híbrido",
  "Etanol",
  "Biodiesel",
];

export const TIPOS_TRANSMISION = [
  "Manual",
  "Automática",
  "CVT",
  "Automatizada",
  "Doble Embrague",
];

export const TIPOS_TRACCION = [
  "Delantera",
  "Trasera",
  "4x4",
  "AWD",
  "Integral",
];

export const TIPOS_CLIENTE = [
  "Comprador",
  "Vendedor",
  "Consultor",
  "Particular",
  "Empresa",
  "Concesionario",
  "Mayorista",
];

// Función helper para obtener modelos por marca
export function getModelosPorMarca(marca: string): string[] {
  return MODELOS_POR_MARCA[marca] || [];
}
