
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CarFront } from "lucide-react";
import api from "../services/api";

function AddVehicle() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: "Car",
    brand: "",
    model: "",
    registrationNumber: "",
    fuelType: "Petrol",
    manufacturingYear: new Date().getFullYear(),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("roadmateToken");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !formData.brand.trim() ||
      !formData.model.trim() ||
      !formData.registrationNumber.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/vehicles",
        {
          ...formData,
          brand: formData.brand.trim(),
          model: formData.model.trim(),
          registrationNumber: formData.registrationNumber.trim().toUpperCase(),
          manufacturingYear: Number(formData.manufacturingYear),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message || "Vehicle added successfully!");

      setTimeout(() => {
        navigate("/user/vehicles");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to add vehicle. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vehicle-page">
      <div className="vehicle-form-container">
        <Link to="/user/dashboard" className="vehicle-back-link">
          <ArrowLeft size={18} /> Back to Dashboard
        </Link>

        <div className="vehicle-form-heading">
          <div className="vehicle-icon-box">
            <CarFront size={30} />
          </div>
          <h1>Add Your Vehicle</h1>
          <p>Register your vehicle to manage services and reminders.</p>
        </div>

        {error && <div className="vehicle-alert error">{error}</div>}
        {success && <div className="vehicle-alert success">{success}</div>}

        <form onSubmit={handleSubmit} className="vehicle-form">
          <div className="vehicle-form-grid">
            <div className="vehicle-field">
              <label>Vehicle Type *</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                required
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="vehicle-field">
              <label>Fuel Type *</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                required
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="CNG">CNG</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="vehicle-field">
              <label>Brand *</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Tata"
                required
              />
            </div>

            <div className="vehicle-field">
              <label>Model *</label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g. Nexon"
                required
              />
            </div>

            <div className="vehicle-field full-width">
              <label>Registration Number *</label>
              <input
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
                placeholder="e.g. MH12AB1234"
                style={{ textTransform: "uppercase" }}
                required
              />
            </div>

            <div className="vehicle-field full-width">
              <label>Manufacturing Year *</label>
              <select
                name="manufacturingYear"
                value={formData.manufacturingYear}
                onChange={handleChange}
                required
              >
                {Array.from(
                  { length: 40 },
                  (_, index) => new Date().getFullYear() - index
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="vehicle-submit-btn"
            disabled={loading}
          >
            {loading ? "Registering Vehicle..." : "Register Vehicle"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddVehicle;
