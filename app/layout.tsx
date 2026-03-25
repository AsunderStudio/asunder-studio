import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asunder Studio",
  description: "Veteran meets Vision. Coming soon.",
  openGraph: {
    title: "Asunder Studio",
    description: "Veteran meets Vision. Coming soon.",
    url: "https://asunder.studio",
    siteName: "Asunder Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asunder Studio",
    description: "Veteran meets Vision. Coming soon.",
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
