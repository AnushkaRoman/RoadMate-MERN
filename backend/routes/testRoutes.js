
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Any authenticated user
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Protected profile accessed successfully",
    user: req.user,
  });
});

// Admin only
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Admin Dashboard",
    });
  }
);

// Service provider only
router.get(
  "/provider",
  authMiddleware,
  roleMiddleware("serviceProvider"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome to Service Provider Dashboard",
    });
  }
);

module.exports = router;
