const express = require("express");

const notificationController = require("../controllers/notification.controller");

const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

// Get all notifications
router.get("/", authenticate, notificationController.getNotifications);

// Get unread notifications
router.get(
  "/unread",
  authenticate,
  notificationController.getUnreadNotifications,
);

// Mark one as read
router.put("/:id/read", authenticate, notificationController.markAsRead);

// Mark all as read
router.put("/read-all", authenticate, notificationController.markAllAsRead);
router.post("/test",authenticate, notificationController.createTestNotification);

module.exports = router;
