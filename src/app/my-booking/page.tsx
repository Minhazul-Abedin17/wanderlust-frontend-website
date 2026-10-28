
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import MyBookingsList from "@/components/MyBookingsList";

export type Booking = {
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

export default async function MyBookingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.email) {
    redirect("/sign-in");
  }

  let bookings: Booking[] = [];
  let error = "";

  try {
    const res = await fetch(
      `http://localhost:8000/my-booking/${encodeURIComponent(
        session.user.email,
      )}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Unable to load your bookings.");
    }

    const data = await res.json();

    bookings = Array.isArray(data)
      ? data.map((booking) => ({
          ...booking,
          _id: String(booking._id),
        }))
      : [];
  } catch {
    error = "We couldn't load your bookings. Please try again later.";
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative mb-9 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-700 via-blue-700 to-indigo-800 px-6 py-10 text-white shadow-lg sm:px-10 sm:py-12">
          <div className="absolute -right-10 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-20 right-40 size-48 rounded-full bg-sky-300/20 blur-2xl" />

          <div className="relative">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
              Wanderlust
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              My Bookings
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
              Manage your trips, review your booking details, and keep your
              next adventure organized in one place.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-300" />
              Signed in as {session.user.name || session.user.email}
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Your travel reservations
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Review and manage your booking details.
            </p>
          </div>

          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </p>
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
          >
            {error}
          </div>
        ) : (
          <MyBookingsList initialBookings={bookings} />
        )}
      </section>
    </main>
  );
}
