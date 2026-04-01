import { useEffect, useState } from "react";
import Header from "../../components/user/Header";
import AnimatedHeading from "../../components/user/AnimatedHeading";
import PopularCategories from "../../components/user/PopularCategories";
import CustomerReviews from "../../components/user/CustomerReviews";
import Footer from "../../components/user/Footer";
import { useCart } from "../../context/user/CartContext";
import { useAuth } from "../../context/user/AuthContext";
import { features, todaysSpecial } from "../../services/serviceData";
import { useNavigate } from "react-router-dom";
import { Utensils, Gift, Lock, UserPlus, Star } from "lucide-react";
import { getHeadlines, getSiteFeatures } from "../../services/headlineService";
import { subscribeNewsletter, getTodayOffer, getImageUrl } from "../../services/api";
import { getProducts } from "../../services/productService";

// Hero Images
import pizzaHero from "../../assets/images/hero/pizza.png";
import biryaniHero from "../../assets/images/hero/biryani.png";
import { motion } from "framer-motion";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);
  const [headlines, setHeadlines] = useState([]);
  const [offers, setOffers] = useState(null);
  const [isMember, setIsMember] = useState(true); // Default to true to avoid flash
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [latestProducts, setLatestProducts] = useState([]);
  const [copySuccess, setCopySuccess] = useState("");

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(""), 3000);
  };

  const fetchOffer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsMember(false); 
      setLoadingOffer(false);
      return;
    }
    setLoadingOffer(true);
    try {
      const res = await getTodayOffer();
      if (res.data?.membership_required) {
        setIsMember(false);
        setOffers(null);
      } else {
        setIsMember(true);
        setOffers(Array.isArray(res.data) ? res.data : [res.data]);
      }
    } catch (err) {
      console.error("Error fetching offer:", err);
      setIsMember(false);
    } finally {
      setLoadingOffer(false);
    }
  };

  const handleSubscribe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    try {
      await subscribeNewsletter();
      setSuccess(true);
      // Wait a'moment then refresh offers to show them unlocked
      setTimeout(() => {
        fetchOffer();
      }, 1500);
    } catch (err) {
      console.error("Subscription Error:", err);
      // If newsletter fails, maybe they still need to pay?
      navigate("/membership");
    }
  };

  useEffect(() => {
    setIsVisible(true);
    fetchOffer();
    fetchSpecialProducts();
  }, []);

  const fetchSpecialProducts = async () => {
    try {
      const res = await getProducts();
      const allProductsRes = Array.isArray(res.data) ? res.data : (res.data.results || res.data.value || []);
      // Take only the last 3 added foods (highest IDs) and reverse to show newest first
      const newestThree = allProductsRes.slice(-3).reverse();
      setLatestProducts(newestThree);
    } catch (err) {
      console.error("Error fetching special products:", err);
      setLatestProducts(todaysSpecial);
    }
  };

  const [siteFeatures, setSiteFeatures] = useState([]);

  useEffect(() => {
    getHeadlines()
      .then((res) => {
        setHeadlines(
          Array.isArray(res.data) ? res.data : res.data.headlines || [],
        );
      })
      .catch((err) => console.log("Axios Error:", err));

    // Fetch dynamic features
    getSiteFeatures()
      .then(res => {
        if (Array.isArray(res.data)) setSiteFeatures(res.data);
      })
      .catch(err => console.log("Features Fetch Error:", err));
  }, []);

  const handleReadyToTaste = (dish) => {
    addToCart(dish);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen">
      {isVisible ? <Header /> : null}
      
      {/* Hero section */}
      {/* Hero section with floating food assets */}
      <section
        className="relative min-h-screen flex items-center justify-center px-6 pt-10 bg-[#ffffff] overflow-hidden"
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-orange-100/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-red-100/30 rounded-full blur-3xl -translate-x-1/4 translate-y-1/4"></div>

        {/* Floating Pizza Asset - Top Left */}
        <motion.div 
          initial={{ x: -250, opacity: 0, rotate: -30 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute -left-16 lg:left-12 top-28 lg:top-52 w-20 lg:w-48 z-10 pointer-events-none select-none"
        >
          <motion.img 
            src={pizzaHero} 
            alt="Pizza" 
            draggable={false}
            animate={{ 
              y: [0, -12, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-auto object-contain mix-blend-multiply opacity-100 contrast-[1.05]"
          />
        </motion.div>

        {/* Floating Biryani Asset - Bottom Right */}
        <motion.div 
          initial={{ x: 250, opacity: 0, rotate: 30 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="absolute -right-16 lg:right-12 bottom-10 lg:bottom-24 w-20 lg:w-48 z-10 pointer-events-none select-none"
        >
          <motion.img 
            src={biryaniHero} 
            alt="Biryani" 
            draggable={false}
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, -4, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="w-full h-auto object-contain mix-blend-multiply opacity-100"
          />
        </motion.div>

        <div className="container mx-auto max-w-6xl relative z-20">
          <div className={`space-y-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="">
              <AnimatedHeading />
            </div>
            
            <div className="max-w-xl mx-auto space-y-4 text-center">
              {Array.isArray(headlines) && headlines.length > 0 ? (
                headlines.map(({ id, title }) => (
                  <motion.p 
                    key={id} 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg md:text-2xl text-gray-500 font-medium leading-relaxed"
                  >
                    {title}
                  </motion.p>
                ))
              ) : (
                <p className="text-center text-gray-400 font-medium">Authentic flavors delivered to your doorstep</p>
              )}
            </div>

            <div className="flex justify-center gap-6 pt-6 flex-wrap">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/menu")} 
                className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.5)] transition-all"
              >
                Order Now
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "rgba(249,115,22,0.05)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/menu")} 
                className="px-8 py-3.5 border-2 border-orange-500/30 text-orange-600 font-bold rounded-2xl transition-all hover:border-orange-500"
              >
                Explore Menu
              </motion.button>
            </div>
            
            {/* Added Stats Section - Zomato style touch */}
          </div>
        </div>

        {/* Improved Scroll Indicator */}
        {/* Zomato-style Trust Markers at absolute bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-12 flex flex-col items-center gap-4 pb-2">
          <div className="flex items-center gap-8 flex-wrap justify-center opacity-60 hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">100+ Dishes</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default md:border-x md:border-gray-200 px-4 md:px-8">
              <div className="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">4.9/5 Rated</span>
            </div>
            <div className="flex items-center gap-2 group cursor-default">
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">Best Offers</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 group cursor-pointer" 
               onClick={() => document.getElementById("arrow")?.scrollIntoView({ behavior: "smooth" })}>
            <div className="w-[1.2px] h-8 bg-gray-200 rounded-full relative overflow-hidden">
               <motion.div 
                 animate={{ y: [0, 32, 0] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us section */}
      <section id="arrow" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="container mx-auto max-w-6xl">
          <div className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 " : "opacity-0 "}`}>
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Why <span className="text-orange-500">Choose</span> Us</h2>
            <p className="text-gray-600 text-lg">We're committed to giving you the best experience</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(siteFeatures.length > 0 ? siteFeatures : features).map((feature, index) => (
              <div key={index} className={`group bg-white rounded-3xl p-8 shadow-lg transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-orange-200 ${isVisible ? "opacity-100 " : "opacity-0 "}`} style={{ transitionDelay: `${500 + index * 100}ms` }}>
                <div className="text-6xl mb-4 transform transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                   {feature.icon.length < 5 ? feature.icon : "✨"}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                <div className="mt-6 h-1 w-0 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Special Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-6"><span className="text-orange-500">Today's </span> Special</h2>
            <p className="text-gray-600 text-lg">“Chef’s special picks, made fresh today”</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 place-items-center">
            {latestProducts.map((dish) => (
              <div key={dish.id} className="group relative w-72 h-72 rounded-full bg-white/80 backdrop-blur-xl border-[6px] border-white shadow-[0_15px_40px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_rgba(249,115,22,0.35)]">
                {dish.image ? (
                  dish.image.toLowerCase().endsWith('.mp4') ? (
                    <video 
                      src={getImageUrl(dish.image)} 
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover rounded-full transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:scale-110 group-hover:opacity-30" 
                    />
                  ) : (
                    <img 
                      src={getImageUrl(dish.image)} 
                      alt={dish.name} 
                      className="absolute inset-0 w-full h-full object-cover rounded-full transition-all duration-500 ease-out group-hover:-translate-y-4 group-hover:scale-110 group-hover:opacity-30" 
                    />
                  )
                ) : (
                  <div className="absolute inset-0 bg-orange-100 flex items-center justify-center rounded-full group-hover:opacity-30">
                    <Utensils className="w-20 h-20 text-orange-400 opacity-30" />
                  </div>
                )}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 opacity-0 translate-y-6 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0">
                  <h3 className="text-xl font-black text-gray-900 mb-2">{dish.name}</h3>
                  <p className="text-sm font-medium text-gray-600 mb-3 line-clamp-2">{dish.description || "Authentic specialty dish prepared fresh today."}</p>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-orange-600 font-black text-2xl">₹{dish.price}</span>
                    <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-lg">
                      <Star className="w-3.5 h-3.5 text-orange-500 fill-current" />
                      <span className="text-sm font-bold text-orange-700">{dish.rating || 4.5}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleReadyToTaste(dish)}
                    className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-full shadow-lg transition-all active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Best Offers Section */}
      {((!loadingOffer && offers && offers.length > 0) || (!loadingOffer && !isMember && offers)) && (
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Today's <span className="text-orange-500">Best Offers</span>
            </h2>
            <p className="text-gray-500 font-medium max-w-2xl mx-auto text-lg italic">
              Exclusive coupons just for our valued members. Limited time only!
            </p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-8 justify-center">
              {isMember ? (
                offers && offers.map((offer, idx) => (
                  <motion.div 
                    key={offer.id || idx}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_35px_60px_-15px_rgba(249,115,22,0.3)] group overflow-hidden border border-white/10"
                  >
                    {/* Glassmorphism Background layer */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-50 group-hover:opacity-30 transition-opacity"></div>
                    
                    {/* Card Content */}
                    <div className="relative z-10 text-center flex flex-col h-full items-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-md shadow-inner">
                        <Gift className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      
                      <h3 className="text-2xl font-black mb-3 tracking-tight group-hover:scale-105 transition-transform">{offer.title}</h3>
                      <p className="text-sm mb-6 opacity-90 leading-relaxed font-bold min-h-[40px] italic">"{offer.description}"</p>
                      
                      <div className="mt-auto w-full space-y-6">
                        <div className="py-2 px-4 bg-yellow-400 text-red-700 font-black text-xl rounded-xl inline-block -rotate-2 transform hover:rotate-0 transition-transform shadow-lg">
                          {offer.discount} OFF
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <div className="relative flex items-center bg-white/95 text-orange-600 font-black px-6 py-3 rounded-2xl text-lg shadow-xl border-2 border-dashed border-orange-500/50 group/code cursor-pointer w-full justify-between overflow-hidden">
                            <span className="text-xs uppercase text-gray-400 font-bold block mb-1">Copy Code:</span>
                            {offer.coupon_code}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleCopy(offer.coupon_code); }}
                              className="ml-3 p-2 bg-orange-50 hover:bg-orange-600 hover:text-white rounded-xl transition-all group-hover:scale-110"
                              title="Copy to clipboard"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                            </button>
                            {copySuccess === offer.coupon_code && (
                              <motion.span 
                                initial={{ opacity: 0, scale: 0.5, y: -20 }} 
                                animate={{ opacity: 1, scale: 1, y: 0 }} 
                                className="absolute -top-12 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl border border-white/20 whitespace-nowrap"
                              >
                                ✅ COPIED!
                              </motion.span>
                            )}
                          </div>
                          <p className="text-[10px] text-white/50 font-black uppercase tracking-tighter italic">Tap to copy and save big</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="w-full max-w-2xl bg-white rounded-3xl p-16 shadow-2xl border-2 border-dashed border-orange-300 text-center group hover:border-orange-500 transition-all duration-700 mx-auto">
                   <div className="mb-8 relative">
                      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                        <Lock className="w-12 h-12 text-orange-200 group-hover:text-white transition-colors" />
                      </div>
                   </div>
                   <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">VIP Offers Locked! 🔒</h3>
                   <p className="text-gray-500 text-lg mb-10 font-medium">Join our community newsletter to unlock 3 mysterious coupons and hidden recipes.</p>
                   <button 
                    onClick={() => {
                        const target = document.getElementById('newsletter-section');
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black rounded-full hover:scale-105 transition-all shadow-xl hover:shadow-orange-500/40 transform active:scale-95"
                   >
                     Unlock All 3 Offers Now
                   </button>
                </div>
              )}
          </div>
        </div>
      </section>
      )}

      {/* Popular Categories Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <PopularCategories />
      </section>

      {/* Customer Reviews Section */}
      <section>
        <CustomerReviews />
      </section>

      {/* Newsletter Section */}
      <section id="newsletter-section" className="py-20 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Subscribe to
            <span className="text-orange-500"> Our Newsletter </span>
          </h2>

          <p className="text-lg text-gray-500">
            {success 
              ? "Thank you for subscribing! Check out your exclusive offers above." 
              : "Click the button below to subscribe and unlock exclusive offers and special discounts."
            }
          </p>

          {!success && !isMember && (
            <div className="flex justify-center">
              <button
                onClick={handleSubscribe}
                className="px-12 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-full hover:scale-105 transition shadow-xl"
              >
                Join Newsletter & Unlock Offers
              </button>
            </div>
          )}
          
          {(success || isMember) && (
            <div className="text-orange-600 font-bold text-xl py-4 flex items-center justify-center gap-2">
              <Gift className="w-6 h-6 " /> You are a Subscribed Member!
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <section>
        <Footer />
      </section>
    </div>
  );
}
