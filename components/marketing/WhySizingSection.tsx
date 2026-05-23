import Link from "next/link";

export function WhySizingSection() {
  return (
    <section className="py-16 bg-surface">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="display text-2xl font-bold text-brand-dark mb-4">
          Why proper AC sizing matters
        </h2>
        <p className="text-muted leading-relaxed mb-6">
          An oversized aircon short-cycles — it cools fast but doesn&apos;t dehumidify well, wastes
          electricity, and wears out faster. An undersized unit runs non-stop and still struggles in
          Batangas heat. Right-sizing saves money and keeps you comfortable.
        </p>
        <Link
          href="/calculator"
          className="inline-flex px-6 py-3 rounded-full bg-brand text-white font-semibold hover:bg-brand-dark"
        >
          Calculate your room size
        </Link>
      </div>
    </section>
  );
}
