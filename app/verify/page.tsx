"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { apiFetch } from "@/lib/api";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMsg("Token de verificacion no proporcionado.");
      return;
    }

    apiFetch(`/auth/verify?token=${encodeURIComponent(token)}`, {
      method: "POST",
    })
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setErrorMsg(
          err instanceof Error ? err.message : "Error al verificar la cuenta"
        );
      });
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">
          Verificando tu cuenta...
        </p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
          <CheckCircle className="h-7 w-7 text-success" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-foreground">
          Cuenta verificada
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Tu cuenta ha sido activada exitosamente. Ya puedes iniciar sesion.
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
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <XCircle className="h-7 w-7 text-destructive" />
      </div>
      <h1 className="font-serif text-2xl font-bold text-foreground">
        Error de verificacion
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">{errorMsg}</p>
      <Link
        href="/login"
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ir al login
      </Link>
    </div>
  );
}

export default function VerifyPage() {
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
              <VerifyContent />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
