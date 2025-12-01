import Hero from "@/Components/Hero/Hero";
import SectionListServer from "@/Components/Home/SectionListServer";
import DefaultLayout from "@/Layout/DefaultLayout";
import SchemaData from "@/components/SchemaData";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";
import { getCanonicalBaseUrl } from "@/lib/canonical";


export const metadata = {
  title: "Piggy Almari - Rent, Buy, Sell Fashion",
  description: "Rent, Buy, Sell Fashion - Fashion made smarter! Rent occasional wear online or at our stores. Buy pre-loved outfits with minimum 50% savings. Earn money by selling your occasional outfits with us.",
  keywords: [
    "fashion rental",
    "rent clothes",
    "buy pre-loved fashion",
    "sell clothes",
    "occasional wear",
    "fashion rental India"
  ],
  openGraph: {
    title: "Piggy Almari - Rent, Buy, Sell Fashion",
    description: "Rent, Buy, Sell Fashion - Fashion made smarter! Rent occasional wear online or at our stores. Buy pre-loved outfits with minimum 50% savings.",
    url: "/",
    siteName: "Piggy Almari",
    images: [
      {
        url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
        width: 1200,
        height: 630,
        alt: "Piggy Almari - Rent, Buy, Sell Fashion",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piggy Almari - Rent, Buy, Sell Fashion",
    description: "Rent, Buy, Sell Fashion - Fashion made smarter!",
    images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      {/* Organization Schema: Identifies business entity to search engines */}
      <SchemaData schema={getOrganizationSchema()} />
      {/* Website Schema: Defines website structure and search functionality */}
      <SchemaData schema={getWebsiteSchema()} />
      <DefaultLayout>
        <Hero />
        <SectionListServer />
      </DefaultLayout>
    </>
  );
}
