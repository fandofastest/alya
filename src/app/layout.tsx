import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getLocale } from "@/lib/i18n-server";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIPADU HUKUM",
  description: "Sistem Informasi Terpadu Produk Hukum - KPU Kota Dumai",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
