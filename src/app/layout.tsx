import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Humble Superhero Registry",
  description:
    "A community of humble superheroes making the world a better place",
  keywords: ["superhero", "community", "humility", "registry"],
  authors: [{ name: "Alejandro Pacheco" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.className} suppressHydrationWarning>
      <body className='dark:bg-gray-900 transition-colors duration-200'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
