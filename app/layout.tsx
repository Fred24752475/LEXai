import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexGH — AI Business Compliance Guide for Ghana",
  description:
    "LexGH helps Ghanaian entrepreneurs and SMEs stay compliant with ORC, GRA, and SSNIT requirements using live AI research.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="min-h-screen antialiased font-sans">{children}</body>
    </html>
  );
}
