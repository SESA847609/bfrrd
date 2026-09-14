const express = require("express");

const attendanceController = require("../controllers/attendance.controller");

const {
  authenticate,
  requireAdmin,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Generate event QR
router.get(
  "/qr/:eventId",
  authenticate,
  attendanceController.generateQR
);

// Mark attendance
router.post(
  "/mark",
  authenticate,
  attendanceController.markAttendance
);

module.exports = router;