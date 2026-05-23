import { Hero } from "@/components/marketing/Hero";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { WhySizingSection } from "@/components/marketing/WhySizingSection";
import { ProofSection } from "@/components/marketing/ProofSection";
import { TestimonialsSection } from "@/components/marketing/TestimonialsSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessSchema, faqSchema, websiteSchema } from "@/lib/seo/schema";
import Link from "next/link";
import { site } from "@/config/site";

export default function HomePage() {
  return (
    <>
      <JsonLd data={[websiteSchema(), businessSchema(), faqSchema()]} />
      <Hero />
      <WhySizingSection />
      <ServicesSection />
      <ProofSection />
      <TestimonialsSection />
      <section className="py-12 bg-brand/5 border-y border-brand/10">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="display text-xl font-bold mb-3">Ready for a quote?</h2>
          <p className="text-muted text-sm mb-4">
            Use the calculator or message us with your AC type, HP, and barangay.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/calculator"
              className="px-5 py-2.5 rounded-full bg-brand text-white font-semibold text-sm"
            >
              AC Calculator
            </Link>
            <a
              href={site.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full border border-brand text-brand font-semibold text-sm"
            >
              Messenger
            </a>
          </div>
        </div>
      </section>
      <FaqSection />
    </>
  );
}
