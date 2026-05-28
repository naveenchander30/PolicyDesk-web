import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast-context";

export const metadata: Metadata = {
  title: "PolicyDesk",
  description: "Insurance payment tracking for independent agents"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
