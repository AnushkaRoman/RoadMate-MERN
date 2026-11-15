
const express = require("express");
const router = express.Router();

const {
  addFuelStation,
  getAllFuelStations,
  getActiveFuelStations,
  updateFuelStation,
  toggleFuelStationStatus,
  deleteFuelStation,
} = require("../controllers/fuelStationController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin routes
router.post("/", authMiddleware, roleMiddleware("admin"), addFuelStation);

router.get("/admin/all", authMiddleware, roleMiddleware("admin"), getAllFuelStations);

router.put("/:id", authMiddleware, roleMiddleware("admin"), updateFuelStation);

router.patch("/:id/status", authMiddleware, roleMiddleware("admin"), toggleFuelStationStatus);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteFuelStation);

// Public route - active stations only
router.get("/", getActiveFuelStations);

module.exports = router;
