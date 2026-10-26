import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-sky-100 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white px-10 py-12">
        <div className="relative mx-auto w-fit text-center">
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-1 top-1/2 -z-10 bg-sky-100"
          />
          <h2 className="font-serif text-4xl font-semibold text-slate-900">
            Why Choose Wanderlust
          </h2>
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">
          Your trusted partner for exceptional travel experiences
        </p>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3 md:divide-x md:divide-slate-200">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-start gap-3 md:px-8"
            >
              <Image
                src={feature.icon}
                alt=""
                width={32}
                height={32}
                className="size-8"
              />
              <h3 className="text-lg font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
