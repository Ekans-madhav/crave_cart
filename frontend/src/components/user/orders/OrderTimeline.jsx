import React from "react";
import { motion } from "framer-motion";
import { Check, Dot, MapPin, PackageOpen, Utensils, Truck } from "lucide-react";

export default function OrderTimeline({ currentStatus, orderDate }) {
  if (currentStatus === "Cancelled") {
    return (
      <div className="py-8 px-4 text-center bg-red-50 rounded-2xl border border-red-100 italic text-red-600 font-medium">
        This order has been cancelled.
      </div>
    );
  }

  const steps = [
    { label: "Pending", key: "Order placed", icon: PackageOpen },
    { label: "Processing", key: "Accepted", icon: Utensils },
    { label: "Delivering", key: "Out for delivery", icon: Truck },
    { label: "Delivered", key: "Delivered", icon: MapPin },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case "Order placed": return 0;
      case "Accepted":
      case "Preparing":
        return 1;
      case "Out for delivery": return 2;
      case "Delivered": return 3;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  // Time mockups format
  const mockTimes = [
    new Date(orderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    new Date(new Date(orderDate).getTime() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    new Date(new Date(orderDate).getTime() + 25 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    new Date(new Date(orderDate).getTime() + 30 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    new Date(new Date(orderDate).getTime() + 45 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  ];

  return (
    <div className="py-4 px-2 sm:px-4">
      <div className="relative pl-8 border-l-2 border-gray-100 ml-4 space-y-8">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          let colorClass = "";
          let bgColor = "";
          let iconColor = "";

          if (isCompleted) {
            colorClass = "text-green-600";
            bgColor = "bg-green-500";
            iconColor = "text-white";
          } else if (isCurrent) {
            colorClass = "text-orange-500 font-bold";
            bgColor = "bg-orange-500 ring-4 ring-orange-100";
            iconColor = "text-white";
          } else {
            colorClass = "text-gray-400";
            bgColor = "bg-gray-200";
            iconColor = "text-gray-400";
          }

          const StepIcon = step.icon;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, type: "spring" }}
              className="relative flex items-center justify-between"
            >
              <div
                className={`absolute -left-[50px] w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${bgColor}`}
              >
                {isCompleted ? (
                  <Check className={`w-5 h-5 ${iconColor}`} />
                ) : isCurrent ? (
                  <Dot className="w-8 h-8 text-white animate-pulse" />
                ) : (
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                )}
              </div>

              <div className="flex-1 ml-4 sm:ml-2 flex justify-between items-center group">
                <div>
                  <h4 className={`text-sm sm:text-base transition-colors ${colorClass}`}>
                    {step.label}
                  </h4>
                  {isCurrent && (
                    <p className="text-xs text-orange-400 mt-1">
                      In progress...
                    </p>
                  )}
                </div>
                {(!isPending || isCurrent) && (
                  <span className="text-xs sm:text-sm text-gray-400 font-medium">
                    {mockTimes[index]}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
