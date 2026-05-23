/** Single source for business NAP, URLs, and marketing content. */

function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  get url() {
    return resolveSiteUrl();
  },
  businessId: () => `${resolveSiteUrl()}/#business`,
  websiteId: () => `${resolveSiteUrl()}/#website`,

  name: "CoolPro - Air Solutions Aircon Services Lipa",
  shortName: "CoolPro Lipa",
  tagline: "Aircon cleaning, repair, installation & refrigerant service",
  description:
    "Aircon general and chemical cleaning, repair, installation, and refrigerant top-up serving Lipa City and Batangas Province.",

  phone: "+639485121132",
  phoneDisplay: "0948 512 1132",
  messenger: "https://m.me/coolproairconlipa",
  whatsapp: "https://wa.me/639485121132",
  facebook: "https://www.facebook.com/share/1Dh5ZkH4kk/",
  maps: "https://maps.google.com/?q=Lipa+City+Batangas+Philippines",

  logo: "/assets/coolpro_logo.svg",
  ogImage: "/assets/coolpro_service_showcase.svg",

  geo: { latitude: 13.9411, longitude: 121.1631 },
  address: {
    locality: "Lipa City",
    region: "Batangas",
    country: "PH",
  },

  areas: [
    "Lipa City",
    "Tanauan",
    "Santo Tomas",
    "Malvar",
    "Mataasnakahoy",
    "Talisay",
    "Batangas City",
    "Rosario",
    "San Jose",
    "Ibaan",
    "Cuenca",
    "Balete",
    "Padre Garcia",
  ] as const,

  openingHours: {
    opens: "08:00",
    closes: "18:00",
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
} as const;

export type FaqItem = { q: string; a: string };

export const faqItems: FaqItem[] = [
  {
    q: "What areas do you serve?",
    a: "We dispatch from Lipa City to Tanauan, Santo Tomas, Malvar, Mataasnakahoy, Talisay, Batangas City, Rosario, San Jose, Ibaan, Cuenca, Balete, Padre Garcia, and nearby Batangas towns.",
  },
  {
    q: "How do I book aircon service?",
    a: "Message us on Messenger or WhatsApp with your AC type, HP, issue, and barangay. We confirm scope and schedule before your visit. You can also call 0948 512 1132.",
  },
  {
    q: "What is the difference between general and chemical cleaning?",
    a: "General cleaning covers filters, coils, drain line, and exterior wash — ideal every 3–6 months. Chemical cleaning is a deeper flush when there is mold, odor, weak cooling, or heavy buildup.",
  },
  {
    q: "Do you service split-type, window, and inverter AC?",
    a: "Yes. We work on split-type, window, floor-standing, and inverter units for homes and small commercial sites in Batangas.",
  },
  {
    q: "Do you service Tanauan, Santo Tomas, and Malvar?",
    a: "Yes. We regularly visit Tanauan, Santo Tomas, Malvar, and other towns near Lipa. Send your location on Messenger so we can confirm schedule.",
  },
  {
    q: "My aircon is not cooling — can you repair it?",
    a: "Yes. We troubleshoot not cooling, leaks, noise, and units that won't start. Parts and labor are quoted on-site before work proceeds.",
  },
  {
    q: "Do you install new aircon units?",
    a: "Yes. We provide split-type installation and relocation labor in Lipa and Batangas. The AC unit is typically purchased separately unless we arrange otherwise.",
  },
  {
    q: "How often should I clean my aircon in the Philippines?",
    a: "For most home units in humid Batangas weather, general cleaning every 3–6 months helps airflow and cooling. Chemical cleaning is only when buildup or odor persists.",
  },
  {
    q: "Do you offer refrigerant top-up?",
    a: "Yes, after a pressure check and leak inspection when applicable. We use R410A or R32 depending on your unit label.",
  },
  {
    q: "How do I get a quote?",
    a: "Message us on Messenger with your service needed, AC type, HP, and location. We confirm pricing and scope before dispatch — no surprise charges for agreed work.",
  },
  {
    q: "What HP aircon do I need for my room?",
    a: "Use our free AC size calculator — enter room size, sun exposure, and room type. You'll get a recommended HP and BTU/hr estimate. A site visit confirms the final size before purchase.",
  },
];

