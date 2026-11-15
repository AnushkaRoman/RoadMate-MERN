
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AdminAddFuelStation = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    fuelTypes: ["Petrol", "Diesel"],
    petrolPrice: "",
    dieselPrice: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("roadmateToken");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFuelType = (type) => {
    setForm((prev) => ({
      ...prev,
      fuelTypes: prev.fuelTypes.includes(type)
        ? prev.fuelTypes.filter((fuel) => fuel !== type)
        : [...prev.fuelTypes, type],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.fuelTypes.length) {
      setError("Select at least one fuel type");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/fuel-stations",
        {
          ...form,
          petrolPrice: Number(form.petrolPrice || 0),
          dieselPrice: Number(form.dieselPrice || 0),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/admin/fuel-stations");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add fuel station"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Add Fuel Station</h2>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/admin/fuel-stations")}
        >
          Back
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-4">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Station Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Address *</label>
                <input
                  type="text"
                  name="address"
                  className="form-control"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">City *</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label d-block">Fuel Types *</label>

                {["Petrol", "Diesel", "CNG", "EV Charging"].map((type) => (
                  <div className="form-check form-check-inline" key={type}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.fuelTypes.includes(type)}
                      onChange={() => handleFuelType(type)}
                    />
                    <label className="form-check-label">{type}</label>
                  </div>
                ))}
              </div>

              <div className="col-md-6">
                <label className="form-label">Petrol Price (₹/L)</label>
                <input
                  type="number"
                  name="petrolPrice"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={form.petrolPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Diesel Price (₹/L)</label>
                <input
                  type="number"
                  name="dieselPrice"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={form.dieselPrice}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mt-4">
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Fuel Station"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddFuelStation;
