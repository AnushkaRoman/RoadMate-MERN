
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [costs, setCosts] = useState({});

  const token = localStorage.getItem("roadmateToken");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/provider/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(response.data.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      setError("");
      setMessage("");

      await api.patch(
        `/provider/bookings/${bookingId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Booking status updated successfully.");
      fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update booking status."
      );
    }
  };

  const handleCostChange = (bookingId, field, value) => {
    setCosts((prev) => ({
      ...prev,
      [bookingId]: {
        ...prev[bookingId],
        [field]: value,
      },
    }));
  };

  const updateCost = async (booking) => {
    const bookingCost = costs[booking._id] || {};

    const payload = {};

    if (bookingCost.estimatedCost !== undefined &&
        bookingCost.estimatedCost !== "") {
      payload.estimatedCost = Number(bookingCost.estimatedCost);
    }

    if (bookingCost.finalCost !== undefined &&
        bookingCost.finalCost !== "") {
      payload.finalCost = Number(bookingCost.finalCost);
    }

    if (Object.keys(payload).length === 0) {
      setError("Enter at least one cost value.");
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.patch(
        `/provider/bookings/${booking._id}/cost`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Booking cost updated successfully.");
      fetchBookings();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update booking cost."
      );
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-primary";
      case "rejected":
        return "bg-danger";
      case "in-progress":
        return "bg-info text-dark";
      case "completed":
        return "bg-success";
      case "cancelled":
        return "bg-secondary";
      default:
        return "bg-warning text-dark";
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2>Service Bookings</h2>
          <p className="text-muted">
            Manage customer service requests.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={fetchBookings}
        >
          Refresh Bookings
        </button>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading && (
        <div className="text-center py-5">
          Loading bookings...
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="card p-5 text-center shadow-sm">
          <h4>No Bookings Available</h4>
          <p className="text-muted">
            Customer bookings will appear here.
          </p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="row g-4">
          {bookings.map((booking) => {
            const customer = booking.user || {};
            const vehicle = booking.vehicle || {};
            const center = booking.serviceCenter || {};

            return (
              <div className="col-lg-6" key={booking._id}>
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                      <h5>{booking.serviceType}</h5>

                      <span
                        className={`badge ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <h6 className="text-primary">
                      Customer Details
                    </h6>
                    <p className="mb-1">
                      <strong>Name:</strong>{" "}
                      {customer.name || "N/A"}
                    </p>
                    <p className="mb-3">
                      <strong>Email:</strong>{" "}
                      {customer.email || "N/A"}
                    </p>

                    <h6 className="text-primary">
                      Vehicle Details
                    </h6>
                    <p className="mb-1">
                      <strong>Vehicle:</strong>{" "}
                      {vehicle.brand || ""} {vehicle.model || ""}
                    </p>
                    <p className="mb-3">
                      <strong>Registration:</strong>{" "}
                      {vehicle.registrationNumber || "N/A"}
                    </p>

                    <h6 className="text-primary">
                      Booking Details
                    </h6>
                    <p className="mb-1">
                      <strong>Center:</strong>{" "}
                      {center.name || "N/A"}
                    </p>
                    <p className="mb-1">
                      <strong>Date:</strong>{" "}
                      {booking.bookingDate
                        ? new Date(
                            booking.bookingDate
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="mb-3">
                      <strong>Payment:</strong>{" "}
                      {booking.paymentStatus || "pending"}
                    </p>

                    <hr />

                    <h6 className="text-primary mb-3">
                      Service Cost
                    </h6>

                    <div className="row g-2 mb-3">
                      <div className="col-6">
                        <label className="form-label">
                          Estimated Cost
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder={booking.estimatedCost || 0}
                          value={
                            costs[booking._id]?.estimatedCost ??
                            ""
                          }
                          onChange={(e) =>
                            handleCostChange(
                              booking._id,
                              "estimatedCost",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="col-6">
                        <label className="form-label">
                          Final Cost
                        </label>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          placeholder={booking.finalCost || 0}
                          value={
                            costs[booking._id]?.finalCost ??
                            ""
                          }
                          onChange={(e) =>
                            handleCostChange(
                              booking._id,
                              "finalCost",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>

                    <button
                      className="btn btn-outline-primary btn-sm mb-3"
                      onClick={() => updateCost(booking)}
                    >
                      Update Cost
                    </button>

                    <hr />

                    <div className="d-flex flex-wrap gap-2">
                      {booking.status === "pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "accepted"
                              )
                            }
                          >
                            Accept
                          </button>

                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "rejected"
                              )
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {booking.status === "accepted" && (
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "in-progress"
                            )
                          }
                        >
                          Start Service
                        </button>
                      )}

                      {booking.status === "in-progress" && (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() =>
                            updateStatus(
                              booking._id,
                              "completed"
                            )
                          }
                        >
                          Complete Service
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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

export default ProviderBookings;
