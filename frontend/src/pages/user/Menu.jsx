import _asset_1 from "../../assets/images/Menu foods/menu top.jpeg";
import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Leaf, Flame, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import Card from "../../components/user/Card";
import { useCart } from "../../context/user/CartContext";
import { getCategories, getMenuTypes, getSortOptions } from "../../services/categoryService";
import { getProducts } from "../../services/productService";

import { useLocation, useSearchParams } from "react-router-dom";

const Menu = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const initialCategory = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [showmsg, setShowmsg] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [menuTypes, setMenuTypes] = useState([]);
  const [sortOptions, setSortOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
        const [prodRes, catRes, typeRes, sortRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getMenuTypes(),
          getSortOptions()
        ]);
        const allProducts = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.results || prodRes.data.value || []);
        setMenuItems(allProducts);
        setCategories(catRes.data);
        setMenuTypes(typeRes.data);
        setSortOptions(sortRes.data);
    } catch (err) {
        console.error("Menu Load Error:", err);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      setTimeout(() => {
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && cat !== selectedCategory) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const StarIcon = () => (
    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
    </svg>
  );

  const filteredAndSortedItems = menuItems
    .filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category?.name === selectedCategory;
      const matchesType = selectedType === "all" || item.menu_type?.name === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      const ratingA = parseFloat(a.rating) || 0;
      const ratingB = parseFloat(b.rating) || 0;

      if (sortBy === "price-low" || sortBy === "low-price") return priceA - priceB;
      if (sortBy === "price-high" || sortBy === "high-price") return priceB - priceA;
      if (sortBy === "rating") return ratingB - ratingA;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-50 to-red-50">
      <Header /> {/* nav bar */}
      {/* Menu Hero Section */}
      <section className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={_asset_1}
            alt="Menu Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Our <span className="text-orange-500">Menu</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Delicious food delivered to your doorstep
            </p>
            <div className="flex justify-center gap-4">
              <span className="bg-orange-500 px-6 py-2 rounded-full">
                25+ Items
              </span>
              <span className="bg-red-500 px-6 py-2 rounded-full">
                Fast Delivery
              </span>
            </div>
          </div>
        </div>
      </section>
      {/* Search & Filter Section */}
      <section className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-xl border-b border-orange-100 shadow-lg transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-4">
          <div className="flex flex-col space-y-6 md:space-y-4">
            {/* Top row: Search and Sort Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Modern Search Field */}
              <div className="relative flex-1 max-w-lg group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" size={18} />
                <input
                  type="text"
                  placeholder="What are you craving today?..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-200 transition-all duration-300 text-gray-700 placeholder-gray-400 shadow-inner group-hover:shadow transition-shadow"
                />
              </div>

              {/* Filtering & Sorting Pill-style Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Diet Type Switcher */}
                <div className="flex bg-gray-100 p-1 rounded-xl shadow-inner border border-gray-200/50">
                  <button
                    onClick={() => setSelectedType("all")}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                      selectedType === "all" ? "bg-white text-orange-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    All
                  </button>
                  {menuTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.name)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 ${
                        selectedType === type.name ? "bg-white text-orange-600 shadow-md" : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {type.name === 'VEG' && <Leaf size={12} className={selectedType === type.name ? "text-green-500" : ""} />}
                      {type.name === 'NONVEG' && <Flame size={12} className={selectedType === type.name ? "text-red-500" : ""} />}
                      {type.name === 'VEG' ? 'Veg' : type.name === 'NONVEG' ? 'Non-Veg' : type.name}
                    </button>
                  ))}
                </div>

                {/* Sort dropdown with custom arrow */}
                <div className="relative group">
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:rotate-180 transition-transform duration-300" size={16} />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:ring-4 focus:ring-orange-500/10 focus:bg-white focus:border-orange-200 text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-300 shadow-sm"
                  >
                    <option value="default">Sort: Default</option>
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Bottom Row: Category Scrolling Chips */}
            <div className="relative -mx-4 px-4">
              <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide py-2">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory("all")}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 flex items-center gap-2 border ${
                    selectedCategory === "all"
                      ? "bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-200"
                      : "bg-white text-gray-600 border-gray-100 hover:border-orange-200 hover:bg-orange-50 shadow-sm"
                  }`}
                >
                  <Sparkles size={16} className={selectedCategory === "all" ? "text-orange-200" : "text-orange-400"} />
                  All Categories
                </motion.button>
                {categories.map((cat, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 border ${
                      selectedCategory === cat.name
                        ? "bg-orange-600 text-white border-orange-500 shadow-lg shadow-orange-200"
                        : "bg-white text-gray-600 border-gray-100 hover:border-orange-200 hover:bg-orange-50 shadow-sm"
                    }`}
                  >
                    {cat.name}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dishes Listing Section */}
      <section id="dishes" className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              Explore Culinary Gems
            </h2>
            <p className="text-gray-500 font-medium">Found {filteredAndSortedItems.length} extraordinary dishes for you</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {isLoading ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center gap-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
              <p className="text-orange-500 font-semibold animate-pulse">Loading flavors...</p>
            </div>
          ) : filteredAndSortedItems.length > 0 ? (
            <AnimatePresence mode='popLayout'>
              {filteredAndSortedItems.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id}
                >
                  <Card item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="col-span-full py-32 text-center rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="text-gray-300" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">No matches found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </section>

      {/* Toast Notification */}
      {showmsg && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-pulse">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{addedItemName} added to cart!</span>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Menu;
