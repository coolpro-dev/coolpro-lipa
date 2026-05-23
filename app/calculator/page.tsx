import type { Metadata } from "next";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { JsonLd } from "@/components/seo/JsonLd";
import { calculatorFaq } from "@/config/site";
import { businessSchema, calculatorWebAppSchema, faqSchema } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "AC Size Calculator — HP & BTU Estimate",
  description:
    "Free aircon size calculator for Lipa and Batangas. Get recommended HP, BTU/hr, and AC type — then request a quote from CoolPro.",
  openGraph: {
    title: "AC Size Calculator | CoolPro Lipa",
    description: "Calculate recommended AC HP and BTU/hr for your room. Free estimate for Batangas homes.",
  },
};

export default function CalculatorRoute() {
  return (
    <>
      <JsonLd data={[businessSchema(), calculatorWebAppSchema(), faqSchema(calculatorFaq)]} />
      <CalculatorPage />
      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="display text-xl font-bold mb-4">Calculator FAQ</h2>
        <div className="space-y-3">
          {calculatorFaq.map((item) => (
            <details key={item.q} className="border-b border-slate-200 py-3">
              <summary className="font-medium cursor-pointer">{item.q}</summary>
              <p className="text-muted text-sm mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
