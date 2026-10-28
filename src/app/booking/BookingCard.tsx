
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Minus, Plus, ShieldCheck, Users } from "lucide-react";

import type { Destination } from "@/lib/destinations";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

type BookingCardProps = {
  destination: Destination & {
    departureDate?: string | null;
  };
};

export default function BookingCard({ destination }: BookingCardProps) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [travelers, setTravelers] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const price = Number(destination.price) || 0;
  const totalPrice = price * travelers;

  useEffect(() => {
    if (user?.email) {
      setEmail((currentEmail) => currentEmail || user.email);
    }
  }, [user?.email]);

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSuccess("");
    setError("");
    setLoading(true);

    const bookingDetails = {
      ...user,
      userName: user?.name,
      destinationId: String(destination.id),
      destinationName: destination.name,
      country: destination.country,
      departureDate: destination.departureDate || "",
      travelers,
      email: email.trim(),
      pricePerPerson: price,
      totalPrice,
      status: "pending",
    };

    try {
      const res = await fetch("http://localhost:8000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      const bookingRes = await res.json();

      if (!res.ok) {
        throw new Error(bookingRes.message || "Booking failed.");
      }

      setSuccess("Your booking has been submitted successfully!");
      console.log("Booking saved:", bookingRes);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-none border-0 bg-transparent py-0 shadow-none">
      <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-400">
          YOUR NEXT ADVENTURE
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">
          Book Your Trip
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          Enter your details to plan your journey.
        </p>
      </div>

      <CardContent className="space-y-5 px-0 pb-0 pt-5">
        <form onSubmit={handleBooking} className="space-y-5">
          <div className="space-y-3">
            <Label>Number of travelers</Label>

            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300">
                  <Users className="size-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Travelers
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {travelers} {travelers === 1 ? "person" : "people"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full"
                  disabled={travelers <= 1 || loading}
                  onClick={() =>
                    setTravelers((count) => Math.max(1, count - 1))
                  }
                  aria-label="Remove traveler"
                >
                  <Minus className="size-4" />
                </Button>

                <span className="w-5 text-center font-bold">{travelers}</span>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-full"
                  disabled={travelers >= 20 || loading}
                  onClick={() =>
                    setTravelers((count) => Math.min(20, count + 1))
                  }
                  aria-label="Add traveler"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-email">Contact email</Label>
            <Input
              id="booking-email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <h3 className="font-bold text-slate-900 dark:text-white">
              Price Summary
            </h3>

            <div className="mt-3 flex justify-between gap-3 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                ${price.toLocaleString("en-US")} × {travelers}{" "}
                {travelers === 1 ? "person" : "people"}
              </span>

              <span className="font-semibold text-slate-900 dark:text-white">
                ${totalPrice.toLocaleString("en-US")}
              </span>
            </div>

            <div className="mt-4 flex items-end justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-700">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Total Price
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  USD · Estimated total
                </p>
              </div>

              <p className="text-2xl font-extrabold tracking-tight text-sky-600 dark:text-sky-400">
                ${totalPrice.toLocaleString("en-US")}
              </p>
            </div>
          </div>

          {success && (
            <div
              role="status"
              className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
            >
              <CheckCircle2 className="size-5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-sky-600 font-semibold text-white shadow-md transition hover:bg-sky-700"
          >
            {loading ? "Submitting Booking..." : "Confirm Booking"}
          </Button>

          <p className="flex items-start justify-center gap-2 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            Your contact information is required to arrange your trip.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
