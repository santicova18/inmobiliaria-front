"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken } from "@/lib/api";
import {
  Users,
  Loader2,
  UserX,
  CheckCircle,
  XCircle,
  Calendar,
  Shield,
} from "lucide-react";

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  activo: boolean;
  is_verified: boolean;
  fecha_registro: string;
}

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  async function fetchUsuarios() {
    const token = getToken();
    if (!token) return;
    try {
      const data = await apiFetch<Usuario[]>("/usuarios/list", { token });
      setUsuarios(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar usuarios"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDeactivate(userId: number) {
    const token = getToken();
    if (!token) return;
    setActionLoading(userId);
    try {
      await apiFetch(`/usuarios/deactivate?usuario_id=${userId}`, {
        method: "PUT",
        token,
      });
      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al desactivar");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Gestion de Usuarios
          </h1>
        </div>
        <p className="mt-1 text-muted-foreground">
          Administra los usuarios registrados en el sistema
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {usuarios.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Users className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Sin usuarios
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Verificado
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-muted-foreground">
                    Registro
                  </th>
                  <th className="px-6 py-4 text-right font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      #{u.id}
                    </td>
                    <td className="px-6 py-4 text-foreground">{u.nombre}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.activo
                            ? "bg-success/10 text-success"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {u.activo ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          u.is_verified
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {u.is_verified ? "Si" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(u.fecha_registro).toLocaleDateString(
                          "es-CO"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.activo && (
                        <button
                          onClick={() => handleDeactivate(u.id)}
                          disabled={actionLoading === u.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 disabled:opacity-50"
                        >
                          {actionLoading === u.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <UserX className="h-3 w-3" />
                          )}
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
