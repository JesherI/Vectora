import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vectora",
  description: "Vectora",
  icons: { icon: '/Vectora-Negro.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
