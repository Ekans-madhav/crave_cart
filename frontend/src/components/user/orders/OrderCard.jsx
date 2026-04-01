import React, { useState, forwardRef } from "react";
import { ChevronDown, ChevronUp, Clock, PackageCheck, Utensils, Receipt, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderTimeline from "./OrderTimeline";
import DeliveryInfo from "./DeliveryInfo";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../../context/user/CartContext";

const OrderCard = forwardRef(({ order, onDeletePrompt, onRate }, ref) => {
  const [isTracking, setIsTracking] = useState(false);
  const navigate = useNavigate();
  const { cancelOrder } = useCart();
  const [cancelling, setCancelling] = useState(false);

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? It's freshly placed!")) return;
    setCancelling(true);
    try {
      await cancelOrder(order.id);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel order.");
    } finally {
      setCancelling(false);
    }
  };

  const isWithinTimeLimit = (dateString, limitMinutes = 5) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - createdDate;
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins <= limitMinutes;
  };

  const isCancelable = 
    order.status === "Order placed" || 
    (order.status === "Accepted" && isWithinTimeLimit(order.created_at));
  const isPayable = order.status === "Pending";

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 transition-shadow duration-300 p-6 sm:p-8 relative"
    >
      <button
        onClick={() => onDeletePrompt(order.id)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
        title="Delete Order History"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-5 mb-5 gap-4 mt-2 sm:mt-0 pr-8 sm:pr-12">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold tracking-tight text-gray-800">
              <span className="text-orange-500 mr-1">#</span>{order.id}
            </h3>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1.5 rounded-lg w-max border border-gray-100">
            <Clock className="w-4 h-4 text-orange-400" />
            {new Date(order.created_at).toLocaleString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
        
        <div className="bg-orange-50 px-6 py-4 rounded-xl border border-orange-100 w-full md:w-auto text-center md:text-right shadow-sm">
          <p className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-1 flex items-center justify-center md:justify-end gap-1">
            <Receipt className="w-3.5 h-3.5" /> Total Paid
          </p>
          <p className="text-3xl font-black text-orange-600">₹{order.total_price}</p>
        </div>
      </div>

      {/* Items List */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
          <Utensils className="w-4 h-4 text-orange-500" />
          Items Included
        </h4>
        <ul className="space-y-3 px-2">
          {order.items?.map((item, idx) => (
            <li key={idx} className="flex justify-between items-center text-sm sm:text-base group border-b border-gray-50 pb-2 last:border-0 last:pb-0">
              <span className="text-gray-700 font-medium flex items-center gap-3">
                <span className="w-7 h-7 bg-orange-50 text-orange-600 border border-orange-100 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-transform group-hover:scale-110">
                  {item.quantity}x
                </span>
                {item.product_details?.name || "Premium Dish"}
              </span>
              <div className="flex items-center gap-4">
                {order.status !== "Pending" && (
                  <button 
                    onClick={() => onRate(item.product_details)}
                    className="text-[10px] font-black text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-widest bg-orange-50 px-2 py-1 rounded-md"
                  >
                    Rate Food
                  </button>
                )}
                <span className="text-gray-800 font-bold tracking-tight group-hover:text-orange-600 transition-colors">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Track & Cancel Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100 gap-3">
        <div className="flex w-full justify-between items-center gap-3">
          <button
            onClick={() => setIsTracking(!isTracking)}
            className="flex-1 px-4 py-2 text-sm border border-orange-200 bg-white text-orange-600 hover:bg-orange-50 hover:border-orange-300 font-bold rounded-lg shadow-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isTracking ? "Hide" : "Track Order"}
            {isTracking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {isCancelable && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="px-4 py-2 text-sm bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-lg transition-all duration-300 flex items-center gap-1.5"
            >
              {cancelling ? "..." : <><X className="w-4 h-4" /> Cancel</>}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Tracking UI */}
      <AnimatePresence>
        {isTracking && order.status !== "Pending" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mt-6 border-t border-gray-100 pt-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pl-2">
              <div className="bg-orange-50/50 rounded-xl p-6 border border-orange-50 shadow-inner">
                <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <div className="w-2 h-8 bg-orange-500 rounded-full" /> Live Tracking
                </h4>
                <OrderTimeline currentStatus={order.status} orderDate={order.created_at} />
              </div>
              <div className="h-full">
                <DeliveryInfo 
                  address={{
                    fullName: order.full_name,
                    phoneNumber: order.phone,
                    streetAddress: order.address,
                    city: order.city,
                    pincode: order.pincode
                  }} 
                  status={order.status} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

export default OrderCard;
