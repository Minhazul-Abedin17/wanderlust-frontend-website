import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip", className: "w-52" },
  {
    label: "Date/Duration",
    placeholder: "Anytime / 3 Days",
    className: "w-44",
  },
  { label: "Budget", placeholder: "$0-$3000", className: "w-40" },
  { label: "People", placeholder: "5-10", className: "w-32" },
];

function SearchStrip() {
  return (
    <form
      action="/search"
      className="flex items-stretch divide-x divide-white/20 border-t border-white/20 bg-white/15 backdrop-blur-md"
    >
      {searchFields.map((field) => (
        <fieldset key={field.label} className={`flex-1 px-6 py-3 ${field.className}`}>
          <legend className="sr-only">{field.label}</legend>
          <label
            htmlFor={`banner-search-${field.label}`}
            className="mb-1 block text-sm font-semibold text-white"
          >
            {field.label}
          </label>
          <Input
            id={`banner-search-${field.label}`}
            name={field.label.toLowerCase()}
            placeholder={field.placeholder}
            className="h-auto rounded-none border-0 bg-transparent px-0 py-0 text-xs text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:border-transparent"
          />
        </fieldset>
      ))}
      <Button
        type="submit"
        className="h-auto self-stretch rounded-none bg-cyan-500 px-10 text-sm font-semibold text-white hover:bg-cyan-600"
      >
        Search
      </Button>
    </form>
  );
}

export function Banner() {
  return (
    <section className="relative overflow-hidden">
      <Image
        src="/images/Banner.png"
        alt="Tropical coastline with turquoise water"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative flex min-h-[520px] flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="max-w-3xl text-5xl font-medium text-white md:text-6xl">
            Discover Your Next Adventure
          </h1>
          <p className="mt-4 max-w-xl text-sm text-white/85 md:text-base">
            Explore breathtaking destinations and create unforgettable memories
            with our curated travel experiences.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <Button className="h-11 rounded-md bg-cyan-500 px-7 text-xs font-bold tracking-widest text-white uppercase hover:bg-cyan-600">
              Explore Now
              <ArrowRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-md border-white/40 bg-white/25 px-7 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm hover:bg-white/35 hover:text-white dark:bg-white/25 dark:hover:bg-white/35"
            >
              View Destination
            </Button>
          </div>
        </div>

        <SearchStrip />
      </div>
    </section>
  );
}
