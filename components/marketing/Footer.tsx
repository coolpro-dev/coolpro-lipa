import Link from "next/link";
import { site } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <p className="display font-bold text-lg mb-2">{site.shortName}</p>
          <p className="text-slate-300 leading-relaxed">{site.tagline}</p>
        </div>
        <div className="footer-nap space-y-2 text-slate-300">
          <p>
            <a href={`tel:${site.phone}`} className="hover:text-brand-light">
              {site.phoneDisplay}
            </a>
          </p>
          <p>
            <a href={site.messenger} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light">
              Messenger
            </a>
          </p>
          <p>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-brand-light">
              WhatsApp
            </a>
          </p>
        </div>
        <div className="space-y-2">
          <Link href="/calculator" className="block hover:text-brand-light">
            AC Size Calculator
          </Link>
          <Link href="/contact" className="block hover:text-brand-light">
            Contact
          </Link>
          <Link href="/services" className="block hover:text-brand-light">
            All services
          </Link>
        </div>
      </div>
      <p className="text-center text-slate-400 text-xs pb-6">
        © {new Date().getFullYear()} {site.shortName} — Lipa &amp; Batangas
      </p>
    </footer>
  );
}
