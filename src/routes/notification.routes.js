const express = require("express");
const notificationController = require("../controllers/notification.controller");
const { authenticate } = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", authenticate, notificationController.getNotifications);
router.get("/unread", authenticate, notificationController.getUnreadNotifications,);
router.put("/:id/read", authenticate, notificationController.markAsRead);
router.put("/read-all", authenticate, notificationController.markAllAsRead);
router.post("/test",authenticate, notificationController.createTestNotification);
router.delete("/:id", authenticate, notificationController.deleteNotification);

module.exports = router;
