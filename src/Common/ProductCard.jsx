"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa6";
import DownloadAppModal from "@/Common/Modal/DownloadAppModal";

export default function ProductCard({
  href = "#",
  imageSrc,
  imageAlt = "",
  title,
  subtitle,
  details,
  price,
  rating,
  maxRating = 5,
  liked: likedProp,
  onToggleLike,
  className = "",
  showDownloadModal = false,
  onShowDownloadModal,
}) {
  const [likedInternal, setLikedInternal] = useState(Boolean(likedProp));
  const [showModal, setShowModal] = useState(false);
  const liked = likedProp ?? likedInternal;

  function handleToggleLike(e) {
    e.preventDefault();
    if (showDownloadModal) {
      setShowModal(true);
      if (onShowDownloadModal) {
        onShowDownloadModal();
      }
    } else {
      if (typeof onToggleLike === "function") onToggleLike(!liked);
      else setLikedInternal((v) => !v);
    }
  }

  const closeModal = () => {
    setShowModal(false);
  };

  const stars = useMemo(() => {
    const full = Math.max(0, Math.min(maxRating, Math.round(Number(rating) || 0)));
    return Array.from({ length: maxRating }, (_, i) => i < full);
  }, [rating, maxRating]);

  return (
    <Link
      href={href}
      className={`relative block overflow-hidden bg-white shadow-[0_1px_6px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1 rounded-sm ${className}`}
      style={{ aspectRatio: '3/4' }}
    >
      {/* --- Image Section --- */}
      <div className="relative w-full h-full">
        {imageSrc && (
          <>
            <Image
              src={imageSrc}
              alt={imageAlt || title || "Product image"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 295px"
              className="object-cover"
              style={{ objectPosition: 'center' }}
            />

            {/* --- Heart Icon --- */}
            <button
              type="button"
              aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
              onClick={handleToggleLike}
              className="absolute right-2 top-2 md:right-3 md:top-3 z-10 grid h-6 w-6 md:h-7 md:w-7 place-items-center rounded-full bg-white/80 text-black shadow hover:bg-white transition-colors"
            >
              {liked ? <AiFillHeart className="text-red-500 text-sm md:text-base" /> : <AiOutlineHeart className="text-sm md:text-base" />}
            </button>
          </>
        )}

        {/* --- Text Content (bottom overlay) --- */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-2 md:px-4 md:py-4 text-center" style={{ backgroundColor: '#EAEAEA', opacity: '80%' }}>
          <p className="fs-md font-semibold text-black mb-0.5 md:mb-1 line-clamp-1 text-[#313131]">
            {title}
          </p>
          {details && (
            <p className="fs-xs leading-snug mb-1 md:mb-2 line-clamp-2 text-[#313131]">
              {details}
            </p>
          )}

          {price != null && (
            <p className="fs-xs font-semibold text-black mb-1 md:mb-2 text-[#313131]">₹{price}</p>
          )}

          {/* --- Star Rating --- */}
          <div className="flex items-center justify-center gap-0.5">
            {stars.map((isFull, i) => (
              <span key={i} className={`text-base ${isFull ? "text-black" : "text-gray-400"}`}>
                {isFull ? <FaStar className="text-[#313131] text-xl" /> : <FaStar className="text-[#313131] text-xl" />}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showModal}
        onClose={closeModal}
        title="Download App"
        description="Download our app to add items to your wishlist"
      />
    </Link>
  );
}
