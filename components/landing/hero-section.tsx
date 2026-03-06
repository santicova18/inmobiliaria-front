import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center justify-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-landscape.jpg"
          alt="Vista aerea de proyecto inmobiliario"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/40 to-background" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center px-6 py-24 text-center md:py-32">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-2 backdrop-blur-sm">
          <MapPin className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-primary-foreground">
            Lotes desde 100m2 disponibles
          </span>
        </div>

        <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl text-balance">
          Tu terreno ideal
          <br />
          te espera
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-primary-foreground/80 text-pretty">
          Descubre lotes exclusivos en ubicaciones privilegiadas. Proceso de
          compra transparente, pagos flexibles y soporte dedicado.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/registro"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl sm:w-auto"
          >
            Comenzar ahora
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary-foreground/30 bg-primary-foreground/10 px-8 py-4 text-base font-semibold text-primary-foreground backdrop-blur-sm transition-all hover:bg-primary-foreground/20 sm:w-auto"
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  );
}
