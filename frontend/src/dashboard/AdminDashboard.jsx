
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("roadmateUser") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("roadmateToken");
    localStorage.removeItem("roadmateUser");
    navigate("/login");
  };

  return (
    <div className="user-dashboard">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-brand">RoadMate</h2>

        <nav className="dashboard-nav">
          <Link
            to="/admin/dashboard"
            className="dashboard-nav-item"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/service-centers"
            className="dashboard-nav-item"
          >
            Manage Service Centers
          </Link>

          <Link
            to="/admin/users"
            className="dashboard-nav-item"
          >
            Manage Users
          </Link>

          <Link
            to="/admin/fuel-stations"
            className="dashboard-nav-item"
          >
            Manage Fuel Stations
          </Link>

          <Link
            to="/admin/settings"
            className="dashboard-nav-item"
          >
            Settings
          </Link>

          <button
            className="dashboard-nav-item"
            onClick={logout}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">

        <header className="dashboard-topbar">
          <h3>Admin Dashboard</h3>
          <span>{user.name || "Administrator"}</span>
        </header>

        <section className="dashboard-welcome">
          <h1>
            Welcome, {user.name || "Admin"}!
          </h1>

          <p>
            Manage RoadMate users, service centers,
            and fuel station information.
          </p>
        </section>

        {/* OVERVIEW CARDS */}
        <section className="dashboard-stats">

          <div className="dashboard-stat-card">
            <h3>Manage</h3>
            <p>Service Centers</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Manage</h3>
            <p>Users</p>
          </div>

          <div className="dashboard-stat-card">
            <h3>Manage</h3>
            <p>Fuel Stations</p>
          </div>

        </section>

        {/* QUICK ACTIONS */}
        <section className="dashboard-actions">

          <Link
            to="/admin/service-centers"
            className="dashboard-action-card"
          >
            <h3>Manage Service Centers</h3>
            <p>
              Approve service center registrations
              and manage their status.
            </p>
          </Link>

          <Link
            to="/admin/users"
            className="dashboard-action-card"
          >
            <h3>Manage Users</h3>
            <p>
              View users and service providers
              registered on RoadMate.
            </p>
          </Link>

          <Link
            to="/admin/fuel-stations"
            className="dashboard-action-card"
          >
            <h3>Manage Fuel Stations</h3>
            <p>
              Manage fuel station information
              available on RoadMate.
            </p>
          </Link>

        </section>

      </main>
    </div>
  );
};

export default AdminDashboard;
