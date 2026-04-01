import React, { useRef, useEffect, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { getImageUrl } from "../../services/api";
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function PopularCategories() {
  const [categories, setCategories] = useState([]);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories()
      .then(res => {
        console.log("Categories data:", res.data);
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.log("Category Fetch Error:", err));
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -260,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 260,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="px-4 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-3">
            Popular <span className="text-orange-500">Categories</span>
          </h2>
          <p className="text-sm text-gray-600">
            Explore our wide range of cuisines
          </p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:shadow-xl md:-left-5"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition hover:shadow-xl md:-right-5"
          >
            <ArrowRight className="h-5 w-5 text-gray-600" />
          </button>

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2 py-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <div
                  key={category.id || index}
                  onClick={() => navigate(`/menu?category=${encodeURIComponent(category.name)}#dishes`)}
                  className="flex-none w-40 cursor-pointer rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                >
                  <div className="aspect-square overflow-hidden rounded-2xl bg-gray-50">
                    {category.image?.toLowerCase().endsWith('.mp4') ? (
                      <video
                        src={getImageUrl(category.image)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                      />
                    ) : (
                      <img
                        src={getImageUrl(category.image)}
                        alt={category.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110 cursor-pointer"
                        onError={(e) => {
                          e.target.style.backgroundColor = "#f3f4f6";
                        }}
                      />
                    )}
                  </div>

                  <div className="py-3 text-center">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
                <div className="flex w-full justify-center">
                    <p className="text-gray-400">No categories found.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
