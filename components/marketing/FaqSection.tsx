import { faqItems } from "@/config/site";

export function FaqSection() {
  return (
    <section id="faq" className="py-16 md:py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4">
        <h2 className="display text-2xl font-bold mb-8">Frequently asked questions</h2>
        <div className="divide-y divide-slate-200">
          {faqItems.map((item) => (
            <details key={item.q} className="py-4 group">
              <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                {item.q}
                <span className="text-brand ml-2 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-muted text-sm mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
