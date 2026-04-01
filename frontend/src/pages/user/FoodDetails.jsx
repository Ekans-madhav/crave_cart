import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/user/CartContext";
import { getProduct, getProducts } from "../../services/productService";
import { getImageUrl } from "../../services/api";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Card from "../../components/user/Card";
import { 
  ArrowLeft, Clock, ShoppingCart, Star, 
  ChevronRight, Heart, Share2, Info, Search
} from "lucide-react";
import { motion } from "framer-motion";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productRes, allProductsRes] = await Promise.all([
        getProduct(id),
        getProducts()
      ]);
      
      const currentFood = productRes.data;
      setFood(currentFood);
      
      const allProducts = Array.isArray(allProductsRes.data) ? allProductsRes.data : [];
      const currentCatId = currentFood.category?.id || currentFood.category;
      
      const related = allProducts
        .filter((item) => {
            const itemCatId = item.category?.id || item.category;
            return itemCatId === currentCatId && String(item.id) !== String(id);
        })
        .slice(0, 4);

      setRelatedFoods(related);
    } catch (err) {
      console.error("Error fetching food details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!food) return;
    for (let i = 0; i < quantity; i++) {
        addToCart(food);
    }
    navigate("/cart");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="h-[60vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-gray-100 border-t-[#fc8019] rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!food) return null;

  const imageSrc = getImageUrl(food.image);
  const isVeg = (food.menu_type?.name || food.type || "").toLowerCase().includes("veg");

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Search Bar Placeholder (Swiggy Style) */}
      <div className="max-w-4xl mx-auto px-4 pt-24 hidden md:block">
         <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
               <span className="hover:text-black cursor-pointer" onClick={() => navigate("/")}>Home</span>
               <ChevronRight className="w-3 h-3" />
               <span className="hover:text-black cursor-pointer" onClick={() => navigate("/menu")}>Food Online</span>
               <ChevronRight className="w-3 h-3" />
               <span className="text-black">{food.name}</span>
            </div>
         </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-12 items-start">
           
           {/* Info Section */}
           <div className="flex-1 space-y-6">
              <div className="space-y-2">
                 <div className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded border flex items-center justify-center p-0.5 ${isVeg ? 'border-green-600' : 'border-red-600'}`}>
                       <div className={`w-full h-full rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       {isVeg ? 'Pure Veg' : 'Non-Veg'}
                    </span>
                 </div>
                 <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
                    {food.name}
                 </h1>
                 <p className="text-gray-500 font-medium text-sm">
                    {food.category?.name || food.category}
                 </p>
              </div>

              {/* Price & Rating Row */}
              <div className="flex items-center gap-6">
                 <div className="text-2xl font-black text-gray-800">
                    ₹{food.price}
                 </div>
                 {food.rating > 0 && (
                   <div className="flex items-center gap-1.5 px-2 py-1 bg-green-600 text-white rounded text-xs font-black">
                      <Star className="w-3 h-3 fill-current" />
                      {parseFloat(food.rating).toFixed(1)}
                   </div>
                 )}
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Offers / Highlights */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1">
                    <div className="flex items-center gap-2 text-[#fc8019]">
                       <Clock className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Delivery Time</span>
                    </div>
                    <div className="text-sm font-black text-gray-800">30-45 MINS</div>
                 </div>
                 <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-1">
                    <div className="flex items-center gap-2 text-[#fc8019]">
                       <Info className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Portion Size</span>
                    </div>
                    <div className="text-sm font-black text-gray-800">Serves 1-2</div>
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                 <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">About This Item</h3>
                 <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-4 hover:line-clamp-none transition-all cursor-pointer">
                    {food.description || "Indulge in our chef-curated masterpiece. Prepared with the freshest ingredients and a blend of secret spices, this dish promises a journey of flavors in every bite."}
                 </p>
              </div>
           </div>

           {/* Image & Action Section */}
           <div className="w-full md:w-80 flex flex-col items-center gap-4">
              <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-2xl relative bg-gray-50">
                 {food.image?.toLowerCase().endsWith('.mp4') ? (
                   <video 
                     src={imageSrc} 
                     autoPlay 
                     loop 
                     muted 
                     playsInline 
                     className="w-full h-full object-cover" 
                   />
                 ) : (
                   <img src={imageSrc} className="w-full h-full object-cover" alt={food.name} />
                 )}
                 <div className="absolute inset-0 bg-black/5"></div>
              </div>
              
              {/* Swiggy Style Add Button */}
              <div className="w-32 -mt-8 relative z-10">
                 <div className="bg-white rounded-lg border border-gray-200 shadow-xl flex items-center overflow-hidden h-11">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex-1 h-full flex items-center justify-center font-black text-gray-400 hover:bg-gray-50 hover:text-[#fc8019] transition"
                    >
                       -
                    </button>
                    <span className="flex-1 h-full flex items-center justify-center font-black text-sm text-[#fc8019]">
                       {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex-1 h-full flex items-center justify-center font-black text-gray-400 hover:bg-gray-50 hover:text-[#fc8019] transition"
                    >
                       +
                    </button>
                 </div>
                 <button 
                   onClick={handleAddToCart}
                   className="w-full mt-4 bg-[#fc8019] text-white py-4 rounded-xl font-black text-xs tracking-[0.2em] uppercase shadow-lg shadow-orange-100 hover:bg-[#e67300] transition transform active:scale-95"
                 >
                    Add to Cart
                 </button>
              </div>
              
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2 bg-gray-50 px-3 py-1 rounded-full">Customizable</p>
           </div>
        </div>

        {/* More Items Section */}
        {relatedFoods.length > 0 && (
          <div className="mt-24 space-y-12">
             <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-black text-gray-800">Customers also ordered</h2>
                <div className="w-20 h-1 bg-[#fc8019] rounded-full"></div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {relatedFoods.map((item) => (
                   <Card key={item.id} item={item} />
                ))}
             </div>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FoodDetails;
