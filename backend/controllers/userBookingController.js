
const Booking = require("../models/Booking");
const ServiceCenter = require("../models/ServiceCenter");
const Vehicle = require("../models/Vehicle");

// Book a service
const bookService = async (req, res, next) => {
  try {
    const { vehicle, serviceCenter, serviceType, bookingDate } = req.body;

    if (!vehicle || !serviceCenter || !serviceType || !bookingDate) {
      return res.status(400).json({
        success: false,
        message: "All booking fields are required",
      });
    }

    const vehicleExists = await Vehicle.findOne({
  _id: vehicle,
  owner: req.user.id
});

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    const centerExists = await ServiceCenter.findOne({
      _id: serviceCenter,
      isApproved: true,
      isActive: true,
    });

    if (!centerExists) {
      return res.status(404).json({
        success: false,
        message: "Service center unavailable",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      vehicle,
      serviceCenter,
      serviceType,
      bookingDate,
      status: "pending",
      paymentStatus: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Service booked successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// Get user's bookings
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("vehicle")
      .populate("serviceCenter")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel booking
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Booking cannot be cancelled",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  bookService,
  getMyBookings,
  cancelBooking,
};
