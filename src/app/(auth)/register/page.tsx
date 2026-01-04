import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Trading AI</h1>
          <p className="mt-2 text-gray-600">Create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
