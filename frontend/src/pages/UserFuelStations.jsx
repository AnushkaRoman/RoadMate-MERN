
import React, { useEffect, useState } from "react";
import api from "../services/api";

const UserFuelStations = () => {
  const [stations, setStations] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch active fuel stations
  const fetchStations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/fuel-stations");
      setStations(response.data.stations);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load fuel stations"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  // Search station by name, city or address
  const filteredStations = stations.filter((station) =>
    `${station.name} ${station.city} ${station.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">Find Fuel Stations</h2>
          <p className="text-muted">
            Find fuel stations and check fuel prices.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchStations}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by station name, city or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-2">Loading fuel stations...</p>
        </div>
      ) : filteredStations.length === 0 ? (
        <div className="alert alert-info text-center">
          No fuel stations found.
        </div>
      ) : (
        <div className="row g-4">
          {filteredStations.map((station) => (
            <div className="col-md-6 col-lg-4" key={station._id}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="fw-bold">{station.name}</h5>
                    <span className="badge bg-success">Active</span>
                  </div>

                  <p className="text-muted mb-2">
                    <i className="bi bi-geo-alt me-2"></i>
                    {station.address}, {station.city}
                  </p>

                  <p className="mb-2">
                    <strong>Phone:</strong> {station.phone}
                  </p>

                  <p className="mb-3">
                    <strong>Available Fuels:</strong>{" "}
                    {(station.fuelTypes || []).join(", ")}
                  </p>

                  <div className="bg-light rounded p-3">
                    <div className="d-flex justify-content-between">
                      <span>Petrol</span>
                      <strong>
                        ₹{Number(station.petrolPrice || 0).toFixed(2)}/L
                      </strong>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">
                      <span>Diesel</span>
                      <strong>
                        ₹{Number(station.dieselPrice || 0).toFixed(2)}/L
                      </strong>
                    </div>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${station.name}, ${station.address}, ${station.city}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary w-100 mt-3"
                  >
                    View on Google Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFuelStations;
