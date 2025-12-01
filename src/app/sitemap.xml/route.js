/**
 * Dynamic sitemap.xml route handler
 * Generates sitemap for search engines
 * This is the Next.js App Router way to serve sitemap.xml dynamically
 */

// Required for static export - tells Next.js to generate this route statically at build time
export const dynamic = 'force-static';

// Note: We can't import getCanonicalBaseUrl here since it's a route handler
// So we'll manually remove www from the URL
function getCanonicalBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zencrmsuper.smarttechnica.com';
  try {
    const url = new URL(baseUrl);
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.replace('www.', '');
    }
    return url.toString().replace(/\/$/, '');
  } catch {
    return baseUrl.replace(/\/$/, '');
  }
}

export async function GET() {
  const siteUrl = getCanonicalBaseUrl();
  
  // Basic sitemap structure
  // You can enhance this to fetch actual product/category URLs from your API
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  
  <!-- Home Page -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Category Page -->
  <url>
    <loc>${siteUrl}/category/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Section Page -->
  <url>
    <loc>${siteUrl}/section/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Post/Product Page -->
  <url>
    <loc>${siteUrl}/post/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- 
    TODO: Add dynamic URLs here by fetching from your API
    Example:
    - Product URLs: ${siteUrl}/post/PRODUCT_TITLE/
    - Category URLs: ${siteUrl}/category/CATEGORY_ID
    - Subcategory URLs: ${siteUrl}/subcategory/SUBCATEGORY_ID
    - Section URLs: ${siteUrl}/section?id=SECTION_ID
  -->
  
</urlset>`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

