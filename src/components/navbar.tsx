import Link from "next/link";
import { UserRound } from "lucide-react";
import { cn } from "cn";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Destinations", href: "/Destinations", active: false },
  { label: "My Bookings", href: "/bookings", active: false },
  { label: "Add-destinations", href: "/add-destination", active: false },
];

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-cyan-600",
        active ? "text-cyan-600" : "text-foreground/80"
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-background">
      <nav className="grid h-14 grid-cols-3 items-center px-4 md:px-8">
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <NavLink key={link.label} {...link} />
          ))}
        </div>

        <Link
          href="/"
          className="justify-self-center text-xl font-bold tracking-tight text-cyan-600"
        >
          Wanderlast
        </Link>

        <div className="flex items-center gap-5 justify-self-end">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-sm font-medium text-foreground/80 transition-colors hover:text-cyan-600"
          >
            <UserRound className="size-4" />
            Profile
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-cyan-600"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium text-foreground/80 transition-colors hover:text-cyan-600"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
