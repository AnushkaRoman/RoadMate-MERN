
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CarFront, Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("roadmateToken", token);
      localStorage.setItem("roadmateUser", JSON.stringify(user));

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "serviceProvider") {
        navigate("/provider/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" className="auth-back">
          <ArrowLeft size={18} /> Back to RoadMate
        </Link>

        <div className="auth-brand">
          <CarFront size={35} />
          <h2>RoadMate</h2>
        </div>

        <div className="auth-left-content">
          <span>WELCOME BACK</span>
          <h1>Your journey<br />continues here.</h1>
          <p>
            Manage your vehicles, maintenance, and everything
            that keeps you moving.
          </p>
        </div>

        <p className="auth-left-footer">
          © 2026 RoadMate
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <CarFront size={30} />
            <h3>RoadMate</h3>
          </div>

          <span className="auth-label">ACCOUNT LOGIN</span>
          <h2>Welcome back!</h2>
          <p className="auth-subtitle">
            Enter your credentials to access your account.
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control auth-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-2">
              <label className="form-label">Password</label>

              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control auth-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-end mb-4">
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn auth-submit w-100"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-bottom-text">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link">
              Create Account
            </Link>
          </p>

          <p className="auth-provider-text">
            Are you a service provider?{" "}
            <Link to="/provider/signup" className="auth-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
