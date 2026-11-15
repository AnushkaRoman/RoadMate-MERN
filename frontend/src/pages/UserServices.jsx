
import { useEffect, useState } from "react";
import api from "../services/api";

function UserServices() {
  const [centers, setCenters] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    vehicle: "",
    serviceCenter: "",
    serviceType: "",
    bookingDate: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const loadData = async () => {
    try {
      setLoading(true);

      const [centerRes, vehicleRes, bookingRes] = await Promise.all([
        api.get("/service-centers"),
        api.get("/vehicles/my-vehicles"),
        api.get("/bookings/my-bookings"),
      ]);

      setCenters(centerRes.data.serviceCenters || centerRes.data.centers || centerRes.data.data || []);
      setVehicles(vehicleRes.data.vehicles || vehicleRes.data.data || []);
      setBookings(bookingRes.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.post("/bookings", form);
      setMessage("Service booked successfully!");
      setForm({
        vehicle: "",
        serviceCenter: "",
        serviceType: "",
        bookingDate: "",
      });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.patch(`/bookings/${id}/cancel`);
      setMessage("Booking cancelled successfully.");
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Cancellation failed.");
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading services...</div>;
  }

  return (
    <div className="container py-4">
      <h2 className="mb-4">My Services</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Book a Vehicle Service</div>

        <div className="card-body">
          <form onSubmit={handleBooking}>
            <div className="mb-3">
              <label className="form-label">Select Vehicle</label>
              <select
                className="form-select"
                name="vehicle"
                value={form.vehicle}
                onChange={handleChange}
                required
              >
                <option value="">Choose vehicle</option>
                {vehicles.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.vehicleName || v.name || v.registrationNumber || v.vehicleNumber}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Service Center</label>
              <select
                className="form-select"
                name="serviceCenter"
                value={form.serviceCenter}
                onChange={handleChange}
                required
              >
                <option value="">Choose service center</option>
                {centers.map((center) => (
                  <option key={center._id} value={center._id}>
                    {center.name} - {center.city}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Service Type</label>
              <input
                className="form-control"
                name="serviceType"
                placeholder="e.g. General Service, Oil Change, Repair"
                value={form.serviceType}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Booking Date</label>
              <input
                type="date"
                className="form-control"
                name="bookingDate"
                min={today}
                value={form.bookingDate}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Book Service
            </button>
          </form>
        </div>
      </div>

      <h4 className="mb-3">My Booking History</h4>

      {bookings.length === 0 ? (
        <div className="alert alert-info">No service bookings found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Service Center</th>
                <th>Vehicle</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.serviceCenter?.name || "Service Center"}</td>
                  <td>
                    {booking.vehicle?.vehicleName ||
                      booking.vehicle?.registrationNumber ||
                      booking.vehicle?.vehicleNumber ||
                      "Vehicle"}
                  </td>
                  <td>{booking.serviceType}</td>
                  <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    ₹{booking.finalCost || booking.estimatedCost || 0}
                  </td>
                  <td>
                    {!["completed", "cancelled", "rejected"].includes(
                      booking.status
                    ) && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => cancelBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default UserServices;
