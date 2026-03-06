"use client";

import { useState, useEffect } from "react";
import { apiFetch, getToken } from "@/lib/api";
import {
  CreditCard,
  Loader2,
  Calendar,
  DollarSign,
  CheckCircle,
  Plus,
  X,
} from "lucide-react";

interface Compra {
  id: number;
  total: number;
  pendiente: number;
  estado: string;
}

interface Pago {
  id: number;
  compra_id: number;
  fecha_pago: string;
  valor_pagado: number;
  comprobante: string | null;
}

export default function PagosPage() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [selectedCompra, setSelectedCompra] = useState<number | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagosLoading, setPagosLoading] = useState(false);
  const [error, setError] = useState("");

  // New payment form
  const [showForm, setShowForm] = useState(false);
  const [compraId, setCompraId] = useState("");
  const [valor, setValor] = useState("");
  const [comprobante, setComprobante] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);

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
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchPagos(compraIdParam: number) {
    const token = getToken();
    if (!token) return;
    setPagosLoading(true);
    try {
      const data = await apiFetch<Pago[]>(`/pagos/compra/${compraIdParam}`, {
        token,
      });
      setPagos(data);
      setSelectedCompra(compraIdParam);
    } catch {
      setPagos([]);
    } finally {
      setPagosLoading(false);
    }
  }

  async function handlePagoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const token = getToken();
    if (!token) return;

    try {
      await apiFetch("/pagos/register", {
        method: "POST",
        body: JSON.stringify({
          compra_id: parseInt(compraId),
          valor_pagado: parseFloat(valor),
          comprobante: comprobante || null,
        }),
        token,
      });
      setPaySuccess(true);
      setShowForm(false);
      setValor("");
      setComprobante("");
      await fetchCompras();
      if (selectedCompra) await fetchPagos(selectedCompra);
      setTimeout(() => setPaySuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrar pago");
    } finally {
      setSubmitting(false);
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
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Pagos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Registra abonos y consulta tu historial de pagos
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
              <Plus className="h-4 w-4" /> Nuevo Pago
            </>
          )}
        </button>
      </div>

      {paySuccess && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-success">
          <CheckCircle className="h-5 w-5" />
          Pago registrado exitosamente. Recibiras un recibo por correo.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* New payment form */}
      {showForm && (
        <div className="mb-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Registrar Nuevo Pago
          </h2>
          <form
            onSubmit={handlePagoSubmit}
            className="grid gap-4 sm:grid-cols-3"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Compra
              </label>
              <select
                required
                value={compraId}
                onChange={(e) => setCompraId(e.target.value)}
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Selecciona una compra</option>
                {compras
                  .filter((c) => c.estado === "Activa")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      Compra #{c.id} - Pendiente: $
                      {Number(c.pendiente).toLocaleString("es-CO")}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Valor del abono
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0.00"
                className="rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Comprobante (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={comprobante}
                  onChange={(e) => setComprobante(e.target.value)}
                  placeholder="Numero de referencia"
                  className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Pagar"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Compras list */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Tus Compras
          </h2>
          {compras.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <CreditCard className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                No tienes compras registradas.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {compras.map((c) => (
                <button
                  key={c.id}
                  onClick={() => fetchPagos(c.id)}
                  className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                    selectedCompra === c.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground">
                      Compra #{c.id}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total: ${Number(c.total).toLocaleString("es-CO")} |{" "}
                      {c.estado}
                    </p>
                  </div>
                  <DollarSign className="h-5 w-5 text-primary" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagos list */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Historial de Pagos
          </h2>
          {pagosLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : selectedCompra === null ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <CreditCard className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Selecciona una compra para ver sus pagos.
              </p>
            </div>
          ) : pagos.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No hay pagos registrados para esta compra.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pagos.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">
                      ${Number(p.valor_pagado).toLocaleString("es-CO")}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(p.fecha_pago).toLocaleDateString("es-CO")}
                    </span>
                  </div>
                  {p.comprobante && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ref: {p.comprobante}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
