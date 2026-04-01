import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdmin } from "../../context/admin/AdminContext";
import { LayoutDashboard, ShoppingBag, Utensils, Users, Settings, LogOut, Tag, Bell, MessageSquare, Newspaper, Gift } from "lucide-react";

const Sidebar = () => {
  const { logout, admin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Use window.location.href for a full reload 
    // to ensure user session is also cleared in all contexts
    window.location.href = "/";
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag className="w-5 h-5" /> },
    { name: "Classifications", path: "/admin/menu-types", icon: <Tag className="w-5 h-5" /> },
    { name: "Messages", path: "/admin/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { name: "Headlines", path: "/admin/headlines", icon: <Bell className="w-5 h-5" /> },
    { name: "Blog Posts", path: "/admin/blog-management", icon: <Newspaper className="w-5 h-5" /> },
    { name: "Menu Items", path: "/admin/menu", icon: <Utensils className="w-5 h-5" /> },
    { name: "Today's Offer", path: "/admin/today-offer", icon: <Gift className="w-5 h-5" /> },
    { name: "Users", path: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="flex items-center justify-center h-20 border-b border-gray-800">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
          CraveCard
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="px-4 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            Main Menu
          </p>
        </div>

        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {item.icon}
              <span className="ml-3 font-medium">{item.name}</span>
            </NavLink>
          ))}
          
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
