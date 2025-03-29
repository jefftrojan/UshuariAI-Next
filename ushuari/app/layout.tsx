// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

// Initialize Inter font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ushuari - Legal Assistance Platform",
  description:
    "Connect with legal organizations for assistance with your legal questions and concerns",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
