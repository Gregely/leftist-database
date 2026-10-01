"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

export function isActive(pathname: string, href: string) {
  if (href === "/explore") return pathname === "/explore" || pathname.startsWith("/tendencies") || pathname.startsWith("/paths");
  return pathname === href || pathname.startsWith(href + "/");
}

export function NavLinks() {
  const pathname = usePathname() ?? "/";
  return (
    <ul className="flex items-center gap-7 xl:gap-9">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`label relative py-2 transition-colors hover:text-red ${active ? "text-red" : "text-ink"} after:absolute after:inset-x-0 after:-bottom-[1px] after:h-[2px] after:origin-left after:bg-red after:transition-transform after:duration-300 ${active ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
