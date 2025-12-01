"use client";

import { useState, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";

export default function Filter({
  priceType,
  setPriceType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  totalItems = 0,
}) {
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // Get display text for price range button
  const getPriceRangeDisplay = () => {
    if (!priceType) return "Price Range";
    const typeText = priceType === "sell" ? "Sale" : "Rent";
    if (minPrice || maxPrice) {
      const min = minPrice ? `₹${minPrice}` : "Min";
      const max = maxPrice ? `₹${maxPrice}` : "Max";
      return `${typeText} Price (${min} - ${max})`;
    }
    return `${typeText} Price`;
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPriceDropdown || showSortDropdown) {
        const target = event.target;
        if (!target.closest(".filter-dropdown") && !target.closest(".filter-button")) {
          setShowPriceDropdown(false);
          setShowSortDropdown(false);
        }
      }
    };

    if (showPriceDropdown || showSortDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showPriceDropdown, showSortDropdown]);

  const getSortDisplayText = () => {
    switch (sortBy) {
      case "rent_price_low_high":
        return "Rent Price - Low to High";
      case "rent_price_high_low":
        return "Rent Price - High to Low";
      case "sale_price_low_high":
        return "Sale Price - Low to High";
      case "sale_price_high_low":
        return "Sale Price - High to Low";
      default:
        return "Rent Price - Low to High";
    }
  };

  return (
    <>
      {/* Filter and Sort Section */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        {/* Filter Section */}
        <div className="flex items-center gap-4 flex-wrap w-full sm:w-auto">
          <span className="fs-sm font-bold text-theme-black">Filter :</span>

          {/* Price Range Dropdown */}
          <div className="relative flex-1 min-w-0 sm:flex-none sm:min-w-[0]">
            <button
              type="button"
              className="filter-button flex items-center gap-1 sm:gap-4 text-theme-black fs-sm transition-colors w-full sm:w-auto sm:min-w-[160px] border border-transparent sm:border-transparent rounded-md"
              onClick={() => {
                setShowPriceDropdown(!showPriceDropdown);
                setShowSortDropdown(false);
              }}
            >
              <span>{getPriceRangeDisplay()}</span>
              <IoChevronDown
                className={`transition-transform ${showPriceDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showPriceDropdown && (
              <div className="filter-dropdown absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[20] w-full sm:w-auto sm:min-w-[280px] max-w-[90vw]">
                <div className="p-3 border-b border-gray-200">
                  <span className="fs-xs font-semibold text-gray-600">Select Type</span>
                </div>
                
                {/* Price Type Selection */}
                <div className="p-2 flex gap-2 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPriceType("sell")}
                    className={`w-full sm:flex-1 px-3 py-2 fs-sm rounded border transition-colors ${
                      priceType === "sell"
                        ? "bg-gray-100 font-semibold border-gray-400"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Sale Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceType("rent")}
                    className={`w-full sm:flex-1 px-3 py-2 fs-sm rounded border transition-colors ${
                      priceType === "rent"
                        ? "bg-gray-100 font-semibold border-gray-400"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    Rent Price
                  </button>
                </div>

                {/* Price Range Inputs */}
                {priceType && (
                  <div className="p-3 border-t border-gray-200">
                    <span className="fs-xs font-semibold text-gray-600 block mb-2">Price Range</span>
                    <div className="flex gap-2 items-center flex-col sm:flex-row">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPrice || ""}
                        onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded fs-sm focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                      <span className="text-gray-500 hidden sm:inline-block">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice || ""}
                        onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                        className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded fs-sm focus:outline-none focus:border-gray-400"
                        min="0"
                      />
                    </div>
                  </div>
                )}

                {/* Clear Filter */}
                <div className="p-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setPriceType("");
                      setMinPrice("");
                      setMaxPrice("");
                      setShowPriceDropdown(false);
                    }}
                    className="w-full px-3 py-2 fs-sm hover:bg-gray-100 text-gray-500 rounded"
                  >
                    Clear Filter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sort by and Total Items Section */}
        <div className="flex items-start sm:items-center gap-4 flex-col sm:flex-row w-full sm:w-auto">
        <div className="flex items-start sm:items-center gap-4 flex-row ">
          <span className="fs-sm font-bold text-theme-black">Sort by :</span>

          {/* Sort Dropdown */}
          <div className="relative flex-1 min-w-0 sm:flex-none sm:min-w-[0]">
            <button
              type="button"
              className="filter-button flex items-center gap-1 sm:gap-4 text-theme-black fs-sm transition-colors w-full sm:w-auto sm:min-w-[180px] border border-transparent sm:border-transparent rounded-md"
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowPriceDropdown(false);
              }}
            >
              <span>{getSortDisplayText()}</span>
              <IoChevronDown
                className={`transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
              />
            </button>

            {showSortDropdown && (
              <div className="filter-dropdown absolute top-full left-0 sm:left-auto sm:right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[20] w-full sm:w-auto sm:min-w-[220px] max-w-[90vw]">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("rent_price_low_high");
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 fs-sm hover:bg-gray-100 ${
                    sortBy === "rent_price_low_high" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Rent Price - Low to High
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("rent_price_high_low");
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 fs-sm hover:bg-gray-100 ${
                    sortBy === "rent_price_high_low" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Rent Price - High to Low
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("sale_price_low_high");
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 fs-sm hover:bg-gray-100 ${
                    sortBy === "sale_price_low_high" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Sale Price - Low to High
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy("sale_price_high_low");
                    setShowSortDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 fs-sm hover:bg-gray-100 ${
                    sortBy === "sale_price_high_low" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  Sale Price - High to Low
                </button>
              </div>
            )}
          </div>
        </div>

          {/* Total Items Count */}
          <div className="fs-sm text-dark-gray text-end w-full sm:w-auto">
            {totalItems} {totalItems === 1 ? "Product" : "Products"}
          </div>
          </div>
      </div>
    </>
  );
}

