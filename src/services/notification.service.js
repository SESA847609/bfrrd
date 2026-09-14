const Notification = require("../models/Notification");

// Create notification
const createNotification = async ({
    userId,
    title,
    message,
    type = "system",
    eventId = null,
}) => {
    const notification = await Notification.create({
        user: userId,
        title,
        message,
        type,
        event: eventId,
    });

    return notification;
};

// Get user's notifications
const getUserNotifications = async (userId) => {
    return Notification.find({
        user: userId,
    })
        .populate("event", "title location startDate endDate")
        .sort({
            createdAt: -1,
        });
};

// Get unread notifications
const getUnreadNotifications = async (userId) => {
    return Notification.find({
        user: userId,
        isRead: false,
    })
        .populate("event", "title location startDate endDate")
        .sort({
            createdAt: -1,
        });
};

// Mark notification as read
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            user: userId,
        },
        {
            isRead: true,
        },
        {
            new: true,
        },
    );

    if (!notification) {
        const error = new Error("Notification not found");

        error.status = 404;

        throw error;
    }

    return notification;
};

// Mark all notifications as read
const markAllAsRead = async (userId) => {
    await Notification.updateMany(
        {
            user: userId,
            isRead: false,
        },
        {
            isRead: true,
        },
    );

    return true;
};

module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
};
