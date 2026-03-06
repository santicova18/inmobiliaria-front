"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiFetch } from "@/lib/api";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cambiar la contrasena"
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
          <CheckCircle className="h-7 w-7 text-success" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Contrasena actualizada
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tu contrasena ha sido cambiada exitosamente.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Iniciar Sesion
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
          <Lock className="h-7 w-7 text-primary" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Nueva contrasena
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa tu nueva contrasena
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
            htmlFor="new-password"
            className="text-sm font-medium text-foreground"
          >
            Nueva contrasena
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showPassword ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Cambiar contrasena"
          )}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
