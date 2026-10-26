import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DestinationCardModel } from "@/lib/destinations";

export function DestinationCard({
  destination,
}: {
  destination: DestinationCardModel;
}) {
  return (
    <Card size="sm" className="gap-0 py-0">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {destination.imageUrl ? (
          <Image
            src={destination.imageUrl}
            alt={destination.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MapPinIcon className="size-8 text-muted-foreground/40" />
          </div>
        )}
        <div className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-md bg-black/45 px-1.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          {destination.rating.toFixed(1)}
          <StarIcon className="size-3 fill-current" />
        </div>
      </div>

      <CardContent className="space-y-1.5 p-4">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPinIcon className="size-3.5" />
          {destination.country}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{destination.name}</h3>
          <p className="shrink-0 text-sm font-bold">
            ${destination.price.toLocaleString()}
            <span className="text-[10px] font-normal text-muted-foreground">
              /Person
            </span>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDaysIcon className="size-3.5" />
          {destination.duration}
        </div>

        <Link
          href={`/Destinations/${destination.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-sky-600 hover:underline dark:text-sky-400"
        >
          Book Now
          <ArrowUpRightIcon className="size-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
