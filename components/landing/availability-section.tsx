"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import LotesMap from "@/components/dashboard/lotes-map";
import { Loader2, Map, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Lote {
  id: number;
  area_m2: number;
  ubicacion: string;
  valor: number;
  estado: string;
  etapa_id: number;
}

export default function AvailabilitySection() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch<Lote[]>("/lotes/list");
        setLotes(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const disponibles = lotes.filter((l) => l.estado === "Disponible").length;

  return (
    <section className="py-20 md:py-28" id="disponibilidad">
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Map className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
            Disponibilidad de Lotes
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Consulta en tiempo real el estado de cada lote organizado por etapas
            de desarrollo.
            {!loading && !error && disponibles > 0 && (
              <span className="block mt-2 font-semibold text-success">
                {disponibles} lotes disponibles ahora mismo
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Map className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No se pudo cargar la disponibilidad
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Registrate para ver los lotes disponibles desde tu panel.
            </p>
            <Link
              href="/registro"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Crear cuenta
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : lotes.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <Map className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              Proximamente
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Estamos preparando nuevos lotes. Registrate para ser el primero en
              enterarte.
            </p>
          </div>
        ) : (
          <>
            <LotesMap lotes={lotes} />

            <div className="mt-10 text-center">
              <Link
                href="/registro"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
              >
                Registrate para comprar
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
