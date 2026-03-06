"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiFetch } from "@/lib/api";
import { UserPlus, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

export default function RegistroPage() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nombre, email, password }),
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al registrar la cuenta"
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
                <CheckCircle className="h-7 w-7 text-success" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Registro exitoso
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Hemos enviado un correo de verificacion a{" "}
                <strong className="text-foreground">{email}</strong>. Revisa tu
                bandeja de entrada y haz click en el enlace para activar tu
                cuenta.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Ir a Iniciar Sesion
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                <UserPlus className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Crear cuenta
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Registrate para explorar nuestros lotes
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="nombre"
                  className="text-sm font-medium text-foreground"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Juan Perez"
                  className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Correo electronico
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Contrasena
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimo 6 caracteres"
                    className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-5 w-5" />
                    Crear cuenta
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Inicia sesion
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
