import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { reviews as staticReviews } from "../../services/serviceData";
import { getReviews } from "../../services/reviewService";

const CustomerReviews = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRealReviews();
  }, []);

  const fetchRealReviews = async () => {
    try {
      const res = await getReviews();
      if (res.data && res.data.length > 0) {
        setData(res.data);
      } else {
        setData([]); // No reviews yet
      }
    } catch (err) {
      console.error("Reviews fetch error:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const StarIcon = ({ filled = true }) => (
    <svg
      className={`w-4 h-4 ${filled ? "text-yellow-400 fill-current" : "text-gray-200 fill-current"}`}
      viewBox="0 0 20 20"
    >
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );

  if (!isLoading && data.length === 0) return null;

  return (
    <section className="px-4 py-24 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-red-200/20 rounded-full blur-3xl"></div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl mb-3">
            What Our <span className="text-orange-500">Customers</span> Say
          </h2>
          <p className="text-sm text-gray-600">
            Real experiences from food lovers across India
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="relative overflow-hidden py-10 -mx-4 group">
            {/* Gradient Mask for seamless edges */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-orange-50 to-transparent z-20 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-red-50 to-transparent z-20 pointer-events-none"></div>

            <motion.div 
              className="flex gap-8 px-4"
              animate={{ x: [0, -1 * (data.length * 382)] }}
              transition={{ 
                duration: data.length * 8, 
                ease: "linear", 
                repeat: Infinity 
              }}
              // Pause animation on hover
              style={{ display: "flex", width: "fit-content" }}
            >
              {[...data, ...data, ...data].map((review, index) => (
                <div key={index} className="w-[350px] flex-shrink-0 relative mt-10">
                  
                  {/* Initial Circle */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-20 h-20 rounded-full bg-orange-50 border-4 border-white shadow-xl flex items-center justify-center text-orange-400 text-3xl font-black transform transition hover:scale-110">
                      {(review.name || "A").charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-white/80 backdrop-blur-md rounded-3xl pt-14 p-6 shadow-[0_15px_60px_rgba(0,0,0,0.05)] border border-white hover:border-orange-200 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col items-center">
                    
                    <h3 className="font-black text-gray-800 text-lg mb-1 mt-2">
                      {review.name || "Anonymous User"}
                    </h3>

                    <div className="flex gap-1 mb-5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <StarIcon key={s} filled={s <= (review.rating || 5)} />
                      ))}
                    </div>

                    <div className="relative">
                      <span className="absolute top-0 left-0 text-orange-100 text-5xl font-serif pointer-events-none leading-none -translate-x-2">"</span>
                      <p className="text-slate-600 text-[15px] leading-relaxed relative z-10 pt-2 line-clamp-4 italic font-medium">
                        {review.feedback || review.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerReviews;