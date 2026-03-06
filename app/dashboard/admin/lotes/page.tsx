"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken } from "@/lib/api";
import {
  MapPin,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  Settings,
  LayoutGrid,
  List,
} from "lucide-react";
import LotesMap from "@/components/dashboard/lotes-map";

interface Lote {
  id: number;
  area_m2: number;
  ubicacion: string;
  valor: number;
  estado: string;
  etapa_id: number;
}

export default function AdminLotesPage() {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Create/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formArea, setFormArea] = useState("");
  const [formUbicacion, setFormUbicacion] = useState("");
  const [formValor, setFormValor] = useState("");
  const [formEstado, setFormEstado] = useState("Disponible");
  const [formEtapaId, setFormEtapaId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [adminView, setAdminView] = useState<"table" | "map">("table");

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

  function openCreate() {
    setEditingId(null);
    setFormArea("");
    setFormUbicacion("");
    setFormValor("");
    setFormEstado("Disponible");
    setFormEtapaId("");
    setShowForm(true);
  }

  function openEdit(lote: Lote) {
    setEditingId(lote.id);
    setFormArea(String(lote.area_m2));
    setFormUbicacion(lote.ubicacion);
    setFormValor(String(lote.valor));
    setFormEstado(lote.estado);
    setFormEtapaId(String(lote.etapa_id));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const token = getToken();
    if (!token) return;

    try {
      if (editingId) {
        await apiFetch(`/lotes/update/${editingId}`, {
          method: "PUT",
          body: JSON.stringify({
            area_m2: parseInt(formArea),
            ubicacion: formUbicacion,
            valor: parseFloat(formValor),
            estado: formEstado,
            etapa_id: parseInt(formEtapaId),
          }),
          token,
        });
        setSuccess("Lote actualizado exitosamente");
      } else {
        await apiFetch("/lotes/create", {
          method: "POST",
          body: JSON.stringify({
            area_m2: parseInt(formArea),
            ubicacion: formUbicacion,
            valor: parseFloat(formValor),
            estado: formEstado,
            etapa_id: parseInt(formEtapaId),
          }),
          token,
        });
        setSuccess("Lote creado exitosamente");
      }
      setShowForm(false);
      await fetchLotes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Estas seguro de eliminar este lote?")) return;
    const token = getToken();
    if (!token) return;
    try {
      await apiFetch(`/lotes/delete/${id}`, { method: "DELETE", token });
      setSuccess("Lote eliminado");
      await fetchLotes();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar");
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
        <div className="flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              Gestionar Lotes
            </h1>
            <p className="mt-1 text-muted-foreground">
              Crear, editar y eliminar lotes del sistema
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => setAdminView("table")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                adminView === "table"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              Tabla
            </button>
            <button
              onClick={() => setAdminView("map")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                adminView === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Mapa
            </button>
          </div>
          <button
            onClick={() => (showForm ? setShowForm(false) : openCreate())}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" /> Cancelar
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Nuevo Lote
              </>
            )}
          </button>
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

      {/* Form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            {editingId ? "Editar Lote" : "Crear Nuevo Lote"}
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Area (m2) - 100 a 200
              </label>
              <input
                type="number"
                min="100"
                max="200"
                required
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                placeholder="150"
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Ubicacion
              </label>
              <input
                type="text"
                required
                value={formUbicacion}
                onChange={(e) => setFormUbicacion(e.target.value)}
                placeholder="Sector norte, manzana 3"
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Valor ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formValor}
                onChange={(e) => setFormValor(e.target.value)}
                placeholder="50000000"
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Estado
              </label>
              <select
                value={formEstado}
                onChange={(e) => setFormEstado(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="Disponible">Disponible</option>
                <option value="Reservado">Reservado</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Etapa ID
              </label>
              <input
                type="number"
                required
                value={formEtapaId}
                onChange={(e) => setFormEtapaId(e.target.value)}
                placeholder="1"
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                ) : editingId ? (
                  "Guardar cambios"
                ) : (
                  "Crear lote"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Map view */}
      {adminView === "map" && lotes.length > 0 && (
        <div className="mb-8">
          <LotesMap lotes={lotes} />
        </div>
      )}

      {/* Table */}
      {lotes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Sin lotes
          </h2>
        </div>
      ) : adminView === "table" ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Ubicacion
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Area
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Etapa
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {lotes.map((lote) => (
                  <tr
                    key={lote.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      #{lote.id}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {lote.ubicacion}
                    </td>
                    <td className="px-6 py-4 text-foreground">
                      {lote.area_m2} m2
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      ${Number(lote.valor).toLocaleString("es-CO")}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          estadoStyles[lote.estado] || ""
                        }`}
                      >
                        {lote.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {lote.etapa_id}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(lote)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(lote.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20"
                        >
                          <Trash2 className="h-3 w-3" />
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
