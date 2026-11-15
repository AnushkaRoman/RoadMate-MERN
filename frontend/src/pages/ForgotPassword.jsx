
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CarFront, ArrowLeft, Mail } from "lucide-react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setResetToken("");

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        response.data.message || "Password reset request successful."
      );

      // Development token returned by backend
      if (response.data.resetToken) {
        setResetToken(response.data.resetToken);
      } else {
        setError(
          "Reset token was not returned. Check your backend response."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to process request. Please try again."
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
          <span>PASSWORD RECOVERY</span>
          <h1>Forgot your password?</h1>
          <p>
            Enter your registered email address and we'll
            help you reset your password.
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

          <div className="mb-3">
            <Mail size={35} color="#ff6b35" />
          </div>

          <span className="auth-label">ACCOUNT RECOVERY</span>
          <h2>Reset password</h2>

          <p className="auth-subtitle">
            Enter your email to receive password reset instructions.
          </p>

          {message && (
            <div className="alert alert-success">{message}</div>
          )}

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {resetToken && (
            <div className="alert alert-warning">
              <strong>Development Reset Token</strong>

              <p className="small mt-2 mb-1">
                Copy this token for password recovery:
              </p>

              <code className="text-break">{resetToken}</code>

              <div className="mt-3">
                <Link
                  to={`/reset-password?token=${encodeURIComponent(resetToken)}`}
                  className="auth-link"
                >
                  Continue to Reset Password
                </Link>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Email Address</label>

              <input
                type="email"
                className="form-control auth-input"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn auth-submit w-100"
              disabled={loading}
            >
              {loading ? "Sending Request..." : "Send Reset Instructions"}
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

export default ForgotPassword;
