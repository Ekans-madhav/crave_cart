import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../../services/authService";

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      const user = saved ? JSON.parse(saved) : null;
      return (user && user.is_admin) ? user : null;
    } catch (e) {
      return null;
    }
  });

  const [notifications, setNotifications] = useState([]);

  // Check for new orders or users based on localStorage length changes 
  // to power the notification badge visually.
  useEffect(() => {
    if (!admin) return;

    let lastOrderCount = JSON.parse(localStorage.getItem('orders') || '[]').length;
    let lastUserCount = JSON.parse(localStorage.getItem('users') || '[]').length;

    const interval = setInterval(() => {
      const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      if (currentOrders.length > lastOrderCount) {
        addNotification(`You have ${currentOrders.length - lastOrderCount} new order(s)!`);
        lastOrderCount = currentOrders.length;
      }
      if (currentUsers.length > lastUserCount) {
        addNotification(`${currentUsers.length - lastUserCount} new user(s) registered!`);
        lastUserCount = currentUsers.length;
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [admin]);

  const login = async (email, password) => {
    try {
        const data = await authService.login({ username: email, password });
        const userProfile = await authService.getProfile();
        
        if (userProfile.is_staff || userProfile.is_superuser) {
            setAdmin(userProfile);
            localStorage.setItem("user", JSON.stringify(userProfile));
            localStorage.setItem("adminUser", JSON.stringify(userProfile));
            localStorage.setItem("token", data.access);
            localStorage.setItem("accessToken", data.access);
            localStorage.setItem("refreshToken", data.refresh);
            return true;
        } else {
            authService.logout();
            return false;
        }
    } catch (err) {
        return false;
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const updateSettings = (updatedData) => {
    if (admin) {
      const updatedAdmin = { ...admin, ...updatedData };
      setAdmin(updatedAdmin);
      localStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
    }
  };

  const addNotification = (message) => {
    setNotifications((prev) => [{ id: Date.now(), message, read: false }, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const value = React.useMemo(() => ({
    admin,
    login,
    logout,
    updateSettings,
    notifications,
    addNotification,
    markNotificationsRead,
  }), [admin, notifications]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
