"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { volkhov } from "../lib/fonts";
import useDealsStore from "../store/useDealsStore";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const FALLBACK_IMAGE = "/images/D-img.jpg";

export default function FashionSlider() {
  const [startIndex, setStartIndex] = useState(0);
  const [filter, setFilter] = useState("all");
  const { products, loading, error, fetchDeals } = useDealsStore();
  const router = useRouter();

  const logos = [
    { src: "/logo/logo (1).png", alt: "Logo 1" },
    { src: "/logo/logo (2).png", alt: "Logo 2" },
    { src: "/logo/logo (3).png", alt: "Logo 3" },
    { src: "/logo/logo (4).png", alt: "Logo 4" },
    { src: "/logo/logo.png", alt: "Logo 5" },
  ];

  // Check if URL is a video
  const isVideoUrl = (url) => {
    if (!url) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".avi", ".mov", ".wmv", ".flv"];
    const urlLower = url.toLowerCase();
    return videoExtensions.some((ext) => urlLower.includes(ext));
  };

  // Validate media URL (image or video)
  const getMediaUrl = (card) => {
    const mediaUrl = card?.image?.url; // Fixed: Changed from card?.images?.url to match JSON structure

    if (!mediaUrl) {
      console.warn("Missing media URL for card:", card?.name);
      return { url: FALLBACK_IMAGE, isVideo: false };
    }

    const fullUrl = mediaUrl.startsWith("http") ? mediaUrl : `${process.env.NEXT_PUBLIC_API_URL}${mediaUrl}`;

    return {
      url: fullUrl,
      isVideo: isVideoUrl(fullUrl),
    };
  };

  // Media Component (Image or Video)
  const MediaComponent = ({ card, fill, className, sizes, priority, style }) => {
    const { url, isVideo } = getMediaUrl(card);

    if (isVideo) {
      return (
        <video
          src={url} // Fixed: Removed redundant fullUrl construction
          autoPlay
          muted
          loop
          playsInline
          className={className}
          style={
            fill
              ? {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  ...style,
                }
              : style
          }
          onError={() => {
            console.error("Video failed to load for card:", card.name); // Fixed: Changed card.title to card.name
            toast.error(`Failed to load video for ${card.name}`); // Fixed: Changed card.title to card.name
          }}
        />
      );
    }

    return (
      <Image
        src={url}
        alt={card.name || "Deal Image"} // Fixed: Changed card.title to card.name
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        style={style}
        onError={() => {
          console.error("Image failed to load for card:", card.name); // Fixed: Changed card.title to card.name
          toast.error(`Failed to load image for ${card.name}`); // Fixed: Changed card.title to card.name
        }}
      />
    );
  };

  // Fetch deals on mount
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const rotateRight = () => {
    if (!Array.isArray(products) || products.length === 0) return;
    setStartIndex((prev) => (prev + 1) % products.length);
  };

  const rotateLeft = () => {
    if (!Array.isArray(products) || products.length === 0) return;
    setStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getVisibleCards = () => {
    if (!Array.isArray(products) || products.length === 0) return [];
    let filteredProducts = products;
    if (filter !== "all") {
      filteredProducts = products
        .filter((card) => {
          const discountNum = parseInt(card.discount) || 0;
          return filter === "high" ? discountNum >= 50 : discountNum >= 30;
        })
        .sort((a, b) => parseInt(b.discount) - parseInt(a.discount));
    }
    const visible = [];
    for (let i = 0; i < Math.min(3, filteredProducts.length); i++) {
      visible.push(filteredProducts[(startIndex + i) % filteredProducts.length]);
    }
    return visible;
  };

  if (loading) {
    return <div className="text-center py-10">Loading deals...</div>;
  }

  if (error) {
    toast.error(`❌ Error: ${error}`);
  }

  if (!Array.isArray(products) || products.length === 0) {
    return <div className="text-center py-10">No deals available</div>;
  }

  const visibleCards = getVisibleCards();

  return (
    <div className="w-full componet2_bg py-6 sm:py-8 lg:py-12 px-2 sm:px-4 relative">
      <div className="max-w-[1281px] mx-auto relative">
        {/* Filter for Hottest Collections */}
        <div className="mb-4 flex justify-center">
          {/* Filter dropdown commented out */}
        </div>

        {/* Mobile and Tablet Layout */}
        <div className="block lg:hidden flex flex-col ">
          {/* Deal Card - Mobile/Tablet */}
          <div className="px-4 sm:p-6 mb-6  sm:mb-8 mr-auto max-w-md tablet-deals-card">
            <h2
              className={`text-[27px]  sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 ${volkhov.className}`}
            >
              Deals Of The Month
            </h2>
            <div className="space-y-1 mb-4 text-sm sm:text-base ">
              <p className="text-gray-600">Unbeatable prices, limited offer!</p>
              <p className="text-gray-600">Grab the hottest deals before theyre gone.</p>
              <p className="text-gray-600">Shop now and save big this month</p>
            </div>
            <Link href="/fashion">
              <button
                className="bg-yellow-400 cursor-pointer hover:bg-yellow-500 text-black text-[16px] font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow hover:shadow-md transform hover:scale-105"
                onClick={() => toast.success("Redirecting to deals page!")}
              >
                Buy Now
              </button>
            </Link>
          </div>

          {/* Cards Container - Mobile (3 cards) */}
          <div className="block sm:hidden w-full mb-6">
            <div className="flex gap-3 justify-center px-3">
              {visibleCards.map((card, index) => (
                <div
                  key={card._id || `${card.name}-${index}`} // Fixed: Changed card.id || ${card.title}-${index} to card._id || ${card.name}-${index}
                  onClick={() => router.push(`/fashion/${card._id}`)}
                  className="relative flex-shrink-0 overflow-hidden bg-[#f9f9f9] rounded-none hover:shadow-xl transition-transform duration-300 cursor-pointer"
                  style={{
                    width: index === 0 ? "160px" : "25vw",
                    maxWidth: index === 0 ? "110px" : "90px",
                    minWidth: index === 0 ? "90px" : "80px",
                    height: index === 0 ? "190px" : "165px",
                    aspectRatio: "3/4",
                  }}
                >
                  <MediaComponent
                    card={card}
                    fill={true}
                    className="object-cover"
                    sizes="(max-width: 640px) 30vw, 25vw"
                    priority={index === 0}
                  />
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-white p-1 shadow-md rounded">
                      <h3 className="text-[8px] text-gray-700">{`${card.name}`}</h3>
                      <h2 className="text-[9px] font-bold text-black">{card.discount}% OFF</h2>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cards Container - Tablet (3 cards) */}
          <div className="hidden sm:block lg:hidden w-full mb-6">
            <div className="flex gap-3 justify-center px-3">
              {visibleCards.map((card, index) => (
                <div
                  key={card._id || `${card.name}-${index}`} // Fixed: Changed card.id || ${card.title}-${index} to card._id || ${card.name}-${index}
                  onClick={() => router.push(`/fashion/${card._id}`)}
                  className="relative flex-shrink-0 overflow-hidden bg-[#f9f9f9] rounded-none hover:shadow-xl transition-transform duration-300 cursor-pointer"
                  style={{
                    width: index === 0 ? "28vw" : "24vw",
                    maxWidth: index === 0 ? "180px" : "160px",
                    minWidth: index === 0 ? "130px" : "110px",
                    height: index === 0 ? "340px" : "280px",
                    aspectRatio: "3/4",
                  }}
                >
                  <MediaComponent
                    card={card}
                    fill={true}
                    className="object-cover"
                    sizes="(max-width: 1024px) 28vw, 24vw"
                    priority={index === 0}
                  />
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-white p-2 shadow-md rounded">
                      <h3 className="text-sm font-bold text-gray-700">{`${card.name}`}</h3>
                      <h2 className="text-sm font-bold text-black">{card.discount}% OFF</h2>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons - Mobile/Tablet */}
          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={rotateLeft}
              className="bg-white text-black shadow-lg rounded-full w-6 h-6 sm:w-11 sm:h-11 hover:bg-gray-800 transition-colors flex items-center justify-center"
              aria-label="Previous"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={rotateRight}
              className="bg-white text-black shadow-lg rounded-full w-6 h-6 sm:w-11 sm:h-11 hover:bg-gray-800 transition-colors flex items-center justify-center"
              aria-label="Next"
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-start justify-between gap-3  overflow-visible desktop-container">
          {/* Deal Card - Desktop */}
          <div className="relative max-w-[444px] w-full h-[253px] mx-auto text-start deals-card">
            <div className="  mt-2 relative h-full overflow-hidden">
              <h2
                className={`text-[27px] font-bold text-gray-800 mb-2 ${volkhov.className}`}
              >
                Deals Of The Month
              </h2>
              <div className="space-y-1 mb-3 text-[14px]">
                <p className="text-gray-600">Unbeatable prices, limited offer!</p>
                <p className="text-gray-600">Grab the hottest deals before theyre gone.</p>
                <p className="text-gray-600">Shop now and save big this month</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Desktop */}
          <div className="absolute nav-button bottom-6 flex gap-2 z-20 nav-buttons">
            <button
              onClick={rotateLeft}
              className="bg-white text-black cursor-pointer text-Center h-8 w-8 shadow-xl rounded-full hover:shadow-xl hover: transition-colors text-xl"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 ml-1" />
            </button>
            <button
              onClick={rotateRight}
              className="bg-white text-black h-8 w-8 shadow-xl cursor-pointer rounded-full hover:shadow-xl transition-colors text-xl"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600 ml-1" />
            </button>
          </div>

          {/* Card Group - Desktop */}
          <div className="flex gap-3">
            {visibleCards.map((card, index) => (
              <div
                key={card._id || `${card.name}-${index}`} // Fixed: Changed card.id || ${card.title}-${index} to card._id || ${card.name}-${index}
                onClick={() => router.push(`/fashion/${card._id}`)}
                className={`relative cursor-pointer flex-shrink-0 overflow-hidden bg-[#f9f9f9] rounded-none hover:shadow-xl transition-transform duration-300 custom-card ${
                  index === 0 ? "primary" : "secondary"
                }`}
                style={{
                  width: index === 0 ? "360px" : "270px",
                  height: index === 0 ? "482px" : "420px",
                  aspectRatio: "3/4",
                  alignSelf: "flex-start",
                }}
              >
                <MediaComponent
                  card={card}
                  fill={true}
                  className="object-cover"
                  sizes="(min-width: 1024px) 24vw, 280px"
                  priority={index === 0}
                />
                {index === 0 && (
                  <div className="absolute bottom-4 left-4 bg-white p-3 shadow-md rounded">
                    <h3 className="text-sm font-bold text-gray-700">{`${card.name}`}</h3>
                    <h2 className="text-base font-bold text-black">{card.discount}% OFF</h2>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo Section */}
      <div className="max-w-[1281px] mx-auto p-8 md-mt-7 overflow-hidden pb-8">
        <div className="flex flex-nowrap items-center justify-between gap-4 w-full">
          {logos.map(({ src, alt }) => (
            <div
              key={alt}
              className="relative flex-shrink w-full max-w-[140px] h-[24px] sm:h-[28px] md:h-[33px]"
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 10vw, 140px"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}