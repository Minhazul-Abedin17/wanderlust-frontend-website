"use client";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { cn } from "cn";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Destinations", href: "/Destinations", active: false },
  { label: "My Bookings", href: "/my-booking", active: false },
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
        active ? "text-cyan-600" : "text-foreground/80",
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const handleSignout = () => {
    authClient.signOut();
  };
  console.log(user);
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
          {user ? (
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                    aria-label="Open user menu"
                  />
                }
              >
                <Avatar>
                  <AvatarImage
                    referrerPolicy="no-referrer"
                    src={user.image || ""}
                  />
                  <AvatarFallback>
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </PopoverTrigger>

              <PopoverContent>
                <PopoverHeader>
                  <PopoverTitle>{user.name}</PopoverTitle>
                  <PopoverDescription>{user.email}</PopoverDescription>

                  <button
                    type="button"
                    onClick={handleSignout}
                    className="rounded-xl bg-red-500 p-2 font-bold text-white hover:bg-red-600"
                  >
                    Sign out
                  </button>
                </PopoverHeader>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-cyan-600"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-cyan-600"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
