import _asset_1 from "../../assets/images/Logos/Logofood.png";
import React, { useState, useEffect } from "react";
import { useCart } from "../../context/user/CartContext";
import { useAuth } from "../../context/user/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Package, ShoppingCart, Menu, X, User, LogOut, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" }
  ];

  const activePath = location.pathname;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-2" 
            : "bg-transparent py-4"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group perspective-1000">
              <motion.div
                whileHover={{ rotateY: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="bg-gradient-to-tr from-orange-500 to-red-600 p-2 rounded-2xl shadow-lg ring-4 ring-orange-50"
              >
                <img src={_asset_1} className="w-8 h-8 object-contain brightness-110 contrast-110" alt="CraveCart" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent group-hover:from-orange-600 group-hover:to-red-600 transition-all duration-300">
                  CraveCart
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 -mt-1 group-hover:text-orange-400 transition-colors">Premium Food</span>
              </div>
            </Link>

            {/* Desktop Navigation - Center Pill */}
            <div className="hidden lg:flex items-center bg-gray-100/50 backdrop-blur-md px-2 py-1.5 rounded-2xl border border-white/50 shadow-sm">
                {navLinks.map((link) => (
                  <Link 
                    to={link.path} 
                    key={link.name}
                    className={`px-5 py-2 text-sm font-black transition-all rounded-xl relative ${
                      activePath === link.path ? "text-orange-600" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {activePath === link.path && (
                      <motion.div 
                        layoutId="navPill"
                        className="absolute inset-0 bg-white shadow-sm rounded-xl" 
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                ))}
            </div>

            {/* Icons Section */}
            <div className="flex items-center space-x-1 sm:space-x-4">
              {/* Persistent Cart for Mobile & Desktop */}
              <button 
                onClick={() => navigate("/cart")} 
                className="p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all relative group"
              >
                <ShoppingCart className="w-6 h-6 group-active:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 bg-gradient-to-tr from-orange-500 to-red-600 text-white text-[10px] rounded-full px-1.5 py-0.5 min-w-[1.2rem] h-5 flex items-center justify-center font-black ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Orders - Hidden on small mobile to avoid clutter */}
              <button 
                onClick={() => navigate("/orders")} 
                className="hidden sm:flex p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all group"
              >
                <Package className="w-6 h-6 group-active:scale-110 transition-transform" />
              </button>

              {/* Desktop Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-3 ml-2">
                {user ? (
                   <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => navigate("/profile")}
                        className="p-1 px-4 py-2 rounded-xl bg-gray-50 flex items-center gap-2 border border-gray-100 hover:border-orange-200 hover:bg-white transition-all group"
                      >
                         <div className="bg-orange-500 p-1 rounded-lg">
                            <User className="w-4 h-4 text-white" />
                         </div>
                         <span className="text-sm font-black text-gray-700">Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300"
                        title="Logout"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                   </div>
                ) : (
                  <div className="flex items-center space-x-2">

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate("/signup")}
                      className="px-7 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-black shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)] hover:shadow-[0_15px_25px_-5px_rgba(249,115,22,0.5)] transition-all"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-3 bg-gray-900 rounded-2xl text-white shadow-xl shadow-gray-200 active:scale-95 transition-all"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile App Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] shadow-2xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="p-8 pb-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-500 p-2 rounded-xl shadow-lg shadow-orange-200">
                    <img src={_asset_1} className="w-6 h-6 invert brightness-0" alt="" />
                  </div>
                  <span className="text-xl font-black text-gray-900 tracking-tight">CraveCart</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-gray-50 rounded-2xl text-gray-400 active:text-gray-900 active:bg-gray-100 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 px-8 py-2 overflow-y-auto space-y-8">
                {/* Profile Section on Mobile Sidebar */}
                {user && (
                    <button 
                      onClick={() => { navigate("/profile"); setIsOpen(false); }}
                      className="w-full text-left bg-orange-50 p-6 rounded-[2rem] flex items-center gap-4 hover:bg-orange-100 transition-colors"
                    >
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                            <User className="w-8 h-8" />
                        </div>
                        <div className="flex flex-col flex-1">
                            <span className="text-xs font-black text-orange-400 uppercase tracking-widest leading-none mb-1 text-left">Welcome back</span>
                            <span className="text-lg font-black text-gray-900 truncate max-w-[140px] text-left">{user.email.split('@')[0]}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-orange-300" />
                    </button>
                )}

                {/* Navigation Links */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2 mb-4">Explore Menu</p>
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between p-4 px-6 rounded-2xl transition-all group ${
                          activePath === link.path 
                          ? "bg-gray-900 text-white shadow-xl shadow-gray-200" 
                          : "bg-gray-50 text-gray-600 active:bg-orange-50 active:text-orange-600"
                      }`}
                    >
                      <span className="font-black text-lg">{link.name}</span>
                      <div className={`p-1 rounded-lg ${activePath === link.path ? "bg-white/20" : "bg-white"}`}>
                          <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Sidebar Footer */}
              <div className="p-8 pt-4 border-t border-gray-100 space-y-4 bg-white">
                <div className="grid grid-cols-2 gap-3 mb-2">
                    <button 
                        onClick={() => {navigate("/orders"); setIsOpen(false)}}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl active:bg-orange-100 group transition-colors"
                    >
                        <Package className="w-5 h-5 text-gray-700" />
                        <span className="text-xs font-black text-gray-600">My Orders</span>
                    </button>
                    <button 
                        onClick={() => {navigate("/cart"); setIsOpen(false)}}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl active:bg-orange-100 group transition-colors"
                    >
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5 text-gray-700" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
                        </div>
                        <span className="text-xs font-black text-gray-600">Checkout</span>
                    </button>
                </div>

                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full py-5 bg-red-50 text-red-600 rounded-3xl font-black flex items-center justify-center gap-3 active:scale-95 transition-all shadow-sm"
                  >
                    <LogOut className="w-5 h-5" /> Logout Account
                  </button>
                ) : (
                    <button
                      onClick={() => { navigate("/signup"); setIsOpen(false); }}
                      className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-3xl font-black shadow-xl shadow-orange-200 active:scale-95 transition-all"
                    >
                      Sign Up Free
                    </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}




