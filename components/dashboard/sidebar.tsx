"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserData, logout } from "@/lib/api";
import {
  Home,
  MapPin,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
  LayoutGrid,
} from "lucide-react";
import { useState, useEffect } from "react";

const clientLinks = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/mapa-lotes", label: "Mapa de Lotes", icon: LayoutGrid },
  { href: "/dashboard/lotes", label: "Lotes", icon: MapPin },
  { href: "/dashboard/compras", label: "Mis Compras", icon: ShoppingCart },
  { href: "/dashboard/pagos", label: "Pagos", icon: CreditCard },
  { href: "/dashboard/pqrs", label: "PQRS", icon: MessageSquare },
];

const adminLinks = [
  { href: "/dashboard/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/dashboard/admin/lotes", label: "Gestionar Lotes", icon: Settings },
  { href: "/dashboard/admin/pqrs", label: "Gestionar PQRS", icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<ReturnType<typeof getUserData>>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setUser(getUserData());
  }, []);

  const isAdmin = user?.rol === "Administrador";

  return (
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-border bg-card transition-all ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-border px-4 py-5">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-serif text-lg font-bold text-foreground">
              Terranova
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label={collapsed ? "Expandir menu" : "Contraer menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {!collapsed && (
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Menu
            </p>
          )}
          {clientLinks.map((link) => {
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
                title={collapsed ? link.label : undefined}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                {!collapsed && link.label}
              </Link>
            );
          })}
        </div>

        {isAdmin && (
          <div className="mt-6 flex flex-col gap-1">
            {!collapsed && (
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Administracion
              </p>
            )}
            {adminLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                  title={collapsed ? link.label : undefined}
                >
                  <link.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && link.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* User info */}
      <div className="border-t border-border px-3 py-4">
        {!collapsed && user && (
          <div className="mb-3 px-3">
            <p className="truncate text-sm font-medium text-foreground">
              {user.nombre || user.email}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.rol}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          title={collapsed ? "Cerrar sesion" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && "Cerrar sesion"}
        </button>
      </div>
    </aside>
  );
}
