import DefaultLayout from "@/Layout/DefaultLayout";
import CategoryProductsServerWrapper from "@/Components/CategoryProducts/CategoryProductsServerWrapper";
import SchemaData from "@/Components/SchemaData";
import { getCollectionPageSchema, getBreadcrumbSchema } from "@/lib/schema";
export const metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Fashion Categories | Piggy Almari",
    description: "Browse fashion items by category.",
  },
  alternates: {
    canonical: "/category",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CategoryPage() {
  const collectionSchema = getCollectionPageSchema({
    name: "Fashion Categories",
    description: "Browse our collection of fashion items organized by category",
    url: "/category",
    itemCount: 0, // Would be dynamic in real implementation
  });

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/category" },
  ]);

  return (
    <>
      {/* CollectionPage Schema: Identifies this as a product collection page */}
      <SchemaData schema={collectionSchema} />
      {/* Breadcrumb Schema: Shows navigation path */}
      <SchemaData schema={breadcrumbSchema} />
      <DefaultLayout>
        <CategoryProductsServerWrapper />
      </DefaultLayout>
    </>
  );
}

