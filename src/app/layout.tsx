import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ColorSchemeScript } from "@mantine/core";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Konva Whiteboard",
  description: "A whiteboard app made with Konva.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const FAVICON =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 100 100"><text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="90">🎨</text></svg>';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
        <link rel="icon" type="image/svg+xml" href={FAVICON} />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
