import { redirect } from "next/navigation";

export const metadata = {
  title: "Redirecting...",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LegacySubcategoryPage({ searchParams }) {
  const categoryId = searchParams?.id;
  const subCategoryId = searchParams?.subId;

  if (subCategoryId) {
    redirect(`/subcategory/${encodeURIComponent(subCategoryId)}`);
  }

  if (categoryId) {
    redirect(`/category/${encodeURIComponent(categoryId)}`);
  }

  redirect("/category");
}

