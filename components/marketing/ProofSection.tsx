import Image from "next/image";
import { site } from "@/config/site";

export function ProofSection() {
  return (
    <section id="proof" className="py-16 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="display text-2xl font-bold text-center mb-8">On-site work</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="sm:col-span-2 lg:col-span-2 relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200">
            <Image
              src={site.ogImage}
              alt="CoolPro aircon services Lipa Batangas"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 flex items-center justify-center text-center text-muted text-sm">
            Before/after photos from recent jobs — message us on Messenger to see more examples.
          </div>
        </div>
      </div>
    </section>
  );
}
