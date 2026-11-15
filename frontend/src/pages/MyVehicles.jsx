
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  CarFront,
  Fuel,
  CalendarDays,
  Hash,
  Trash2,
} from "lucide-react";
import api from "../services/api";

function MyVehicles() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("roadmateToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/vehicles/my-vehicles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVehicles(response.data.vehicles || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <div className="my-vehicles-page">
      <div className="vehicles-header">
        <div>
          <Link to="/user/dashboard" className="vehicle-back-link">
            <ArrowLeft size={18} /> Dashboard
          </Link>

          <h1>My Vehicles</h1>
          <p>Manage all your registered vehicles in one place.</p>
        </div>

        <Link to="/user/add-vehicle" className="add-vehicle-button">
          <Plus size={18} /> Add Vehicle
        </Link>
      </div>

      <div className="vehicles-summary">
        <div>
          <span>Total Registered Vehicles</span>
          <h2>{vehicles.length}</h2>
        </div>
        <CarFront size={36} />
      </div>

      {loading ? (
        <div className="vehicles-message">Loading vehicles...</div>
      ) : error ? (
        <div className="vehicles-message error">{error}</div>
      ) : vehicles.length === 0 ? (
        <div className="vehicles-empty">
          <CarFront size={55} />
          <h3>No vehicles registered yet</h3>
          <p>Add your first vehicle to start using RoadMate.</p>
          <Link to="/user/add-vehicle" className="add-vehicle-button">
            <Plus size={18} /> Register Vehicle
          </Link>
        </div>
      ) : (
        <div className="vehicles-grid">
          {vehicles.map((vehicle) => (
            <div className="vehicle-card" key={vehicle._id}>
              <div className="vehicle-card-top">
                <div className="vehicle-card-icon">
                  <CarFront size={30} />
                </div>
                <span className="vehicle-type-badge">
                  {vehicle.vehicleType}
                </span>
              </div>

              <h3>
                {vehicle.brand} {vehicle.model}
              </h3>

              <div className="vehicle-detail">
                <Hash size={16} />
                <span>{vehicle.registrationNumber}</span>
              </div>

              <div className="vehicle-detail">
                <Fuel size={16} />
                <span>{vehicle.fuelType}</span>
              </div>

              <div className="vehicle-detail">
                <CalendarDays size={16} />
                <span>{vehicle.manufacturingYear}</span>
              </div>

              <div className="vehicle-card-footer">
                <span>Registered with RoadMate</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyVehicles;
