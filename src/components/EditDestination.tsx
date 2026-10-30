"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { DestinationCardModel } from "@/lib/destinations";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const categories = [
  "Beach",
  "Mountain",
  "Adventure",
  "Romantic",
  "City",
  "Cultural",
  "Nature",
];

export default function EditDestination({
  destination,
}: {
  destination: DestinationCardModel;
}) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: destination.name,
    country: destination.country,
    category: destination.category || "",
    price: String(destination.price),
    duration: destination.duration,
    departureDate: destination.departureDate || "",
    imageUrl: destination.imageUrl || "",
    description: destination.description || "",
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const jwtToken = await getTokenFromClient();

      const res = await fetch(
        `http://localhost:8000/Destinations/${destination._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok || result.matchedCount === 0) {
        throw new Error(result.message || "Failed to update destination");
      }

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating destination:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update the destination."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" />}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700 dark:bg-green-300 dark:text-black dark:hover:bg-green-400"
      >
        Edit Destination
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Edit Destination
          </DialogTitle>

          <DialogDescription>
            Update the destination details below.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5 p-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Destination Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Bali Paradise"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="Indonesia"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={form.category}
                    onValueChange={(value) =>
                      setForm((prev) => ({
                        ...prev,
                        category: value ?? "",
                      }))
                    }
                  >
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="1299"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="7 Days/6 Nights"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  name="departureDate"
                  type="date"
                  value={form.departureDate}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the travel experience..."
                  className="min-h-24"
                  rows={4}
                />
              </div>

              {message && (
                <p role="alert" className="rounded-lg bg-muted p-3 text-sm">
                  {message}
                </p>
              )}

              <DialogFooter className="border-t pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-600 text-white hover:bg-sky-700"
                >
                  {loading ? "Saving..." : "Confirm Update"}
                </Button>
              </DialogFooter>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}