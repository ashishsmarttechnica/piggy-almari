/**
 * Dynamic robots.txt route handler
 * Allows search engines and social media crawlers to index the site
 * This is the Next.js App Router way to serve robots.txt dynamically
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
  
  const robotsTxt = `# robots.txt for Piggy Almari
# Allows search engines and social media crawlers to index the site

User-agent: *
Allow: /

# Allow Facebook crawler for Open Graph metadata
User-agent: facebookexternalhit
Allow: /

# Allow Twitter crawler for Twitter Cards
User-agent: Twitterbot
Allow: /

# Allow LinkedIn crawler
User-agent: LinkedInBot
Allow: /

# Allow Pinterest crawler
User-agent: Pinterestbot
Allow: /

# Allow WhatsApp crawler
User-agent: WhatsApp
Allow: /

# Allow Instagram crawler
User-agent: Instagram
Allow: /

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

