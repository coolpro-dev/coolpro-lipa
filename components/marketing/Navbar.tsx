"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { site } from "@/config/site";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/calculator", label: "AC Calculator" },
  { href: "/services", label: "All Services" },
  { href: "/#faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <nav
        className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4"
        aria-label="Primary"
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src={site.logo} alt="CoolPro" width={44} height={44} className="object-contain" />
          <span className="display font-bold text-brand-dark">{site.shortName}</span>
        </Link>

        <ul className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-brand">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <a
          href={site.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex px-4 py-2 rounded-full bg-brand text-white text-sm font-semibold hover:bg-brand-dark"
        >
          Book on Messenger
        </a>

        <button
          type="button"
          className="md:hidden p-2 text-2xl"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4">
          <ul className="space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-2" onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.messenger} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold">
                Messenger
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
