import DefaultLayout from "@/Layout/DefaultLayout";
import CategoryProductsServerWrapper from "@/Components/CategoryProducts/CategoryProductsServerWrapper";
import SchemaData from "@/components/SchemaData";
import { getCollectionPageSchema, getBreadcrumbSchema } from "@/lib/schema";
import { getCanonicalBaseUrl } from "@/lib/canonical";
import { fetchCategoryPosts } from "@/api/categoryPosts.api";
import { fetchCategoryData } from "@/api/category.api";
import { cache } from "react";
import { notFound } from "next/navigation";

const resolveCategoryForSubcategory = cache(async (subCategoryId) => {
  try {
    const data = await fetchCategoryData();
    const categories = Array.isArray(data?.data) ? data.data : [];

    for (const category of categories) {
      const subcategories = Array.isArray(category?.subCategorys) ? category.subCategorys : [];
      const match = subcategories.find((sub) => String(sub?._id) === String(subCategoryId));

      if (match) {
        return {
          category,
          subCategory: match,
        };
      }
    }

    return null;
  } catch (error) {
    console.error("Error resolving subcategory mapping:", error?.message || error);
    return null;
  }
});

async function fetchCategoryForMetadata(categoryId, subCategoryId) {
  if (!categoryId || !subCategoryId) {
    return null;
  }

  try {
    const data = await fetchCategoryPosts({
      page: 1,
      limit: 1,
      CategoryId: String(categoryId),
      subCategoryId: String(subCategoryId),
      is_approved: "[1]",
      is_visible: true,
    });

    const firstPost = Array.isArray(data?.data) && data.data.length > 0 ? data.data[0] : null;

    return {
      categoryInfo: firstPost?.categoryInfo || null,
      subCategoryInfo: firstPost?.subCategoryInfo || null,
      total: data?.total || 0,
    };
  } catch (err) {
    console.error("Error fetching subcategory for metadata:", err?.message || err);
    return null;
  }
}

const defaultMetadata = {
  title: "Fashion Subcategory - Browse Products",
  description:
    "Browse fashion items by subcategory. Find specific fashion items organized by subcategory at Piggy Almari.",
  keywords: [
    "fashion subcategory",
    "browse fashion subcategory",
    "subcategory products",
    "fashion items subcategory",
  ],
  openGraph: {
    title: "Fashion Subcategory | Piggy Almari",
    description:
      "Browse fashion items by subcategory. Find specific fashion items organized by subcategory.",
    type: "website",
    url: "/subcategory",
    images: [
      {
        url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
        width: 1200,
        height: 630,
        alt: "Piggy Almari - Subcategory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Subcategory | Piggy Almari",
    description: "Browse fashion items by subcategory.",
    images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
  },
  alternates: {
    canonical: "/subcategory",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export async function generateMetadata({ params }) {
  const subCategoryId = params?.id;

  if (!subCategoryId) {
    return defaultMetadata;
  }

  const resolved = await resolveCategoryForSubcategory(subCategoryId);

  if (!resolved?.category?._id) {
    return {
      ...defaultMetadata,
      openGraph: {
        ...defaultMetadata.openGraph,
        url: `/subcategory/${subCategoryId}`,
      },
      alternates: {
        canonical: `/subcategory/${subCategoryId}`,
      },
    };
  }

  const categoryId = String(resolved.category._id);
  const categoryData = await fetchCategoryForMetadata(categoryId, subCategoryId);

  const subCategoryName =
    categoryData?.subCategoryInfo?.[0]?.name || resolved.subCategory?.name || "Fashion Subcategory";
  const subCategoryDescription =
    categoryData?.subCategoryInfo?.[0]?.CK_Description ||
    resolved.subCategory?.CK_Description ||
    `Browse ${subCategoryName} fashion items. Rent or buy pre-loved fashion items at Piggy Almari.`;

  const itemCount = categoryData?.total || 0;
  const itemCountText = itemCount > 0 ? ` (${itemCount} items)` : "";

  const cleanDescription = subCategoryDescription
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 160);

  return {
    title: `${subCategoryName}${itemCountText} | Piggy Almari`,
    description:
      cleanDescription ||
      `Browse ${subCategoryName} fashion items. Rent or buy pre-loved fashion items at Piggy Almari.`,
    keywords: [
      subCategoryName.toLowerCase(),
      "fashion subcategory",
      "browse fashion",
      "fashion collection",
      resolved.category?.name ? resolved.category.name.toLowerCase() : null,
    ].filter(Boolean),
    openGraph: {
      title: `${subCategoryName} | Piggy Almari`,
      description: cleanDescription || `Browse ${subCategoryName} fashion items.`,
      type: "website",
      url: `/subcategory/${subCategoryId}`,
      images: [
        {
          url: `${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`,
          width: 1200,
          height: 630,
          alt: `${subCategoryName} - Piggy Almari`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${subCategoryName} | Piggy Almari`,
      description: cleanDescription || `Browse ${subCategoryName} fashion items.`,
      images: [`${getCanonicalBaseUrl()}/PiggyAlmariLogo.png`],
    },
    alternates: {
      canonical: `/subcategory/${subCategoryId}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SubCategoryPage({ params }) {
  const subCategoryId = params?.id;

  if (!subCategoryId) {
    notFound();
  }

  const resolved = await resolveCategoryForSubcategory(subCategoryId);

  if (!resolved?.category?._id) {
    notFound();
  }

  const categoryId = String(resolved.category._id);
  const categoryName = resolved.category?.name || "Categories";
  const subCategoryName = resolved.subCategory?.name || "Subcategory";
  const subCategoryDescription = resolved.subCategory?.CK_Description || null;

  const collectionSchema = getCollectionPageSchema({
    name: subCategoryName,
    description: subCategoryDescription
      ? subCategoryDescription.replace(/<[^>]*>/g, "").trim()
      : "Browse our collection of fashion items organized by subcategory",
    url: `/subcategory/${subCategoryId}`,
    itemCount: 0,
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: categoryName, url: categoryId ? `/category/${categoryId}` : "/category" },
    { name: subCategoryName, url: `/subcategory/${subCategoryId}` },
  ]);

  return (
    <>
      {/* <SchemaData schema={collectionSchema} /> */}
      {/* <SchemaData schema={breadcrumbSchema} /> */}
      <DefaultLayout>
        <CategoryProductsServerWrapper categoryId={categoryId} subCategoryId={subCategoryId} />
      </DefaultLayout>
    </>
  );
}


