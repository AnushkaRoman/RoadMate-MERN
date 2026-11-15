
const express = require("express");
const router = express.Router();

const {
  getProviderBookings,
  updateBookingStatus,
  updateBookingCost,
} = require("../controllers/providerBookingController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// All routes require Service Provider authentication
router.use(authMiddleware);
router.use(roleMiddleware("serviceProvider"));

// GET provider bookings
router.get("/", getProviderBookings);

// Update booking status
router.patch("/:id/status", updateBookingStatus);

// Update booking cost
router.patch("/:id/cost", updateBookingCost);

module.exports = router;
