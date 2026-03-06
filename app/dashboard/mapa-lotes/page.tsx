"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken, getUserData } from "@/lib/api";
import LotesMap from "@/components/dashboard/lotes-map";
import {
  Loader2,
  ShoppingCart,
  CheckCircle,
  Map,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";

interface Lote {
  id: number;
  area_m2: number;
  ubicacion: string;
  valor: number;
  estado: string;
  etapa_id: number;
}

type ViewMode = "map" | "grid";

export default function MapaLotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLotes, setSelectedLotes] = useState<number[]>([]);
  const [buying, setBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [filterEstado, setFilterEstado] = useState<string>("todos");
  const [filterEtapa, setFilterEtapa] = useState<string>("todas");

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

  function toggleSelect(id: number) {
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

  // Get unique etapa values for filter
  const etapaIds = [...new Set(lotes.map((l) => l.etapa_id))].sort(
    (a, b) => a - b
  );

  // Apply filters
  const filteredLotes = lotes.filter((lote) => {
    if (filterEstado !== "todos" && lote.estado !== filterEstado) return false;
    if (
      filterEtapa !== "todas" &&
      lote.etapa_id !== parseInt(filterEtapa)
    )
      return false;
    return true;
  });

  // Selected lotes details
  const selectedDetails = lotes.filter((l) => selectedLotes.includes(l.id));
  const totalSelected = selectedDetails.reduce(
    (sum, l) => sum + Number(l.valor),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <Map className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Mapa de Disponibilidad
            </h1>
            <p className="mt-1 text-muted-foreground">
              Vista grafica de todos los lotes por etapa y estado
            </p>
          </div>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-1">
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "map"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Mapa
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid3X3 className="h-4 w-4" />
            Tabla
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Estado
          </label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="todos">Todos</option>
            <option value="Disponible">Disponible</option>
            <option value="Reservado">Reservado</option>
            <option value="Vendido">Vendido</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Etapa
          </label>
          <select
            value={filterEtapa}
            onChange={(e) => setFilterEtapa(e.target.value)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          >
            <option value="todas">Todas</option>
            {etapaIds.map((id) => (
              <option key={id} value={String(id)}>
                Etapa {id}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Mostrando {filteredLotes.length} de {lotes.length} lotes
        </div>
      </div>

      {/* Alerts */}
      {buySuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle className="h-5 w-5" />
          Compra realizada exitosamente. Recibiras un correo de confirmacion.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Selected lotes floating bar */}
      {selectedLotes.length > 0 && (
        <div className="mb-6 flex flex-col gap-4 rounded-2xl border-2 border-primary bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">
              {selectedLotes.length} lote{selectedLotes.length > 1 ? "s" : ""}{" "}
              seleccionado{selectedLotes.length > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              Total: ${totalSelected.toLocaleString("es-CO")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedLotes([])}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              Limpiar
            </button>
            <button
              onClick={handleBuy}
              disabled={buying}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {buying ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Comprar
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {filteredLotes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Map className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            No hay lotes para mostrar
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Prueba cambiando los filtros seleccionados.
          </p>
        </div>
      ) : viewMode === "map" ? (
        <LotesMap
          lotes={filteredLotes}
          selectable
          selectedIds={selectedLotes}
          onToggleSelect={toggleSelect}
        />
      ) : (
        /* Table view */
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Sel.
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Ubicacion
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Area
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Etapa
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLotes.map((lote) => {
                  const isSelected = selectedLotes.includes(lote.id);
                  const isAvailable = lote.estado === "Disponible";
                  const estadoColor: Record<string, string> = {
                    Disponible: "bg-success/10 text-success",
                    Reservado: "bg-warning/10 text-warning",
                    Vendido: "bg-destructive/10 text-destructive",
                  };

                  return (
                    <tr
                      key={lote.id}
                      className={`border-b border-border last:border-0 transition-colors ${
                        isSelected ? "bg-primary/5" : "hover:bg-secondary/30"
                      }`}
                    >
                      <td className="px-4 py-3">
                        {isAvailable ? (
                          <button
                            onClick={() => toggleSelect(lote.id)}
                            className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                              isSelected
                                ? "border-primary bg-primary"
                                : "border-border hover:border-primary"
                            }`}
                            aria-label={`Seleccionar lote ${lote.id}`}
                          >
                            {isSelected && (
                              <CheckCircle className="h-3 w-3 text-primary-foreground" />
                            )}
                          </button>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        #{lote.id}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {lote.ubicacion}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {lote.area_m2} m2
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        ${Number(lote.valor).toLocaleString("es-CO")}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            estadoColor[lote.estado] || ""
                          }`}
                        >
                          {lote.estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Etapa {lote.etapa_id}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
