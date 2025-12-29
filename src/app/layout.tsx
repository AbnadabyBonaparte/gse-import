import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GSE Import",
  description: "Se existe no mundo, chega na sua garagem.",
  keywords: ["importação", "peças automotivas", "sourcing", "automação"],
  authors: [{ name: "GSE Import" }],
  openGraph: {
    title: "GSE Import - Global Sourcing Engine",
    description: "Se existe no mundo, chega na sua garagem.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}

