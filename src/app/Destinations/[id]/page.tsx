
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";

import {
  sampleDestinations,
  type Destination,
} from "@/lib/destinations";
import EditDestination from "@/components/EditDestination";
import DeleteDestination from "@/components/DeleteDestination";

type DestinationWithDate = Destination & {
  departureDate?: string | null;
};

async function getDestination(
  id: string
): Promise<DestinationWithDate | null> {
  try {
    const res = await fetch(
      `http://localhost:8000/Destinations/${id}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const data = await res.json();

      if (data) {
        return {
          ...data,
          id: String(data.id ?? data._id),
        } as DestinationWithDate;
      }
    }
  } catch {
    // API unavailable; use sample data below.
  }

  return (
    sampleDestinations.find((item) => String(item.id) === id) ?? null
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    return { title: "Destination Not Found | Wanderlust" };
  }

  return {
    title: `${destination.name} | Wanderlust`,
    description:
      destination.description ||
      `Explore ${destination.name} in ${destination.country} with Wanderlust.`,
  };
}

function formatDate(value?: string | null): string {
  if (!value) return "Flexible dates";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  const price = Number(destination.price) || 0;
  const rating = Math.min(
    5,
    Math.max(0, Number(destination.rating) || 4.5)
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/Destinations"
          className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium transition hover:border-sky-500 hover:text-sky-600"
        >
          <ArrowLeft className="size-4" />
          All destinations
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400">
                <MapPin className="size-3.5" />
                {destination.country}
              </span>

              {destination.category ? (
                <span className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  {destination.category}
                </span>
              ) : null}
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {destination.name}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {destination.description ||
                `Discover ${destination.name} and enjoy an unforgettable travel experience in ${destination.country}.`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-400/15">
              <Star className="size-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <p className="font-bold">{rating.toFixed(1)} / 5</p>
              <p className="text-xs text-muted-foreground">
                Destination rating
              </p>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-5">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted shadow-lg sm:aspect-[16/10]">
              {destination.imageUrl ? (
                <Image
                  src={destination.imageUrl}
                  alt={destination.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <MapPin className="size-12 text-muted-foreground/40" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

              <div className="absolute left-5 top-5">
                <span className="rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
                  Explore {destination.country}
                </span>
              </div>

              <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-7 sm:bottom-7">
                <p className="mb-1 text-sm text-white/80">
                  Your next adventure starts here
                </p>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Discover something extraordinary.
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                  <Clock3 className="size-5" />
                </div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="mt-1 text-sm font-semibold">
                  {destination.duration || "Flexible"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <CalendarDays className="size-5" />
                </div>
                <p className="text-xs text-muted-foreground">Departure</p>
                <p className="mt-1 text-sm font-semibold">
                  {formatDate(destination.departureDate)}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-border bg-card p-4 sm:col-span-1">
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                  <ShieldCheck className="size-5" />
                </div>
                <p className="text-xs text-muted-foreground">Planning</p>
                <p className="mt-1 text-sm font-semibold">
                  Easy & convenient
                </p>
              </div>
            </div>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="text-lg font-bold">
                About this destination
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {destination.description ||
                  `Explore the attractions of ${destination.name} and create memorable experiences in ${destination.country}.`}
              </p>
            </section>
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-black/[0.04]">
              <div className="bg-gradient-to-br from-sky-600 to-blue-700 p-6 text-white sm:p-7">
                <p className="text-sm font-medium text-white/80">
                  Your next getaway
                </p>

                <div className="mt-3 flex items-end gap-2">
                  <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                    ${price.toLocaleString("en-US")}
                  </span>
                  <span className="pb-1 text-sm text-white/80">
                    / person
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm">
                  <Star className="size-4 fill-amber-300 text-amber-300" />
                  <span className="font-semibold">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-white/75">
                    Destination rating
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <h2 className="text-lg font-bold">
                  Ready for your trip?
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Start planning your experience at {destination.name}.
                </p>

                <div className="my-5 space-y-3 border-y border-border py-5">
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    <span>Destination details</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    <span>Trip duration information</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                    <span>Explore at your own pace</span>
                  </div>
                </div>
                <EditDestination destination={destination}/>
                <DeleteDestination id={id}/>

                <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
                  Booking functionality will be available once the
                  booking page is connected.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
