import DefaultLayout from "@/Layout/DefaultLayout";
import ProductListServerWrapper from "@/Components/ProductList/ProductListServerWrapper";
import SchemaData from "@/Components/SchemaData";
import { getCollectionPageSchema, getBreadcrumbSchema } from "@/lib/schema";
import { getCanonicalBaseUrl } from "@/lib/canonical";
import { fetchSectionPosts } from "@/api/section.api";

/**
 * Server-side fetch for section data (for metadata generation)
 * Uses native fetch to get section information before rendering
 */
async function fetchSectionForMetadata(sectionId) {
  if (!sectionId) {
    return null;
  }

  try {
    const data = await fetchSectionPosts({
      id: String(sectionId),
      page: 1,
      limit: 1,
      is_approved: "[1]",
    });

    return {
      sectionData: data?.data || null,
      total: data?.total || 0,
    };
  } catch (err) {
    console.error("Error fetching section for metadata:", err?.message || err);
    return null;
  }
}

/**
 * Dynamic Metadata Generation for Section Pages
 * Why: Generates SEO-optimized metadata based on actual section data
 * - Uses section names from API (e.g., "Trending", "New Arrivals")
 * - Includes product count for better context
 * - Improves search engine visibility with section-specific content
 */
export async function generateMetadata({ searchParams }) {
  // In Next.js 15, searchParams might be a Promise that needs to be awaited
  const params = await Promise.resolve(searchParams || {});
  const sectionId = params?.id;
  
  // Fallback metadata if no section ID or fetch fails
  const defaultMetadata = {
    title: "Fashion Section - Curated Collections | Piggy Almari",
    description: "Browse curated fashion collections and sections. Discover trending fashion items, new arrivals, and featured products at Piggy Almari.",
    keywords: [
      "fashion section",
      "curated fashion",
      "fashion collections",
      "trending fashion",
      "featured fashion items"
    ],
    openGraph: {
      title: "Fashion Section | Piggy Almari",
      description: "Browse curated fashion collections and sections. Discover trending fashion items and featured products.",
      type: "website",
      url: sectionId ? `/section?id=${sectionId}` : "/section",
      images: [
        {
          url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
          width: 1200,
          height: 630,
          alt: "Piggy Almari - Fashion Sections",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Fashion Section | Piggy Almari",
      description: "Browse curated fashion collections and sections.",
      images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
    },
    alternates: {
      canonical: sectionId ? `/section?id=${sectionId}` : "/section",
    },
    robots: {
      index: true,
      follow: true,
    },
  };

  // If no section ID, return default metadata
  if (!sectionId) {
    return defaultMetadata;
  }

  // Fetch section data for dynamic metadata
  const sectionData = await fetchSectionForMetadata(sectionId);
  
  if (!sectionData || !sectionData.sectionData) {
    return defaultMetadata;
  }

  // Generate dynamic metadata from section data
  const sectionName = sectionData.sectionData.name || "Fashion Section";
  const sectionDescription = sectionData.sectionData.CK_Description 
    ? sectionData.sectionData.CK_Description.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().substring(0, 160)
    : `Browse ${sectionName} curated fashion collection. Discover trending fashion items and featured products at Piggy Almari.`;

  const itemCount = sectionData.total || 0;
  const itemCountText = itemCount > 0 ? ` (${itemCount} items)` : "";

  return {
    title: `${sectionName}${itemCountText} | Piggy Almari`,
    description: sectionDescription,
    keywords: [
      sectionName.toLowerCase(),
      "curated fashion",
      "fashion collections",
      "trending fashion",
      "featured fashion items",
      "fashion section",
    ],
    openGraph: {
      title: `${sectionName} | Piggy Almari`,
      description: sectionDescription,
      type: "website",
      url: `/section?id=${sectionId}`,
      images: [
        {
          url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
          width: 1200,
          height: 630,
          alt: `${sectionName} - Piggy Almari`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${sectionName} | Piggy Almari`,
      description: sectionDescription,
      images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
    },
    alternates: {
      canonical: `/section?id=${sectionId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function SectionPage() {
  const collectionSchema = getCollectionPageSchema({
    name: "Fashion Section",
    description: "Browse our curated fashion collections and sections",
    url: "/section",
    itemCount: 0,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Section", url: "/section" },
  ]);

  return (
    <>
      {/* CollectionPage Schema: Identifies this as a curated section/collection */}
      {/* <SchemaData schema={collectionSchema} /> */}
      {/* Breadcrumb Schema: Shows navigation path */}
      {/* <SchemaData schema={breadcrumbSchema} /> */}
      <DefaultLayout>
        <ProductListServerWrapper />
      </DefaultLayout>
    </>
  );
}

