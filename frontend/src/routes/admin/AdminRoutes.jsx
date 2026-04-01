import React from "react";
import { Routes, Route } from "react-router-dom";
import { AdminProvider } from "../../context/admin/AdminContext";
import AdminLayout from "../../layout/admin/AdminLayout";
import Dashboard from "../../pages/admin/Dashboard";
import Orders from "../../pages/admin/Orders";
import Menu from "../../pages/admin/Menu";
import MenuTypes from "../../pages/admin/MenuTypes";
import Users from "../../pages/admin/Users";
import Headlines from "../../pages/admin/Headlines";
import Settings from "../../pages/admin/Settings";
import ManageContact from "../../pages/admin/ManageContact";
import ManageBlog from "../../pages/admin/ManageBlog";
import ManageOffer from "../../pages/admin/ManageOffer";
import AdminRoute from "../../components/admin/AdminRoute";

const AdminRoutes = () => {
  return (
    <AdminRoute>
      <AdminProvider>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="menu" element={<Menu />} />
            <Route path="classifications" element={<MenuTypes />} />
            <Route path="menu-types" element={<MenuTypes />} />
            <Route path="users" element={<Users />} />
            <Route path="headlines" element={<Headlines />} />
            <Route path="settings" element={<Settings />} />
            <Route path="messages" element={<ManageContact />} />
            <Route path="blog-management" element={<ManageBlog />} />
            <Route path="today-offer" element={<ManageOffer />} />
          </Route>
        </Routes>
      </AdminProvider>
    </AdminRoute>
  );
};

export default AdminRoutes;
