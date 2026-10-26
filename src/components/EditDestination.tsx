"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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
import { PlusIcon, XIcon } from "lucide-react";
import { DestinationCardModel } from "@/lib/destinations";

const categories = [
  "Beach",
  "Mountain",
  "Adventure",
  "Romantic",
  "City",
  "Cultural",
  "Nature",
];

const initialForm = {
  name: "",
  country: "",
  category: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

export default function EditDestination({ destination }:{destination : DestinationCardModel}) {
  const [form, setForm] = useState(destination);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setField =
    (field: keyof typeof initialForm) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleReset = () => {
    setForm(initialForm);
    setMessage("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const { _id, ...updatedData } = form;

      const res = await fetch(
        `http://localhost:8000/Destinations/${destination._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...updatedData,
            price: Number(form.price),
          }),
        },
      );

      const result = await res.json();

      if (!res.ok || result.matchedCount === 0) {
        throw new Error("Failed to update destination");
      }

      setMessage("Destination updated successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Could not update the destination.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          handleReset();
        }
      }}
    >
      <DialogTrigger
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-green-400 dark:bg-green-300 dark:hover:bg-green-300"
        render={<Button variant="outline" />}
      >
        Edit Destination
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Travel Package
          </DialogTitle>
          <DialogDescription>
            Enter destination details to create a new travel package.
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-5 p-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Destination Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Bali Paradise"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={setField("country")}
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
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={setField("price")}
                    placeholder="1299"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={form.duration}
                    onChange={setField("duration")}
                    placeholder="7 Days/6 Nights"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={form.departureDate}
                  onChange={setField("departureDate")}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={form.imageUrl}
                  onChange={setField("imageUrl")}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={setField("description")}
                  placeholder="Describe the travel experience..."
                  className="min-h-24"
                  rows={4}
                />
              </div>

              {message && (
                <p role="status" className="rounded-lg bg-muted p-3 text-sm">
                  {message}
                </p>
              )}

              <DialogFooter className="gap-2 border-t pt-5">
                <DialogClose
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                    />
                  }
                >
                  <XIcon className="mr-1 size-4" />
                  Cancel
                </DialogClose>

                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-600 text-white hover:bg-sky-700"
                >
                  <PlusIcon className="mr-1 size-4" />
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
