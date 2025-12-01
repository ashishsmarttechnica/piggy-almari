"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Helper function to convert hex to rgba with opacity
const hexToRgba = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const slides = [
  {
    src: "/Banner02.png",
    overlayImage: "/S-2.png",
    alt: "Buy banner",
    label: "BUY",
    description: (
      <>
        Buy Pre-loved Outfits
        <br />
        of a Minimum of 50% Savings
      </>
    ),
    position: "center",
    bgColor: "#F5F5DC", // Light beige for BUY
  },
  {
    src: "/Banner01.png",
    overlayImage: "/S-1.png",
    alt: "Rent banner",
    label: "RENT",
    description: (
      <>
        Rent Occasional Wear
        <br />
        Online or at our Stores
      </>
    ),
    position: "left",
    aspectRatio: "13/2",
    bgColor: "#F5F5DC", // Light beige for RENT
    
  },
  {
    src: "/Banner03.png",
    overlayImage: "/S-3.png",
    alt: "Sell banner",
    label: "SELL",
    description: (
      <>
        Earn Money by Selling
        <br />
        Your Occasional Outfits With Us
      </>
    ),
    position: "right",
    bgColor: "#A46E40", // Brownish-orange for SELL
  },
];

export default function Hero() {
  return (
    <section className="w-full bg-light-gray">
      <div className="px-0">
        <Swiper
          modules={[ A11y]}
          spaceBetween={16}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="w-full overflow-hidden"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <div className="relative w-full" style={{ aspectRatio: "16/6" }}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover"
                />
                <div
                  className={`pointer-events-none absolute inset-0 flex items-center z-10 ${
                    s.position === "left"
                      ? "absolute left-[26%]"
                      : s.position === "right"
                      ? "justify-end right-[4%]"
                      : s.position === "center"
                      ? "justify-center"
                      : s.position === "center1"
                      ? "justify-start pl-8 md:pl-12"
                      : "justify-center"

                  }`}
                >
                  <div 
                    className="rounded md:rounded-lg px-4 py-6 md:px-6 md:py-12 text-center hero-text relative overflow-hidden max-w-[92vw] sm:max-w-[80vw] md:max-w-[60vw]"
                    style={{
                      backgroundColor: hexToRgba(s.bgColor, 0.4)
                    }}
                  >
                    {/* Overlay Image (S-1, S-2, S-3) inside text div */}
                    {s.overlayImage && (
                      <div className="absolute inset-0 z-0">
                        <Image
                          src={s.overlayImage}
                          alt={`${s.label} overlay`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    )}
                    
                    <div className="relative z-10">
                      <h2 className="text-base md:text-5xl font-semibold text-theme-black tracking-wide mb-4 md:mb-8">
                        {s.label}
                      </h2>
                      <p className="text-[10px] md:text-lg text-dark-gray mt-1 whitespace-normal leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
