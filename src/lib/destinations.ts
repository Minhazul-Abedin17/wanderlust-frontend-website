export type Destination = {
  id: string | number;
  name: string;
  country: string;
  category?: string | null;
  price: number | string;
  duration?: string | null;
  departureDate?: string | null;
  imageUrl?: string | null;
  rating?: number | string | null;
  description?: string | null;
};

export type DestinationCardModel = {
  id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  imageUrl: string | null;
  rating: number;
  departureDate?: string;
  description?: string;
};

export function toDestinationCardModel(
  destination: Destination
): DestinationCardModel {
  return {
   id: String(destination.id ?? (destination as Destination & { _id?: string })._id ?? destination.name),
    name: destination.name || "Untitled Destination",
    country: destination.country || "Unknown",
    category: destination.category || "",
    price: Number(destination.price) || 0,
    duration: destination.duration || "",
    imageUrl: destination.imageUrl || null,
    rating: Number(destination.rating) || 4.5,
  };
}

/** Leading day count from durations like "7 Days/6 Nights". */
export function durationInDays(duration: string): number {
  const match = duration.match(/(\d+)\s*days?/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

/** Used when the API at http://localhost:8000 is unreachable. */
export const sampleDestinations: Destination[] = [
  {
    id: "bali-paradise",
    name: "Bali Paradise",
    country: "Indonesia",
    category: "Beach",
    price: 2700,
    duration: "7 Days/6 Nights",
    departureDate: "2027-03-14",
    rating: 4.5,
    description:
      "Discover misty rice terraces, hidden waterfalls, and turquoise beaches on this unforgettable journey through the Island of the Gods.",
    imageUrl:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "maldives-coral-retreat",
    name: "Maldives Coral Retreat",
    country: "Maldives",
    category: "Beach",
    price: 3450,
    duration: "5 Days/4 Nights",
    departureDate: "2027-02-20",
    rating: 4.8,
    description:
      "Wake up to crystal-clear lagoons and overwater villas, with daily snorkeling over vibrant coral reefs.",
    imageUrl:
      "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "swiss-alps-getaway",
    name: "Swiss Alps Getaway",
    country: "Switzerland",
    category: "Mountain",
    price: 2100,
    duration: "6 Days/5 Nights",
    departureDate: "2027-06-05",
    rating: 4.7,
    description:
      "Ride scenic trains past glaciers and emerald valleys, then unwind in charming alpine villages.",
    imageUrl:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "machu-picchu-trek",
    name: "Machu Picchu Trek",
    country: "Peru",
    category: "Adventure",
    price: 1890,
    duration: "8 Days/7 Nights",
    departureDate: "2027-05-10",
    rating: 4.9,
    description:
      "Follow ancient Inca trails through cloud forests to the timeless citadel of Machu Picchu at sunrise.",
    imageUrl:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "paris-city-escape",
    name: "Paris City Escape",
    country: "France",
    category: "Romantic",
    price: 1240,
    duration: "4 Days/3 Nights",
    departureDate: "2027-04-02",
    rating: 4.6,
    description:
      "Stroll riverside boulevards, climb the Eiffel Tower, and linger over long café evenings in the City of Light.",
    imageUrl:
      "https://images.unsplash.com/photo-1502605217418-47e3d1e02204?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "banff-starry-nights",
    name: "Banff Starry Nights",
    country: "Canada",
    category: "Adventure",
    price: 2260,
    duration: "7 Days/6 Nights",
    departureDate: "2027-08-18",
    rating: 4.5,
    description:
      "Paddle glacier-fed lakes by day and watch peaks glowing beneath a sky full of stars by night.",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80",
  },
];
