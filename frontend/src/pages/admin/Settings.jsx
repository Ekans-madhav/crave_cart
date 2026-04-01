import React, { useState } from "react";
import { useAdmin } from "../../context/admin/AdminContext";
import { Save, Lock, ShieldCheck, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import authService from "../../services/authService";

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await authService.changePassword({
        old_password: formData.currentPassword,
        new_password: formData.newPassword
      });
      
      setMessage({ type: "success", text: "Password updated successfully" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Password change error:", err);
      const errMsg = err.response?.data?.error || "Error updating password. Check your current password.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setIsLoading(false);
    }
    
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
          <ShieldCheck className="w-6 h-6 text-orange-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Security Settings</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your administrator security credentials</p>
        </div>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border ${
            message.type === "success" 
              ? "bg-green-50 border-green-200 text-green-700" 
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                Update Password
              </h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="newPassword"
                      required
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      name="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className="pl-10 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg disabled:opacity-50 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
