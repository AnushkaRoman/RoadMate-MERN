
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

const ProviderAddCenter = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    services: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.phone.trim() ||
      !formData.services.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    const token = localStorage.getItem("roadmateToken");

    if (!token) {
      setError("Please login as a Service Provider.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      phone: formData.phone.trim(),
      services: formData.services
        .split(",")
        .map((service) => service.trim())
        .filter(Boolean),
    };

    try {
      setLoading(true);

      const response = await api.post(
        "/service-centers",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message ||
          "Service Center registered successfully!"
      );

      setFormData({
        name: "",
        address: "",
        city: "",
        phone: "",
        services: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to register service center."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-7">
          <div className="card shadow border-0 p-4">
            <div className="mb-3">
              <Link
                to="/provider/dashboard"
                className="text-decoration-none"
              >
                ← Back to Dashboard
              </Link>
            </div>

            <h2 className="text-center mb-2">
              Register Service Center
            </h2>

            <p className="text-center text-muted mb-4">
              Add your automobile service center to RoadMate.
            </p>

            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
                <br />
                <strong>Status: Pending Admin Approval</strong>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">
                  Service Center Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Enter service center name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  className="form-control"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="10-digit mobile number"
                  maxLength="10"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Services Offered
                </label>
                <textarea
                  name="services"
                  className="form-control"
                  rows="3"
                  placeholder="General Service, Oil Change, Brake Repair"
                  value={formData.services}
                  onChange={handleChange}
                  required
                />
                <small className="text-muted">
                  Separate multiple services using commas.
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading
                  ? "Registering..."
                  : "Register Service Center"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderAddCenter;
