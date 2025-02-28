import { useState, useEffect } from "react";
import HeroSection from "../components/sections/HeroSection";
import FeatureSection from "../components/sections/MainCards";

export default function LandingPage() {
  const [isLoadingImages, setIsLoadingImages] = useState(true);

  const imagesToLoad = [
    "/splash-image.jpg",
    "/images/aboutpadel-img.jpg",
    "/images/membership-img.jpg",
    "/images/students-img.jpg",
  ];

  useEffect(() => {
    let loadedCount = 0;

    function handleLoadOrError() {
      loadedCount++;
      if (loadedCount === imagesToLoad.length) {
        setIsLoadingImages(false);
      }
    }

    imagesToLoad.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = handleLoadOrError;
      img.onerror = handleLoadOrError;
    });
  }, []);

  if (isLoadingImages) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <main>
      <HeroSection />
      <FeatureSection />
    </main>
  );
}
