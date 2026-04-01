import _asset_1 from "../../assets/images/Blog/post 2.jpeg";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useAuth } from "../../context/user/AuthContext";
import { Eye, EyeOff, Mail, Lock, Utensils, ChefHat } from "lucide-react";
import API from "../../services/api";
import authService from "../../services/authService";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const data = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        // Standardize keys for AuthContext
        const userData = {
            id: data.user_id,
            email: data.email,
            is_admin: data.is_admin
        };

        login(userData, data.tokens);

        if (userData.is_admin) {
           navigate("/admin"); 
        } else {
           navigate("/");
        }
      } catch (error) {
        setLoginError("Invalid email or password");
      }
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (loginError) setLoginError("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex flex-col min-h-screen bg-gray-50 font-sans"
    >
      <Header />

      <main className="flex flex-1 mt-20 items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-orange-100">
          
          {/* LEFT IMAGE SIDE */}
          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full h-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={_asset_1}
                alt="Fresh Food"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white">
                <ChefHat className="w-12 h-12 text-orange-400 mb-6" />
                <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
                  Welcome Back <br />
                  <span className="text-orange-400">Food Lover</span>
                </h1>
                <p className="text-lg opacity-90 font-medium max-w-md">
                  Login to continue exploring delicious recipes and food stories.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT FORM SIDE */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-gradient-to-br from-orange-50/50 to-white">
            <Utensils className="absolute -top-10 -right-10 w-64 h-64 text-orange-50/50 rotate-12 pointer-events-none" />
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md relative z-10"
            >
              <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-3"><span className="text-orange-500">Sign</span> In</h2>
                <p className="text-gray-500 font-medium text-lg">Access your account to continue</p>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 font-medium"
                >
                  <p className="text-sm">{loginError}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-white ${
                        errors.email ? "border-red-300 ring-4 ring-red-50" : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
                      } transition-all outline-none font-medium`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 font-semibold">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-orange-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 rounded-2xl border bg-white ${
                        errors.password ? "border-red-300 ring-4 ring-red-50" : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
                      } transition-all outline-none font-medium`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-500 font-semibold">{errors.password}</p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-500 peer-checked:border-orange-500 transition-colors flex items-center justify-center">
                         {rememberMe && <svg className="w-3 h-3 text-white pointer-events-none" viewBox="0 0 14 14" fill="none"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"></path></svg>}
                      </div>
                    </div>
                    <span className="ml-3 text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-700 font-bold transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Login 
                  </button>
                </div>
              </form>

              <div className="mt-10 text-center">
                <p className="text-gray-500 font-medium">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Login;
