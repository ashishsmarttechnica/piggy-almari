"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCanonicalRedirectUrl } from "@/lib/canonical";

/**
 * CanonicalRedirect Component
 * Handles client-side redirect from www to non-www (or vice versa)
 * This ensures SEO consistency and prevents duplicate content issues
 */
export default function CanonicalRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const redirectUrl = getCanonicalRedirectUrl();
    
    if (redirectUrl) {
      // Use replace to avoid adding to history
      // This is a permanent redirect (301 equivalent)
      window.location.replace(redirectUrl);
    }
  }, [router]);

  // This component doesn't render anything
  return null;
}

