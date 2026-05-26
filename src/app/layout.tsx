import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuditProvider } from "@/context/AuditContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Narrative Shield™ — AI Search Visibility & Narrative Intelligence",
  description:
    "Discover what AI tells people about your brand. Audit AI Overviews, detect poison sources, and generate corrective action playbooks.",
  keywords: [
    "AI search visibility",
    "brand monitoring",
    "AI overviews",
    "narrative intelligence",
    "AISO",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <AuditProvider>
          {children}
        </AuditProvider>
      </body>
    </html>
  );
}
