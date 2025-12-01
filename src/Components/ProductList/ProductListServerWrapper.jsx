"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductListServer from "./ProductListServer";

function ProductListServerFallback() {
  return (
    <div className="w-full bg-light-gray min-h-screen">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3 mb-2"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="aspect-square bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductListServerWrapper() {
  const searchParams = useSearchParams();
  const sectionId = searchParams?.get("id");

  return (
    <Suspense fallback={<ProductListServerFallback />}>
      <ProductListServer sectionId={sectionId} />
    </Suspense>
  );
}

