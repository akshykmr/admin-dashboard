// import { Navigate } from "react-router-dom";
// // import React, { useState, useEffect } from "react";
// // import { hostedCommonModuleAxios } from "./backendAxios/backendAxios";

// function ProtectedRoutes({ children }) {
//   const isSignedIn = localStorage.getItem("token");
//   // const userType = localStorage.getItem("permission")
//   if (!isSignedIn) {
//     console.log('redirecting to login')
//     return <Navigate to="/login" />;
//   }
//   return children;
// }
// export default ProtectedRoutes;

import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const isSignedIn = localStorage.getItem("token");
  const userType = localStorage.getItem("permission");


  if (!isSignedIn) {
    // If the user is not signed in, redirect to the login page
    return <Navigate to="/login" />;
  }


  // Define allowed routes for each user type
  const allowedRoutes = {
    super_admin: ["/"], // Allow all routes for superadmin
    parking_management: ["/home", "all-parking", "/assigned-parking","/unassigned-parking", "/add-parking", "/update-parking","/settings","/homepage","/add-banner","/my-account",],


    event_management: ["/home","/upcoming-events", "/ongoing-events","/expired-events","/add-event", "/update-event", "/settings","/view-event","/homepage","/add-banner","/my-account"],



    ticket_management: ["/home","/ticket", "/viewticket","/settings","/homepage","/add-banner","/my-account"],
  };

  // Check if the current route is allowed for the user's permission
  const currentRoute = window.location.pathname;
  const isRouteAllowed =
    allowedRoutes[userType] &&
    allowedRoutes[userType].some((allowedRoute) =>
      currentRoute.startsWith(allowedRoute)
    );

  if (!isRouteAllowed) {
    // If the route is not allowed for the user's permission, redirect to a default page or show an error message
    return <Navigate to="/*" />;
  }

  return children;
}

export default ProtectedRoutes;
