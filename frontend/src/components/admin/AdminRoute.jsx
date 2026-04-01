import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const location = useLocation();

    // Check if user exists and is an admin
    if (!user || user.is_admin !== true) {
        // Not an admin? Redirect to user login or home
        // Since we now use a single login system, redirect to /login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;
