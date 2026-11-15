
const express = require("express");
const router = express.Router();

const {
  getServiceCenters,
  getServiceCenterById,
  addServiceCenter,
  getMyServiceCenters,
  getPendingServiceCenters,
  getAllServiceCentersAdmin,
  approveServiceCenter,
  toggleServiceCenterStatus,
} = require("../controllers/serviceCenterController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ==========================================
// ADMIN ROUTES
// ==========================================

// Get pending service centers
router.get(
  "/admin/pending",
  authMiddleware,
  roleMiddleware("admin"),
  getPendingServiceCenters
);

// Get ALL service centers (approved + pending)
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllServiceCentersAdmin
);

// Approve service center
router.patch(
  "/admin/:id/approve",
  authMiddleware,
  roleMiddleware("admin"),
  approveServiceCenter
);

// Activate / deactivate service center
router.patch(
  "/admin/:id/toggle-status",
  authMiddleware,
  roleMiddleware("admin"),
  toggleServiceCenterStatus
);

// ==========================================
// SERVICE PROVIDER ROUTES
// ==========================================

// Add service center
router.post(
  "/",
  authMiddleware,
  roleMiddleware("serviceProvider"),
  addServiceCenter
);

// Get provider's own service centers
router.get(
  "/my-centers",
  authMiddleware,
  roleMiddleware("serviceProvider"),
  getMyServiceCenters
);

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all approved and active service centers
router.get("/", getServiceCenters);

// Get service center by ID
router.get("/:id", getServiceCenterById);

module.exports = router;
