import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {

  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role")?.toLowerCase();

 
  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;