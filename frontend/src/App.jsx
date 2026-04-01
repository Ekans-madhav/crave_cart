import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import API from "./services/api";
import Home from "./pages/user/Home";
import Cart from "./pages/user/Cart";
import Menu from "./pages/user/Menu";
import About from "./pages/user/About";
import Blog from "./pages/user/Blog";
import BlogDetails from "./pages/user/BlogDetails";
import Order from "./pages/user/Order";
import Contact from "./pages/user/Contact";
import Login from "./pages/user/Login";
import SignUp from "./pages/user/SignUp";
import Membership from "./pages/user/Membership";
import Orders from "./pages/user/Orders";
import Payment from "./pages/user/Payment";
import Profile from "./pages/user/Profile";
import FoodDetails from "./pages/user/FoodDetails";
import AdminRoutes from "./routes/admin/AdminRoutes";
import ProtectedRoute from "./components/user/ProtectedRoute";

function App() {
  const location = useLocation();
  const isRouteAdmin = location.pathname.startsWith("/admin");
  const routeKey = isRouteAdmin ? "admin" : location.pathname;

  // Check Auth on load
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await API.get("/api/check-user/");

    } catch (error) {
      // User is likely deleted or token is invalid
      // Handled globally by axios interceptor but including here for safety
      console.error("Auth check failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/blog/:category/:id" element={<BlogDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/food/:id" element={<FoodDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
