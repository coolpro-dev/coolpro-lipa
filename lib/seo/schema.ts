import { faqItems, site } from "@/config/site";

export function businessSchema() {
  return {
    "@type": ["LocalBusiness", "HVACBusiness"],
    "@id": site.businessId(),
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    telephone: site.phone,
    image: [`${site.url}${site.logo}`, `${site.url}${site.ogImage}`],
    logo: `${site.url}${site.logo}`,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: [
      ...site.areas.map((name) => ({ "@type": "City", name })),
      { "@type": "AdministrativeArea", name: "Batangas Province" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.openingHours.days,
        opens: site.openingHours.opens,
        closes: site.openingHours.closes,
      },
    ],
    sameAs: [site.facebook, site.messenger],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.phone,
        contactType: "customer service",
        areaServed: "PH",
        availableLanguage: ["en", "fil"],
      },
    ],
    priceRange: "₱₱",
    hasMap: site.maps,
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": site.websiteId(),
    url: site.url,
    name: site.name,
    publisher: { "@id": site.businessId() },
    inLanguage: "en-PH",
  };
}

export function faqSchema(items = faqItems) {
  return {
    "@type": "FAQPage",
    "@id": `${site.url}/#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function calculatorWebAppSchema() {
  return {
    "@type": "WebApplication",
    name: "CoolPro AC Size Calculator",
    url: `${site.url}/calculator`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "PHP" },
    provider: { "@id": site.businessId() },
  };
}
