import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import { useAdmin } from "../../context/admin/AdminContext";
import { motion } from "framer-motion";

const AdminLayout = () => {
  const { admin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if current path is dashboard (index route)
  const isDashboard = location.pathname === "/admin" || location.pathname === "/admin/";

  // Prevent redirect loop if we are already on the login page or if admin exists
  if (!admin && location.pathname !== "/admin/login") {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition duration-300 ease-in-out`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        {isDashboard && <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
