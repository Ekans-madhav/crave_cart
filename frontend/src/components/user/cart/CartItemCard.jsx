import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../../services/api';

const CartItemCard = React.forwardRef(({ item, index, onRemove, onUpdateQuantity }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center relative group"
    >
      {/* Image */}
      <div className="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
        <img 
          src={getImageUrl(item.image)} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      </div>

      {/* Middle Section: Info */}
      <div className="flex-1 w-full flex flex-col justify-center text-center sm:text-left">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-gray-800 tracking-tight">{item.name}</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description || "A delicious meal crafted with care."}</p>
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <span className="text-lg font-black text-orange-600">₹{item.price}</span>
        </div>
      </div>

      {/* Right Section: Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t border-gray-100 sm:border-0">
        
        {/* Quantity Controls */}
        <div className="flex items-center bg-gray-50/80 rounded-2xl border border-orange-100 p-1.5 shadow-sm">
          <button
            onClick={() => onUpdateQuantity(index, -1)}
            disabled={item.quantity <= 0}
            className="w-9 h-9 flex items-center justify-center text-orange-600 bg-white hover:bg-orange-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm border border-orange-50 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            <Minus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
          
          <div className="w-12 text-center">
            <motion.span 
              key={item.quantity}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="block font-black text-gray-800 text-lg"
            >
              {item.quantity}
            </motion.span>
          </div>

          <button
            onClick={() => onUpdateQuantity(index, 1)}
            className="w-9 h-9 flex items-center justify-center text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all duration-300 shadow-md shadow-orange-100 group/btn"
          >
            <Plus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => onRemove(index)}
            className="flex-1 sm:flex-none p-3 sm:w-11 sm:h-11 flex items-center justify-center text-gray-400 bg-gray-50 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 rounded-2xl transition-all duration-300 shadow-sm group/trash"
            title="Remove Item"
          >
            <Trash2 className="w-5 h-5 group-hover/trash:scale-110 transition-transform" />
          </button>
        </div>

      </div>
    </motion.div>
  );
});
export default CartItemCard;
