import { Lexend_Deca } from "next/font/google";
import "../Styles/globals.css";
import "../Styles/theam.css";
import QueryProviderWrapper from "@/providers/QueryProviderWrapper";
import CanonicalRedirect from "@/Components/CanonicalRedirect/CanonicalRedirect";
import { getCanonicalBaseUrl } from "@/lib/canonical";
  
const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(getCanonicalBaseUrl()),
  title: {
    default: "Piggy Almari - Rent, Buy, Sell Fashion",
    template: "%s"
  },
  description: "Rent, Buy, Sell Fashion - Fashion made smarter! Rent occasional wear online or at our stores. Buy pre-loved outfits with minimum 50% savings. Earn money by selling your occasional outfits with us.",
  keywords: [
    "fashion rental",
    "rent clothes",
    "buy pre-loved fashion",
    "sell clothes",
    "occasional wear",
    "fashion rental India",
    "rent designer clothes",
    "sustainable fashion",
    "pre-owned fashion",
    "fashion marketplace"
  ],
  authors: [{ name: "Piggy Almari" }],
  creator: "Piggy Almari",
  publisher: "Piggy Almari",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: getCanonicalBaseUrl(),
    siteName: 'Piggy Almari',
    title: 'Piggy Almari - Rent, Buy, Sell Fashion',
    description: 'Rent, Buy, Sell Fashion - Fashion made smarter! Rent occasional wear online or at our stores. Buy pre-loved outfits with minimum 50% savings.',
    images: [
      {
        url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
        width: 1200,
        height: 630,
        alt: 'Piggy Almari - Rent, Buy, Sell Fashion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piggy Almari - Rent, Buy, Sell Fashion',
    description: 'Rent, Buy, Sell Fashion - Fashion made smarter!',
    images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
    creator: '@piggyalmari',
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  verification: {
  },
  category: 'Fashion',
};

// Viewport configuration - must be exported separately in Next.js 15
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} antialiased`}
      >
        {/* Canonical URL redirect (www to non-www) */}
        <CanonicalRedirect />
        <QueryProviderWrapper>
          {children}
        </QueryProviderWrapper>
      </body>
    </html>
  );
}
