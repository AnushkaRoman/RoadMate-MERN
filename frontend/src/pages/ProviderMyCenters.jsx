
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ProviderMyCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("roadmateToken");

      const response = await api.get(
        "/service-centers/my-centers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        response.data.data ||
        response.data.serviceCenters ||
        response.data.centers ||
        [];

      setCenters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load service centers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>My Service Centers</h2>
          <p className="text-muted">
            Manage your registered service centers.
          </p>
        </div>

        <Link
          to="/provider/add-center"
          className="btn btn-primary"
        >
          + Register New Center
        </Link>
      </div>

      {loading && (
        <div className="text-center py-5">
          Loading service centers...
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchCenters}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && centers.length === 0 && (
        <div className="card p-5 text-center shadow-sm">
          <h4>No Service Centers Registered</h4>
          <p className="text-muted">
            Register your first service center to get started.
          </p>
          <Link
            to="/provider/add-center"
            className="btn btn-primary mx-auto"
          >
            Register Service Center
          </Link>
        </div>
      )}

      {!loading && centers.length > 0 && (
        <div className="row g-4">
          {centers.map((center) => (
            <div className="col-md-6 col-lg-4" key={center._id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <h5 className="card-title">{center.name}</h5>

                  <p className="text-muted mb-2">
                    📍 {center.city}
                  </p>

                  <p className="mb-2">
                    <strong>Address:</strong> {center.address}
                  </p>

                  <p className="mb-2">
                    <strong>Phone:</strong> {center.phone}
                  </p>

                  <div className="mb-3">
                    <strong>Services:</strong>
                    <div className="mt-2">
                      {(center.services || []).map(
                        (service, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark border me-1 mb-1"
                          >
                            {service}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <span
                      className={`badge ${
                        center.isApproved
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {center.isApproved
                        ? "Approved"
                        : "Pending Approval"}
                    </span>

                    <span
                      className={`badge ${
                        center.isActive
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      {center.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <Link
          to="/provider/dashboard"
          className="text-decoration-none"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProviderMyCenters;
