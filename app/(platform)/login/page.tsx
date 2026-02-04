import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Influencer Circle</h1>
          <p className="text-slate-500 text-sm">
            Acesse sua conta para continuar usando a plataforma.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

