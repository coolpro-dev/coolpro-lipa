import Image from "next/image";
import { site } from "@/config/site";

const jobPhotos = [
  { src: "/assets/coolpro_job_1.webp", alt: "Aircon cleaning service in Lipa" },
  { src: "/assets/coolpro_job_2.webp", alt: "Split-type AC maintenance Batangas" },
  { src: "/assets/coolpro_job_3.webp", alt: "Aircon chemical wash service" },
  { src: "/assets/coolpro_job_4.webp", alt: "AC installation work" },
  { src: "/assets/coolpro_job_5.webp", alt: "Window type aircon cleaning" },
  { src: "/assets/coolpro_job_6.webp", alt: "Aircon repair service Batangas" },
];

export function ProofSection() {
  return (
    <section id="proof" className="py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="display text-2xl font-bold text-center mb-8">On-site work</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {jobPhotos.map((photo, i) => (
            <div
              key={photo.src}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 ${
                i === 0 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading={i < 3 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted mt-6">
          Recent jobs in Lipa and Batangas — message us on{" "}
          <a href={site.messenger} className="text-brand underline" target="_blank" rel="noopener noreferrer">
            Messenger
          </a>{" "}
          for more examples.
        </p>
      </div>
    </section>
  );
}
