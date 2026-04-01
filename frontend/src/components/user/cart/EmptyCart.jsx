import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const EmptyCart = React.forwardRef((props, ref) => {
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mt-8"
    >
      <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <ShoppingCart className="w-14 h-14 text-orange-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 tracking-tight">Your cart is empty</h3>
      <p className="text-gray-500 mt-2 text-center max-w-sm font-medium">
        Add some delicious items to get started!
      </p>
      <Link
        to="/menu"
        className="mt-8 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-orange-200 transform hover:-translate-y-1 transition-all duration-300"
      >
        Browse Menu
      </Link>
    </motion.div>
  );
});

export default EmptyCart;
