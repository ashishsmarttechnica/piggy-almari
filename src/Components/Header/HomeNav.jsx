"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import useCategory from "@/hooks/Category/useCategory";
import NavDropdown from "./NavDropdown";
import { IoMenu, IoClose } from "react-icons/io5";
import NavSidebar from "./NavSidebar";


export default function HomeNav({ initialData = null, initialError = null }) {
  const { categories: storeCategories, loading: storeLoading, error: storeError } = useCategory({
    autoFetch: !initialData, // Only auto-fetch if we don't have initial data
  });

  // Use initial data if available, otherwise use store data
  const categories = initialData?.categories || storeCategories;
  const loading = initialData ? false : storeLoading;
  const error = initialError || storeError;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const orderedCategories = useMemo(() => {
    return [...(categories || [])].sort((a, b) => (a?.index || 0) - (b?.index || 0));
  }, [categories]);

  if (error) {
    return (
      <div className="w-full bg-light-gray text-theme-black">
        <div className="container mx-auto px-5 py-3">
          <p className="fs-md">Failed to load categories: {error}</p>
        </div>
      </div>
    );
  }

  const maxVisible = useMemo(() => {
     if (viewportWidth >= 1280) return 8; 
    if (viewportWidth >= 1024) return 6; // lg and up
    if (viewportWidth >= 768) return 4; 
    if (viewportWidth <= 767 && viewportWidth >= 514) return 3; 
    if (viewportWidth <= 513 && viewportWidth >= 405) return 2; 
    return 0;
  }, [viewportWidth]);

  return (
    <div className="w-full bg-light-gray border-b border-dark-gray/20">
      <div className="container mx-auto">
        <nav className="flex items-center justify-center gap-6 whitespace-nowrap px-5 h-12.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 fs-sm font-medium text-dark-gray hover:text-black cursor-pointer"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <IoMenu size={18} />
            Menu
          </button>
          <Link href="/" className="fs-sm text-dark-gray hover:text-black font-medium">
            Home
          </Link>
          {loading ? (
            <>
              {Array.from({ length: Math.min(maxVisible || 6, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="h-7 w-[140px] rounded-md bg-dark-gray/20 animate-pulse"
                  aria-busy="true"
                />
              ))}
            </>
          ) : (
            orderedCategories.slice(0, maxVisible).map((cat) => (
              <NavDropdown
                key={cat._id}
                label={cat.name}
                items={(cat.subCategorys || []).slice().sort((a, b) => (a?.index || 0) - (b?.index || 0))}
                getHref={(sub) => `/subcategory/${encodeURIComponent(sub._id)}`}
                categoryHref={`/category/${encodeURIComponent(cat._id)}`}
              />
            ))
          )}
        </nav>
      </div>

      <NavSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} categories={categories} loading={loading} />
    </div>
  );
}