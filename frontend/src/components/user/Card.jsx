import { getImageUrl } from "../../services/api";
import { useCart } from "../../context/user/CartContext";
import { useNavigate } from "react-router-dom";
import { Utensils } from "lucide-react";

const Card = ({ item, offerText }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleReadyToTaste = () => {
    addToCart(item);
    navigate("/cart");
  };

  const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
      {/* Image */}
      <div 
        className="h-60 overflow-hidden cursor-pointer bg-gray-100"
        onClick={() => navigate(`/food/${item.id || item._id}`)}
      >
        {item.image?.toLowerCase().endsWith('.mp4') ? (
          <video
            src={getImageUrl(item.image)}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}
      </div>

      {/* Veg / Non-Veg Badge */}
      <div
        className={`absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-semibold shadow-sm backdrop-blur-md bg-white/90 ${
          item.menu_type?.name === "VEG" ? "text-green-600" : "text-red-600"
        }`}
      >
        {item.menu_type?.name === "VEG" ? "🟢 Veg" : "🔴 Non-Veg"}
      </div>

            {/* Offer Badge */}
            {offerText && (
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold shadow-md uppercase tracking-wide flex items-center gap-1">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {offerText}
              </div>
            )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

      {/* Content */}
      <div className="absolute bottom-0 p-4 text-white w-full">
        <h3 
          className="text-lg font-bold cursor-pointer hover:text-orange-300 transition-colors inline-block leading-tight"
          onClick={() => navigate(`/food/${item.id || item._id}`)}
        >
          {item.name}
        </h3>

        <p className="text-xs opacity-80 mt-0.5">{item.category?.name || item.category}</p>

        {/* Rating */}
        {item.rating > 0 && (
          <div className="flex items-center mt-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <span className="ml-1.5 text-xs text-gray-200">({parseFloat(item.rating).toFixed(1)})</span>
          </div>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">
              ₹{item.price}
            </span>
            {offerText && (
              <span className="text-xs text-gray-400 line-through">
                ₹{item.price + 50}
              </span>
            )}
          </div>

          <button
            onClick={handleReadyToTaste}
            className="flex items-center justify-center gap-1.5 bg-white/20 hover:bg-white hover:text-orange-600 backdrop-blur-sm border border-white/30 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300"
          >
            <Utensils className="w-3.5 h-3.5" /> ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
