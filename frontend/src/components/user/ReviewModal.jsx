import React, { useState } from "react";
import { Star, X, MessageSquare, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitReview } from "../../services/reviewService";

const ReviewModal = ({ isOpen, onClose, product, orderId }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitReview({
        product: product.id,
        rating: rating,
        feedback: feedback
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFeedback("");
        setRating(5);
      }, 2000);
    } catch (err) {
      console.error("Review Submit Error:", err);
      const backendError = err.response?.data?.error || "Database error: Please run migrations as advised.";
      alert(backendError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        {isSuccess ? (
          <div className="p-12 text-center py-20">
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 scale-125 animate-bounce">
                <Star className="fill-current w-10 h-10" />
             </div>
             <h2 className="text-2xl font-black text-gray-800 mb-2">Thank You!</h2>
             <p className="text-gray-500">Your feedback helps us serve you better.</p>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white relative">
              <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                 <X size={20} />
              </button>
              <div className="flex items-center gap-4 mb-2">
                 <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <Star className="w-6 h-6 fill-current" />
                 </div>
                 <h2 className="text-xl font-black tracking-tight">Rate your food</h2>
              </div>
              <p className="text-orange-100 text-sm">How was your experience with {product?.name}?</p>
            </div>

            <div className="p-8">
              {/* Star Rating */}
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform active:scale-90"
                  >
                    <Star
                      size={40}
                      className={`${
                        (hover || rating) >= star ? "text-orange-500 fill-current" : "text-gray-200"
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>

              {/* Feedback Input */}
              <div className="mb-6 relative">
                 <div className="absolute top-4 left-4 text-gray-400">
                    <MessageSquare size={18} />
                 </div>
                 <textarea
                   rows="4"
                   value={feedback}
                   onChange={(e) => setFeedback(e.target.value)}
                   placeholder="Share your thoughts about this food..."
                   className="w-full bg-gray-50 rounded-3xl p-4 pl-12 text-sm text-gray-700 border-none outline-none focus:ring-2 focus:ring-orange-500/20"
                 />
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-200 flex items-center justify-center gap-2 hover:shadow-orange-300 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewModal;
