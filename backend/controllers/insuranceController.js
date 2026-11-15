
const Insurance = require("../models/Insurance");
const Vehicle = require("../models/Vehicle");

// ADD INSURANCE POLICY
const addInsurance = async (req, res, next) => {
  try {
    const {
      vehicle,
      provider,
      policyNumber,
      insuranceType,
      coverageAmount,
      premiumAmount,
      startDate,
      expiryDate
    } = req.body;

    if (
      !vehicle ||
      !provider ||
      !policyNumber ||
      !insuranceType ||
      coverageAmount === undefined ||
      premiumAmount === undefined ||
      !startDate ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All insurance fields are required"
      });
    }

    // Verify vehicle ownership
    const vehicleExists = await Vehicle.findOne({
      _id: vehicle,
      owner: req.user.id
    });

    if (!vehicleExists) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    // Check duplicate policy number for this user
    const existingPolicy = await Insurance.findOne({
      user: req.user.id,
      policyNumber
    });

    if (existingPolicy) {
      return res.status(409).json({
        success: false,
        message: "Policy number already exists"
      });
    }

    if (new Date(expiryDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date"
      });
    }

    const insurance = await Insurance.create({
      user: req.user.id,
      vehicle,
      provider,
      policyNumber,
      insuranceType,
      coverageAmount,
      premiumAmount,
      startDate,
      expiryDate
    });

    res.status(201).json({
      success: true,
      message: "Insurance policy added successfully",
      insurance
    });

  } catch (error) {
    next(error);
  }
};

// GET MY INSURANCE POLICIES
const getMyInsurance = async (req, res, next) => {
  try {
    const policies = await Insurance.find({
      user: req.user.id
    })
      .populate("vehicle", "brand model registrationNumber")
      .sort({ expiryDate: 1 });

    res.status(200).json({
      success: true,
      count: policies.length,
      policies
    });

  } catch (error) {
    next(error);
  }
};

// UPDATE INSURANCE POLICY
const updateInsurance = async (req, res, next) => {
  try {
    const policy = await Insurance.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found"
      });
    }

    const allowedFields = [
      "provider",
      "policyNumber",
      "insuranceType",
      "coverageAmount",
      "premiumAmount",
      "startDate",
      "expiryDate",
      "isActive"
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        policy[field] = req.body[field];
      }
    });

    if (policy.expiryDate < policy.startDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after start date"
      });
    }

    await policy.save();

    res.status(200).json({
      success: true,
      message: "Insurance policy updated successfully",
      policy
    });

  } catch (error) {
    next(error);
  }
};

// DELETE INSURANCE POLICY
const deleteInsurance = async (req, res, next) => {
  try {
    const policy = await Insurance.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Insurance policy not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Insurance policy deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  addInsurance,
  getMyInsurance,
  updateInsurance,
  deleteInsurance
};
