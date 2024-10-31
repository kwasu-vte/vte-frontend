import "./globals.css";
import { Roboto } from "next/font/google";
import { Urbanist } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

import { AuthProvider } from "@/lib/auth";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={urbanist.className}>
        <NextUIProvider>
          <div className='bg-[#BFE7BF]'>
            <AuthProvider>
              {children}
            </AuthProvider>
          </div>
        </NextUIProvider>
      </body>
    </html>
  );
}