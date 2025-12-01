"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { IoClose, IoChevronDown } from "react-icons/io5";

export default function NavSidebar({ open, onClose, categories = [], loading = false }) {
  const orderedCategories = useMemo(() => {
    return (categories || []).slice().sort((a, b) => (a?.index || 0) - (b?.index || 0));
  }, [categories]);

  const [expanded, setExpanded] = useState(() => new Set());

  function toggle(catId) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <aside className="absolute left-0 top-0 h-full w-80 max-w-[86vw] bg-white text-theme-black shadow-xl">
        <div className="flex items-center justify-between px-4 h-12.5 border-b border-dark-gray/15">
          <span className="fs-sm font-medium">Menu</span>
          <button type="button" className="p-2 text-dark-gray hover:text-black cursor-pointer" onClick={onClose} aria-label="Close menu">
            <IoClose size={18} />
          </button>
        </div>

        <div className="px-2 py-2 overflow-y-auto h-[calc(100%-3rem)]">
          <Link href="/" className="block px-3 py-2 rounded hover:bg-light-gray/70 fs-sm cursor-pointer" onClick={onClose}>
            Home
          </Link>

          {loading && (
            <div className="mt-2 space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-8 rounded-md bg-dark-gray/15 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && orderedCategories.map((cat) => {
            const sub = (cat.subCategorys || []).slice().sort((a, b) => (a?.index || 0) - (b?.index || 0));
            const isOpen = expanded.has(cat._id);
            const hasSubcategories = sub.length > 0;
            
            return (
              <div key={cat._id} className="mt-1">
                {hasSubcategories ? (
                  <>
                    <div className="flex items-center">
                      <Link
                        href={`/category/${encodeURIComponent(cat._id)}`}
                        className="flex-1 px-3 py-2 fs-sm font-medium text-dark-gray hover:text-black hover:bg-light-gray/70 rounded cursor-pointer"
                        onClick={onClose}
                      >
                        {cat.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggle(cat._id)}
                        className="px-2 py-2 text-dark-gray hover:text-black cursor-pointer"
                        aria-expanded={isOpen}
                        aria-label={`Toggle ${cat.name} subcategories`}
                      >
                        <IoChevronDown className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                    {isOpen && (
                      <ul className="mt-1">
                        <li>
                          <Link
                            href={`/category/${encodeURIComponent(cat._id)}`}
                            className="block px-6 py-2 fs-sm font-semibold text-theme-black hover:text-black hover:bg-light-gray/70 cursor-pointer border-b border-dark-gray/10"
                            onClick={onClose}
                          >
                            View All {cat.name}
                          </Link>
                        </li>
                        {sub.map((s) => (
                          <li key={s._id}>
                            <Link
                              href={`/subcategory/${encodeURIComponent(s._id)}`}
                              className="block px-6 py-2 fs-sm text-dark-gray hover:text-black hover:bg-light-gray/70 cursor-pointer"
                              onClick={onClose}
                            >
                              {s.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={`/category/${encodeURIComponent(cat._id)}`}
                    className="block w-full px-3 py-2 fs-sm font-medium text-dark-gray hover:text-black hover:bg-light-gray/70 rounded cursor-pointer"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}


