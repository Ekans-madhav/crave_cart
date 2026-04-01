import React from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CartSummary({ subtotal, deliveryCharge, total, itemCount, onCheckout }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sm:p-8 sticky top-28">
      <h3 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
        Order Summary
      </h3>
      
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600 font-medium tracking-wide">
          <span>Total Items</span>
          <span className="font-bold text-gray-800 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{itemCount}</span>
        </div>
        <div className="flex justify-between text-gray-600 font-medium tracking-wide">
          <span>Subtotal</span>
          <span className="font-bold text-gray-800">₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-gray-600 font-medium tracking-wide">
          <span>Delivery Fee</span>
          <span className="font-bold text-gray-800">₹{deliveryCharge}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xl font-black text-gray-800 pt-5 border-t border-gray-100 mt-2 mb-8 bg-orange-50/50 -mx-6 sm:-mx-8 px-6 sm:px-8 pb-4 rounded-b-xl border-dashed">
        <span>Total Price</span>
        <span className="text-orange-600 text-3xl font-black drop-shadow-sm">₹{total}</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <button
          onClick={onCheckout}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-black text-lg rounded-xl shadow-[0_5px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          Proceed to Order <ArrowRight className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => navigate("/menu")}
          className="w-full py-4 border border-gray-200 hover:border-orange-300 bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5" /> Continue Ordering
        </button>
      </div>
    </div>
  );
}
