"use client";

import { useState } from "react";
import { PlusIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

const initialForm = {
  name: "",
  country: "",
  category: null as string | null,
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

const categories = [
  "Beach",
  "Mountain",
  "Adventure",
  "Cultural",
  "Romantic",
  "Family",
  "Wildlife",
];

export default function AddDestinationPage() {
  const [form, setForm] = useState(initialForm);

  const setField =
    (field: string) =>
    (
      value:
        | string
        | number
        | readonly string[]
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const val =
        typeof value === "object" && value !== null && "target" in value
          ? value.target.value
          : (value as string);
      setForm((prev) => ({ ...prev, [field]: val }));
    };

  const handleReset = () => setForm(initialForm);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res= await fetch("http://localhost:8000/add-destination",{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
    })
    const data = await res.json()
    console.log(data)
    // TODO: submit to the backend
    console.log("New travel package:", form);
    setForm(initialForm);
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Add New Travel Package
      </h1>

      <Card className="mt-8 shadow-sm">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      category: value as string | null,
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
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
                  placeholder="e.g. 1,299"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={form.duration}
                  onChange={setField("duration")}
                  placeholder="e.g. 7 Days/6 Nights"
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
                required
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
                rows={3}
              />
            </div>
            <CardFooter className="mt-8 flex justify-end gap-3 border-0! bg-transparent! p-0!">
              <Button
                type="submit"
                className="mb-5 gap-1.5 bg-sky-600 text-white hover:bg-sky-600/80 dark:bg-sky-500 dark:text-white dark:hover:bg-sky-500/80"
              >
                <PlusIcon data-icon="inline-start" />
                Add Travel Package
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
