"use client";
import { User, Mail, Phone, MapPin, Calendar, Car } from "lucide-react";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ClientForm() {
  const [formData, setFormData] = useState({
    nombreCompleto: "",
    fechaNacimiento: "",
    provincia: "",
    localidad: "",
    direccion: "",
    telefonoCelular: "",
    telefonoFijo: "",
    correoElectronico: "",
    tipoVehiculo: "",
    productoServicio: "",
    marca: "",
    modelo: "",
    anioCompra: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al endpoint
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="shadow-lg border-0 max-w-4xl mx-auto">
      <CardHeader className="text-center pb-6 bg-slate-800 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold tracking-tight">
          Nuevo Cliente
        </CardTitle>
        <CardDescription className="text-slate-300">
          Completa la información del cliente para Guzman Motors
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 bg-slate-50 rounded-b-lg">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Sección Datos Personales */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-700 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-cyan-500" /> Datos Personales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-cyan-100 shadow-sm">
              <div className="space-y-2">
                <Label
                  htmlFor="nombreCompleto"
                  className="text-slate-700 font-medium"
                >
                  Nombre Completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="nombreCompleto"
                    name="nombreCompleto"
                    type="text"
                    placeholder="Nombre completo"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className="pl-10 border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="fechaNacimiento"
                  className="text-slate-700 font-medium"
                >
                  Fecha de Nacimiento
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    className="pl-10 border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="provincia"
                  className="text-slate-700 font-medium"
                >
                  Provincia
                </Label>
                <Input
                  id="provincia"
                  name="provincia"
                  type="text"
                  placeholder="Provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="localidad"
                  className="text-slate-700 font-medium"
                >
                  Localidad
                </Label>
                <Input
                  id="localidad"
                  name="localidad"
                  type="text"
                  placeholder="Localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="direccion"
                  className="text-slate-700 font-medium"
                >
                  Dirección
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="direccion"
                    name="direccion"
                    type="text"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="pl-10 border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="telefonoCelular"
                  className="text-slate-700 font-medium"
                >
                  Teléfono Celular
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="telefonoCelular"
                    name="telefonoCelular"
                    type="text"
                    placeholder="Teléfono celular"
                    value={formData.telefonoCelular}
                    onChange={handleChange}
                    className="pl-10 border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="telefonoFijo"
                  className="text-slate-700 font-medium"
                >
                  Teléfono Fijo
                </Label>
                <Input
                  id="telefonoFijo"
                  name="telefonoFijo"
                  type="text"
                  placeholder="Teléfono fijo"
                  value={formData.telefonoFijo}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="correoElectronico"
                  className="text-slate-700 font-medium"
                >
                  Correo Electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="correoElectronico"
                    name="correoElectronico"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.correoElectronico}
                    onChange={handleChange}
                    className="pl-10 border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Separador visual */}
          <div className="my-8 border-t border-cyan-200" />

          {/* Sección Datos del Vehículo */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-700 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-cyan-500" /> Datos del Vehículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-cyan-100 shadow-sm">
              <div className="space-y-2">
                <Label
                  htmlFor="tipoVehiculo"
                  className="text-slate-700 font-medium"
                >
                  Tipo de Vehículo
                </Label>
                <Input
                  id="tipoVehiculo"
                  name="tipoVehiculo"
                  type="text"
                  placeholder="Tipo de vehículo"
                  value={formData.tipoVehiculo}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="productoServicio"
                  className="text-slate-700 font-medium"
                >
                  Producto/Servicio
                </Label>
                <Input
                  id="productoServicio"
                  name="productoServicio"
                  type="text"
                  placeholder="Producto o servicio"
                  value={formData.productoServicio}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marca" className="text-slate-700 font-medium">
                  Marca
                </Label>
                <Input
                  id="marca"
                  name="marca"
                  type="text"
                  placeholder="Marca"
                  value={formData.marca}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelo" className="text-slate-700 font-medium">
                  Modelo
                </Label>
                <Input
                  id="modelo"
                  name="modelo"
                  type="text"
                  placeholder="Modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="anioCompra"
                  className="text-slate-700 font-medium"
                >
                  Año de Compra
                </Label>
                <Input
                  id="anioCompra"
                  name="anioCompra"
                  type="number"
                  placeholder="Año de compra"
                  value={formData.anioCompra}
                  onChange={handleChange}
                  className="border-slate-300 focus:border-cyan-400 focus:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-8">
            <Button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 shadow-md"
            >
              Crear Cliente
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
