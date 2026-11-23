
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CarFront,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import api from "../services/api";

function Auth({ initialMode = "login" }) {
  const navigate = useNavigate();

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
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

  // REGISTRATION
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!["user", "serviceProvider"].includes(formData.role)) {
      setError("Please select a valid account type.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/signup", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
      });

      setSuccess("Account created successfully! Please sign in.");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });

      setTimeout(() => {
        setMode("login");
        setSuccess("");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-left">
        <Link to="/" className="auth-back">
          <ArrowLeft size={18} /> Back to RoadMate
        </Link>

        <div className="auth-brand">
          <CarFront size={35} />
          <h2>RoadMate</h2>
        </div>

        <div className="auth-left-content">
          <span>
            {mode === "login" ? "WELCOME BACK" : "JOIN ROAD MATE"}
          </span>

          <h1>
            {mode === "login" ? (
              <>Your journey<br />continues here.</>
            ) : (
              <>Start your journey with us.</>
            )}
          </h1>

          <p>
            {mode === "login"
              ? "Manage your vehicles, maintenance, and everything that keeps you moving."
              : "Create your account and experience smarter vehicle management, maintenance, and service booking."
            }
          </p>
        </div>

        <p className="auth-left-footer">
          © 2026 RoadMate
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="auth-right">
        <div className="auth-form-container">

          <div className="auth-mobile-brand">
            <CarFront size={30} />
            <h3>RoadMate</h3>
          </div>

          {/* LOGIN / REGISTER TABS */}
          <div className="d-flex gap-2 mb-4">
            <button
              type="button"
              className={`btn w-50 ${
                mode === "login"
                  ? "auth-submit"
                  : "btn-outline-secondary"
              }`}
              onClick={() => switchMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={`btn w-50 ${
                mode === "signup"
                  ? "auth-submit"
                  : "btn-outline-secondary"
              }`}
              onClick={() => switchMode("signup")}
            >
              Register
            </button>
          </div>

          <span className="auth-label">
            {mode === "login" ? "ACCOUNT LOGIN" : "CREATE ACCOUNT"}
          </span>

          <h2>
            {mode === "login" ? "Welcome back!" : "Get started!"}
          </h2>

          <p className="auth-subtitle">
            {mode === "login"
              ? "Enter your credentials to access your account."
              : "Fill in your details to create your account."
            }
          </p>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={handleLogin}>

              <div className="mb-3">
                <label className="form-label">
                  Email Address
                </label>

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
                <label className="form-label">
                  Password
                </label>

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
  {showPassword
    ? <EyeOff size={18} />
    : <Eye size={18} />
  }
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
          )}

          {/* REGISTRATION FORM */}
          {mode === "signup" && (
            <form onSubmit={handleSignup}>

              <div className="mb-3">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control auth-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={2}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Email Address
                </label>

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

              {/* ROLE SELECTION */}
              <div className="mb-3">
                <label className="form-label">
                  Register As
                </label>

                <select
                  name="role"
                  className="form-select auth-input"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">Vehicle Owner</option>
                  <option value="serviceProvider">
                    Service Provider
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Password
                </label>

                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control auth-input"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? <EyeOff size={18} />
                      : <Eye size={18} />
                    }
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">
                  Confirm Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="form-control auth-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn auth-submit w-100"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>
          )}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <p className="auth-bottom-text">
            {mode === "login"
              ? "Don't have an account? "
              : "Already have an account? "
            }

            <button
              type="button"
              className="auth-link border-0 bg-transparent"
              onClick={() =>
                switchMode(mode === "login" ? "signup" : "login")
              }
            >
              {mode === "login" ? "Create Account" : "Sign In"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Auth;
