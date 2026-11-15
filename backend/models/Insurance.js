
const mongoose = require("mongoose");

const insuranceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true
    },

    provider: {
      type: String,
      required: true,
      trim: true
    },

    policyNumber: {
      type: String,
      required: true,
      trim: true
    },

    insuranceType: {
      type: String,
      enum: ["comprehensive", "third-party", "other"],
      required: true
    },

    coverageAmount: {
      type: Number,
      required: true,
      min: 0
    },

    premiumAmount: {
      type: Number,
      required: true,
      min: 0
    },

    startDate: {
      type: Date,
      required: true
    },

    expiryDate: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

insuranceSchema.index(
  { user: 1, policyNumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("Insurance", insuranceSchema);
