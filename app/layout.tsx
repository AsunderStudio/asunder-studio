import type { Metadata } from "next";
import "./globals.css";

const TITLE = "Asunder Studio";
const DESCRIPTION = "A creative studio for brands navigating the age of average.";

export const metadata: Metadata = {
  metadataBase: new URL("https://asunder.studio"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://asunder.studio",
    siteName: "Asunder Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Asunder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
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
