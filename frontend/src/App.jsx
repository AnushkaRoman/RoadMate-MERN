
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserDashboard from "./dashboard/UserDashboard";
import AddVehicle from "./pages/AddVehicle";
import MyVehicles from "./pages/MyVehicles";
import ProviderDashboard from "./dashboard/ProviderDashboard";
import ProviderAddCenter from "./pages/ProviderAddCenter";
import ProviderMyCenters from "./pages/ProviderMyCenters";
import ProviderBookings from "./pages/ProviderBookings";
import AdminDashboard from "./dashboard/AdminDashboard";
import AdminServiceCenters from "./pages/AdminServiceCenters";
import AdminUsers from "./pages/AdminUsers";
import AdminFuelStations from "./pages/AdminFuelStations";
import AdminAddFuelStation from "./pages/AdminAddFuelStation";
import UserFuelStations from "./pages/UserFuelStations";
import ProviderSettings from "./pages/ProviderSettings";
import UserServices from "./pages/UserServices";
import UserReminders from "./pages/UserReminders";
import UserInsurance from "./pages/UserInsurance";
import UserSettings from "./pages/UserSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/add-vehicle" element={<AddVehicle />} />
<Route path="/user/vehicles" element={<MyVehicles />} />
<Route
  path="/provider/dashboard"
  element={<ProviderDashboard />}
/>
<Route
  path="/provider/add-center"
  element={<ProviderAddCenter />}
/>
<Route
  path="/provider/my-centers"
  element={<ProviderMyCenters />}
/>
<Route
  path="/provider/bookings"
  element={<ProviderBookings />}
/>
<Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>
<Route
  path="/admin/service-centers"
  element={<AdminServiceCenters />}
/>
<Route path="/admin/users" element={<AdminUsers />} />
<Route
  path="/admin/fuel-stations"
  element={<AdminFuelStations />}
/>

<Route
  path="/admin/fuel-stations/add"
  element={<AdminAddFuelStation />}
/>
<Route
  path="/user/fuel"
  element={<UserFuelStations />}
/>
<Route
  path="/provider/settings"
  element={<ProviderSettings />}
/>
<Route path="/user/reminders" element={<UserReminders />} />
<Route path="/user/services" element={<UserServices />} />
<Route path="/user/insurance" element={<UserInsurance />} />
<Route path="/user/settings" element={<UserSettings />} />

        <Route
          path="*"
          element={
            <div className="text-center mt-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
