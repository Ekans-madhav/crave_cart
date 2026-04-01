import _asset_1 from "../../assets/images/About us/about us our story.png";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../components/user/Header";
import Footer from "../../components/user/Footer";
import { useAuth } from "../../context/user/AuthContext";
import { Eye, EyeOff, Mail, User, Phone, Lock, HeartHandshake, ChefHat } from "lucide-react";
import API from "../../services/api";

const InputField = ({ icon, name, placeholder, value, onChange, error }) => {
  return (
    <div>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
          {icon}
        </span>

        <input
          type={name === "email" ? "email" : "text"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-4 py-4 rounded-2xl border bg-white ${
            error
              ? "border-red-300 ring-4 ring-red-50"
              : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
          } transition-all outline-none font-medium`}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
    </div>
  );
};

/* =========================
   PASSWORD FIELD
========================= */

const PasswordField = ({
  name,
  placeholder,
  value,
  onChange,
  show,
  toggle,
  error,
}) => {
  return (
    <div>
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
          <Lock className="w-5 h-5" />
        </span>

        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-12 py-4 rounded-2xl border bg-white ${
            error
              ? "border-red-300 ring-4 ring-red-50"
              : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50"
          } transition-all outline-none font-medium`}
        />

        <button
          type="button"
          onClick={toggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>}
    </div>
  );
};

/* =========================
   MAIN SIGNUP COMPONENT
========================= */
import authService from "../../services/authService";

const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength("Weak");
    else if (strength === 3) setPasswordStrength("Medium");
    else setPasswordStrength("Strong");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") checkPasswordStrength(value);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const userData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        password: formData.password,
        confirm_password: formData.confirmPassword,
      };
      const res = await API.post("/api/register/", userData);
      alert("Registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error Response:", error.response?.data);
      const errorMsg = error.response?.data 
                ? Object.entries(error.response.data).map(([key, val]) => `${key}: ${val}`).join("\n") 
                : "Registration failed";
      alert(errorMsg);
    }

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
        <div className="flex flex-col lg:flex-row-reverse w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-orange-100">
          
          {/* LEFT IMAGE / RIGHT on DESKTOP via flex-row-reverse */}
          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-full h-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={_asset_1}
                alt="Signup"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
              
              <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 text-white">
                <HeartHandshake className="w-12 h-12 text-orange-400 mb-6" />
                <h1 className="text-4xl sm:text-5xl font-black mb-4 tracking-tight leading-tight">
                  Join our <br />
                  <span className="text-orange-400">Food Community</span>
                </h1>
                <p className="text-lg opacity-90 font-medium max-w-md">
                  Create an account to explore delicious meals and exclusive offers.
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT FORM / LEFT on DESKTOP via flex-row-reverse */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 relative bg-gradient-to-bl from-orange-50/50 to-white">
            <ChefHat className="absolute -bottom-10 -left-10 w-64 h-64 text-orange-50/50 -rotate-12 pointer-events-none" />
            
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md relative z-10"
            >
              <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-3"><span className="text-orange-500">Sign</span> Up</h2>
                <p className="text-gray-500 font-medium text-lg">Create your account to get started</p>
              </div>

              {showSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-center font-bold"
                >
                  Account Created Successfully! Redirecting...
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <InputField
                  icon={<User className="w-5 h-5" />}
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />

                <InputField
                  icon={<Mail className="w-5 h-5" />}
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <InputField
                  icon={<Phone className="w-5 h-5" />}
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={errors.phoneNumber}
                />

                <PasswordField
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  show={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                  error={errors.password}
                />

                <PasswordField
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  show={showConfirmPassword}
                  toggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  error={errors.confirmPassword}
                />

                {/* Password Strength Indicator */}
                {passwordStrength && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                      <div className={`h-full transition-all duration-300 ${
                        passwordStrength === 'Weak' ? 'w-1/3 bg-red-500' :
                        passwordStrength === 'Medium' ? 'w-2/3 bg-yellow-400' :
                        'w-full bg-green-500'
                      }`} />
                    </div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        passwordStrength === "Weak"
                          ? "text-red-500"
                          : passwordStrength === "Medium"
                            ? "text-yellow-600"
                            : "text-green-500"
                      }`}
                    >
                      {passwordStrength}
                    </span>
                  </div>
                )}

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg shadow-[0_8px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Create Account
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 font-medium">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
                  >
                    Login
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

export default SignUp;
