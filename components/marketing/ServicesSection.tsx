import Link from "next/link";
import { services } from "@/config/site";

export function ServicesSection() {
  return (
    <section id="services" className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand">Services</p>
        <h2 className="display text-2xl md:text-3xl font-bold mt-2 mb-8">Aircon services we offer</h2>
        <ul className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="block px-4 py-4 hover:bg-surface font-medium text-brand-dark"
              >
                {s.h1.replace(" in Lipa Batangas", "")}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">
          <Link href="/calculator" className="text-brand font-semibold">
            Not sure what HP you need? Try our calculator →
          </Link>
        </p>
      </div>
    </section>
  );
}
