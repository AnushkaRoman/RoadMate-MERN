
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserDashboard from "./dashboard/UserDashboard";
import ProviderDashboard from "./dashboard/ProviderDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";

import AddVehicle from "./pages/AddVehicle";
import MyVehicles from "./pages/MyVehicles";

import ProviderAddCenter from "./pages/ProviderAddCenter";
import ProviderMyCenters from "./pages/ProviderMyCenters";
import ProviderBookings from "./pages/ProviderBookings";
import ProviderSettings from "./pages/ProviderSettings";

import AdminServiceCenters from "./pages/AdminServiceCenters";
import AdminUsers from "./pages/AdminUsers";
import AdminFuelStations from "./pages/AdminFuelStations";
import AdminAddFuelStation from "./pages/AdminAddFuelStation";

import UserFuelStations from "./pages/UserFuelStations";
import UserServices from "./pages/UserServices";
import UserReminders from "./pages/UserReminders";
import UserInsurance from "./pages/UserInsurance";
import UserSettings from "./pages/UserSettings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* HOME */}
        <Route path="/" element={<Home />} />

        {/* AUTHENTICATION */}
        <Route path="/auth" element={<Auth initialMode="login" />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/signup" element={<Auth initialMode="signup" />} />

        <Route
          path="/provider/signup"
          element={<Auth initialMode="signup" />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* VEHICLE OWNER */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/add-vehicle" element={<AddVehicle />} />
        <Route path="/user/vehicles" element={<MyVehicles />} />
        <Route path="/user/fuel" element={<UserFuelStations />} />
        <Route path="/user/reminders" element={<UserReminders />} />
        <Route path="/user/services" element={<UserServices />} />
        <Route path="/user/insurance" element={<UserInsurance />} />
        <Route path="/user/settings" element={<UserSettings />} />

        {/* SERVICE PROVIDER */}
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
          path="/provider/settings"
          element={<ProviderSettings />}
        />

        {/* ADMIN */}
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

        {/* 404 */}
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
