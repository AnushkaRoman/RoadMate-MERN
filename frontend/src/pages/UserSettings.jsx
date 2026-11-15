
import { useEffect, useState } from "react";
import api from "../services/api";

const UserSettings = () => {
  const storedUser = JSON.parse(
    localStorage.getItem("roadmateUser") || "{}"
  );

  const [profile, setProfile] = useState({
    name: storedUser.name || "",
    email: storedUser.email || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfile({
      name: storedUser.name || "",
      email: storedUser.email || ""
    });
  }, []);

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.put("/auth/profile", profile);

      const updatedUser = response.data.user;

      localStorage.setItem(
        "roadmateUser",
        JSON.stringify(updatedUser)
      );

      alert("Profile updated successfully!");

    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      await api.put("/auth/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      alert("Password changed successfully!");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      alert(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-1">Account Settings</h2>
      <p className="text-muted mb-4">
        Manage your profile and account security.
      </p>

      {/* Profile */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Personal Information</h5>

          <form onSubmit={updateProfile}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="form-control"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
              />
            </div>

            <button className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Change Password</h5>

          <form onSubmit={changePassword}>
            <div className="mb-3">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                minLength="6"
                required
              />
            </div>

            <button className="btn btn-warning" disabled={loading}>
              {loading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>

      {/* Account Details */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Account Information</h5>

          <p>
            <strong>Role:</strong>{" "}
            <span className="badge bg-secondary">
              {storedUser.role || "user"}
            </span>
          </p>

          <p className="text-muted mb-0">
            Your account is protected using authentication and encrypted passwords.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
