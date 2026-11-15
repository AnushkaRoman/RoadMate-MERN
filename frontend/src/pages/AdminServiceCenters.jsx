
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const AdminServiceCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("roadmateToken");

      const response = await api.get("/service-centers/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCenters(response.data.serviceCenters || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch service centers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const approveCenter = async (id) => {
    try {
      const token = localStorage.getItem("roadmateToken");

      await api.patch(
        `/service-centers/admin/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Service center approved successfully!");
      fetchCenters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to approve service center."
      );
    }
  };

  const toggleCenterStatus = async (id) => {
    try {
      const token = localStorage.getItem("roadmateToken");

      await api.patch(
        `/service-centers/admin/${id}/toggle-status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Service center status updated successfully!");
      fetchCenters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update service center status."
      );
    }
  };

  return (
    <div className="user-dashboard">
      <aside className="dashboard-sidebar">
        <h2 className="dashboard-brand">RoadMate</h2>

        <nav className="dashboard-nav">
          <Link to="/admin/dashboard" className="dashboard-nav-item">
            Dashboard
          </Link>

          <Link
            to="/admin/service-centers"
            className="dashboard-nav-item"
          >
            Manage Service Centers
          </Link>

          <Link to="/admin/users" className="dashboard-nav-item">
            Manage Users
          </Link>

          <Link to="/admin/fuel-stations" className="dashboard-nav-item">
            Manage Fuel Stations
          </Link>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <h3>Admin - Service Center Management</h3>

          <Link to="/admin/dashboard" className="btn btn-outline-secondary">
            Back to Dashboard
          </Link>
        </header>

        <section className="dashboard-welcome">
          <h1>Manage Service Centers</h1>
          <p>
            Approve service centers and manage their operational status.
          </p>
        </section>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Total Service Centers: {centers.length}</h4>

          <button
            className="btn btn-primary"
            onClick={fetchCenters}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading service centers...</p>
        ) : centers.length === 0 ? (
          <div className="alert alert-info">
            No service centers found.
          </div>
        ) : (
          <div className="row">
            {centers.map((center) => (
              <div className="col-md-6 col-lg-4 mb-4" key={center._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">{center.name}</h5>

                    <p className="text-muted mb-2">
                      {center.address}, {center.city}
                    </p>

                    <p>
                      <strong>Phone:</strong> {center.phone}
                    </p>

                    <p>
                      <strong>Provider:</strong>{" "}
                      {center.provider?.name || "Unknown"}
                    </p>

                    <p>
                      <strong>Email:</strong>{" "}
                      {center.provider?.email || "N/A"}
                    </p>

                    <p>
                      <strong>Services:</strong>{" "}
                      {center.services?.length
                        ? center.services.join(", ")
                        : "Not specified"}
                    </p>

                    <div className="mb-3">
                      <strong>Approval: </strong>
                      <span
                        className={`badge ${
                          center.isApproved
                            ? "bg-success"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {center.isApproved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    <div className="mb-3">
                      <strong>Status: </strong>
                      <span
                        className={`badge ${
                          center.isActive ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {center.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    {!center.isApproved ? (
                      <button
                        className="btn btn-success w-100"
                        onClick={() => approveCenter(center._id)}
                      >
                        Approve Service Center
                      </button>
                    ) : (
                      <button
                        className={`btn ${
                          center.isActive
                            ? "btn-danger"
                            : "btn-success"
                        } w-100`}
                        onClick={() => toggleCenterStatus(center._id)}
                      >
                        {center.isActive
                          ? "Deactivate Center"
                          : "Activate Center"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminServiceCenters;
