import { Suspense } from "react";
import ProductDetailsServer from "./ProductDetailsServer";

function ProductDetailsServerFallback() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="skeleton-shimmer h-[600px] rounded-lg"></div>
          <div className="space-y-4">
            <div className="skeleton-shimmer h-8 w-3/4 rounded"></div>
            <div className="skeleton-shimmer h-4 w-full rounded"></div>
            <div className="skeleton-shimmer h-4 w-2/3 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsServerWrapper({ productTitle, initialData }) {
  return (
    <Suspense fallback={<ProductDetailsServerFallback />}>
      <ProductDetailsServer productTitle={productTitle} initialData={initialData} />
    </Suspense>
  );
}

