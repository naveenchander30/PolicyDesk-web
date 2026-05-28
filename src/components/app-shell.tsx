"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useCallback } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

type AppShellProps = {
  children: ReactNode;
};

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/policies", label: "Policies" },
  { href: "/payments", label: "Payments" },
  { href: "/insurance-types", label: "Insurance Types" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  const handleSignOut = useCallback(async () => {
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/dashboard">
          PolicyDesk
        </Link>
        <span className="app-brand-sub">Agency Management</span>

        <nav aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "active" : ""}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-actions">
          <button className="logout" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
