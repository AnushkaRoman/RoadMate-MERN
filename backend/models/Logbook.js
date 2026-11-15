
const mongoose = require("mongoose");

const logbookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    serviceType: {
      type: String,
      required: true,
    },

    serviceDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
    },

    odometer: {
      type: Number,
      default: 0,
    },

    cost: {
      type: Number,
      default: 0,
    },

    serviceCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceCenter",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Logbook", logbookSchema);
