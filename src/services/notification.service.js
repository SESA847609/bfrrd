const Notification = require("../models/Notification");
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const notificationService = require('./notification.service');
 
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

const getUserNotifications = async (userId) => {
    return Notification.find({
        user: userId,
    })
        .populate("event", "title location startDate endDate")
        .sort({
            createdAt: -1,
        });
};

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
const deleteNotification = async (notificationId, userId) => {
    const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        user: userId,
    });

    if (!notification) {
        const error = new Error("Notification not found");
        error.status = 404;
        throw error;
    }

    return notification;
};
module.exports = {
    createNotification,
    getUserNotifications,
    getUnreadNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
};
