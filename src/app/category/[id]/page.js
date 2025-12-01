import DefaultLayout from "@/Layout/DefaultLayout";
import CategoryProductsServerWrapper from "@/Components/CategoryProducts/CategoryProductsServerWrapper";
import SchemaData from "@/components/SchemaData";
import { getCollectionPageSchema, getBreadcrumbSchema } from "@/lib/schema";
import { getCanonicalBaseUrl } from "@/lib/canonical";
import { fetchCategoryPosts } from "@/api/categoryPosts.api";
import { notFound } from "next/navigation";

async function fetchCategoryForMetadata(categoryId) {
  if (!categoryId) {
    return null;
  }

  try {
    const data = await fetchCategoryPosts({
      page: 1,
      limit: 1,
      CategoryId: String(categoryId),
      is_approved: "[1]",
      is_visible: true,
    });

    const firstPost = Array.isArray(data?.data) && data.data.length > 0 ? data.data[0] : null;

    return {
      categoryInfo: firstPost?.categoryInfo || null,
      total: data?.total || 0,
    };
  } catch (err) {
    console.error("Error fetching category for metadata:", err?.message || err);
    return null;
  }
}

const defaultMetadata = {
  title: "Fashion Categories - Browse by Category | Piggy Almari",
  description:
    "Browse fashion items by category. Rent or buy pre-loved fashion items organized by category at Piggy Almari.",
  keywords: [
    "fashion categories",
    "browse fashion",
    "category page",
    "fashion collection",
    "fashion items by category",
  ],
  openGraph: {
    title: "Fashion Categories | Piggy Almari",
    description:
      "Browse fashion items by category. Rent or buy pre-loved fashion items organized by category.",
    type: "website",
    url: "/category",
    images: [
      {
        url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
        width: 1200,
        height: 630,
        alt: "Piggy Almari - Categories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Categories | Piggy Almari",
    description: "Browse fashion items by category.",
    images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
  },
  alternates: {
    canonical: "/category",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateMetadata({ params }) {
  const categoryId = params?.id;

  if (!categoryId) {
    return defaultMetadata;
  }

  const categoryData = await fetchCategoryForMetadata(categoryId);

  if (!categoryData) {
    return {
      ...defaultMetadata,
      alternates: {
        canonical: `/category/${categoryId}`,
      },
      openGraph: {
        ...defaultMetadata.openGraph,
        url: `/category/${categoryId}`,
      },
    };
  }

  const categoryName = categoryData.categoryInfo?.[0]?.name || "Fashion Category";
  const categoryDescription =
    categoryData.categoryInfo?.[0]?.CK_Description ||
    `Browse ${categoryName} fashion items. Rent or buy pre-loved fashion items at Piggy Almari.`;

  const itemCount = categoryData.total || 0;
  const itemCountText = itemCount > 0 ? ` (${itemCount} items)` : "";

  const cleanDescription = categoryDescription
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  return {
    title: `${categoryName}${itemCountText} | Piggy Almari`,
    description:
      cleanDescription ||
      `Browse ${categoryName} fashion items. Rent or buy pre-loved fashion items at Piggy Almari.`,
    keywords: [
      categoryName.toLowerCase(),
      "fashion category",
      "browse fashion",
      "fashion collection",
      "fashion items by category",
    ],
    openGraph: {
      title: `${categoryName} | Piggy Almari`,
      description: cleanDescription || `Browse ${categoryName} fashion items.`,
      type: "website",
      url: `/category/${categoryId}`,
      images: [
        {
          url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
          width: 1200,
          height: 630,
          alt: `${categoryName} - Piggy Almari`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${categoryName} | Piggy Almari`,
      description: cleanDescription || `Browse ${categoryName} fashion items.`,
      images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
    },
    alternates: {
      canonical: `/category/${categoryId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function CategoryDetailPage({ params }) {
  const categoryId = params?.id;

  if (!categoryId) {
    notFound();
  }

  const collectionSchema = getCollectionPageSchema({
    name: "Fashion Categories",
    description: "Browse our collection of fashion items organized by category",
    url: `/category/${categoryId}`,
    itemCount: 0,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/category" },
    { name: "Category Detail", url: `/category/${categoryId}` },
  ]);

  return (
    <>
      <SchemaData schema={collectionSchema} />
      <SchemaData schema={breadcrumbSchema} />
      <DefaultLayout>
        <CategoryProductsServerWrapper categoryId={categoryId} />
      </DefaultLayout>
    </>
  );
}


