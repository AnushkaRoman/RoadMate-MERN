
const Booking = require("../models/Booking");

// GET PROVIDER BOOKINGS
const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("vehicle")
      .populate({
        path: "serviceCenter",
        select: "name city phone provider",
      })
      .sort({ createdAt: -1 });

    // Only bookings belonging to this provider
    const providerBookings = bookings.filter(
      (booking) =>
        booking.serviceCenter &&
        booking.serviceCenter.provider.toString() === req.user.id
    );

    res.status(200).json({
      success: true,
      count: providerBookings.length,
      bookings: providerBookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "accepted",
      "rejected",
      "in-progress",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id)
      .populate("serviceCenter");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      !booking.serviceCenter ||
      booking.serviceCenter.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot manage this booking",
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

// UPDATE BOOKING COST
const updateBookingCost = async (req, res) => {
  try {
    const { estimatedCost, finalCost } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("serviceCenter");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      !booking.serviceCenter ||
      booking.serviceCenter.provider.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You cannot manage this booking",
      });
    }

    if (
      estimatedCost !== undefined &&
      (typeof estimatedCost !== "number" || estimatedCost < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Estimated cost must be a non-negative number",
      });
    }

    if (
      finalCost !== undefined &&
      (typeof finalCost !== "number" || finalCost < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Final cost must be a non-negative number",
      });
    }

    if (estimatedCost !== undefined) {
      booking.estimatedCost = estimatedCost;
    }

    if (finalCost !== undefined) {
      booking.finalCost = finalCost;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cost updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking cost",
      error: error.message,
    });
  }
};

module.exports = {
  getProviderBookings,
  updateBookingStatus,
  updateBookingCost,
};
