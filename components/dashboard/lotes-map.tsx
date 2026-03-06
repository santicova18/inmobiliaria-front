"use client";

import { useState } from "react";
import {
  MapPin,
  Ruler,
  DollarSign,
  Layers,
  X,
  ShoppingCart,
} from "lucide-react";

interface Lote {
  id: number;
  area_m2: number;
  ubicacion: string;
  valor: number;
  estado: string;
  etapa_id: number;
}

interface LotesMapProps {
  lotes: Lote[];
  selectable?: boolean;
  selectedIds?: number[];
  onToggleSelect?: (id: number) => void;
}

const estadoConfig: Record<
  string,
  { bg: string; border: string; label: string; dot: string }
> = {
  Disponible: {
    bg: "bg-success/15",
    border: "border-success/40",
    label: "Disponible",
    dot: "bg-success",
  },
  Reservado: {
    bg: "bg-warning/15",
    border: "border-warning/40",
    label: "Reservado",
    dot: "bg-warning",
  },
  Vendido: {
    bg: "bg-destructive/15",
    border: "border-destructive/40",
    label: "Vendido",
    dot: "bg-destructive",
  },
};

export default function LotesMap({
  lotes,
  selectable = false,
  selectedIds = [],
  onToggleSelect,
}: LotesMapProps) {
  const [hoveredLote, setHoveredLote] = useState<Lote | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Group lotes by etapa_id
  const etapas = lotes.reduce<Record<number, Lote[]>>((acc, lote) => {
    if (!acc[lote.etapa_id]) acc[lote.etapa_id] = [];
    acc[lote.etapa_id].push(lote);
    return acc;
  }, {});

  const etapaKeys = Object.keys(etapas)
    .map(Number)
    .sort((a, b) => a - b);

  function handleMouseEnter(lote: Lote, e: React.MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltipPos({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
    setHoveredLote(lote);
  }

  function handleMouseLeave() {
    setHoveredLote(null);
  }

  function handleClick(lote: Lote) {
    if (selectable && lote.estado === "Disponible" && onToggleSelect) {
      onToggleSelect(lote.id);
    }
  }

  // Summary counts
  const disponibles = lotes.filter((l) => l.estado === "Disponible").length;
  const reservados = lotes.filter((l) => l.estado === "Reservado").length;
  const vendidos = lotes.filter((l) => l.estado === "Vendido").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Legend + Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-success" />
            <span className="text-sm text-foreground">
              Disponible ({disponibles})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-warning" />
            <span className="text-sm text-foreground">
              Reservado ({reservados})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 rounded-full bg-destructive" />
            <span className="text-sm text-foreground">
              Vendido ({vendidos})
            </span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {lotes.length} lotes
        </div>
      </div>

      {/* Percentage bar */}
      <div className="overflow-hidden rounded-full bg-muted h-3 flex">
        {disponibles > 0 && (
          <div
            className="bg-success transition-all"
            style={{ width: `${(disponibles / lotes.length) * 100}%` }}
          />
        )}
        {reservados > 0 && (
          <div
            className="bg-warning transition-all"
            style={{ width: `${(reservados / lotes.length) * 100}%` }}
          />
        )}
        {vendidos > 0 && (
          <div
            className="bg-destructive transition-all"
            style={{ width: `${(vendidos / lotes.length) * 100}%` }}
          />
        )}
      </div>

      {/* Map grid by etapa */}
      {etapaKeys.map((etapaId) => {
        const etapaLotes = etapas[etapaId].sort((a, b) => a.id - b.id);

        return (
          <div key={etapaId} className="rounded-2xl border border-border bg-card overflow-hidden">
            {/* Etapa header */}
            <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-6 py-4">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Etapa {etapaId}
              </h3>
              <span className="ml-auto rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {etapaLotes.length} lotes
              </span>
            </div>

            {/* Grid of lots */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                {etapaLotes.map((lote) => {
                  const config = estadoConfig[lote.estado] || estadoConfig.Disponible;
                  const isSelected = selectedIds.includes(lote.id);
                  const isClickable =
                    selectable && lote.estado === "Disponible";

                  return (
                    <button
                      key={lote.id}
                      type="button"
                      onClick={() => handleClick(lote)}
                      onMouseEnter={(e) => handleMouseEnter(lote, e)}
                      onMouseLeave={handleMouseLeave}
                      className={`relative flex flex-col items-center justify-center rounded-xl border-2 p-3 transition-all ${
                        config.bg
                      } ${
                        isSelected
                          ? "border-primary ring-2 ring-primary/30 scale-105"
                          : config.border
                      } ${
                        isClickable
                          ? "cursor-pointer hover:scale-105 hover:shadow-md"
                          : lote.estado !== "Disponible"
                          ? "cursor-default opacity-70"
                          : "cursor-default"
                      }`}
                      aria-label={`Lote ${lote.id}, ${lote.estado}, ${lote.area_m2}m2`}
                    >
                      {/* Selected indicator */}
                      {isSelected && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                          <ShoppingCart className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}

                      {/* Lot visual */}
                      <div className={`mb-1.5 h-2.5 w-2.5 rounded-full ${config.dot}`} />
                      <span className="text-xs font-bold text-foreground">
                        {lote.id}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {lote.area_m2}m2
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {/* Tooltip */}
      {hoveredLote && (
        <div
          className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-full rounded-xl border border-border bg-card p-4 shadow-xl"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                estadoConfig[hoveredLote.estado]?.dot || "bg-muted"
              }`}
            />
            <span className="text-sm font-bold text-foreground">
              Lote #{hoveredLote.id}
            </span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
              {hoveredLote.estado}
            </span>
          </div>
          <div className="flex flex-col gap-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              {hoveredLote.ubicacion}
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler className="h-3 w-3" />
              {hoveredLote.area_m2} m2
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3 w-3" />
              ${Number(hoveredLote.valor).toLocaleString("es-CO")}
            </div>
          </div>
          {/* Arrow */}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-card" />
        </div>
      )}
    </div>
  );
}
