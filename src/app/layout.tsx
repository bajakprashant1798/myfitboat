import type { Metadata } from "next";
import { Providers } from "./providers";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MyFitBoat — Engineered Hydration. Zero Sugar. 550mg Potassium.",
  description:
    "India's first 550mg potassium hydration sachet. Zero sugar, 6 electrolytes, vitamins C/B6/B12/D. Engineered for elite performance.",
  openGraph: {
    siteName: "MyFitBoat",
    type: "website",
    title: "MyFitBoat — Engineered Hydration",
    description:
      "India's first 550mg potassium hydration sachet. Zero sugar. Engineered for elite performance.",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export const viewport = {
  themeColor: "#26282e",
  width: "device-width",
  initialScale: 1,
};

const themeBootstrap = `(function(){try{var t=localStorage.getItem('mfb-theme');if(t==='light'){document.documentElement.classList.add('light');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
