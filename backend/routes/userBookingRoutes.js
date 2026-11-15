
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  bookService,
  getMyBookings,
  cancelBooking,
} = require("../controllers/userBookingController");

router.post("/", protect, bookService);
router.get("/my-bookings", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

module.exports = router;
