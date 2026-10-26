"use client";

import { useState } from "react";

import { DestinationCard } from "@/components/destination-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  durationInDays,
  toDestinationCardModel,
  type Destination,
  type DestinationCardModel,
} from "@/lib/destinations";

const priceRangeLimits: Record<string, [number, number]> = {
  "under-1000": [0, 1000],
  "1000-2000": [1000, 2000],
  "2000-3000": [2000, 3000],
  "over-3000": [3000, Number.POSITIVE_INFINITY],
};

const sorters: Record<string, (a: DestinationCardModel, b: DestinationCardModel) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  "rating-desc": (a, b) => b.rating - a.rating,
  "duration-asc": (a, b) => durationInDays(a.duration) - durationInDays(b.duration),
};

export function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const cards = destinations.map(toDestinationCardModel);

  const categories = Array.from(
    new Set(cards.map((card) => card.category).filter(Boolean))
  );

  let filtered = cards.filter((card) => {
    if (category && category !== "all" && card.category !== category) {
      return false;
    }
    if (priceRange && priceRangeLimits[priceRange]) {
      const [min, max] = priceRangeLimits[priceRange];
      if (card.price < min || card.price >= max) {
        return false;
      }
    }
    return true;
  });

  if (sortBy && sorters[sortBy]) {
    filtered = [...filtered].sort(sorters[sortBy]);
  }

  const filterSelectClass = (hasValue: boolean) =>
    `w-full ${hasValue ? "" : "uppercase"}`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="group">
        <Select
          value={category}
          onValueChange={(value) => setCategory(value as string | null)}
        >
          <SelectTrigger className={filterSelectClass(!!category)}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as string | null)}
        >
          <SelectTrigger className={filterSelectClass(!!priceRange)}>
            <SelectValue placeholder="Price range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(priceRangeLimits).map(([value, [min, max]]) => (
              <SelectItem key={value} value={value}>
                {max === Number.POSITIVE_INFINITY
                  ? `Over $${min.toLocaleString()}`
                  : min === 0
                    ? `Under $${max.toLocaleString()}`
                    : `$${min.toLocaleString()} - $${max.toLocaleString()}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as string | null)}
        >
          <SelectTrigger className={filterSelectClass(!!sortBy)}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
            <SelectItem value="duration-asc">Duration: Shortest first</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Showing {filtered.length}{" "}
        {filtered.length === 1 ? "destination" : "destinations"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((card) => (
            <DestinationCard key={card.id} destination={card} />
          ))}
        </div>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          No destinations match your filters. Try adjusting the category or
          price range.
        </div>
      )}
    </div>
  );
}

export function DestinationsExplorerSkeleton() {
  return (
    <div aria-busy="true">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
        <Skeleton className="h-8" />
      </div>
      <Skeleton className="mt-4 h-4 w-44" />
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-2.5">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
