
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addReminder,
  getMyReminders,
  updateReminder,
  deleteReminder
} = require("../controllers/reminderController");

// Create reminder
router.post("/", protect, addReminder);

// Get logged-in user's reminders
router.get("/my-reminders", protect, getMyReminders);

// Update reminder
router.put("/:id", protect, updateReminder);

// Delete reminder
router.delete("/:id", protect, deleteReminder);

module.exports = router;
