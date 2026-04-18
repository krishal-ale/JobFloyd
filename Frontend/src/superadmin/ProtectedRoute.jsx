import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const SuperAdminProtectedRoute = ({ children }) => {
  const { user, loading } = useSelector((store) => store.authSlice);

  if (loading) return null;

  if (!user || user.email !== "jobfloyd.app@gmail.com") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};


export default SuperAdminProtectedRoute;