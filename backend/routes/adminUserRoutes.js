
const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
} = require("../controllers/adminUserController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes require Admin authentication
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

// Get all users
router.get("/", getAllUsers);

// Activate / deactivate user
router.patch("/:id/status", toggleUserStatus);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