export const calculatorFaq: FaqItem[] = [
  faqItems[faqItems.length - 1]!,
  {
    q: "Is the calculator result final?",
    a: "No — it's a preliminary estimate with a 15% safety buffer. CoolPro confirms sizing on-site before you buy or install.",
  },
  {
    q: "What happens if my AC is oversized or undersized?",
    a: "Oversized units short-cycle and waste power; undersized units run constantly and struggle in peak heat. Our calculator flags sizing risks — we help you pick the right HP.",
  },
];

export type ServiceDef = {
  slug: string;
  legacyFile: string;
  title: string;
  h1: string;
  description: string;
  serviceType: string;
  bullets: string[];
};

export const services: ServiceDef[] = [
  {
    slug: "ac-general-cleaning",
    legacyFile: "ac-general-cleaning-lipa-batangas.html",
    title: "Aircon General Cleaning Lipa Batangas | CoolPro",
    h1: "Aircon General Cleaning in Lipa Batangas",
    description:
      "Routine split-type and window AC cleaning in Lipa City and Batangas — filters, coils, drain line, and exterior wash.",
    serviceType: "Air conditioning cleaning",
    bullets: [
      "Filter wash and fin cleaning",
      "Drain line check",
      "Exterior cabinet wipe-down",
      "Ideal every 3–6 months for home units",
    ],
  },
  {
    slug: "ac-chemical-cleaning",
    legacyFile: "ac-chemical-cleaning-lipa-batangas.html",
    title: "Aircon Chemical Cleaning Lipa Batangas | CoolPro",
    h1: "Aircon Chemical Cleaning in Lipa Batangas",
    description:
      "Deep chemical flush for units with weak cooling, mold, odor, or heavy buildup.",
    serviceType: "Air conditioning chemical cleaning",
    bullets: [
      "Full dismantling of indoor unit (split type)",
      "Chemical soak and flush of evaporator",
      "Drain pan and blower cleaning",
      "Recommended when general cleaning is not enough",
    ],
  },
  {
    slug: "ac-repair",
    legacyFile: "ac-repair-lipa-batangas.html",
    title: "Aircon Repair Lipa Batangas | CoolPro",
    h1: "Aircon Repair & Troubleshooting in Lipa Batangas",
    description:
      "Diagnose not cooling, leaking water, strange noise, or unit not starting — parts quoted before work.",
    serviceType: "Air conditioning repair",
    bullets: [
      "Compressor, fan, sensor, and PCB checks",
      "Leak detection when needed",
      "Parts and labor quoted on-site",
      "Split, window, and floor-standing units",
    ],
  },
  {
    slug: "ac-installation",
    legacyFile: "ac-installation-lipa-batangas.html",
    title: "Aircon Installation Lipa Batangas | CoolPro",
    h1: "Aircon Installation in Lipa Batangas",
    description:
      "Split-type installation and relocation labor in Lipa and Batangas (AC unit sold separately).",
    serviceType: "Air conditioning installation",
    bullets: [
      "Wall mounting and bracket setup",
      "Copper tubing and drain routing",
      "Vacuum and test run",
      "Standard home split up to ~1.5 HP",
    ],
  },
  {
    slug: "ac-refrigerant-top-up",
    legacyFile: "ac-refrigerant-top-up-lipa-batangas.html",
    title: "Aircon Refrigerant Top-Up Lipa Batangas | CoolPro",
    h1: "Aircon Refrigerant Top-Up in Lipa Batangas",
    description:
      "Pressure check and refrigerant top-up (R410A / R32) after leak inspection when needed.",
    serviceType: "Air conditioning refrigerant service",
    bullets: [
      "Pressure and temperature check",
      "Leak inspection when applicable",
      "R410A or R32 per unit label",
      "Quoted before top-up",
    ],
  },
];

export function messengerPrefill(message: string): string {
  return `${site.messenger}?text=${encodeURIComponent(message)}`;
}
