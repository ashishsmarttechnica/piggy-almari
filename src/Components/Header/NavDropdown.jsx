"use client";

import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function NavDropdown({ label, items, getHref, categoryHref, loading = false }) {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const safeItems = useMemo(() => (Array.isArray(items) ? items : []), [items]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function updatePosition() {
    const el = anchorRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const left = Math.min(
      Math.max(8, rect.left),
      Math.max(8, window.innerWidth - 280) // keep inside viewport for ~min-w-56
    );
    setPosition({ top: rect.bottom + window.scrollY, left: left + window.scrollX, width: rect.width });
  }

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onScroll = () => updatePosition();
    const onResize = () => updatePosition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  if (loading) {
    return (
      <span
        ref={anchorRef}
        className="inline-flex h-7 w-[140px] items-center rounded-md bg-dark-gray/20 animate-pulse"
        aria-busy="true"
      />
    );
  }

  if (safeItems.length === 0) {
    return (
      <div ref={anchorRef}>
        {categoryHref ? (
          <Link
            href={categoryHref}
            className="fs-sm font-medium inline-flex items-center text-dark-gray hover:text-black md:h-12.5"
          >
            {label}
          </Link>
        ) : (
          <span className="fs-sm font-medium inline-flex items-center text-dark-gray hover:text-black md:h-12.5">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    <div 
      ref={anchorRef} 
      className="relative inline-block text-left"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {categoryHref ? (
        <Link
          href={categoryHref}
          className="fs-sm font-medium cursor-pointer inline-flex items-center gap-2 text-dark-gray hover:text-black md:h-12.5"
          onClick={() => setOpen(false)}
        >
          {label}
          {safeItems.length > 0 && (
            <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
              <IoIosArrowDown />
            </span>
          )}
        </Link>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(e) => {
            e.preventDefault();
            setOpen((v) => !v);
          }}
          className="fs-sm font-medium cursor-pointer inline-flex items-center gap-2 text-dark-gray hover:text-black md:h-12.5"
        >
          {label}
          {safeItems.length > 0 && (
            <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
              <IoIosArrowDown />
            </span>
          )}
        </button>
      )}
      {/* {categoryHref ? (
        <Link
          href={categoryHref}
          className="fs-sm font-medium cursor-pointer inline-flex items-center gap-2 text-black md:h-12.5 text-dark-gray hover:text-black"
        >
          {label}
          {safeItems.length > 0 && (
            <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
              <IoIosArrowDown />
            </span>
          )}
        </Link>
      ) : (
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="fs-sm font-medium cursor-pointer inline-flex items-center gap-2 text-black md:h-12.5 text-dark-gray hover:text-black"
        >
          {label}
          {safeItems.length > 0 && (
            <span className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}>
              <IoIosArrowDown />
            </span>
          )}
        </button>
      )} */}
      {open &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            role="menu"
            className="min-w-56 max-w-[90vw] fixed z-60 rounded-md bg-light-gray text-dark-gray shadow-lg ring-1 ring-black/5 "
            style={{ top: position.top, left: position.left }}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <ul className="py-2 max-h-96 overflow-y-auto">
              {categoryHref && (
                <li>
                  <Link
                    href={categoryHref}
                    className="block px-4 py-2 fs-sm font-semibold text-theme-black hover:bg-dark-gray/10 border-b border-dark-gray/10"
                    onClick={() => setOpen(false)}
                  >
                    View All {label}
                  </Link>
                </li>
              )}
              {safeItems.map((item) => (
                <li key={item._id}>
                  <Link
                    href={getHref ? getHref(item) : "#"}
                    className="block px-4 py-2 fs-sm text-black hover:bg-dark-gray/10"
                    onClick={() => setOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )}
    </div>
  );
}
