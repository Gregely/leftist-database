import type { Metadata, Viewport } from "next";
import { Archivo, Newsreader } from "next/font/google";
import { SITE, siteTitle } from "@/lib/site";
import "./globals.css";

/** Reading and display: an optical-size serif, sharp at headline sizes and calm at text sizes. */
const newsreader = Newsreader({
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
/** Interface: a grotesque with a width axis — condensed capitals for labels and navigation. */
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  style: ["normal", "italic"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: `${siteTitle} — ${SITE.tagline}`, template: `%s — ${siteTitle}` },
  description: SITE.description,
};

export const viewport: Viewport = {
  themeColor: "#f2eee5",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
