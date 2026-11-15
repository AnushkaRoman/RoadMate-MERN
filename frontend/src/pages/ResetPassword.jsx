
import React, { useState } from "react";
import {
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

import {
  CarFront,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";

import api from "../services/api";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get token directly from browser URL
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate token
    if (!token) {
      setError(
        "Reset token is missing. Please request a new token."
      );
      return;
    }

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // Send token and new password to backend
     const response = await api.post("/auth/reset-password", {
  token: token,
  newPassword: password,
});
      setSuccess(
        response.data.message || "Password reset successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/login" className="auth-back">
          <ArrowLeft size={18} /> Back to Login
        </Link>

        <div className="auth-brand">
          <CarFront size={35} />
          <h2>RoadMate</h2>
        </div>

        <div className="auth-left-content">
          <span>SECURE YOUR ACCOUNT</span>

          <h1>Create a new password.</h1>

          <p>
            Choose a strong password to protect your RoadMate account.
          </p>
        </div>

        <p className="auth-left-footer">© 2026 RoadMate</p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <CarFront size={30} />
            <h3>RoadMate</h3>
          </div>

          <span className="auth-label">PASSWORD RECOVERY</span>

          <h2>Reset password</h2>

          <p className="auth-subtitle">
            Enter and confirm your new password.
          </p>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">New Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control auth-input"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">
                Confirm New Password
              </label>

              <input
                type={showPassword ? "text" : "password"}
                className="form-control auth-input"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="btn auth-submit w-100"
              disabled={loading}
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-bottom-text">
            Remember your password?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
