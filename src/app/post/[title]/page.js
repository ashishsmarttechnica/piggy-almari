import DefaultLayout from "@/Layout/DefaultLayout";
import ProductDetailsServerWrapper from "@/Components/ProductDetails/ProductDetailsServerWrapper";
import SchemaData from "@/Components/SchemaData";
import { getProductSchema, getBreadcrumbSchema } from "@/lib/schema";
import { getCanonicalBaseUrl } from "@/lib/canonical";

const getImageBaseUrl = () => process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "";

function getSiteUrl() {
  return getCanonicalBaseUrl();
}

async function fetchProductForMetadata(productTitle) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !productTitle) {
    return null;
  }

  try {
    const queryParams = new URLSearchParams({
      title: String(productTitle),
    });

    const url = `${apiUrl}/api/v1/getSinglePostByTitle?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || !data.data || !data.data.post) {
      return null;
    }

    return data.data.post;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching product for metadata:", err?.message || err);
    }
    return null;
  }
}

async function fetchProductDetailsServer(productTitle, params = {}) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl || !productTitle) {
    return null;
  }

  try {
    const { ratedPostsLimit = 4 } = params;
    const queryParams = new URLSearchParams({
      title: String(productTitle),
    });

    if (ratedPostsLimit) {
      queryParams.append("ratedPostsLimit", String(ratedPostsLimit));
    }

    const url = `${apiUrl}/api/v1/getSinglePostByTitle?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "force-cache",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    if (!data || !data.data) {
      return null;
    }

    return {
      post: data.data.post || null,
      ratings: data.data.ratings || null,
      reviews: Array.isArray(data.data.reviews) ? data.data.reviews : [],
      relatedPosts: Array.isArray(data.data.relatedPosts) ? data.data.relatedPosts : [],
    };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching product details server-side:", err?.message || err);
    }
    return null;
  }
}

async function fetchAllProductTitles() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return [];
  }

  try {
    const productTitles = new Set();

    try {
      const homeUrl = `${apiUrl}/api/v1/getHomeScreenData?page=1&limit=100&postLimit=100`;
      const homeResponse = await fetch(homeUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (homeResponse.ok) {
        const homeData = await homeResponse.json();

        if (homeData?.data) {
          if (Array.isArray(homeData.data.sections)) {
            homeData.data.sections.forEach((section) => {
              if (Array.isArray(section.posts)) {
                section.posts.forEach((post) => {
                  if (post?.title) productTitles.add(String(post.title));
                });
              }
            });
          }

          if (Array.isArray(homeData.data.posts)) {
            homeData.data.posts.forEach((post) => {
              if (post?.title) productTitles.add(String(post.title));
            });
          }
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error fetching from home screen:", err?.message || err);
      }
    }

    return Array.from(productTitles);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error fetching all product titles:", err?.message || err);
    }
    return [];
  }
}

