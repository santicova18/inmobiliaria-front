import {
  ShieldCheck,
  CreditCard,
  MapPin,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    icon: MapPin,
    title: "Lotes Exclusivos",
    description:
      "Terrenos de 100 a 200 m2 en ubicaciones estrategicas, organizados por etapas de desarrollo.",
  },
  {
    icon: CreditCard,
    title: "Pagos Flexibles",
    description:
      "Abona a tu ritmo con un sistema de pagos transparente. Recibe comprobantes por correo automaticamente.",
  },
  {
    icon: ShieldCheck,
    title: "Proceso Seguro",
    description:
      "Verificacion de cuenta por email, proteccion de datos y recuperacion de contrasena en cualquier momento.",
  },
  {
    icon: MessageSquare,
    title: "Soporte PQRS",
    description:
      "Envia peticiones, quejas, reclamos o sugerencias y recibe seguimiento en tiempo real.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto w-full max-w-screen-xl px-6">
        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl md:text-5xl text-balance">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-pretty">
            Gestionamos cada paso de tu inversion inmobiliaria con tecnologia y
            transparencia.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
