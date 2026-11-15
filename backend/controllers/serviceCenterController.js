
const ServiceCenter = require("../models/ServiceCenter");

// Get approved and active service centers
exports.getServiceCenters = async (req, res, next) => {
  try {
    const centers = await ServiceCenter.find({
      isApproved: true,
      isActive: true,
    }).populate("provider", "name email");

    res.status(200).json({
      success: true,
      count: centers.length,
      serviceCenters: centers,
    });
  } catch (error) {
    next(error);
  }
};

// Get single service center
exports.getServiceCenterById = async (req, res, next) => {
  try {
    const center = await ServiceCenter.findById(req.params.id)
      .populate("provider", "name email");

    if (!center || !center.isApproved || !center.isActive) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    res.status(200).json({
      success: true,
      serviceCenter: center,
    });
  } catch (error) {
    next(error);
  }
};

// Add service center (service provider)
exports.addServiceCenter = async (req, res, next) => {
  try {
    const { name, address, city, phone, services } = req.body;

    if (!name || !address || !city || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, address, city and phone are required",
      });
    }

    const center = await ServiceCenter.create({
      provider: req.user.id,
      name,
      address,
      city,
      phone,
      services: Array.isArray(services) ? services : [],
    });

    res.status(201).json({
      success: true,
      message: "Service center submitted for approval",
      serviceCenter: center,
    });
  } catch (error) {
    next(error);
  }
};

// Get service centers belonging to logged-in provider
exports.getMyServiceCenters = async (req, res, next) => {
  try {
    const centers = await ServiceCenter.find({
      provider: req.user.id,
    });

    res.status(200).json({
      success: true,
      count: centers.length,
      serviceCenters: centers,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get pending service centers
exports.getPendingServiceCenters = async (req, res, next) => {
  try {
    const centers = await ServiceCenter.find({
      isApproved: false,
    }).populate("provider", "name email");

    res.status(200).json({
      success: true,
      serviceCenters: centers,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get ALL service centers
exports.getAllServiceCentersAdmin = async (req, res, next) => {
  try {
    const centers = await ServiceCenter.find()
      .populate("provider", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: centers.length,
      serviceCenters: centers,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Approve service center
exports.approveServiceCenter = async (req, res, next) => {
  try {
    const center = await ServiceCenter.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service center approved successfully",
      serviceCenter: center,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Activate or deactivate service center
exports.toggleServiceCenterStatus = async (req, res, next) => {
  try {
    const center = await ServiceCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: "Service center not found",
      });
    }

    center.isActive = !center.isActive;
    await center.save();

    res.status(200).json({
      success: true,
      message: `Service center ${
        center.isActive ? "activated" : "deactivated"
      } successfully`,
      serviceCenter: center,
    });
  } catch (error) {
    next(error);
  }
};
