import type { Metadata } from "next";
import { site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact CoolPro Lipa — Messenger, WhatsApp, or call ${site.phoneDisplay}.`,
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@type": "ContactPage",
          name: "Contact CoolPro Lipa",
          url: `${site.url}/contact`,
          mainEntity: { "@id": site.businessId() },
        }}
      />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="display text-3xl font-bold text-brand-dark mb-6">Contact CoolPro</h1>
        <div className="space-y-4 text-lg">
          <p>
            <a href={site.messenger} className="text-[#0084ff] font-semibold" target="_blank" rel="noopener noreferrer">
              Messenger
            </a>{" "}
            — fastest for quotes and scheduling
          </p>
          <p>
            <a href={site.whatsapp} className="text-[#25d366] font-semibold" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </p>
          <p>
            <a href={`tel:${site.phone}`} className="text-brand font-semibold">
              {site.phoneDisplay}
            </a>
          </p>
          <p>
            <a href={site.maps} target="_blank" rel="noopener noreferrer" className="text-brand underline">
              Lipa City, Batangas on Maps
            </a>
          </p>
        </div>
        <p className="mt-8 text-muted text-sm">
          Service areas: {site.areas.join(", ")}, and nearby Batangas towns.
        </p>
        <p className="mt-4">
          <a href="/calculator" className="text-brand font-semibold">
            Use the AC size calculator →
          </a>
        </p>
      </div>
    </>
  );
}
