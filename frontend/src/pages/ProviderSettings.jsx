
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProviderSettings() {
  const navigate = useNavigate();

  const savedUser = JSON.parse(
    localStorage.getItem("roadmateUser") || "{}"
  );

  const [name, setName] = useState(savedUser.name || "");
  const [phone, setPhone] = useState(savedUser.phone || "");
  const [address, setAddress] = useState(savedUser.address || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put("/auth/profile", {
        name,
        phone,
        address,
      });

      const updatedUser = {
        ...savedUser,
        ...res.data.user,
      };

      localStorage.setItem(
        "roadmateUser",
        JSON.stringify(updatedUser)
      );

      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Profile update failed"
      );
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    try {
      await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Password change failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("roadmateToken");
    localStorage.removeItem("roadmateUser");
    navigate("/login");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Provider Settings</h2>

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <div className="card p-4 mb-4">
        <h5>Profile Information</h5>

        <form onSubmit={handleProfileUpdate}>
          <div className="mb-3">
            <label className="form-label">Provider Name</label>
            <input
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <button className="btn btn-primary">
            Update Profile
          </button>
        </form>
      </div>

      <div className="card p-4 mb-4">
        <h5>Change Password</h5>

        <form onSubmit={handlePasswordChange}>
          <div className="mb-3">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              minLength={6}
              required
            />
          </div>

          <button className="btn btn-success">
            Change Password
          </button>
        </form>
      </div>

      <div className="card p-4">
        <h5>Account Management</h5>
        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
