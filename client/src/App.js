import React, { lazy, Suspense } from "react";
import ProtectedRoutes from "./ProtectedRoutes";
import { ThemeProvider } from "./context/Themes";
import { LoaderProvider } from "./context/Preloader";
import { ProfileProvider } from "./context/MemberProfile";
import { MemberListProvider } from "./context/MemberList";
import { DataProvider } from "./context/DataSharing";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Error } from "./pages/supports";
import ParkingSlotDetails from "./pages/master/Parking/ParkingSlotDetails";

const Login = lazy(() => import("./pages/master/Login"));
const Dashboard = lazy(() => import("./pages/master/Dashboard"));

const HomePage = lazy(() => import("./pages/master/Homepage/HomePage"));
const AddBanner = lazy(() => import("./pages/master/Homepage/AddBanner"));
const ViewBanner = lazy(() => import("./pages/master/Homepage/ViewBanner"));

const Team = lazy(() => import("./pages/master/team/Team"));
const UpdateAdmin = lazy(() => import("./pages/master/team/UpdateAdmin"));
const AddAdmin = lazy(() => import("./pages/master/team/AddAdmin"));
const AdminProfile = lazy(() => import("./pages/master/team/AdminProfile"));

const Users = lazy(() => import("./pages/master/user/Users"));
const UserProfile = lazy(() => import("./pages/master/user/userProfile"));

const UpcomingEvents = lazy(() =>
  import("./pages/master/Events/UpComingEvents")
);
const OngoingEvents = lazy(() => import("./pages/master/Events/OngoingEvents"));
const ExpiredEvents = lazy(() => import("./pages/master/Events/ExpiredEvents"));
const AddEvents = lazy(() => import("./pages/master/Events/AddEvents"));
const UpdateEvent = lazy(() => import("./pages/master/Events/UpdateEvent"));
const PreviewEvents = lazy(() => import("./pages/master/Events/PreviewEvents"));

const ForgotPassword = lazy(() => import("./pages/master/ForgotPassword"));
const MyAccount = lazy(() => import("./pages/master/MyAccount"));

const Settings = lazy(() => import("./pages/master/Settings"));
const InvoiceList = lazy(() => import("./pages/master/InvoiceList"));
const AllParking = lazy(() => import("./pages/master/Parking/AllParking"));
const AssignedParking = lazy(() =>
  import("./pages/master/Parking/AssignedParking")
);
const UnassignedParking = lazy(() =>
  import("./pages/master/Parking/UnassignedParking")
);
const c = lazy(() =>
  import("./pages/master/Parking/ParkingSlotDetails")
);

// const Permission = lazy(() => import("./pages/master/permission/Permission"));
const AddParking = lazy(() => import("./pages/master/Parking/AddParking"));
const TicketHistory = lazy(() =>
  import("./pages/master/Tickets/TicketHistory")
);
const UpdateBanner = lazy(() => import("./pages/master/Homepage/UpdateBanner"));
const UpdateParking = lazy(() =>
  import("./pages/master/Parking/UpdateParking")
);
const ResetPassword = lazy(() => import("./pages/master/ResetPassword"));
const ScanTicketHistory = lazy(() =>
  import("./pages/master/Tickets/ScannedTickets")
);
const TicketDetails = lazy(() =>
  import("./pages/master/Tickets/TicketDetails")
);

export default function App() {
  return (
    <ThemeProvider>
      <LoaderProvider>
        <ProfileProvider>
          <MemberListProvider>
            <DataProvider>
              <BrowserRouter>
                <Routes>
                  {/* //////////////////UNPROTECTED ROUTES////////////////////  */}

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
                  <Route
                    path="/forgot-password"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        {/* <ProtectedRoutes> */}
                        <ForgotPassword />
                        {/* </ProtectedRoutes> */}
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

                  {/* //////////////////PROTECTED ROUTES////////////////////  */}
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route
                    path="/home"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <Dashboard />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/homepage"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <HomePage />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-banner"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <AddBanner />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  {/* <Route
                    path="/permission"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <Permission />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  /> */}
                  <Route
                    path="/team"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <Team />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-team"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        {/* <ProtectedLogIn> */}
                        <AddAdmin />
                        {/* </ProtectedLogIn> */}
                      </Suspense>
                    }
                  />
                  <Route
                    path="/update-team-profile"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        {/* <ProtectedLogIn> */}
                        <UpdateAdmin />
                        {/* </ProtectedLogIn> */}
                      </Suspense>
                    }
                  />
                  <Route
                    path="/user"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <Users />
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
                    path="/team-profile"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <AdminProfile />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/user-profile"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <UserProfile />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/upcoming-events"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <UpcomingEvents />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/ongoing-events"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <OngoingEvents />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/expired-events"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <ExpiredEvents />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-event"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        {/* <ProtectedLogIn> */}
                        <AddEvents />
                        {/* </ProtectedLogIn> */}
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
                    path="/view-event"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <PreviewEvents />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/all-parking"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <AllParking />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/assigned-parking"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <AssignedParking />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/unassigned-parking"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <UnassignedParking />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/add-parking"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        {/* <ProtectedLogIn> */}
                        <AddParking />
                        {/* </ProtectedLogIn> */}
                      </Suspense>
                    }
                  />
                    <Route
                    path="/parkingSlot-details"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        {/* <ProtectedLogIn> */}
                        <ParkingSlotDetails />
                        {/* </ProtectedLogIn> */}
                      </Suspense>
                    }
                  />
                  <Route
                    path="/update-event"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <UpdateEvent />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/ticket-history"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <TicketHistory />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/scanned-ticket-history"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <ScanTicketHistory />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />

                  <Route
                    path="/ticket-details"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <TicketDetails />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />

                  <Route
                    path="/view-banner"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <ViewBanner />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/update-banner"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <UpdateBanner />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/update-parking"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <UpdateParking />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                  <Route
                    path="/reset-password"
                    element={
                      <Suspense fallback={<LoaderProvider />}>
                        <ProtectedRoutes>
                          <ResetPassword />
                        </ProtectedRoutes>
                      </Suspense>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </DataProvider>
          </MemberListProvider>
        </ProfileProvider>
      </LoaderProvider>
    </ThemeProvider>
  );
}
