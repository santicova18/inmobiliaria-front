"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken, getUserData } from "@/lib/api";
import {
  MapPin,
  Ruler,
  DollarSign,
  Loader2,
  ShoppingCart,
  CheckCircle,
  Layers,
} from "lucide-react";

interface Lote {
  id: number;
  area_m2: number;
  ubicacion: string;
  valor: number;
  estado: string;
  etapa_id: number;
}

export default function LotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLotes, setSelectedLotes] = useState<number[]>([]);
  const [buying, setBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  useEffect(() => {
    fetchLotes();
  }, []);

  async function fetchLotes() {
    try {
      const data = await apiFetch<Lote[]>("/lotes/list");
      setLotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar lotes");
    } finally {
      setLoading(false);
    }
  }

  function toggleLote(id: number) {
    setSelectedLotes((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  }

  async function handleBuy() {
    const user = getUserData();
    const token = getToken();
    if (!user || !token) return;

    setBuying(true);
    setError("");

    try {
      await apiFetch("/lotes/buy", {
        method: "POST",
        body: JSON.stringify({
          usuario_id: user.id,
          lote_id: selectedLotes,
        }),
        token,
      });
      setBuySuccess(true);
      setSelectedLotes([]);
      await fetchLotes();
      setTimeout(() => setBuySuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al comprar");
    } finally {
      setBuying(false);
    }
  }

  const estadoStyles: Record<string, string> = {
    Disponible: "bg-success/10 text-success",
    Reservado: "bg-warning/10 text-warning",
    Vendido: "bg-destructive/10 text-destructive",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Lotes Disponibles
          </h1>
          <p className="mt-1 text-muted-foreground">
            Selecciona los lotes que deseas comprar
          </p>
        </div>

        {selectedLotes.length > 0 && (
          <button
            onClick={handleBuy}
            disabled={buying}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {buying ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                Comprar ({selectedLotes.length})
              </>
            )}
          </button>
        )}
      </div>

      {buySuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle className="h-5 w-5" />
          Compra realizada exitosamente
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {lotes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No hay lotes disponibles
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vuelve pronto para ver nuevas opciones.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lotes.map((lote) => {
            const isSelected = selectedLotes.includes(lote.id);
            const isAvailable = lote.estado === "Disponible";

            return (
              <div
                key={lote.id}
                onClick={() => isAvailable && toggleLote(lote.id)}
                className={`group cursor-pointer rounded-2xl border-2 bg-card p-6 transition-all ${
                  isSelected
                    ? "border-primary shadow-lg"
                    : isAvailable
                    ? "border-border hover:border-primary/30 hover:shadow-md"
                    : "cursor-not-allowed border-border opacity-60"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lote #{lote.id}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      estadoStyles[lote.estado] || "bg-muted text-muted-foreground"
                    }`}
                  >
                    {lote.estado}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    {lote.ubicacion}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    {lote.area_m2} m2
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    Etapa {lote.etapa_id}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1 text-lg font-bold text-foreground">
                    <DollarSign className="h-5 w-5 text-primary" />
                    {Number(lote.valor).toLocaleString("es-CO")}
                  </div>
                  {isAvailable && (
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
