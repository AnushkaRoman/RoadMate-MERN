
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CarFront,
  Wrench,
  Bell,
  ShieldCheck,
  Fuel,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  CalendarDays,
  UserRound,
  Clock,
  CheckCircle,
} from "lucide-react";

import api from "../services/api";

function UserDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------- AUTHENTICATION ----------------

  useEffect(() => {
    const savedUser = localStorage.getItem("roadmateUser");
    const token = localStorage.getItem("roadmateToken");

    if (!savedUser || !token) {
      navigate("/login");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem("roadmateUser");
      localStorage.removeItem("roadmateToken");
      navigate("/login");
    }
  }, [navigate]);

  // ---------------- FETCH DASHBOARD DATA ----------------

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("roadmateToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const [
          vehicleResponse,
          bookingResponse,
          reminderResponse,
          insuranceResponse,
        ] = await Promise.all([
          api.get("/vehicles/my-vehicles", config),
          api.get("/bookings/my-bookings", config),
          api.get("/reminders/my-reminders", config),
          api.get("/insurance/my-policies", config),
        ]);

        // Vehicles
        setVehicles(vehicleResponse.data.vehicles || []);

        // Bookings
        setBookings(bookingResponse.data.bookings || []);

        // Reminders
        setReminders(reminderResponse.data.reminders || []);

        // Insurance
        setPolicies(insuranceResponse.data.policies || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("roadmateToken");
          localStorage.removeItem("roadmateUser");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // ---------------- DASHBOARD STATISTICS ----------------

  const pendingReminders = reminders.filter(
    (reminder) => !reminder.isCompleted
  );

  const activePolicies = policies.filter(
    (policy) =>
      policy.isActive &&
      new Date(policy.expiryDate) >= new Date()
  );

  const upcomingBookings = bookings.filter(
    (booking) =>
      ["pending", "accepted", "in-progress"].includes(
        booking.status
      )
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.bookingDate) -
        new Date(a.createdAt || a.bookingDate)
    )
    .slice(0, 5);

  // ---------------- LOGOUT ----------------

  const handleLogout = () => {
    localStorage.removeItem("roadmateToken");
    localStorage.removeItem("roadmateUser");
    navigate("/login");
  };

  // ---------------- BOOKING STATUS ----------------

  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "green";

      case "completed":
        return "green";

      case "pending":
        return "orange";

      case "rejected":
        return "red";

      case "cancelled":
        return "red";

      case "in-progress":
        return "blue";

      default:
        return "orange";
    };
  };

  return (
    <div className="user-dashboard">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <Link to="/" className="dashboard-brand">
          <CarFront size={30} />
          <span>RoadMate</span>
        </Link>

        <div className="dashboard-user-profile">
          <div className="dashboard-profile-icon">
            <UserRound size={22} />
          </div>

          <div>
            <h4>{user?.name || "Vehicle Owner"}</h4>
            <p>Vehicle Owner</p>
          </div>
        </div>

        <nav className="dashboard-nav">

          <Link to="/user/dashboard" className="dashboard-nav-item">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/user/vehicles" className="dashboard-nav-item">
            <CarFront size={18} />
            My Vehicles
          </Link>

          <Link to="/user/services" className="dashboard-nav-item">
            <Wrench size={18} />
            Services
          </Link>

          <Link to="/user/reminders" className="dashboard-nav-item">
            <Bell size={18} />
            Reminders
          </Link>

          <Link to="/user/insurance" className="dashboard-nav-item">
            <ShieldCheck size={18} />
            Insurance
          </Link>

          <Link to="/user/fuel" className="dashboard-nav-item">
            <Fuel size={18} />
            Fuel Stations
          </Link>

          <Link to="/user/settings" className="dashboard-nav-item">
            <Settings size={18} />
            Settings
          </Link>

        </nav>

        <button
          className="dashboard-nav-item logout-button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-main">

        {/* TOPBAR */}

        <div className="dashboard-topbar">
          <div>
            <span className="dashboard-topbar-label">
              RoadMate / Dashboard
            </span>
            <h2>Dashboard</h2>
          </div>

          <div className="dashboard-topbar-user">
            <UserRound size={20} />
            <span>{user?.name || "User"}</span>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="dashboard-empty">
            {error}
          </div>
        )}

        {/* WELCOME */}

        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-welcome-label">
              VEHICLE MANAGEMENT
            </span>

            <h1>
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </h1>

            <p>
              Manage your vehicles, services and maintenance
              with RoadMate.
            </p>

            <Link
              to="/user/add-vehicle"
              className="dashboard-welcome-button"
            >
              <Plus size={18} />
              Add Your Vehicle
            </Link>
          </div>

          <div className="dashboard-welcome-icon">
            <CarFront size={95} />
          </div>
        </section>

        {/* STATISTICS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <CarFront size={24} />
            </div>

            <p>Total Vehicles</p>
            <h2>{loading ? "..." : vehicles.length}</h2>
            <span>Registered vehicles</span>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon orange">
              <Wrench size={24} />
            </div>

            <p>Service Bookings</p>
            <h2>{loading ? "..." : upcomingBookings.length}</h2>
            <span>Active bookings</span>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <Bell size={24} />
            </div>

            <p>Reminders</p>
            <h2>{loading ? "..." : pendingReminders.length}</h2>
            <span>Pending reminders</span>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon purple">
              <ShieldCheck size={24} />
            </div>

            <p>Insurance</p>
            <h2>{loading ? "..." : activePolicies.length}</h2>
            <span>Active policies</span>
          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="dashboard-quick-actions">

          <div className="dashboard-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Access your frequently used features</p>
            </div>
          </div>

          <div className="dashboard-actions">

            <Link
              to="/user/add-vehicle"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon blue">
                <Plus size={25} />
              </div>

              <span>Add Vehicle</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/user/services"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon orange">
                <Wrench size={25} />
              </div>

              <span>Book Service</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/user/fuel"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon green">
                <Fuel size={25} />
              </div>

              <span>Find Fuel</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/user/insurance"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon purple">
                <ShieldCheck size={25} />
              </div>

              <span>Insurance</span>
              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

        {/* MY VEHICLES */}

        <section className="dashboard-vehicles-section">

          <div className="dashboard-section-heading">
            <div>
              <h2>My Vehicles</h2>
              <p>Your registered vehicles</p>
            </div>

            <Link to="/user/vehicles">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="dashboard-empty">
              Loading vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="dashboard-empty">
              <CarFront size={42} />

              <h3>No vehicles registered</h3>

              <p>
                Add your first vehicle to start using RoadMate.
              </p>

              <Link to="/user/add-vehicle">
                <Plus size={17} />
                Add Vehicle
              </Link>
            </div>
          ) : (
            <div className="dashboard-vehicles-list">

              {vehicles.slice(0, 3).map((vehicle) => (
                <div
                  className="dashboard-vehicle-item"
                  key={vehicle._id}
                >
                  <div className="dashboard-vehicle-icon">
                    <CarFront size={25} />
                  </div>

                  <div className="dashboard-vehicle-info">
                    <h4>
                      {vehicle.brand} {vehicle.model}
                    </h4>

                    <p>{vehicle.registrationNumber}</p>
                  </div>

                  <span className="dashboard-vehicle-type">
                    {vehicle.vehicleType}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* RECENT ACTIVITY */}

        <section className="dashboard-recent-activity">

          <div className="dashboard-section-heading">
            <div>
              <h2>Recent Activity</h2>
              <p>Your latest service bookings</p>
            </div>

            <Link to="/user/services">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="dashboard-empty">
              Loading recent activity...
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="dashboard-empty">
              <CalendarDays size={35} />
              <p>No recent service bookings yet.</p>

              <Link to="/user/services">
                <Wrench size={17} />
                Book a Service
              </Link>
            </div>
          ) : (
            <div className="dashboard-vehicles-list">

              {recentBookings.map((booking) => (
                <div
                  className="dashboard-vehicle-item"
                  key={booking._id}
                >
                  <div className="dashboard-vehicle-icon">
                    <CalendarDays size={23} />
                  </div>

                  <div className="dashboard-vehicle-info">
                    <h4>
                      {booking.serviceType || "Vehicle Service"}
                    </h4>

                    <p>
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString()
                        : "Date not available"}
                    </p>
                  </div>

                  <span
                    className={`dashboard-vehicle-type ${getStatusClass(
                      booking.status
                    )}`}
                  >
                    {booking.status || "pending"}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* REMINDER SHORTCUT */}

        <section className="dashboard-recent-activity">

          <div className="dashboard-section-heading">
            <div>
              <h2>Maintenance Overview</h2>
              <p>Stay updated with your vehicle maintenance</p>
            </div>
          </div>

          <div className="dashboard-actions">

            <Link
              to="/user/reminders"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon orange">
                <Clock size={25} />
              </div>

              <span>
                {pendingReminders.length} Pending Reminders
              </span>

              <ArrowRight size={18} />
            </Link>

            <Link
              to="/user/insurance"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon green">
                <CheckCircle size={25} />
              </div>

              <span>
                {activePolicies.length} Active Policies
              </span>

              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default UserDashboard;
