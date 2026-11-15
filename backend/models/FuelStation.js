
const mongoose = require("mongoose");

const fuelStationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    fuelTypes: {
      type: [String],
      default: ["Petrol", "Diesel"],
    },

    petrolPrice: {
      type: Number,
      default: 0,
    },

    dieselPrice: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FuelStation", fuelStationSchema);
