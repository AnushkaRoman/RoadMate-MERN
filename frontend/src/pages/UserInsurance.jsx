
import { useEffect, useState } from "react";
import api from "../services/api";

const UserInsurance = () => {
  const [vehicles, setVehicles] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    vehicle: "",
    provider: "",
    policyNumber: "",
    insuranceType: "comprehensive",
    coverageAmount: "",
    premiumAmount: "",
    startDate: "",
    expiryDate: ""
  });

  const loadData = async () => {
    try {
      const [vehicleRes, policyRes] = await Promise.all([
        api.get("/vehicles/my-vehicles"),
        api.get("/insurance/my-policies")
      ]);

      setVehicles(vehicleRes.data.vehicles || []);
      setPolicies(policyRes.data.policies || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load insurance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      vehicle: "",
      provider: "",
      policyNumber: "",
      insuranceType: "comprehensive",
      coverageAmount: "",
      premiumAmount: "",
      startDate: "",
      expiryDate: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(form.expiryDate) < new Date(form.startDate)) {
      alert("Expiry date must be after start date");
      return;
    }

    try {
      const payload = {
        ...form,
        coverageAmount: Number(form.coverageAmount),
        premiumAmount: Number(form.premiumAmount)
      };

      if (editingId) {
        delete payload.vehicle;
        await api.put(`/insurance/${editingId}`, payload);
        alert("Policy updated successfully");
      } else {
        await api.post("/insurance", payload);
        alert("Policy added successfully");
      }

      resetForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save policy");
    }
  };

  const handleEdit = (policy) => {
    setEditingId(policy._id);

    setForm({
      vehicle: policy.vehicle?._id || policy.vehicle,
      provider: policy.provider,
      policyNumber: policy.policyNumber,
      insuranceType: policy.insuranceType,
      coverageAmount: policy.coverageAmount,
      premiumAmount: policy.premiumAmount,
      startDate: policy.startDate?.split("T")[0] || "",
      expiryDate: policy.expiryDate?.split("T")[0] || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this insurance policy?")) return;

    try {
      await api.delete(`/insurance/${id}`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete policy");
    }
  };

  const getPolicyStatus = (policy) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(policy.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    if (!policy.isActive) return "Inactive";
    if (expiry < today) return "Expired";
    return "Active";
  };

  const activeCount = policies.filter(
    (p) => getPolicyStatus(p) === "Active"
  ).length;

  const expiredCount = policies.filter(
    (p) => getPolicyStatus(p) === "Expired"
  ).length;

  const upcomingCount = policies.filter((p) => {
    const days =
      (new Date(p.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    return getPolicyStatus(p) === "Active" && days <= 30 && days >= 0;
  }).length;

  if (loading) {
    return <div className="container mt-4">Loading insurance policies...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Insurance Management</h2>
      <p className="text-muted mb-4">
        Manage vehicle insurance policies and expiry dates.
      </p>

      {/* Statistics */}
      <div className="row g-3 mb-4">
        {[
          ["Total Policies", policies.length, "primary"],
          ["Active", activeCount, "success"],
          ["Expiring Soon", upcomingCount, "warning"],
          ["Expired", expiredCount, "danger"]
        ].map(([label, value, color]) => (
          <div className="col-6 col-md-3" key={label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="text-muted small">{label}</div>
                <h3 className={`text-${color} fw-bold mb-0`}>{value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Policy */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editingId ? "Edit Policy" : "Add Insurance Policy"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Vehicle</label>
                <select
                  className="form-select"
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  disabled={!!editingId}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.brand} {v.model} - {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Insurance Provider</label>
                <input
                  className="form-control"
                  name="provider"
                  value={form.provider}
                  onChange={handleChange}
                  placeholder="Insurance company"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Policy Number</label>
                <input
                  className="form-control"
                  name="policyNumber"
                  value={form.policyNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Insurance Type</label>
                <select
                  className="form-select"
                  name="insuranceType"
                  value={form.insuranceType}
                  onChange={handleChange}
                  required
                >
                  <option value="comprehensive">Comprehensive</option>
                  <option value="third-party">Third Party</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Coverage Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="coverageAmount"
                  value={form.coverageAmount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Premium Amount (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  name="premiumAmount"
                  value={form.premiumAmount}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <button className="btn btn-primary me-2" type="submit">
                  {editingId ? "Update Policy" : "Add Policy"}
                </button>

                {editingId && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Policies Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">My Insurance Policies</h5>

          {policies.length === 0 ? (
            <div className="text-center text-muted py-4">
              No insurance policies found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Provider</th>
                    <th>Policy Number</th>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Premium</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.map((p) => {
                    const status = getPolicyStatus(p);

                    return (
                      <tr key={p._id}>
                        <td>{p.provider}</td>
                        <td>{p.policyNumber}</td>
                        <td>
                          {p.vehicle
                            ? `${p.vehicle.brand} ${p.vehicle.model}`
                            : "Vehicle"}
                        </td>
                        <td>
                          <span className="badge bg-secondary">
                            {p.insuranceType}
                          </span>
                        </td>
                        <td>₹{p.premiumAmount}</td>
                        <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              status === "Active"
                                ? "bg-success"
                                : status === "Expired"
                                ? "bg-danger"
                                : "bg-secondary"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-warning"
                              onClick={() => handleEdit(p)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(p._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInsurance;
