import "./globals.css";
import { Roboto } from "next/font/google";
import { Urbanist } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";

// import { AuthProvider } from "@/lib/auth";
import { AppProvider } from "@/context/AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "@/components/providers/AuthProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-urbanist",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} ${roboto.variable}`}>
        <NextUIProvider>
          <AppProvider>
            <div className="bg-[#BFE7BF]">
              <AuthProvider>{children}</AuthProvider>
            </div>
          </AppProvider>
        </NextUIProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
      </body>
    </html>
  );
}
