// 🎯 Exportación centralizada de hooks personalizados
export { useAuth } from "./useAuth";
export { useFileDownload } from "./useFileDownload";
export { useVehicleValidation } from "./useVehicleValidation";
export { useFileUpload } from "./useFileUpload";
export { useNovedadOptions } from "./useNovedadOptions";
export { useFichaTecnicaPDF } from "./useFichaTecnicaPDF";
export {
  useRemolqueOptions,
  useModelosByMarca,
  getOptionsFromData,
  getMarcasFromData,
  getModelosFromData,
} from "./useRemolqueOptions";
export {
  useUsadosOptions,
  useModelosByMarca as useUsadosModelosByMarca,
  getOptionsFromData as getUsadosOptionsFromData,
  getMarcasFromData as getUsadosMarcasFromData,
  getModelosFromData as getUsadosModelosFromData,
} from "./useUsadosOptions";
