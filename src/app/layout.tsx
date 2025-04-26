import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Fitness App",
  description:
    "Fitness App Powered by Next.js 15 and Tailwind CSS,Shadcn UI , Convex Database For Realtime and Open AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${roboto.className} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
