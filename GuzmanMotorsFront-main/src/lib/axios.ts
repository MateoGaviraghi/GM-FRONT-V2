import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL, // Ahora incluye /api
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");

        // Redirigir al login
        window.location.href = "/admin/login";
      }
    }

    if (error.response?.status === 403) {
      // Usuario sin permisos (no es admin o intenta acceder a datos ajenos)
      console.error(
        "❌ Acceso denegado: No tienes permisos para realizar esta acción"
      );

      // Puedes mostrar un toast/alerta aquí si tienes un sistema de notificaciones
      if (typeof window !== "undefined") {
        // Opcional: mostrar alerta al usuario
        alert("No tienes permisos para acceder a este recurso");
      }
    }

    if (error.response?.status === 429) {
      // Rate limit excedido
      console.error("⏱️ Rate limit excedido: Demasiadas peticiones");

      if (typeof window !== "undefined") {
        // El componente que llama debe manejar este error específicamente
        // para mostrar el countdown
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
