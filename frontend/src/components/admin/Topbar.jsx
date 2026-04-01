import React, { useState } from "react";
import { Bell, Search, Menu as MenuIcon } from "lucide-react";
import { useAdmin } from "../../context/admin/AdminContext";
import { motion, AnimatePresence } from "framer-motion";

const Topbar = ({ toggleSidebar }) => {
  const { notifications, markNotificationsRead } = useAdmin();
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 lg:px-8 border-b border-gray-100 sticky top-0 z-30">
      <div className="flex items-center flex-1">
        <button
          onClick={toggleSidebar}
          className="mr-6 lg:hidden text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center space-x-6 relative">
        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              if (unreadCount > 0) markNotificationsRead();
            }}
            className="flex items-center text-gray-400 hover:text-gray-600 focus:outline-none relative p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 flex items-center justify-center rounded-full text-white text-[10px] ring-2 ring-white">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="font-bold text-gray-800">Notifications</h3>
                  <span className="text-xs text-orange-600 font-semibold bg-orange-100 px-2 py-1 rounded-full">{notifications.length} Total</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((n) => (
                      <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-orange-50/50 transition-colors">
                        <p className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(n.id).toLocaleTimeString()}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
