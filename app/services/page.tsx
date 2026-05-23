import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/config/site";

export const metadata: Metadata = {
  title: "Aircon Services Lipa Batangas",
  description: "CoolPro aircon cleaning, repair, installation, and refrigerant service in Lipa and Batangas.",
};

export default function ServicesHubPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="display text-3xl font-bold text-brand-dark mb-6">All aircon services</h1>
      <ul className="space-y-4">
        {services.map((s) => (
          <li key={s.slug}>
            <Link href={`/services/${s.slug}`} className="block p-4 rounded-xl border border-slate-200 hover:border-brand">
              <span className="display font-semibold text-lg">{s.h1.replace(" in Lipa Batangas", "")}</span>
              <p className="text-sm text-muted mt-1">{s.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
