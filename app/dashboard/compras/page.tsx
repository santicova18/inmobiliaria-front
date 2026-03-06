"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken } from "@/lib/api";
import {
  ShoppingCart,
  Loader2,
  Calendar,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Compra {
  id: number;
  usuario_id: number;
  fecha_compra: string;
  total: number;
  pendiente: number;
  estado: string;
}

interface Detalle {
  id: number;
  compra_id: number;
  lote_id: number;
  precio: number;
}

interface Resumen {
  total_compra: number;
  total_pagado: number;
  saldo_pendiente: number;
}

export default function ComprasPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedCompra, setExpandedCompra] = useState<number | null>(null);
  const [detalles, setDetalles] = useState<Record<number, Detalle[]>>({});
  const [resumenes, setResumenes] = useState<Record<number, Resumen>>({});

  useEffect(() => {
    fetchCompras();
  }, []);

  async function fetchCompras() {
    const token = getToken();
    if (!token) return;

    try {
      const data = await apiFetch<Compra[]>("/pagos/mis-compras", { token });
      setCompras(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar compras");
    } finally {
      setLoading(false);
    }
  }

  async function toggleExpand(compraId: number) {
    if (expandedCompra === compraId) {
      setExpandedCompra(null);
      return;
    }

    setExpandedCompra(compraId);
    const token = getToken();
    if (!token) return;

    // Load details and summary in parallel
    if (!detalles[compraId]) {
      try {
        const [detData, resData] = await Promise.all([
          apiFetch<Detalle[]>(`/detalle-compra/compra/${compraId}`, { token }),
          apiFetch<Resumen>(`/pagos/resumen/${compraId}`, { token }),
        ]);
        setDetalles((prev) => ({ ...prev, [compraId]: detData }));
        setResumenes((prev) => ({ ...prev, [compraId]: resData }));
      } catch {
        // silently handle
      }
    }
  }

  const estadoStyles: Record<string, string> = {
    Activa: "bg-warning/10 text-warning",
    Pagada: "bg-success/10 text-success",
    Cancelada: "bg-destructive/10 text-destructive",
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
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Mis Compras
        </h1>
        <p className="mt-1 text-muted-foreground">
          Historial de tus compras de lotes
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {compras.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">
            Sin compras
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Aun no has realizado ninguna compra de lotes.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {compras.map((compra) => {
            const isExpanded = expandedCompra === compra.id;
            const resumen = resumenes[compra.id];
            const detalle = detalles[compra.id];

            return (
              <div
                key={compra.id}
                className="overflow-hidden rounded-2xl border border-border bg-card"
              >
                <button
                  onClick={() => toggleExpand(compra.id)}
                  className="flex w-full items-center justify-between p-6 text-left hover:bg-secondary/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                      <ShoppingCart className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Compra #{compra.id}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(compra.fecha_compra).toLocaleDateString(
                            "es-CO"
                          )}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            estadoStyles[compra.estado] || ""
                          }`}
                        >
                          {compra.estado}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-foreground">
                      ${Number(compra.total).toLocaleString("es-CO")}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-6 py-5">
                    {resumen && (
                      <div className="mb-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-secondary p-4">
                          <p className="text-xs text-muted-foreground">
                            Total compra
                          </p>
                          <p className="mt-1 text-xl font-bold text-foreground">
                            ${Number(resumen.total_compra).toLocaleString("es-CO")}
                          </p>
                        </div>
                        <div className="rounded-xl bg-success/10 p-4">
                          <p className="text-xs text-success">Total pagado</p>
                          <p className="mt-1 text-xl font-bold text-success">
                            ${Number(resumen.total_pagado).toLocaleString("es-CO")}
                          </p>
                        </div>
                        <div className="rounded-xl bg-warning/10 p-4">
                          <p className="text-xs text-warning">
                            Saldo pendiente
                          </p>
                          <p className="mt-1 text-xl font-bold text-warning">
                            ${Number(resumen.saldo_pendiente).toLocaleString("es-CO")}
                          </p>
                        </div>
                      </div>
                    )}

                    {detalle && detalle.length > 0 && (
                      <div>
                        <p className="mb-3 text-sm font-semibold text-foreground">
                          Lotes incluidos
                        </p>
                        <div className="rounded-xl border border-border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border bg-secondary/50">
                                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                                  Lote
                                </th>
                                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                                  Precio
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detalle.map((d) => (
                                <tr
                                  key={d.id}
                                  className="border-b border-border last:border-0"
                                >
                                  <td className="px-4 py-3 text-foreground">
                                    Lote #{d.lote_id}
                                  </td>
                                  <td className="px-4 py-3 text-right font-medium text-foreground">
                                    ${Number(d.precio).toLocaleString("es-CO")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
