"use client";
import { Inter, Roboto_Condensed } from "next/font/google";
import { Urbanist } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Pager from "./page";

const inter = Inter({ subsets: ["latin"] });
const urbanist = Urbanist({ subsets: ["latin"] });
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // Specify the weights you want to use
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // {
  //   isAuthenticated ? (<div></div>) : (<html lang="en">
  //     <body className={roboto.className} >
  //       <Sidebar />
  //       <main className=" bg-[#BFE7BF]">{children}</main>
  //     </body >
  //   </html >)
  // }

  if (isAuthenticated == true) {
    return (
      <html lang="en">
        <body className={roboto.className} >
          <Sidebar />
          <main className=" bg-[#BFE7BF]">{children}</main>
        </body >
      </html >
    );
  } else {
    return (
      <html lang="en">
        <body className={roboto.className} >
          <Pager setIsAuthenticated={setIsAuthenticated}/>
          <main className=" bg-[#BFE7BF]">{children}</main>
        </body >
      </html >
    );
  }
}
