import { Header } from "@/components/header";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-slate-600">
              Accede a tu cuenta de Guzman Motors
            </p>
          </div>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
