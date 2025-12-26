export interface Cliente {
  _id?: string;
  nombreCompleto?: string;
  fechaNacimiento?: string; // ISO string
  provincia?: string;
  localidad?: string;
  direccion?: string;
  telefonoCelular?: string;
  telefonoFijo?: string;
  correoElectronico?: string;
  tipoVehiculo?: string;
  productoServicio?: string;
  marca?: string;
  modelo?: string;
  anioCompra?: number;
  tipoCliente?: string;        // NUEVO - 'Comprador' | 'Vendedor' | 'Consultor'
  observaciones?: string;      // NUEVO - Campo de texto libre
  createdAt?: string;
  updatedAt?: string;
}