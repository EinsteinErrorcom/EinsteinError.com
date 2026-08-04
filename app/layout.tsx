import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";
import { SiteTourBar } from "@/components/site-tour-bar";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-K7RPBDYQYB";

export const metadata: Metadata = {
  title: "Thee MAX-LIT SUPER-Computer Ai(+) Engine UN-SURPASSED !! | Perfect Physics Intelligence | EinsteinError.com",
  description: "Max-Lit is the world's first perfect physics intelligence engine. Unified via 150 physics constants to deliver absolute truth.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        {/* Analytics scripts moved to head for better loading performance */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className="min-h-full">
        <Suspense fallback={null}>
          <SiteTourBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}