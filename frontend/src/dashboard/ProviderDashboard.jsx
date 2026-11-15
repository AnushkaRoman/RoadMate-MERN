
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Wrench,
  Building2,
  CalendarDays,
  Clock,
  CheckCircle,
  Plus,
  ArrowRight,
  LogOut,
  UserRound,
} from "lucide-react";

import api from "../services/api";

const ProviderDashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [loadingCenters, setLoadingCenters] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState("");

  // ---------------- LOAD USER ----------------

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

  // ---------------- FETCH SERVICE CENTERS ----------------

  useEffect(() => {
    const fetchCenters = async () => {
      const token = localStorage.getItem("roadmateToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(
          "/service-centers/my-centers",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const serviceCenters =
          response.data.data ||
          response.data.serviceCenters ||
          response.data.centers ||
          [];

        setCenters(
          Array.isArray(serviceCenters) ? serviceCenters : []
        );
      } catch (err) {
        console.error("Service center fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("roadmateToken");
          localStorage.removeItem("roadmateUser");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load service centers."
          );
        }
      } finally {
        setLoadingCenters(false);
      }
    };

    fetchCenters();
  }, [navigate]);

  // ---------------- FETCH BOOKINGS ----------------

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("roadmateToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await api.get(
          "/provider/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(response.data.bookings || []);
      } catch (err) {
        console.error("Provider booking fetch error:", err);

        if (err.response?.status === 401) {
          localStorage.removeItem("roadmateToken");
          localStorage.removeItem("roadmateUser");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.message ||
              "Unable to load service bookings."
          );
        }
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  // ---------------- STATISTICS ----------------

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "pending"
  );

  const completedServices = bookings.filter(
    (booking) => booking.status === "completed"
  );

  const activeBookings = bookings.filter(
    (booking) =>
      ["accepted", "in-progress"].includes(booking.status)
  );

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.bookingDate) -
        new Date(a.createdAt || a.bookingDate)
    )
    .slice(0, 5);

  // ---------------- STATUS STYLE ----------------

  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
      case "completed":
        return "green";

      case "pending":
        return "orange";

      case "rejected":
      case "cancelled":
        return "red";

      case "in-progress":
        return "blue";

      default:
        return "orange";
    }
  };

  // ---------------- LOGOUT ----------------

  const logout = () => {
    localStorage.removeItem("roadmateToken");
    localStorage.removeItem("roadmateUser");
    navigate("/login");
  };

  return (
    <div className="user-dashboard">

      {/* SIDEBAR */}

      <aside className="dashboard-sidebar">

        <Link to="/" className="dashboard-brand">
          <Building2 size={28} />
          <span>RoadMate</span>
        </Link>

        <div className="dashboard-user-profile">
          <div className="dashboard-profile-icon">
            <UserRound size={22} />
          </div>

          <div>
            <h4>{user.name || "Service Provider"}</h4>
            <p>Service Provider</p>
          </div>
        </div>

        <nav className="dashboard-nav">

          <Link
            to="/provider/dashboard"
            className="dashboard-nav-item"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            to="/provider/add-center"
            className="dashboard-nav-item"
          >
            <Plus size={18} />
            Register Service Center
          </Link>

          <Link
            to="/provider/my-centers"
            className="dashboard-nav-item"
          >
            <Building2 size={18} />
            My Service Centers
          </Link>

          <Link
            to="/provider/bookings"
            className="dashboard-nav-item"
          >
            <Wrench size={18} />
            Service Bookings
          </Link>

          <Link
            to="/provider/settings"
            className="dashboard-nav-item"
          >
            <UserRound size={18} />
            Settings
          </Link>

        </nav>

        <button
          className="dashboard-nav-item logout-button"
          onClick={logout}
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
              RoadMate / Provider
            </span>
            <h2>Service Provider Dashboard</h2>
          </div>

          <div className="dashboard-topbar-user">
            <UserRound size={20} />
            <span>{user.name || "Provider"}</span>
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
              SERVICE MANAGEMENT
            </span>

            <h1>
              Welcome, {user.name?.split(" ")[0] || "Provider"}!
            </h1>

            <p>
              Manage your service centers, customer bookings,
              and automotive services from one place.
            </p>

            <Link
              to="/provider/add-center"
              className="dashboard-welcome-button"
            >
              <Plus size={18} />
              Register Service Center
            </Link>
          </div>

          <div className="dashboard-welcome-icon">
            <Building2 size={90} />
          </div>
        </section>

        {/* STATISTICS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon blue">
              <Building2 size={24} />
            </div>

            <p>Service Centers</p>
            <h2>
              {loadingCenters ? "..." : centers.length}
            </h2>
            <span>Registered centers</span>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon orange">
              <Clock size={24} />
            </div>

            <p>Pending Bookings</p>
            <h2>
              {loadingBookings ? "..." : pendingBookings.length}
            </h2>
            <span>Awaiting response</span>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon green">
              <CheckCircle size={24} />
            </div>

            <p>Completed Services</p>
            <h2>
              {loadingBookings ? "..." : completedServices.length}
            </h2>
            <span>Successfully completed</span>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon purple">
              <Wrench size={24} />
            </div>

            <p>Active Services</p>
            <h2>
              {loadingBookings ? "..." : activeBookings.length}
            </h2>
            <span>Accepted or in progress</span>
          </div>

        </section>

        {/* QUICK ACTIONS */}

        <section className="dashboard-quick-actions">

          <div className="dashboard-section-heading">
            <div>
              <h2>Quick Actions</h2>
              <p>Manage your service business</p>
            </div>
          </div>

          <div className="dashboard-actions">

            <Link
              to="/provider/add-center"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon blue">
                <Plus size={25} />
              </div>

              <span>Register Center</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/provider/my-centers"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon green">
                <Building2 size={25} />
              </div>

              <span>My Centers</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/provider/bookings"
              className="dashboard-action-card"
            >
              <div className="dashboard-action-icon orange">
                <Wrench size={25} />
              </div>

              <span>Manage Bookings</span>
              <ArrowRight size={18} />
            </Link>

          </div>

        </section>

        {/* RECENT BOOKINGS */}

        <section className="dashboard-recent-activity">

          <div className="dashboard-section-heading">
            <div>
              <h2>Recent Bookings</h2>
              <p>Your latest customer service requests</p>
            </div>

            <Link to="/provider/bookings">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loadingBookings ? (
            <div className="dashboard-empty">
              Loading bookings...
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="dashboard-empty">
              <CalendarDays size={35} />

              <p>No service bookings received yet.</p>
            </div>
          ) : (
            <div className="dashboard-vehicles-list">

              {recentBookings.map((booking) => (
                <div
                  className="dashboard-vehicle-item"
                  key={booking._id}
                >
                  <div className="dashboard-vehicle-icon">
                    <CalendarDays size={24} />
                  </div>

                  <div className="dashboard-vehicle-info">
                    <h4>
                      {booking.serviceType || "Vehicle Service"}
                    </h4>

                    <p>
                      {booking.bookingDate
                        ? new Date(
                            booking.bookingDate
                          ).toLocaleDateString()
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

        {/* SERVICE CENTER OVERVIEW */}

        <section className="dashboard-vehicles-section">

          <div className="dashboard-section-heading">
            <div>
              <h2>My Service Centers</h2>
              <p>Your registered automotive service centers</p>
            </div>

            <Link to="/provider/my-centers">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loadingCenters ? (
            <div className="dashboard-empty">
              Loading service centers...
            </div>
          ) : centers.length === 0 ? (
            <div className="dashboard-empty">
              <Building2 size={40} />

              <h3>No service centers registered</h3>

              <p>
                Register your first service center to start
                receiving bookings.
              </p>

              <Link to="/provider/add-center">
                <Plus size={17} />
                Register Center
              </Link>
            </div>
          ) : (
            <div className="dashboard-vehicles-list">

              {centers.slice(0, 3).map((center) => (
                <div
                  className="dashboard-vehicle-item"
                  key={center._id}
                >
                  <div className="dashboard-vehicle-icon">
                    <Building2 size={24} />
                  </div>

                  <div className="dashboard-vehicle-info">
                    <h4>
                      {center.name || "Service Center"}
                    </h4>

                    <p>
                      {center.city || center.address || "Location not available"}
                    </p>
                  </div>

                  <span
                    className={`dashboard-vehicle-type ${
                      center.isApproved ? "green" : "orange"
                    }`}
                  >
                    {center.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
              ))}

            </div>
          )}

        </section>

      </main>

    </div>
  );
};

export default ProviderDashboard;
