import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CITADEL | AI Education Agent & Personal Learning Platform",
  description:
    "Learn Smarter. Grow Faster. Achieve More. The AI-native personalized academic tutor, study planner, and intelligence engine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090e] text-gray-100 antialiased selection:bg-violet-600/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
