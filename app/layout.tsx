import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexGH | Ghana Business Compliance Guide",
  description: "AI-powered business compliance guidance for Ghanaian entrepreneurs and SMEs."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
