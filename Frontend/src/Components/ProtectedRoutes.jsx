import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, replace } from "react-router-dom";

function ProtectedRoutes() {
  const { isAuthenticated, screenLoading } = useSelector((state) => state.user);

  if (screenLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
