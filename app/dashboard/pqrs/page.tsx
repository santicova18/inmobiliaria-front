"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken, getUserData } from "@/lib/api";
import {
  MessageSquare,
  Loader2,
  Plus,
  X,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface PQRS {
  id: number;
  usuario_id: number;
  tipo: string;
  descripcion: string;
  estado: string;
  fecha_creacion: string;
}

const tipoOptions = [
  { value: "Peticion", label: "Peticion" },
  { value: "Queja", label: "Queja" },
  { value: "Reclamo", label: "Reclamo" },
  { value: "Sugerencia", label: "Sugerencia" },
];

export default function PqrsPage() {
  const [pqrsList, setPqrsList] = useState<PQRS[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState("Peticion");
  const [descripcion, setDescripcion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  useEffect(() => {
    fetchPqrs();
  }, []);

  async function fetchPqrs() {
    const user = getUserData();
    if (!user) return;
    try {
      const data = await apiFetch<PQRS[]>(`/pqrs/user/${user.id}`);
      setPqrsList(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar PQRS");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const user = getUserData();
    if (!user) return;

    try {
      await apiFetch(`/pqrs/create?usuario_id=${user.id}`, {
        method: "POST",
        body: JSON.stringify({ tipo, descripcion }),
      });
      setCreateSuccess(true);
      setShowForm(false);
      setDescripcion("");
      await fetchPqrs();
      setTimeout(() => setCreateSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear PQRS");
    } finally {
      setSubmitting(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            PQRS
          </h1>
          <p className="mt-1 text-muted-foreground">
            Peticiones, quejas, reclamos y sugerencias
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" /> Cancelar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Nueva Solicitud
            </>
          )}
        </button>
      </div>

      {createSuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle className="h-5 w-5" />
          Solicitud creada exitosamente
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Creation form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Crear nueva solicitud
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Tipo de solicitud
              </label>
              <div className="flex flex-wrap gap-2">
                {tipoOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTipo(opt.value)}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      tipo === opt.value
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Descripcion (10-500 caracteres)
              </label>
              <textarea
                required
                minLength={10}
                maxLength={500}
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe tu solicitud con detalle..."
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground">
                {descripcion.length}/500 caracteres
              </p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="self-end rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Enviar solicitud"
              )}
            </button>
          </form>
        </div>
      )}

      {/* PQRS list */}
      {pqrsList.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Sin solicitudes
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No has creado ninguna solicitud PQRS aun.
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
