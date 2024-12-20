import React, { useState } from "react";
import { useSwipeable } from "react-swipeable";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const SimpleCarousel = ({ images }) => {
  // Add a fallback for images
  const validImages = Array.isArray(images) && images.length > 0 ? images : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Update nextSlide and prevSlide to handle empty images
  const nextSlide = () => {
    if (validImages.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % validImages.length);
    }
  };

  const prevSlide = () => {
    if (validImages.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length
      );
    }
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventDefaultTouchmoveEvent: true,
    trackTouch: true,
    trackMouse: true,
    disabled: isZoomed,
  });

  return (
    <>
      <div
        {...handlers}
        className={`relative flex-1 rounded-xl lg:h-full overflow-hidden shadow-lg mb-4 lg:mb-0 ${
          isZoomed
            ? "fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
            : ""
        }`}
        onClick={toggleZoom}
      >
        {validImages.length > 0 ? ( // Check if there are valid images
          <img
            src={validImages[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className={`w-full h-full object-cover object-center transition-all duration-300 ${
              isZoomed ? "p-0 cursor-zoom-out" : "cursor-zoom-in"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No images available
          </div> // Fallback UI
        )}
        {!isZoomed && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300 inline-flex md:inline-flex"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300 inline-flex md:inline-flex"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {isZoomed && (
        <div
          {...handlers}
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
          onClick={toggleZoom}
        >
          <img
            src={validImages[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="max-w-full max-h-full"
          />
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-300"
            aria-label="Close"
            onClick={toggleZoom}
          >
            <X size={32} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors duration-300"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
};

export default SimpleCarousel;
