import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const BASE_URL = "https://folio-ten-ashy.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Folio — Бесплатная онлайн-библиотека",
    template: "%s — Folio",
  },
  description:
    "Читайте и скачивайте книги из общественного достояния бесплатно. Русская классика, зарубежная литература, узбекская классика, философия и многое другое.",
  keywords: ["книги", "библиотека", "читать онлайн", "бесплатно", "классика", "public domain", "Folio"],
  authors: [{ name: "Folio" }],
  creator: "Folio",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: BASE_URL,
    siteName: "Folio",
    title: "Folio — Бесплатная онлайн-библиотека",
    description: "Читайте книги из общественного достояния бесплатно. Русская и узбекская классика, философия, наука.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folio — Бесплатная онлайн-библиотека",
    description: "Читайте книги из общественного достояния бесплатно.",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${cormorantGaramond.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <TooltipProvider delay={300}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
