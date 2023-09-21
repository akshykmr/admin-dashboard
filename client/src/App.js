import React, { lazy, Suspense } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
// import ProtectedLogIn from './ProtectedLogIn';
import { ThemeProvider } from "./context/Themes";
import { LoaderProvider } from "./context/Preloader";
import { ProfileProvider } from "./context/MemberProfile";
import { MemberListProvider } from "./context/MemberList";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Error } from "./pages/supports";

import ProtectedLogIn from "./ProtectedLogIn";

const Login = lazy(() => import("./pages/master/Login"));
const Ecommerce = lazy(() => import("./pages/master/Ecommerce"));
const MemberList = lazy(() => import("./pages/master/MemberList"));
const CreateMember = lazy(() => import("./pages/master/CreateMember"));
const UserList = lazy(() => import("./pages/master/UserList"));
const ForgotPassword = lazy(() => import("./pages/master/ForgotPassword"));
const MyAccount = lazy(() => import("./pages/master/MyAccount"));
const MemberProfile = lazy(() => import("./pages/master/MemberProfile"));
const Events = lazy(() => import("./pages/master/Events"));
const CreateEvent = lazy(() => import("./pages/master/CreateEvent"));
const MemberView = lazy(() => import("./pages/master/MemberView"));
const Settings = lazy(() => import("./pages/master/Settings"));
const InvoiceList = lazy(() => import("./pages/master/InvoiceList"));
const Parking = lazy(() => import("./pages/master/Parking/Parking"));

export default function App() {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <ProfileProvider>
          <MemberListProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      {/* <ProtectedLogIn> */}
                      <Login />
                      {/* </ProtectedLogIn> */}
                    </Suspense>
                  }
                />

                {/* PROTECTED ROUTES  */}
                <Route
                  path="/"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <Ecommerce />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/member-list"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <MemberList />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                  <Route
                  path="/create-member"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      {/* <ProtectedLogIn> */}
                      <CreateMember />
                      {/* </ProtectedLogIn> */}
                    </Suspense>
                  }
                />
                <Route
                  path="/user-list"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <UserList />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <ForgotPassword />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/my-account"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <MyAccount />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/member-profile"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <MemberProfile />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <Events />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                 <Route
                  path="/create-event"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      {/* <ProtectedLogIn> */}
                      <CreateEvent />
                      {/* </ProtectedLogIn> */}
                    </Suspense>
                  }
                />
                <Route
                  path="/product-view"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <MemberView />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <Settings />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/invoice-list"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <InvoiceList />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                <Route
                  path="/parking"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      <ProtectedRoutes>
                        <Parking />
                      </ProtectedRoutes>
                    </Suspense>
                  }
                />
                 <Route
                  path="/*"
                  element={
                    <Suspense fallback={<LoaderProvider />}>
                      {/* <ProtectedLogIn> */}
                      <Error />
                      {/* </ProtectedLogIn> */}
                    </Suspense>
                  }
                />
              </Routes>
            </BrowserRouter>
          </MemberListProvider>
        </ProfileProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
}
