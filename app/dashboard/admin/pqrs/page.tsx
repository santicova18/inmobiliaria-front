"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken } from "@/lib/api";
import {
  Shield,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

interface PQRS {
  id: number;
  usuario_id: number;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
}

export default function AdminPqrsPage() {
  const [pqrsList, setPqrsList] = useState<PQRS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // We need a way to get all PQRS. The backend only has user-specific endpoints,
  // so we'll load from a specific admin endpoint or by user.
  // Based on the routes, we can only get by user id. Let's use a general approach.
  // For now, we'll display a search by user id approach, or let the admin check specific PQRS by id.
  const [searchUserId, setSearchUserId] = useState("");
  const [searchPqrsId, setSearchPqrsId] = useState("");

  async function searchByUser() {
    if (!searchUserId) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<PQRS[]>(`/pqrs/user/${searchUserId}`);
      setPqrsList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setPqrsList([]);
    } finally {
      setLoading(false);
    }
  }

  async function searchById() {
    if (!searchPqrsId) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch<PQRS>(`/pqrs/${searchPqrsId}`);
      setPqrsList([data]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
      setPqrsList([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(pqrsId: number, newEstado: string) {
    setUpdatingId(pqrsId);
    setError("");
    try {
      await apiFetch(
        `/pqrs/update-status?pqrs_id=${pqrsId}&estado=${encodeURIComponent(newEstado)}`,
        { method: "PUT" }
      );
      setSuccess(`PQRS #${pqrsId} actualizado a "${newEstado}"`);
      // Refresh
      setPqrsList((prev) =>
        prev.map((p) => (p.id === pqrsId ? { ...p, estado: newEstado } : p))
      );
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setUpdatingId(null);
    }
  }

  const estadoIcons: Record<string, React.ReactNode> = {
    Pendiente: <Clock className="h-4 w-4" />,
    "En proceso": <AlertCircle className="h-4 w-4" />,
    Cerrado: <CheckCircle className="h-4 w-4" />,
  };

  const estadoStyles: Record<string, string> = {
    Pendiente: "bg-warning/10 text-warning",
    "En proceso": "bg-primary/10 text-primary",
    Cerrado: "bg-success/10 text-success",
  };

  const tipoStyles: Record<string, string> = {
    Peticion: "bg-primary/10 text-primary",
    Queja: "bg-destructive/10 text-destructive",
    Reclamo: "bg-warning/10 text-warning",
    Sugerencia: "bg-success/10 text-success",
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Gestionar PQRS
            </h1>
            <p className="mt-1 text-muted-foreground">
              Busca y actualiza el estado de las solicitudes
            </p>
          </div>
        </div>
      </div>

      {success && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Search forms */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Buscar por Usuario ID
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              placeholder="ID del usuario"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={searchByUser}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 text-sm font-semibold text-foreground">
            Buscar por PQRS ID
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              value={searchPqrsId}
              onChange={(e) => setSearchPqrsId(e.target.value)}
              placeholder="ID de la PQRS"
              className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={searchById}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading && pqrsList.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Busca solicitudes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Usa los filtros de arriba para encontrar solicitudes PQRS.
          </p>
        </div>
      ) : pqrsList.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No se encontraron resultados.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pqrsList.map((pqrs) => (
            <div
              key={pqrs.id}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-foreground">
                  #{pqrs.id}
                </span>
                <span className="text-xs text-muted-foreground">
                  Usuario #{pqrs.usuario_id}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    tipoStyles[pqrs.tipo] || ""
                  }`}
                >
                  {pqrs.tipo}
                </span>
                <span
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    estadoStyles[pqrs.estado] || ""
                  }`}
                >
                  {estadoIcons[pqrs.estado]}
                  {pqrs.estado}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(pqrs.fecha_creacion).toLocaleDateString("es-CO")}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-foreground">
                {pqrs.descripcion}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground">
                  Cambiar estado:
                </span>
                {["Pendiente", "En proceso", "Cerrado"].map((estado) => (
                  <button
                    key={estado}
                    onClick={() => updateStatus(pqrs.id, estado)}
                    disabled={pqrs.estado === estado || updatingId === pqrs.id}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${
                      pqrs.estado === estado
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {updatingId === pqrs.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      estado
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
