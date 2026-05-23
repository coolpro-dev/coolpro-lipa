import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, site } from "@/config/site";
import { JsonLd } from "@/components/seo/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.title.replace(` | ${site.shortName}`, ""),
    description: service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@type": "Service",
          name: service.h1,
          description: service.description,
          provider: { "@id": site.businessId() },
          areaServed: site.areas.map((name) => ({ "@type": "City", name })),
          serviceType: service.serviceType,
        }}
      />
      <article className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-muted mb-4">
          <Link href="/">Home</Link>
          {" / "}
          <Link href="/services">Services</Link>
          {" / "}
          <span>{service.slug}</span>
        </nav>
        <h1 className="display text-3xl font-bold text-brand-dark mb-4">{service.h1}</h1>
        <p className="text-muted leading-relaxed mb-8">{service.description}</p>
        <ul className="list-disc pl-5 space-y-2 mb-8">
          {service.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <a
            href={site.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-full bg-brand text-white font-semibold"
          >
            Message for quote
          </a>
          <Link href="/calculator" className="px-5 py-3 rounded-full border border-brand text-brand font-semibold">
            AC Calculator
          </Link>
        </div>
      </article>
    </>
  );
}
