import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Asunder Studio",
  description: "Asunder is a studio for brands navigating the age of average. Experts in campaigns, brand identity, and more.",
  openGraph: {
    title: "Asunder Studio",
    description: "Asunder is a studio for brands navigating the age of average. Experts in campaigns, brand identity, and more.",
    url: "https://asunder.studio",
    siteName: "Asunder Studio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Asunder Studio",
    description: "Asunder is a studio for brands navigating the age of average. Experts in campaigns, brand identity, and more.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
