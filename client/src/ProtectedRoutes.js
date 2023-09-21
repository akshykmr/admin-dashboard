import { Navigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import { hostedCommonModuleAxios } from "./backendAxios/backendAxios";

function ProtectedRoutes({ children }) {
  const isSignedIn = localStorage.getItem("token");
  if (!isSignedIn) {
    console.log('redirecting to login')
    return <Navigate to="/login" />;
  }
  return children;
}
export default ProtectedRoutes;