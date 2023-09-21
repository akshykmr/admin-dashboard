import { Navigate } from "react-router-dom";
// import React, { useState, useEffect } from "react";
// import { hostedCommonModuleAxios } from "./backendAxios/backendAxios";

function ProtectedLogIn({ children }) {
  const isSignedIn = localStorage.getItem("token");
  if (isSignedIn) {
    return <Navigate to="/home" />;
  } else {
    return <Navigate to="/login" />;
  }
} 
export default ProtectedLogIn;