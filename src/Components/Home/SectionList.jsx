"use client";

import { useMemo } from "react";
import Section from "./Section";
import useHome from "@/hooks/Home/useHome";

/**
 * SectionList Component
 * Uses useHome hook which automatically fetches data via useHomeStore
 * The store uses fetchHomeScreenData from home.api.js
 */
export default function SectionList() {
  // Memoize params to prevent unnecessary re-renders
  const params = useMemo(
    () => ({
      page: 1,
      limit: 10,
      postLimit: 4,
    }),
    []
  );
  
  // useHome hook automatically fetches data on mount via store
  // Store uses fetchHomeScreenData from home.api.js
  const { sections, loading, error } = useHome({
    autoFetch: true, // Auto-fetch on mount using store
    params,
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 fs-md">Error loading sections: {error}</p>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    if (loading) {
      return (
        <div className="container mx-auto px-4 py-8">
          <p className="text-dark-gray fs-md">Loading sections...</p>
        </div>
      );
    }
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-dark-gray fs-md">No sections available.</p>
      </div>
    );
  }

  return (
    <>
      {sections.map((section, index) => (
        <Section
          key={section._id}
          section={section}
          index={index}
          loading={loading}
        />
      ))}
    </>
  );
}

