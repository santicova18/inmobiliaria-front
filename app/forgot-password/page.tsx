"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiFetch } from "@/lib/api";
import { KeyRound, Loader2, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch(`/auth/forgot-password?email=${encodeURIComponent(email)}`, {
        method: "POST",
      });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al enviar el correo"
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
            {sent ? (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
                  <CheckCircle className="h-7 w-7 text-success" />
                </div>
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Correo enviado
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Si el correo <strong className="text-foreground">{email}</strong>{" "}
                  esta registrado, recibiras un enlace para restablecer tu
                  contrasena.
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Volver al login
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                    <KeyRound className="h-7 w-7 text-primary" />
                  </div>
                  <h1 className="font-serif text-2xl font-bold text-foreground">
                    Recuperar contrasena
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Ingresa tu correo y te enviaremos un enlace para cambiar tu
                    contrasena
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Enviar enlace"
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Volver al login
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
