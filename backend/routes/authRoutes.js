
const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

const validationMiddleware = require("../middleware/validationMiddleware");

const {
  validateSignup,
  validateLogin,
} = require("../validators/authValidator");

// IMPORTANT: authMiddleware is exported directly
const protect = require("../middleware/authMiddleware");

// ================= SIGNUP =================
router.post(
  "/signup",
  validationMiddleware(validateSignup),
  signup
);

// ================= LOGIN =================
router.post(
  "/login",
  validationMiddleware(validateLogin),
  login
);

// ================= FORGOT PASSWORD =================
router.post(
  "/forgot-password",
  (req, res, next) => {
    if (!req.body.email || !req.body.email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    next();
  },
  forgotPassword
);

// ================= RESET PASSWORD =================
router.post(
  "/reset-password",
  (req, res, next) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    next();
  },
  resetPassword
);

// ================= PROVIDER SETTINGS =================
router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

module.exports = router;
