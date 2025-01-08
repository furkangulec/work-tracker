import type { Metadata } from "next";
import { Inter, Chakra_Petch } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });
const chakraPetch = Chakra_Petch({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: '--font-chakra-petch'
});

export const metadata: Metadata = {
  title: "Chronos",
  description: "Track your work time efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} ${chakraPetch.variable}`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
