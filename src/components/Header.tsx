"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type HeaderProps = {
  title: string;
  routes: {
    title: string;
    href: string;
  }[];
};

export default function Header({
  title,
  routes,
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="bg-green-800 text-white px-6 py-4 flex justify-between items-center">
      <Link href={routes[0]?.href ?? "/"}>
        <h1 className="text-xl font-bold">{title}</h1>
      </Link>

      <nav className="flex gap-2">
        {routes.map((route) => {
          const active = pathname.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href}
              className={`px-4 py-2 rounded-lg transition ${
                active
                  ? "underline underline-offset-8 font-semibold"
                  : "hover:bg-green-700"
              }`}
            >
              {route.title}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}