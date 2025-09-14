import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VTE Frontend",
  description: "Vocational Technical Education Frontend Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className={inter.className}>
        <Providers>
          <QueryProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </QueryProvider>
        </Providers>
      </body>
    </html>
  );
}