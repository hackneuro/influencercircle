import "./globals.css";
import { LanguageProvider } from "@/components/marketing/LanguageContext";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://influencercircle.net"),
  title: {
    default: "Influencer Circle | Professional Growth Platform",
    template: "%s | Influencer Circle"
  },
  description: "Identify, verify, and grow your influencer career with the only guaranteed success platform using Neuro-hooked engagement and AI technology.",
  keywords: ["Influencer Marketing", "Social Media Growth", "ViralMind", "Content Creator", "Engagement Boost"],
  authors: [{ name: "ViralMind Team" }],
  creator: "ViralMind",
  publisher: "ViralMind",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://influencercircle.net",
    title: "Influencer Circle | Professional Growth Platform",
    description: "Identify, verify, and grow your influencer career with the only guaranteed success platform.",
    siteName: "Influencer Circle",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Influencer Circle Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Influencer Circle | Professional Growth Platform",
    description: "Identify, verify, and grow your influencer career with the only guaranteed success platform.",
    creator: "@viralmind",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo-full.jpg",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Influencer Circle",
    "url": "https://influencercircle.net",
    "logo": "https://influencercircle.net/logo-full.jpg",
    "sameAs": [
      "https://viralmind.me",
      "https://www.linkedin.com/company/viralmind-official",
      "https://instagram.com/viralmind.me"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-0123",
      "contactType": "customer service"
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
