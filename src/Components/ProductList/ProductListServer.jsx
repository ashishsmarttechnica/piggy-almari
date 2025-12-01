"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import ProductList from "./ProductList";
import { useSectionPostsStore } from "@/store/SectionPosts.store";

export default function ProductListServer({ sectionId }) {
  // Filter and Sort State
  const [priceType, setPriceType] = useState(""); // "sell" or "rent"
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const initializedRef = useRef(false);
  const filtersInitializedRef = useRef(false);
  
  // Use Zustand store to fetch data
  const fetchSectionPosts = useSectionPostsStore((state) => state.fetchSectionPosts);
  const sectionData = useSectionPostsStore((state) => state.sectionData);
  const posts = useSectionPostsStore((state) => state.posts);
  const pagination = useSectionPostsStore((state) => state.pagination);
  const loading = useSectionPostsStore((state) => state.loading);
  const error = useSectionPostsStore((state) => state.error);

  // Hardcoded params
  const params = { page: 1, limit: 10, is_approved: "[1]" };

  // Build API parameters based on filter/sort state
  const buildApiParams = useCallback((page = 1, limit = 8) => {
    const apiParams = {
      id: sectionId,
      page: page,
      limit: limit,
      is_approved: params.is_approved || "[1]",
      is_type: priceType === "sell" ? "[1]" : priceType === "rent" ? "[2]" : "[0,1,2]", // Type filter: sell=1, rent=2, default=all
    };

    // Add sorting (only if sortBy is set)
    if (sortBy) {
      let sortField = "";
      let sortOrder = "";
      switch (sortBy) {
        case "rent_price_low_high":
          sortField = "rent_prices";
          sortOrder = "Asc";
          break;
        case "rent_price_high_low":
          sortField = "rent_prices";
          sortOrder = "Desc";
          break;
        case "sale_price_low_high":
          sortField = "sell_prices";
          sortOrder = "Asc";
          break;
        case "sale_price_high_low":
          sortField = "sell_prices";
          sortOrder = "Desc";
          break;
        default:
          // No default sort if sortBy is set but doesn't match
          break;
      }
      if (sortField && sortOrder) {
        apiParams.sortFields = `${sortField}:${sortOrder}`;
      }
    }

    // Add price range filters
    if (priceType === "sell") {
      if (minPrice !== "" && minPrice !== null && minPrice !== undefined) {
        apiParams.min_sell_prices = Number(minPrice);
      }
      if (maxPrice !== "" && maxPrice !== null && maxPrice !== undefined) {
        apiParams.max_sell_prices = Number(maxPrice);
      }
    } else if (priceType === "rent") {
      if (minPrice !== "" && minPrice !== null && minPrice !== undefined) {
        apiParams.min_rent_prices = Number(minPrice);
      }
      if (maxPrice !== "" && maxPrice !== null && maxPrice !== undefined) {
        apiParams.max_rent_prices = Number(maxPrice);
      }
    }

    if (params.latitude) apiParams.latitude = params.latitude;
    if (params.longitude) apiParams.longitude = params.longitude;

    return apiParams;
  }, [sectionId, sortBy, priceType, minPrice, maxPrice]);

  // Initial load when sectionId changes
  useEffect(() => {
    if (!sectionId) return;
    
    // Reset state when sectionId changes
    initializedRef.current = false;
    filtersInitializedRef.current = false;
    setCurrentPage(1);
    setHasMore(true);
    setPriceType("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("");

    // Fetch initial data
    const fetchPromise = fetchSectionPosts(buildApiParams(1, 8), false);
    
    if (fetchPromise && typeof fetchPromise.then === 'function') {
      fetchPromise.then(() => {
        initializedRef.current = true;
        filtersInitializedRef.current = true;
      }).catch(() => {
        initializedRef.current = true;
        filtersInitializedRef.current = true;
      });
    } else {
      setTimeout(() => {
        initializedRef.current = true;
        filtersInitializedRef.current = true;
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  // Refetch when filters or sort change (after initial load)
  useEffect(() => {
    // Skip if not initialized yet
    if (!sectionId || !initializedRef.current || !filtersInitializedRef.current) return;
    
    setCurrentPage(1);
    setHasMore(true);
    
    // Fetch with new filters
    fetchSectionPosts(buildApiParams(1, 8), false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, priceType, minPrice, maxPrice]);

  // Update hasMore based on pagination
  useEffect(() => {
    if (pagination.totalPages > 0) {
      setHasMore(currentPage < pagination.totalPages);
    }
  }, [currentPage, pagination.totalPages]);

  // Load more handler for infinite scroll
  const handleLoadMore = useCallback(() => {
    if (!hasMore || loading || !initializedRef.current) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSectionPosts(buildApiParams(nextPage, params.limit || 10), true); // append = true
  }, [hasMore, loading, currentPage, buildApiParams, fetchSectionPosts, params.limit]);

  if (!initializedRef.current) {
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

  return (
    <ProductList
      sectionData={sectionData}
      posts={posts}
      loading={loading}
      error={error}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      priceType={priceType}
      setPriceType={setPriceType}
      minPrice={minPrice}
      setMinPrice={setMinPrice}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      sortBy={sortBy}
      setSortBy={setSortBy}
    />
  );
}
