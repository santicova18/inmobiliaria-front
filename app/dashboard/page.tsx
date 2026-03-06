"use client";

import { getUserData } from "@/lib/api";
import Link from "next/link";
import {
  MapPin,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

const quickLinks = [
  {
    href: "/dashboard/mapa-lotes",
    label: "Mapa de Lotes",
    description: "Vista grafica de disponibilidad por etapa",
    icon: LayoutGrid,
    color: "bg-primary/10 text-primary",
  },
  {
    href: "/dashboard/lotes",
    label: "Explorar Lotes",
    description: "Ver lotes disponibles y comprar",
    icon: MapPin,
    color: "bg-accent/10 text-accent-foreground",
  },
  {
    href: "/dashboard/compras",
    label: "Mis Compras",
    description: "Historial de compras realizadas",
    icon: ShoppingCart,
    color: "bg-accent/20 text-accent-foreground",
  },
  {
    href: "/dashboard/pagos",
    label: "Pagos",
    description: "Registrar abonos y ver historial",
    icon: CreditCard,
    color: "bg-success/10 text-success",
  },
  {
    href: "/dashboard/pqrs",
    label: "PQRS",
    description: "Peticiones, quejas, reclamos y sugerencias",
    icon: MessageSquare,
    color: "bg-warning/10 text-warning",
  },
];

export default function DashboardHome() {
  const user = typeof window !== "undefined" ? getUserData() : null;

  return (
    <div className="mx-auto max-w-5xl">
      {/* Welcome header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Bienvenido{user?.nombre ? `, ${user.nombre}` : ""}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Gestiona tus lotes, compras y solicitudes desde tu panel.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid gap-6 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${link.color}`}
            >
              <link.icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  {link.label}
                </h2>
                <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {link.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
