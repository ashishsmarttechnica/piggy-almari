"use client";

import Link from "next/link";
import ProductCard from "@/Common/ProductCard";
import ProductCardSkeleton from "@/Common/ProductCardSkeleton";
import { useMemo, Fragment } from "react";
import useSection from "@/hooks/Section/useSection";
import { MdArrowForwardIos } from "react-icons/md";

export default function Section({
  section: sectionProp,
  sectionId = null,
  index = 0,
  loading: loadingProp = false,
  baseImageUrl = "",
  autoFetch = false,
}) {
  // If sectionId is provided, fetch the section data
  const { section: fetchedSection, loading: fetching } = useSection(sectionId, {
    autoFetch: autoFetch && !!sectionId,
    params: { page: 1, limit: 10, postLimit: 4 },
  });

  // Use fetched section if available, otherwise use prop
  const section = fetchedSection || sectionProp;
  const loading = loadingProp || fetching;

  // Background color logic based on image pattern:
  // Section 1 (index 0): light gray
  // Sections 2-3 (index 1-2): white background with inner div containing background image
  // Sections 4-5 (index 3-4): light gray
  // Sections 6-7 (index 5-6): dark gray
  const getBackgroundClass = (idx) => {
    if (idx === 0) return "bg-white text-theme-black"; // Section 1
    if (idx === 1 || idx === 2) return "bg-white text-white"; // Sections with background images in inner div
    if (idx === 3 || idx === 4) return "bg-white text-theme-black";
    if (idx === 5) return "bg-dark-gray text-white";
    return "bg-white text-theme-black";
  };
  const bgClass = getBackgroundClass(index);
  
  // Background image for inner div in sections 2 and 3 (index 1 and 2)
  const getInnerBackgroundImage = (idx) => {
    if (idx === 1) return { backgroundImage: "url('/Right.png')" };
    if (idx === 2) return { backgroundImage: "url('/Left.png')" };
    return {};
  };
  const innerBgImageStyle = getInnerBackgroundImage(index);

  const sortedPosts = useMemo(() => {
    if (!section?.posts || !Array.isArray(section.posts)) return [];
    return [...section.posts].sort((a, b) => {
      // Sort by likeCount descending, then by overallRating descending
      if (b.likeCount !== a.likeCount) return b.likeCount - a.likeCount;
      return (b.overallRating || 0) - (a.overallRating || 0);
    });
  }, [section?.posts]);

  // Limit products for sections 2 and 3 (index 2 and 3)
  const maxProducts = index === 1 || index === 2 ? 3 : undefined;
  const displayedPosts = maxProducts ? sortedPosts.slice(0, maxProducts) : sortedPosts;

  const getImageUrl = (imgPath) => {
    if (!imgPath) return "";
    if (imgPath.startsWith("http")) return imgPath;
    return `${baseImageUrl || process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${imgPath}`;
  };

  const getProductHref = (post) => {
    if (!post?.title) return "#";
    return `/post/${encodeURIComponent(post.title)}/`;
  };

  const getSectionHref = () => {
    if (!section?._id) return "#";
    return `/section?id=${section._id}`;
  };

  // Title alignment for sections 2 and 3
  const isSection2 = index === 1;
  const isSection3 = index === 2;

  return (
    <Fragment>
      <section
        className={`w-full py-8 md:py-12 ${bgClass} relative`}
      >
        {isSection2 || isSection3 ? (
          // Special layout for sections 2 and 3 - breaking out of container
          <div className={`relative w-full overflow-hidden min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px]`}>
            {/* Inner div with background image */}
            {innerBgImageStyle.backgroundImage && (
              <div
                className={`absolute inset-y-0 section-img ${
                  isSection2 
                    ? "right-0 w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[85%] rounded-l-[50px] sm:rounded-l-[30px] md:rounded-l-[50px] py-4 sm:py-6 md:py-8 lg:py-12" 
                    : "left-0 w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[85%] rounded-r-[50px] sm:rounded-r-[30px] md:rounded-r-[50px] py-4 sm:py-6 md:py-8 lg:py-12"
                }`}
                style={{
                  backgroundImage: innerBgImageStyle.backgroundImage,
                  backgroundSize: 'cover',
                  backgroundPosition: isSection2 ? 'right center' : 'left center',
                }}
              />
            )}
            
            {/* Content overlay */}
            <div className={`relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-12 ${
              isSection2 
                ? "flex justify-end" 
                : "flex justify-start"
            }`}>
              <div className={`w-full sm:w-[95%] md:w-[90%] lg:w-[85%] xl:w-[85%] ${
                isSection2 ? "text-left sm:text-right" : "text-left"
              }`}>
                <div
                  className={`flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-8 xl:items-center ${
                    isSection3 ? "xl:flex-row-reverse" : "xl:flex-row"
                  }`}
                >
                  {/* Title Section */}
                  <div className={`flex flex-col w-full xl:w-1/3 mb-4 sm:mb-6 lg:mb-0 ${
                    isSection2 
                      ? "items-start sm:items-end text-left sm:text-right " 
                      : "items-start text-left"
                  }`}>
                    {index === 0 ? (
                      <h1 className={`fs-3xl font-bold mb-2 md:mb-3 text-white`}>{section?.name || "Section"}</h1>
                    ) : (
                      <h2 className={`fs-3xl font-bold mb-2 md:mb-3 text-white`}>{section?.name || "Section"}</h2>
                    )}
                    <Link
                      href={getSectionHref()}
                      className="fs-sm font-medium text-white hover:text-gray-200 underline-offset-2 hover:underline transition-colors whitespace-nowrap"
                    >
                      <span className="flex items-center gap-1">View All <span className="text-white arrow-move-right"><MdArrowForwardIos /></span></span>
                    </Link>
                  </div>

                  {/* Product Cards Section - Staggered Up and Down Layout */}
                  <div className="flex-1 w-full xl:w-2/3">
                    {loading ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide lg:overflow-visible">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className={`transition-transform duration-300 ${
                              i % 2 === 0 
                                ? "transform translate-y-0" 
                                : "transform translate-y-12 sm:translate-y-8 lg:translate-y-12 xl:translate-y-46"
                            }`}
                          >
                            <ProductCardSkeleton />
                          </div>
                        ))}
                      </div>
                    ) : displayedPosts.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                        {displayedPosts.map((post, i) => (
                          <div
                            key={post._id || `${post.title}-${i}`}
                            className={`transition-transform duration-300 ${
                              i % 2 === 0 
                                ? "transform translate-y-0" 
                                : "transform translate-y-12 sm:translate-y-8 lg:translate-y-12 xl:translate-y-46"
                            }`}
                          >
                            <ProductCard
                              href={getProductHref(post)}
                              imageSrc={getImageUrl(post.postimg)}
                              imageAlt={post.title || "Product image"}
                              title={post.title || ""}
                              subtitle={post.details || ""}
                              CK_Description={post.details || ""}
                              price={post.sell_prices || post.rent_prices || 0}
                              rating={post.overallRating || 0}
                              liked={post.wishlistFlag || post.likeFlag || false}
                              showDownloadModal={true}
                              onShowDownloadModal={() => {
                                console.log("Show download modal");
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="fs-md text-white">No products available in this section.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Default layout for other sections - inside container
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="mb-6 flex items-center justify-between flex-col sm:flex-row">
              {index === 0 ? (
                <h1 className="fs-3xl font-bold">{section?.name || "Section"}</h1>
              ) : (
                <h2 className="fs-3xl font-bold">{section?.name || "Section"}</h2>
              )}
              <Link
                href={getSectionHref()}
                className="fs-sm font-medium underline-offset-2 hover:underline w-full sm:w-fit whitespace-nowrap"
              >
                <span className="flex items-center gap-1">View All <span className="arrow-move-right"><MdArrowForwardIos /></span></span>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ProductCardSkeleton key={i} /> 
                ))}
              </div>
            ) : displayedPosts.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {displayedPosts.map((post) => (
                  <ProductCard
                    key={post._id || `${post.title}-${index}`}
                    href={getProductHref(post)}
                    imageSrc={getImageUrl(post.postimg)}
                    imageAlt={post.title || "Product image"}
                    title={post.title || ""}
                    subtitle={post.details || ""}
                    price={post.sell_prices || post.rent_prices || 0}
                    rating={post.overallRating || 0}
                    liked={post.wishlistFlag || post.likeFlag || false}
                    showDownloadModal={true}
                    onShowDownloadModal={() => {
                      console.log("Show download modal");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="fs-md text-dark-gray">No products available in this section.</p>
              </div>
            )}
          </div>
        )}
      </section>
      {/* White spacer between sections with background images (index 1 and 2) */}
      {/* {index === 1 && (
        <div className="w-full h-8 md:h-12 bg-white"></div>
      )} */}
    </Fragment>
  );
}

