import Link from "next/link";
import { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <Link className="app-brand" href="/dashboard">
          PolicyDesk
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/dashboard">Dashboard</Link>
        </nav>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
