
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminFuelStations = () => {
  const navigate = useNavigate();

  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("roadmateToken");

  // Fetch all fuel stations
  const fetchStations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fuel-stations/admin/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStations(response.data.stations);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load fuel stations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Activate / deactivate station
  const toggleStatus = async (station) => {
    try {
      setError("");
      setMessage("");

      const response = await api.patch(
        `/fuel-stations/${station._id}/status`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      fetchStations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update station status"
      );
    }
  };

  // Delete station
  const deleteStation = async (station) => {
    const confirmed = window.confirm(
      `Delete ${station.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await api.delete(`/fuel-stations/${station._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
      fetchStations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete station"
      );
    }
  };

  const filteredStations = stations.filter((station) =>
    `${station.name} ${station.city} ${station.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h2 className="fw-bold">Manage Fuel Stations</h2>
          <p className="text-muted mb-0">
            Add, update and manage fuel station locations.
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary"
            onClick={fetchStations}
          >
            Refresh
          </button>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/admin/fuel-stations/add")}
          >
            + Add Fuel Station
          </button>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control"
                placeholder="Search station, city or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="col-md-7 text-md-end mt-2 mt-md-0">
              <span className="badge bg-primary fs-6">
                Total Stations: {stations.length}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2">Loading stations...</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Station</th>
                    <th>Location</th>
                    <th>Phone</th>
                    <th>Fuel Types</th>
                    <th>Petrol ₹/L</th>
                    <th>Diesel ₹/L</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStations.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        No fuel stations found.
                      </td>
                    </tr>
                  ) : (
                    filteredStations.map((station, index) => (
                      <tr key={station._id}>
                        <td>{index + 1}</td>
                        <td className="fw-semibold">{station.name}</td>
                        <td>
                          {station.address}, {station.city}
                        </td>
                        <td>{station.phone}</td>
                        <td>
                          {(station.fuelTypes || []).join(", ")}
                        </td>
                        <td>₹{station.petrolPrice}</td>
                        <td>₹{station.dieselPrice}</td>
                        <td>
                          {station.isActive ? (
                            <span className="badge bg-success">Active</span>
                          ) : (
                            <span className="badge bg-danger">Inactive</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className={`btn btn-sm ${
                                station.isActive
                                  ? "btn-warning"
                                  : "btn-success"
                              }`}
                              onClick={() => toggleStatus(station)}
                            >
                              {station.isActive ? "Deactivate" : "Activate"}
                            </button>

                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteStation(station)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFuelStations;
