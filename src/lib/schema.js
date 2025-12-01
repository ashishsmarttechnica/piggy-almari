/**
 * Schema.org JSON-LD Structured Data Utilities
 * 
 * Why Schema Data?
 * - Helps search engines understand your content better
 * - Enables rich snippets in search results (ratings, prices, images)
 * - Improves SEO rankings and click-through rates
 * - Required for Google Shopping and other services
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://piggyalmari.com';

/**
 * Organization Schema
 * Why: Identifies your business entity to search engines
 * Benefits: Shows business info in Knowledge Graph, improves local SEO
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Piggy Almari",
    "url": SITE_URL,
    "logo": `${SITE_URL}/PiggyAlmariLogo.png`,
    "description": "Rent, Buy, Sell Fashion - Fashion made smarter!",
    "sameAs": [
      // Add your social media URLs here
      // "https://www.facebook.com/piggyalmari",
      // "https://www.instagram.com/piggyalmari",
      // "https://twitter.com/piggyalmari"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Hindi"]
    }
  };
}

/**
 * Website Schema
 * Why: Defines your website structure for search engines
 * Benefits: Helps with site navigation, search box, and site-wide features
 */
export function getWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Piggy Almari",
    "url": SITE_URL,
    "description": "Rent, Buy, Sell Fashion - Fashion made smarter!",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Product Schema
 * Why: Enables rich product snippets in search results
 * Benefits: Shows price, rating, availability, images in Google search
 */
export function getProductSchema(product) {
  if (!product) return null;

  const imageUrl = product.postimg
    ? (product.postimg.startsWith('http')
        ? product.postimg
        : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${product.postimg}`)
    : `${SITE_URL}/PiggyAlmariLogo.png`;

  const encodedTitle = product.title ? encodeURIComponent(product.title) : null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title || "Fashion Item",
    "description": product.details || product.title || "Fashion item from Piggy Almari",
    "image": imageUrl,
    "brand": {
      "@type": "Brand",
      "name": "Piggy Almari"
    },
    "offers": [
      ...(product.rent_prices && encodedTitle ? [{
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": product.rent_prices,
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/post/${encodedTitle}/`,
        "priceSpecification": {
          "@type": "UnitPriceSpecification",
          "price": product.rent_prices,
          "priceCurrency": "INR",
          "unitCode": "DAY"
        }
      }] : []),
      ...(product.sell_prices && encodedTitle ? [{
        "@type": "Offer",
        "priceCurrency": "INR",
        "price": product.sell_prices,
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/post/${encodedTitle}/`
      }] : [])
    ],
    ...(product.overallRating ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.overallRating,
        "reviewCount": product.reviewCount || 0,
        "bestRating": 5,
        "worstRating": 1
      }
    } : {}),
    ...(encodedTitle ? { "url": `${SITE_URL}/post/${encodedTitle}/` } : {})
  };
}

/**
 * Breadcrumb Schema
 * Why: Shows navigation path in search results
 * Benefits: Better UX in search, helps users understand site structure
 */
export function getBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${SITE_URL}${item.url}`
    }))
  };
}

/**
 * CollectionPage Schema (for category/section pages)
 * Why: Identifies collection pages to search engines
 * Benefits: Better categorization in search, improved navigation
 */
export function getCollectionPageSchema(pageData) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageData.name || "Fashion Collection",
    "description": pageData.description || `Browse ${pageData.name || 'fashion'} items at Piggy Almari`,
    "url": `${SITE_URL}${pageData.url}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": pageData.itemCount || 0
    }
  };
}

/**
 * ItemList Schema (for product listing pages)
 * Why: Helps search engines understand product collections
 * Benefits: Can show multiple products in search results
 */
export function getItemListSchema(items, pageUrl, pageName) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageName || "Product List",
    "description": `Browse our collection of ${pageName || 'fashion items'}`,
    "url": `${SITE_URL}${pageUrl}`,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => {
      const encodedTitle = item.title ? encodeURIComponent(item.title) : null;
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": item.title || "Fashion Item",
          ...(encodedTitle ? { "url": `${SITE_URL}/post/${encodedTitle}/` } : {}),
          "image": item.postimg 
            ? (item.postimg.startsWith('http') 
                ? item.postimg 
                : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${item.postimg}`)
            : `${SITE_URL}/PiggyAlmariLogo.png`
        }
      };
    })
  };
}

