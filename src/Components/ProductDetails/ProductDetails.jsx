"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaStar } from "react-icons/fa6";
import { IoShareSocialOutline } from "react-icons/io5";
import ProductCard from "@/Common/ProductCard";
import DownloadAppModal from "@/Common/Modal/DownloadAppModal";
import ShareModal from "@/Common/Modal/ShareModal";
import useProductDetails from "@/hooks/ProductDetails/useProductDetails";
import { useSearchParams } from "next/navigation";

export default function ProductDetails({ initialData = null, productTitle: propProductTitle = null }) {
  const searchParams = useSearchParams();

  const productTitle = propProductTitle || searchParams?.get("title") || searchParams?.get("id");
  
  // Hardcoded params
  const params = { ratedPostsLimit: 4 };
  
  const { post: storePost, ratings: storeRatings, reviews: storeReviews, relatedPosts: storeRelatedPosts, loading: storeLoading, error } = useProductDetails(productTitle, {
    autoFetch: !initialData, // Only auto-fetch if we don't have initial data
    params: params,
  });

  // Use initial data if available, otherwise use store data
  const post = initialData?.post || storePost;
  const ratings = initialData?.ratings || storeRatings;
  const reviews = initialData?.reviews || storeReviews;
  const relatedPosts = initialData?.relatedPosts || storeRelatedPosts;
  
  // If we have initialData, ignore loading state (content is already available)
  const isLoading = initialData ? false : storeLoading;
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Update liked state when post changes
  useEffect(() => {
    if (post) {
      setLiked(post.wishlistFlag || false);
    }
  }, [post]);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ""}${imgPath}`;
  };

  // Get all product images
  const productImages = useMemo(() => {
    if (!post) return [];
    const images = [];
    
    // Add main image from c_post_image or postimg
    if (post.c_post_image?.url) {
      images.push(post.c_post_image.url);
    } else if (post.postimg) {
      images.push(getImageUrl(post.postimg));
    }
    
    // Add images from c_images array
    if (Array.isArray(post.c_images) && post.c_images.length > 0) {
      post.c_images.forEach((img) => {
        if (img?.url) images.push(img.url);
      });
    }
    
    // Add images from images array (fallback)
    if (Array.isArray(post.images) && post.images.length > 0 && images.length === 1) {
      post.images.forEach((img) => {
        const url = getImageUrl(img);
        if (url && !images.includes(url)) images.push(url);
      });
    }
    
    return images;
  }, [post]);

  const stars = useMemo(() => {
    const rating = post?.overallRating || ratings?.rating || 0;
    const full = Math.max(0, Math.min(5, Math.round(Number(rating))));
    return Array.from({ length: 5 }, (_, i) => i < full);
  }, [post?.overallRating, ratings?.rating]);

  // Helper function to get share data
  const getShareData = useMemo(() => {
    if (!post || !productTitle) return null;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://piggyalmari.smarttechnica.com";
    const productUrl = `${siteUrl}/post/${encodeURIComponent(productTitle)}/`;
    
    // Determine if product is for sell or rent
    const isSell = post.sell_prices > 0;
    const isRent = post.rent_prices > 0;
    const actionType = isSell && isRent ? "sell/rent" : isSell ? "sell" : "rent";
    
    const shareText = `I found this awesome product on ${actionType} with very affordable price on Piggy Almari app. hurryup now for your booking. ${productUrl}`;
    const shareTitle = post.title || "Check out this product";

    return { shareText, shareUrl: productUrl, shareTitle };
  }, [post, productTitle]);

  // Detect if device is mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(navigator.userAgent));
    }
  }, []);

  const handleShare = () => {
    if (!post || !productTitle || !getShareData) return;

    // On mobile devices, show the share modal with options
    if (isMobile) {
      setShowShareModal(true);
    } else {
      // On desktop, try Web Share API first, then show modal
      if (navigator.share) {
        navigator.share({
          title: getShareData.shareTitle,
          text: getShareData.shareText,
          url: getShareData.shareUrl,
        }).catch((error) => {
          // User cancelled or error occurred, show modal as fallback
          if (error.name !== "AbortError") {
            setShowShareModal(true);
          }
        });
      } else {
        // Show modal on desktop if Web Share API not available
        setShowShareModal(true);
      }
    }
  };


  const handleToggleLike = () => {
    setShowDownloadModal(true);
  };

  const handleBuyNow = () => {
    setShowDownloadModal(true);
  };

  const handleRentNow = () => {
    setShowDownloadModal(true);
  };

  const closeModal = () => {
    setShowDownloadModal(false);
  };

  const getProductHref = (relatedPost) => {
    if (!relatedPost?.title) return "#";
    return `/post/${encodeURIComponent(relatedPost.title)}/`;
  };

  // Get category/subcategory href for "View All" link
  const getCategoryHref = useMemo(() => {
    if (!post) return "#";

    // Check if subcategory exists (priority)
    if (post.subCategorys && Array.isArray(post.subCategorys) && post.subCategorys.length > 0) {
      const subCategory = post.subCategorys[0];
      const category = post.Categorys && Array.isArray(post.Categorys) && post.Categorys.length > 0 
        ? post.Categorys[0] 
        : null;
      
      if (subCategory?.subCategory) {
        return `/subcategory/${encodeURIComponent(subCategory.subCategory)}`;
      }
    }

    // Fallback to category if no subcategory
    if (post.Categorys && Array.isArray(post.Categorys) && post.Categorys.length > 0) {
      const category = post.Categorys[0];
      if (category?.Category) {
        return `/category/${encodeURIComponent(category.Category)}`;
      }
    }

    return "#";
  }, [post]);

  // Only show loading if we don't have initialData and no post data
  if (isLoading && !initialData && !post) {
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

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500 fs-md">
          {error || "Product not found"}
        </p>
        <Link href="/" className="text-theme-black underline mt-4 inline-block">
          Go back to home
        </Link>
      </div>
    );
  }

  const mainImage = productImages[selectedImageIndex] || productImages[0] || "";

  return (
    <div className="w-full bg-white">
      {/* Main Product Section */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="w-full">
            {/* Main Image */}
            <div className="relative w-full mb-4 rounded-lg overflow-hidden bg-gray-100" style={{ aspectRatio: '1/1' }}>
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={post.title || "Product image"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain"
                  priority
                />
              )}
            </div>
            
            {/* Thumbnail Images */}
            {productImages.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-theme-black"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Product image ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 33vw, 150px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full">
            <div className="flex items-start justify-between mb-4">
              <h1 className="fs-3xl font-bold text-theme-black flex-1 pr-4">
                {post.title || "Product"}
              </h1>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleLike}
                  aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  {liked ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-theme-black text-2xl" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoShareSocialOutline className="text-theme-black text-2xl" />
                </button>
              </div>
            </div>

            <p className="fs-md text-gray-700 mb-4">{post.details || ""}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {stars.map((isFull, i) => (
                  <FaStar
                    key={i}
                    className={`text-xl ${isFull ? "text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <span className="fs-sm text-gray-600">
                ({ratings?.rating || post.overallRating || 0})
              </span>
            </div>

            {/* Deposit */}
            {post.deposite && (
              <div className="mb-6">
                <p className="fs-lg font-semibold text-theme-black">
                  Deposit: ₹{post.deposite.toLocaleString()}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {(post.sell_prices > 0 || post.rent_prices > 0) && (
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-8">
                {post.sell_prices > 0 && (
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 bg-dark-gray text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <span className="fs-xs font-medium">Make It Yours!</span>
                    <span className="fs-lg">Buy Now : ₹{post.sell_prices.toLocaleString()}</span>
                  </button>
                )}
                {post.rent_prices > 0 && (
                  <button
                    type="button"
                    onClick={handleRentNow}
                    className="flex-1 bg-dark-gray text-white py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <span className="fs-xs font-medium">Wear the Moment!</span>
                    <span className="fs-lg">Rent Now : ₹{post.rent_prices.toLocaleString()}</span>
                  </button>
                )}
              </div>
            )}

            {/* Key Details Section */}
            <div className="mb-6">
              <h2 className="fs-xl font-bold text-theme-black mb-3">Key Details Section</h2>
              <div className="fs-md text-gray-700 space-y-2">
                <p>{post.details || "No additional details available."}</p>
                {post.color && <p><strong>Color:</strong> {post.color}</p>}
                {post.Categorys && post.Categorys.length > 0 && (
                  <p>
                    <strong>Category:</strong> {post.Categorys.map((c) => c.categoryName).join(", ")}
                  </p>
                )}
                {post.subCategorys && post.subCategorys.length > 0 && (
                  <p>
                    <strong>Sub Category:</strong> {post.subCategorys.map((sc) => sc.subCategoryName).join(", ")}
                  </p>
                )}
                {post.area && (
                  <p>
                    <strong>Location:</strong> {post.area}, {post.city}, {post.state}
                  </p>
                )}
              </div>
            </div>

            {/* Stylist Notes */}
            <div className="mb-6">
              <h2 className="fs-xl font-bold text-theme-black mb-3">Stylist Notes</h2>
              <p className="fs-md text-gray-700">
                This elegant piece is perfect for special occasions. Pair it with traditional
                jewelry and a classic hairstyle to complete the look. For makeup, opt for a
                natural glow with a bold lip color to complement the outfit's sophistication.
                Consider adding statement earrings and a matching clutch to enhance the overall
                ensemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="bg-white py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="fs-3xl font-bold text-theme-black">Related Product</h2>
              <Link
                href={getCategoryHref}
                className="fs-sm font-medium text-theme-black underline-offset-2 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedPosts.map((relatedPost) => (
                <ProductCard
                  key={relatedPost._id || relatedPost.title}
                  href={getProductHref(relatedPost)}
                  imageSrc={getImageUrl(relatedPost.postimg)}
                  imageAlt={relatedPost.title || "Related product"}
                  title={relatedPost.title || ""}
                  price={relatedPost.sell_prices || relatedPost.rent_prices || 0}
                  rating={relatedPost.overallRating || 0}
                  liked={relatedPost.wishlistFlag || relatedPost.likeFlag || false}
                  showDownloadModal={true}
                  onShowDownloadModal={() => setShowDownloadModal(true)}
                  onToggleLike={(next) => {
                    console.log("Toggle like for", relatedPost._id || relatedPost.title, next);
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={closeModal}
        title="Download App"
        description="Download our app to continue with your purchase"
      />

      {/* Share Modal */}
      {getShareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareText={getShareData.shareText}
          shareUrl={getShareData.shareUrl}
          shareTitle={getShareData.shareTitle}
        />
      )}
    </div>
  );
}

