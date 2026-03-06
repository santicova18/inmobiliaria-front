"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, getUserData } from "@/lib/api";
import Sidebar from "@/components/dashboard/sidebar";
import { Loader2, Menu, X } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUserData();
    if (!token || !user) {
      router.replace("/login");
      return;
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex items-center border-b border-border bg-card px-4 py-3 md:hidden">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg p-2 text-foreground hover:bg-secondary"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="ml-3 font-serif text-lg font-bold text-foreground">
            Terranova
          </span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
