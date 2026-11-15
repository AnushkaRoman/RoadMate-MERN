
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addInsurance,
  getMyInsurance,
  updateInsurance,
  deleteInsurance
} = require("../controllers/insuranceController");

// Add insurance
router.post("/", protect, addInsurance);

// Get my insurance policies
router.get("/my-policies", protect, getMyInsurance);

// Update policy
router.put("/:id", protect, updateInsurance);

// Delete policy
router.delete("/:id", protect, deleteInsurance);

module.exports = router;
