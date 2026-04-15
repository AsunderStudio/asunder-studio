import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asunder Studio",
  description: "#@$%&*+=<>/?{}[]~ 2026.",
  openGraph: {
    title: "Asunder Studio",
    description: "#@$%&*+=<>/?{}[]~ 2026.",
    url: "https://asunder.studio",
    siteName: "Asunder Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asunder Studio",
    description: "#@$%&*+=<>/?{}[]~ 2026.",
  },
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
