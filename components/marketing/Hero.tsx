import Link from "next/link";
import { site } from "@/config/site";

export function Hero() {
  return (
    <section className="bg-gradient-to-br from-brand to-brand-dark text-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <p className="display text-sm font-semibold text-brand-light mb-3">{site.name}</p>
        <h1 className="display text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
          Aircon Cleaning, Repair &amp; Install in{" "}
          <span className="text-brand-light">Lipa &amp; Batangas</span>
        </h1>
        <p className="mt-5 text-lg text-white/85 max-w-xl leading-relaxed">
          General &amp; chemical cleaning, troubleshooting, installation, and refrigerant top-up.
          Call{" "}
          <a href={`tel:${site.phone}`} className="text-brand-light underline">
            {site.phoneDisplay}
          </a>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calculator"
            className="px-5 py-3 rounded-full bg-white text-brand-dark font-semibold hover:bg-brand-light"
          >
            AC Size Calculator
          </Link>
          <a
            href={site.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-[#0084ff] font-semibold"
          >
            Messenger
          </a>
          <a
            href={site.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-[#25d366] font-semibold"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
