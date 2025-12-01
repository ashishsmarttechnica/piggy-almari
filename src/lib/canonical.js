/**
 * Canonical URL Helper
 * Ensures all URLs use the non-www version for consistency
 */

// Choose your preferred canonical version (with or without www)
const PREFER_WWW = false; // Set to true if you prefer www, false for non-www

/**
 * Get the canonical URL without www
 * @param {string} path - The path (e.g., '/', '/contact')
 * @returns {string} The full canonical URL
 */
export function getCanonicalUrl(path = '/') {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zencrmsuper.smarttechnica.com';
  const url = new URL(path, baseUrl);
  
  // Remove www from hostname to ensure canonical version
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
  }
  
  return url.toString();
}

/**
 * Get the base URL (domain) without www
 * @returns {string} The canonical base URL
 */
export function getCanonicalBaseUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zencrmsuper.smarttechnica.com';
  const url = new URL(baseUrl);
  
  // Remove www from hostname
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.replace('www.', '');
  }
  
  return url.toString().replace(/\/$/, ''); // Remove trailing slash
}

/**
 * Check if current URL needs redirect (client-side only)
 * @returns {boolean} True if redirect is needed
 */
export function needsCanonicalRedirect() {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  const hasWww = hostname.startsWith('www.');
  
  // Redirect www to non-www (or vice versa based on preference)
  if (PREFER_WWW) {
    return !hasWww; // Redirect non-www to www
  } else {
    return hasWww; // Redirect www to non-www
  }
}

/**
 * Get the redirect URL for canonicalization
 * @returns {string|null} The redirect URL or null if no redirect needed
 */
export function getCanonicalRedirectUrl() {
  if (typeof window === 'undefined') return null;
  
  const needsRedirect = needsCanonicalRedirect();
  if (!needsRedirect) return null;
  
  const url = new URL(window.location.href);
  
  if (PREFER_WWW) {
    if (!url.hostname.startsWith('www.')) {
      url.hostname = 'www.' + url.hostname;
    }
  } else {
    if (url.hostname.startsWith('www.')) {
      url.hostname = url.hostname.replace('www.', '');
    }
  }
  
  return url.toString();
}

