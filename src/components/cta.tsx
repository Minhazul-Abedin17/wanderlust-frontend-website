import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Cta() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/CTA.png"
        alt="Aerial view of a tropical island surrounded by ocean"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <div className="relative flex flex-col items-center px-4 py-24 text-center">
        <h2 className="font-serif text-4xl font-medium text-white md:text-5xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-3 text-sm text-white/85">
          Join thousands of travelers who have discovered the world with us
        </p>
        <a
          href="/destinations"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-white px-6 text-xs font-bold tracking-widest text-slate-900 uppercase transition-colors hover:bg-white/85 outline-none focus-visible:ring-3 focus-visible:ring-white/60"
        >
          Book Your Trip Today
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  );
}
