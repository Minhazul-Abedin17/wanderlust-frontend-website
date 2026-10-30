import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Compass,
  MapPin,
  ShieldCheck,
  Star,
  Sparkles,
  Globe2,
} from "lucide-react";

import { sampleDestinations, type Destination } from "@/lib/destinations";
import EditDestination from "@/components/EditDestination";
import DeleteDestination from "@/components/DeleteDestination";
import BookingCard from "@/app/booking/BookingCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTokenFromServer } from "@/lib/getTokenFromServer";

type DestinationWithDate = Destination & {
  departureDate?: string | null;
};

async function getDestination(id: string): Promise<DestinationWithDate | null> {
  
  const token = await getTokenFromServer()
  try {
    const res = await fetch(`http://localhost:8000/Destinations/${id}`, {
      headers: {
        authorization: `Bearer ${token}`
      },
      cache: "no-store",
    });

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
    // Use sample data if the API is unavailable.
  }

  return sampleDestinations.find((item) => String(item.id) === id) ?? null;
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
      `Discover ${destination.name}, ${destination.country}, with Wanderlust.`,
  };
}

function formatDate(value?: string | null): string {
  if (!value) return "Flexible dates";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

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

  if (!destination) notFound();

  const price = Number(destination.price) || 0;
  const rating = Math.min(5, Math.max(0, Number(destination.rating) || 4.5));

  return (
    <main className="min-h-screen bg-slate-50/80 pb-16 dark:bg-slate-950">
      {/* Navigation */}
      <div className="border-b border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/Destinations"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-sky-500 hover:text-sky-600 dark:border-slate-700 dark:text-slate-200"
          >
            <ArrowLeft className="size-4" />
            All Destinations
          </Link>

          <div className="hidden items-center gap-2 text-sm font-semibold text-slate-500 sm:flex dark:text-slate-400">
            <ShieldCheck className="size-4 text-emerald-500" />
            Your next adventure starts here
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Destination heading */}
        <section className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                <MapPin className="size-3.5" />
                {destination.country}
              </span>

              {destination.category && (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  {destination.category}
                </span>
              )}

              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                <Sparkles className="size-3.5" />
                Discover & Explore
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              {destination.name}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-400">
              {destination.description ||
                `Discover the beauty of ${destination.name} in ${destination.country} and make your next journey unforgettable.`}
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
              <Star className="size-5 fill-amber-400 text-amber-400" />
            </div>

            <div>
              <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                {rating.toFixed(1)}
                <span className="ml-1 text-sm font-medium text-slate-400">
                  / 5
                </span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Destination rating
              </p>
            </div>
          </div>
        </section>

        {/* Hero image */}
        <section className="relative mb-8">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-200 shadow-lg sm:aspect-[16/7] dark:bg-slate-800">
            {destination.imageUrl ? (
              <Image
                src={destination.imageUrl}
                alt={destination.name}
                fill
                priority
                sizes="(min-width: 1280px) 1200px, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <Compass className="size-16 text-slate-400" />
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

            <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                <Globe2 className="size-4" />
                Explore {destination.country}
              </span>
            </div>

            <div className="absolute inset-x-5 bottom-6 text-white sm:inset-x-9 sm:bottom-9 lg:inset-x-12 lg:bottom-12">
              <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200 sm:text-sm">
                <Sparkles className="size-4" />
                Your next adventure
              </p>

              <h2 className="max-w-3xl text-2xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Discover somewhere extraordinary.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-base">
                New places, unforgettable memories, and experiences worth
                travelling for.
              </p>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.82fr)] xl:gap-8">
          {/* Left side */}
          <div className="min-w-0 space-y-6">
            {/* Information cards */}
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                  <Clock3 className="size-5" />
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Trip Duration
                </p>
                <p className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                  {destination.duration || "Flexible"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                  <CalendarDays className="size-5" />
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Departure Date
                </p>
                <p className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                  {formatDate(destination.departureDate)}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
                  <ShieldCheck className="size-5" />
                </div>

                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Trip Planning
                </p>
                <p className="mt-1.5 text-base font-bold text-slate-900 dark:text-white">
                  Simple & Convenient
                </p>
              </div>
            </section>

            {/* About section */}
            <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                  <Compass className="size-5" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Get to know the place
                  </p>
                  <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
                    About this destination
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-8 text-slate-600 sm:text-base dark:text-slate-400">
                {destination.description ||
                  `Discover the attractions of ${destination.name}, explore the local culture, and create memorable experiences in ${destination.country}.`}
              </p>

              <div className="mt-7 grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-2 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Plan your journey
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Review the trip details before booking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-500" />
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      Travel with confidence
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                      Keep your booking information handy.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Destination management */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Destination Management
              </h2>

              <p className="mb-5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                Update the destination information or remove this destination.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <EditDestination destination={destination} />
                <DeleteDestination id={id} />
              </div>
            </section>
          </div>

          {/* Right side: Booking */}
          <aside className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
              {/* Price header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 p-5 text-white sm:p-6">
                <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />

                <div className="relative">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    <Sparkles className="size-3.5" />
                    Start your adventure
                  </span>

                  <p className="mt-5 text-sm font-medium text-white/80">
                    Your trip starts from
                  </p>

                  <div className="mt-2 flex flex-wrap items-baseline gap-2">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${price.toLocaleString("en-US")}
                    </span>
                    <span className="text-sm text-white/75">/ person</span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <Star className="size-4 fill-amber-300 text-amber-300" />
                    <span className="font-bold">{rating.toFixed(1)}</span>
                    <span className="text-white/75">destination rating</span>
                  </div>
                </div>
              </div>

              {/* Booking form */}
              <div className="p-5 sm:p-6">
                <BookingCard destination={destination} />
              </div>

              {/* Footer note */}
              <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:px-6">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                    Review your trip details before submitting your booking.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom navigation */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Want to explore more?
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Find another destination for your next adventure.
            </p>
          </div>

          <Link
            href="/Destinations"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Explore destinations
            <ArrowLeft className="size-4 rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}
