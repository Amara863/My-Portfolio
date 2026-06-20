import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Amara Firdous — Portfolio",
  description: "Full Stack Developer & Generative AI Enthusiast. B.Tech CSE @ IGDTUW.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
