import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "What To Eat Today?",
  description: "Spin the wheel and let fate decide your next meal!",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍽️</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
