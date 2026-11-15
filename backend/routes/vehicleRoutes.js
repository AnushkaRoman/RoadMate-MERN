
const express = require("express");
const router = express.Router();

const {
  addVehicle,
  getMyVehicles
} = require("../controllers/vehicleController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addVehicle);
router.get("/my-vehicles", authMiddleware, getMyVehicles);

module.exports = router;