export async function generateStaticParams() {
  try {
    const productTitles = await fetchAllProductTitles();
    return productTitles.map((title) => ({
      title: String(title),
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in generateStaticParams:", error);
    }
    return [];
  }
}

export const dynamicParams = true;

function getSafeImageUrl(imagePath) {
  const siteUrl = getSiteUrl();
  const imageBaseUrl = getImageBaseUrl();

  if (!imagePath) {
    return `${siteUrl}/PiggyAlmariLogo.png`;
  }

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const cleanBaseUrl = imageBaseUrl.replace(/\/$/, "");
  const cleanImagePath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return cleanBaseUrl ? `${cleanBaseUrl}${cleanImagePath}` : `${siteUrl}${cleanImagePath}`;
}

export async function generateMetadata({ params }) {
  try {
    const productTitleParam = params?.title;
    const siteUrl = getCanonicalBaseUrl();

    const getDefaultMetadata = () => ({
      title: "Product Details - Fashion Item",
      description:
        "View product details, pricing, and availability. Rent or buy fashion items at Piggy Almari.",
      keywords: ["fashion product", "rent fashion", "buy fashion", "product details", "fashion item"],
      openGraph: {
        title: "Product Details | Piggy Almari",
        description:
          "View product details, pricing, and availability. Rent or buy fashion items at Piggy Almari.",
        type: "website",
        url: productTitleParam
          ? `${siteUrl}/post/${encodeURIComponent(productTitleParam)}/`
          : `${siteUrl}/post/`,
        images: [
          {
            url: `${siteUrl}/PiggyAlmariLogo.png`,
            width: 1200,
            height: 630,
            alt: "Piggy Almari - Product Details",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Product Details | Piggy Almari",
        description: "View product details, pricing, and availability.",
        images: [`${siteUrl}/PiggyAlmariLogo.png`],
      },
      alternates: {
        canonical: productTitleParam
          ? `${siteUrl}/post/${encodeURIComponent(productTitleParam)}/`
          : `${siteUrl}/post/`,
      },
      robots: {
        index: true,
        follow: true,
      },
    });

    if (!productTitleParam) {
      return getDefaultMetadata();
    }

    const product = await fetchProductForMetadata(productTitleParam);

    if (!product) {
      return getDefaultMetadata();
    }

    const productTitle = (product.title || "Fashion Item").trim();
    const productDescription =
      (
        product.details ||
        product.description ||
        "View product details, pricing, and availability. Rent or buy fashion items at Piggy Almari."
      ).trim();
    const productImage = getSafeImageUrl(product.postimg);

    const keywords = [
      productTitle.toLowerCase().substring(0, 50),
      "fashion product",
      "rent fashion",
      "buy fashion",
    ];

    if (product.categoryInfo?.[0]?.name) {
      keywords.push(product.categoryInfo[0].name.toLowerCase());
    }

    if (product.subCategoryInfo?.[0]?.name) {
      keywords.push(product.subCategoryInfo[0].name.toLowerCase());
    }

    const metaDescription =
      productDescription.length > 160
        ? `${productDescription.substring(0, 157).trim()}...`
        : productDescription;

    const ogDescription =
      productDescription.length > 200
        ? `${productDescription.substring(0, 197).trim()}...`
        : productDescription;

    const encodedTitle = encodeURIComponent(productTitleParam);

    return {
      title: productTitle,
      description: metaDescription,
      keywords: keywords.filter(Boolean),
      openGraph: {
        title: `${productTitle} | Piggy Almari`,
        description: ogDescription,
        type: "website",
        url: `${siteUrl}/post/${encodedTitle}/`,
        images: [
          {
            url: productImage,
            width: 1200,
            height: 630,
            alt: productTitle.substring(0, 100),
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: `${productTitle} | Piggy Almari`,
        description: ogDescription,
        images: [productImage],
      },
      alternates: {
        canonical: `${siteUrl}/post/${encodedTitle}/`,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in generateMetadata:", error);
    }

    const siteUrl = getCanonicalBaseUrl();
    const productTitleParam = params?.title;
    return {
      title: "Product Details - Fashion Item",
      description: "View product details, pricing, and availability. Rent or buy fashion items at Piggy Almari.",
      openGraph: {
        title: "Product Details | Piggy Almari",
        description: "View product details, pricing, and availability.",
        type: "website",
        url: productTitleParam
          ? `${siteUrl}/post/${encodeURIComponent(productTitleParam)}/`
          : `${siteUrl}/post/`,
        images: [
          {
            url: `${siteUrl}/PiggyAlmariLogo.png`,
            width: 1200,
            height: 630,
            alt: "Piggy Almari",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Product Details | Piggy Almari",
        description: "View product details, pricing, and availability.",
        images: [`${siteUrl}/PiggyAlmariLogo.png`],
      },
    };
  }
}

export default async function PostPage({ params }) {
  const productTitleParam = params?.title || null;

  let breadcrumbSchema = null;
  try {
    breadcrumbSchema = getBreadcrumbSchema([
      { name: "Home", url: "/" },
      {
        name: "Product",
        url: productTitleParam ? `/post/${encodeURIComponent(productTitleParam)}/` : "/post/",
      },
    ]);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error generating breadcrumb schema:", error);
    }
  }

  const productData = productTitleParam
    ? await fetchProductDetailsServer(productTitleParam, { ratedPostsLimit: 4 })
    : null;

  return (
    <>
      {breadcrumbSchema && <SchemaData schema={breadcrumbSchema} />}
      {productData?.post && <SchemaData schema={getProductSchema(productData.post)} />}
      <DefaultLayout>
        <ProductDetailsServerWrapper productTitle={productTitleParam} initialData={productData} />
      </DefaultLayout>
    </>
  );
}


