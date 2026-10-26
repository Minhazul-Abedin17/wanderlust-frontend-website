"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    photo: "/images/person1.png",
  },
  {
    quote:
      "Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    photo: "/images/person2.png",
  },
];

export function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-4">
        <Carousel opts={{ align: "start" }} className="w-full">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-4xl font-semibold text-slate-900">
                What Travelers Say
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Real experiences from our happy travelers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CarouselPrevious
                size="icon-lg"
                className="relative inset-auto border-slate-300 text-cyan-600 hover:bg-cyan-50"
              />
              <CarouselNext
                size="icon-lg"
                className="relative inset-auto border-slate-300 text-cyan-600 hover:bg-cyan-50"
              />
            </div>
          </div>

          <CarouselContent className="mt-8">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="basis-full md:basis-1/2">
                <article className="flex h-full border border-slate-200 bg-white">
                  <div className="flex min-w-0 flex-1 flex-col p-6">
                    <blockquote className="font-serif text-[15px] leading-snug text-slate-800">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="mt-auto pt-6">
                      <p className="text-sm font-medium text-cyan-700">
                        &mdash; {testimonial.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                  <Image
                    src={testimonial.photo}
                    alt={testimonial.name}
                    width={240}
                    height={300}
                    className="w-[38%] self-stretch object-cover"
                  />
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
