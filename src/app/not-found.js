import Link from "next/link";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import HomeNavServer from "@/Components/Header/HomeNavServer";
import { Suspense } from "react";

/**
 * 404 Page Metadata
 * Why: Even error pages need metadata
 * - Prevents search engines from indexing 404 pages
 * - Provides proper page information
 * - robots: noindex prevents 404s from appearing in search
 */
export const metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for doesn't exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

function HomeNavWrapper() {
  return (
    <Suspense fallback={<div className="w-full bg-light-gray border-b border-dark-gray/20 h-12.5"></div>}>
      <HomeNavServer />
    </Suspense>
  );
}

export default function NotFound() {
  return (
    <>
      <Header />
      <HomeNavWrapper />
      <div className="min-h-screen bg-light-gray flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="fs-6xl font-bold text-theme-black mb-4">404</h1>
          <h2 className="fs-2xl font-semibold text-theme-black mb-4">Page Not Found</h2>
          <p className="fs-md text-dark-gray mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block bg-theme-black text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Go Back Home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

