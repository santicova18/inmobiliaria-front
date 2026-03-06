import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="overflow-hidden rounded-3xl bg-primary">
          <div className="flex flex-col items-center px-8 py-16 text-center md:px-16 md:py-20">
            <h2 className="font-serif text-3xl font-bold text-primary-foreground sm:text-4xl md:text-5xl text-balance">
              Comienza a construir tu futuro hoy
            </h2>
            <p className="mt-4 max-w-lg text-lg text-primary-foreground/80 text-pretty">
              Registrate gratis, explora los lotes disponibles y asegura tu
              inversion en minutos.
            </p>
            <Link
              href="/registro"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-card/90 hover:shadow-lg"
            >
              Crear mi cuenta
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
