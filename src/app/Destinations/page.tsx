import type { Metadata } from "next";
import { Suspense } from "react";

import {
  DestinationsExplorer,
  DestinationsExplorerSkeleton,
} from "@/components/destinations-explorer";
import { sampleDestinations, type Destination } from "@/lib/destinations";

const API_URL = "http://localhost:8000/Destinations";

async function getDestinations(): Promise<Destination[]> {
  try {
    const res = await fetch(API_URL, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    const data: unknown = await res.json();
    // Fall back to sample data when the API returns nothing useful
    return Array.isArray(data) && data.length > 0
      ? (data as Destination[])
      : sampleDestinations;
  } catch {
    // API unreachable (e.g. backend not running) — fall back to sample data
    return sampleDestinations;
  }
}

async function DestinationsSection({
  destinationsPromise,
}: {
  destinationsPromise: Promise<Destination[]>;
}) {
  const destinations = await destinationsPromise;
  return <DestinationsExplorer destinations={destinations} />;
}

export const metadata: Metadata = {
  title: "Explore All Destinations",
  description: "Find your perfect travel experience from our curated collection",
};

export default function AllDestinationsPage() {
  const destinationsPromise = getDestinations();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Explore All Destinations
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Find your perfect travel experience from our curated collection
      </p>

      <div className="mt-8">
        <Suspense fallback={<DestinationsExplorerSkeleton />}>
          <DestinationsSection destinationsPromise={destinationsPromise} />
        </Suspense>
      </div>
    </section>
  );
}
