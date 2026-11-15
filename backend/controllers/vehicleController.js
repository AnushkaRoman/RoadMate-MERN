
const Vehicle = require("../models/Vehicle");

// ADD VEHICLE
const addVehicle = async (req, res, next) => {
  try {
    const {
      vehicleType,
      brand,
      model,
      registrationNumber,
      fuelType,
      manufacturingYear
    } = req.body;

    // Validation
    if (
      !vehicleType ||
      !brand ||
      !model ||
      !registrationNumber ||
      !fuelType ||
      !manufacturingYear
    ) {
      return res.status(400).json({
        success: false,
        message: "All vehicle fields are required"
      });
    }

    // Check duplicate registration
    const existingVehicle = await Vehicle.findOne({
      registrationNumber: registrationNumber.toUpperCase()
    });

    if (existingVehicle) {
      return res.status(409).json({
        success: false,
        message: "Vehicle registration number already exists"
      });
    }

    // Create vehicle
    const vehicle = await Vehicle.create({
      owner: req.user.id,
      vehicleType,
      brand,
      model,
      registrationNumber,
      fuelType,
      manufacturingYear
    });

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle
    });

  } catch (error) {
    next(error);
  }
};

// GET MY VEHICLES
const getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({
      owner: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      vehicles
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addVehicle,
  getMyVehicles
};
