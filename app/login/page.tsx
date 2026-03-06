"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiFetch, setToken, setUserData } from "@/lib/api";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch<Record<string, string>>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      // The backend returns {"login successfuly": token}
      const token = data["login successfuly"];
      if (token) {
        setToken(token);

        // Decode JWT payload to get user info
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserData({
          id: parseInt(payload.sub),
          nombre: payload.nombre || "",
          email: email,
          rol: payload.rol || "Cliente",
        });

        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al iniciar sesion"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-160px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                <LogIn className="h-7 w-7 text-primary" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-foreground">
                Iniciar Sesion
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder
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
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Contrasena
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Olvidaste tu contrasena?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contrasena"
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
                    <LogIn className="h-5 w-5" />
                    Iniciar Sesion
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              No tienes cuenta?{" "}
              <Link
                href="/registro"
                className="font-medium text-primary hover:underline"
              >
                Registrate aqui
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
