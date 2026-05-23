const testimonials = [
  {
    quote: "Fast reply on Messenger and clear quote before they came. Split-type cleaning was thorough.",
    name: "Homeowner, Lipa City",
  },
  {
    quote: "Helped us pick the right HP for a bedroom install. No hard sell — just honest sizing advice.",
    name: "Client, Santo Tomas",
  },
  {
    quote: "Chemical cleaning fixed the mold smell on our window unit. Would book again.",
    name: "Client, Tanauan",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="display text-2xl font-bold text-center mb-10">What customers say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <blockquote
              key={t.name}
              className="rounded-xl border border-slate-200 p-6 bg-surface"
            >
              <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-xs font-medium text-muted">{t.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
