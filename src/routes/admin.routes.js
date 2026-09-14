const express = require("express");

const adminController = require("../controllers/admin.controller");

const { authenticate, requireAdmin } = require("../middleware/auth.middleware");

const router = express.Router();

// All users
router.get("/users", authenticate, requireAdmin, adminController.getUsers);
router.get(
  "/dashboard",
  authenticate,
  requireAdmin,
  adminController.getDashboardStats
);
// User details
router.get(
  "/users/:id",
  authenticate,
  requireAdmin,
  adminController.getUserById,
);

// All events
router.get("/events", authenticate, requireAdmin, adminController.getAllEvents);

// Event registrations
router.get(
  "/events/:eventId/registrations",
  authenticate,
  requireAdmin,
  adminController.getEventRegistrations,
);

// Event attendance
router.get(
  "/events/:eventId/attendance",
  authenticate,
  requireAdmin,
  adminController.getEventAttendance,
);

module.exports = router;
