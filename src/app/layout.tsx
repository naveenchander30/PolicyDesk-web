import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
