
const FuelStation = require("../models/FuelStation");

// ADMIN: Add fuel station
exports.addFuelStation = async (req, res, next) => {
  try {
    const {
      name,
      address,
      city,
      phone,
      fuelTypes,
      petrolPrice,
      dieselPrice,
    } = req.body;

    const station = await FuelStation.create({
      name,
      address,
      city,
      phone,
      fuelTypes,
      petrolPrice,
      dieselPrice,
    });

    res.status(201).json({
      success: true,
      message: "Fuel station added successfully",
      station,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Get all fuel stations
exports.getAllFuelStations = async (req, res, next) => {
  try {
    const stations = await FuelStation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: stations.length,
      stations,
    });
  } catch (error) {
    next(error);
  }
};

// PUBLIC: Get active fuel stations
exports.getActiveFuelStations = async (req, res, next) => {
  try {
    const stations = await FuelStation.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: stations.length,
      stations,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Update fuel station
exports.updateFuelStation = async (req, res, next) => {
  try {
    const station = await FuelStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Fuel station not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fuel station updated successfully",
      station,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Toggle fuel station status
exports.toggleFuelStationStatus = async (req, res, next) => {
  try {
    const station = await FuelStation.findById(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Fuel station not found",
      });
    }

    station.isActive = !station.isActive;
    await station.save();

    res.status(200).json({
      success: true,
      message: `Fuel station ${
        station.isActive ? "activated" : "deactivated"
      } successfully`,
      station,
    });
  } catch (error) {
    next(error);
  }
};

// ADMIN: Delete fuel station
exports.deleteFuelStation = async (req, res, next) => {
  try {
    const station = await FuelStation.findByIdAndDelete(req.params.id);

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "Fuel station not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Fuel station deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
