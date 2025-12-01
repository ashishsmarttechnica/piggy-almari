"use client";

import { useEffect, useState } from "react";
import HomeNav from "./HomeNav";
import { useCategoryStore } from "@/store/Category.store";

export default function HomeNavServer() {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use Zustand store to fetch data
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const categories = useCategoryStore((state) => state.categories);

  useEffect(() => {
    // Fetch using Zustand store
    const fetchPromise = fetchCategories();
    
    // Handle promise (store function may return undefined if already loading)
    if (fetchPromise && typeof fetchPromise.then === 'function') {
      fetchPromise.then(() => {
        // Get data from store after fetch
        const storeCategories = useCategoryStore.getState().categories;
        
        setInitialData({
          categories: Array.isArray(storeCategories) ? storeCategories : [],
        });
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });
    } else {
      // If fetch didn't return a promise (already loading), wait a bit and check store
      setTimeout(() => {
        const storeCategories = useCategoryStore.getState().categories;
        
        setInitialData({
          categories: Array.isArray(storeCategories) ? storeCategories : [],
        });
        setIsLoading(false);
      }, 100);
    }
  }, [fetchCategories]);

  // Show loading state if needed (HomeNav handles its own loading)
  if (isLoading && !initialData) {
    return (
      <div className="w-full bg-light-gray border-b border-dark-gray/20">
        <div className="container mx-auto">
          <nav className="flex items-center justify-center gap-6 whitespace-nowrap px-5 h-12.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-[140px] rounded-md bg-dark-gray/20 animate-pulse"
                aria-busy="true"
              />
            ))}
          </nav>
        </div>
      </div>
    );
  }

  // Pass initial data to client component
  // Client component will hydrate with this data if available
  // Otherwise, it will fetch data client-side using Zustand store and hooks
  return <HomeNav initialData={initialData} initialError={null} />;
}


