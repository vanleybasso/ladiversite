import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: string[];
  altText: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={altText}
          className="max-w-[90%] max-h-[90%] object-contain"
          style={{ aspectRatio: "1/1" }}
        />
      </div>

      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-black p-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
        onClick={goToPrevious}
      >
        <ChevronLeft size={24} strokeWidth={2.5} />
      </button>

      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black p-2 hover:scale-110 transition-transform duration-200 cursor-pointer"
        onClick={goToNext}
      >
        <ChevronRight size={24} strokeWidth={2.5} />
      </button>

      <div 
        className="absolute left-1/2 -translate-x-1/2 flex space-x-2"
        style={{ bottom: "5px" }} 
      >
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full cursor-pointer ${
              currentIndex === index ? "bg-black" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;