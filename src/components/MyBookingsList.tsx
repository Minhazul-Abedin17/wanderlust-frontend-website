"use client";

import { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  MapPin,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

type Booking = {
  _id: string;
  userName?: string;
  destinationId: string;
  destinationName: string;
  country?: string;
  departureDate?: string;
  travelers: number;
  email: string;
  pricePerPerson: number;
  totalPrice: number;
  status: string;
  createdAt?: string;
};

export default function MyBookingsList({
  initialBookings,
}: {
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formatDate = (value?: string) => {
    if (!value) return "Flexible dates";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-emerald-50 text-emerald-700 ring-emerald-200";
      case "cancelled":
        return "bg-red-50 text-red-700 ring-red-200";
      default:
        return "bg-amber-50 text-amber-700 ring-amber-200";
    }
  };

  const cancelBooking = async (booking: Booking) => {
    try {
      const res = await fetch(
        `http://localhost:8000/my-booking/${booking._id}`,
        {
          method: "DELETE",
        },
      );
      const data = await res.json();
      if (!res.ok || data.success !== true) {
        throw new Error(data.message);
      }
      setBookings((current) =>
        current.filter((item) => item._id !== booking._id),
      );

      setSelectedId((current) => (current === booking._id ? null : current));

      setMessage("Booking deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (bookings.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-950">
          <CalendarDays className="size-8" />
        </div>

        <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
          No bookings yet
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          Your next adventure is waiting. Once you book a destination, your
          reservation details will appear here.
        </p>

        <Button
          className="mt-6 rounded-xl bg-sky-600 text-white hover:bg-sky-700"
          onClick={() => (window.location.href = "/Destinations")}
        >
          Explore destinations
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {message && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {message}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {bookings.map((booking) => {
        const isDetailsOpen = selectedId === booking._id;
        const isCancelled = booking.status.toLowerCase() === "cancelled";
        const isLoading = loadingId === booking._id;

        return (
          <article
            key={booking._id}
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="p-5 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <MapPin className="size-6" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {booking.destinationName}
                      </h3>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${getStatusStyle(
                          booking.status || "pending",
                        )}`}
                      >
                        {booking.status?.toLowerCase() === "confirmed" ? (
                          <CheckCircle2 className="size-3.5" />
                        ) : (
                          <Clock3 className="size-3.5" />
                        )}
                        {booking.status || "pending"}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {booking.country || "Destination details"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4" />
                        {formatDate(booking.departureDate)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-4" />
                        {booking.travelers}{" "}
                        {booking.travelers === 1 ? "traveler" : "travelers"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Total price
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                    ${Number(booking.totalPrice || 0).toLocaleString("en-US")}
                  </p>
                  <p className="text-xs text-slate-500">USD</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() =>
                    setSelectedId(isDetailsOpen ? null : booking._id)
                  }
                >
                  {isDetailsOpen ? (
                    <X className="mr-2 size-4" />
                  ) : (
                    <Eye className="mr-2 size-4" />
                  )}
                  {isDetailsOpen ? "Hide Details" : "View Details"}
                </Button>

                {!isCancelled && (
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => cancelBooking(booking)}
                  >
                    <X className="mr-2 size-4" />
                    {isLoading ? "Cancelling..." : "Cancel Booking"}
                  </Button>
                )}
              </div>

              {isDetailsOpen && (
                <div className="mt-5 rounded-2xl bg-slate-50 p-5 dark:bg-slate-800/60">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    Booking details
                  </h4>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Detail label="Booking ID" value={booking._id} />
                    <Detail
                      label="Traveler name"
                      value={booking.userName || "Not provided"}
                    />
                    <Detail label="Contact email" value={booking.email} />
                    <Detail
                      label="Destination"
                      value={`${booking.destinationName}${
                        booking.country ? `, ${booking.country}` : ""
                      }`}
                    />
                    <Detail
                      label="Departure date"
                      value={formatDate(booking.departureDate)}
                    />
                    <Detail
                      label="Travelers"
                      value={String(booking.travelers)}
                    />
                    <Detail
                      label="Price per person"
                      value={`$${Number(
                        booking.pricePerPerson || 0,
                      ).toLocaleString("en-US")} USD`}
                    />
                    <Detail
                      label="Booking status"
                      value={booking.status || "pending"}
                    />
                    {booking.createdAt && (
                      <Detail
                        label="Booked on"
                        value={formatDate(booking.createdAt)}
                      />
                    )}
                  </div>

                  <div className="mt-5 flex items-start gap-2 rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                    Keep your booking details available when contacting the
                    travel team.
                  </div>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}
