import React from "react";
import { Clock, CheckCircle2, Truck, Utensils, PackageCheck, XCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderStatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Order placed":
        return {
          label: "Pending",
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <Clock className="w-4 h-4" />,
        };
      case "Accepted":
      case "Preparing":
        return {
          label: "Processing",
          color: "bg-orange-100 text-orange-700 border-orange-200",
          icon: <Utensils className="w-4 h-4" />,
        };
      case "Out for delivery":
        return {
          label: "Delivering",
          color: "bg-purple-100 text-purple-700 border-purple-200",
          icon: <Truck className="w-4 h-4" />,
        };
      case "Delivered":
        return {
          label: "Delivered",
          color: "bg-green-100 text-green-700 border-green-200",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "Cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
        };
      default:
        return {
          label: status || "Unknown",
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </motion.div>
  );
}
