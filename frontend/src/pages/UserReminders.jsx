
import { useEffect, useState } from "react";
import api from "../services/api";

const UserReminders = () => {
  const [vehicles, setVehicles] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    vehicle: "",
    title: "",
    description: "",
    reminderType: "service",
    dueDate: ""
  });

  const loadData = async () => {
    try {
      const [vehicleRes, reminderRes] = await Promise.all([
        api.get("/vehicles/my-vehicles"),
        api.get("/reminders/my-reminders")
      ]);

      setVehicles(vehicleRes.data.vehicles || []);
      setReminders(reminderRes.data.reminders || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load reminders");
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
      title: "",
      description: "",
      reminderType: "service",
      dueDate: ""
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/reminders/${editingId}`, {
          title: form.title,
          description: form.description,
          reminderType: form.reminderType,
          dueDate: form.dueDate
        });
        alert("Reminder updated successfully");
      } else {
        await api.post("/reminders", form);
        alert("Reminder added successfully");
      }

      resetForm();
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save reminder");
    }
  };

  const handleEdit = (reminder) => {
    setEditingId(reminder._id);

    setForm({
      vehicle: reminder.vehicle?._id || reminder.vehicle,
      title: reminder.title,
      description: reminder.description || "",
      reminderType: reminder.reminderType,
      dueDate: reminder.dueDate?.split("T")[0] || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleComplete = async (reminder) => {
    try {
      await api.put(`/reminders/${reminder._id}`, {
        isCompleted: !reminder.isCompleted
      });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update reminder");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;

    try {
      await api.delete(`/reminders/${id}`);
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete reminder");
    }
  };

  const isOverdue = (reminder) =>
    !reminder.isCompleted &&
    new Date(reminder.dueDate).setHours(0, 0, 0, 0) <
      new Date().setHours(0, 0, 0, 0);

  const upcoming = reminders.filter(
    (r) => !r.isCompleted && !isOverdue(r)
  );

  const overdue = reminders.filter(isOverdue);

  const completed = reminders.filter((r) => r.isCompleted);

  if (loading) {
    return <div className="container mt-4">Loading reminders...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Service Reminders</h2>
      <p className="text-muted mb-4">
        Keep track of vehicle maintenance and important renewals.
      </p>

      {/* Statistics */}
      <div className="row g-3 mb-4">
        {[
          ["Total", reminders.length, "primary"],
          ["Upcoming", upcoming.length, "info"],
          ["Overdue", overdue.length, "danger"],
          ["Completed", completed.length, "success"]
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

      {/* Reminder Form */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            {editingId ? "Edit Reminder" : "Add New Reminder"}
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
                  required
                  disabled={!!editingId}
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
                <label className="form-label">Reminder Type</label>
                <select
                  className="form-select"
                  name="reminderType"
                  value={form.reminderType}
                  onChange={handleChange}
                  required
                >
                  <option value="service">Service</option>
                  <option value="insurance">Insurance</option>
                  <option value="puc">PUC</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Title</label>
                <input
                  className="form-control"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Insurance Renewal"
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Additional details..."
                />
              </div>

              <div className="col-12">
                <button className="btn btn-primary me-2" type="submit">
                  {editingId ? "Update Reminder" : "Add Reminder"}
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

      {/* Reminders List */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">My Reminders</h5>

          {reminders.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No reminders found. Add your first reminder above.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Reminder</th>
                    <th>Vehicle</th>
                    <th>Type</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reminders.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <div className="fw-semibold">{r.title}</div>
                        <small className="text-muted">{r.description}</small>
                      </td>
                      <td>
                        {r.vehicle
                          ? `${r.vehicle.brand} ${r.vehicle.model}`
                          : "Vehicle"}
                      </td>
                      <td>
                        <span className="badge bg-secondary">
                          {r.reminderType.toUpperCase()}
                        </span>
                      </td>
                      <td>{new Date(r.dueDate).toLocaleDateString()}</td>
                      <td>
                        {r.isCompleted ? (
                          <span className="badge bg-success">Completed</span>
                        ) : isOverdue(r) ? (
                          <span className="badge bg-danger">Overdue</span>
                        ) : (
                          <span className="badge bg-info text-dark">Upcoming</span>
                        )}
                      </td>
                      <td>
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleComplete(r)}
                          >
                            {r.isCompleted ? "Undo" : "Complete"}
                          </button>
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(r)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(r._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReminders;
