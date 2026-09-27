const QRCode = require("qrcode");
const Attendance = require("../models/Attendance");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const notificationService = require("./notification.service");

const generateEventQR = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  const qrData = JSON.stringify({
    eventId: event._id.toString(),
  });

  const qrCode = await QRCode.toDataURL(qrData);

  return {
    eventId: event._id,
    qrCode,
  };
};

const markAttendance = async ({ eventId, userId }) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  const registration = await Registration.findOne({
    event: eventId,
    user: userId,
    status: "registered",
  });

  if (!registration) {
    const error = new Error(
      "You are not registered for this event"
    );

    error.status = 403;
    throw error;
  }

  const now = new Date();

  if (now < event.startDate) {
    const error = new Error(
      "This session has not started yet"
    );

    error.status = 400;
    throw error;
  }

  if (now > event.endDate) {
    const error = new Error(
      "This session has already ended"
    );

    error.status = 400;
    throw error;
  }

  const existingAttendance = await Attendance.findOne({
    registration: registration._id,
  });

  if (existingAttendance) {
    const error = new Error(
      "Attendance already marked"
    );

    error.status = 409;
    throw error;
  }

  const attendance = await Attendance.create({
    registration: registration._id,
    user: userId,
    event: eventId,
    checkedInBy: userId,
  });

  registration.status = "attended";

  await registration.save();

  try {
    const notification = await notificationService.createNotification({
      userId,
      title: "Attendance Marked",
      message: `Your attendance has been successfully marked for ${event.title}.`,
      type: "attendance",
      eventId: event._id,
    });

    console.log("ATTENDANCE NOTIFICATION CREATED:", notification);
  } catch (error) {
    console.error("ATTENDANCE NOTIFICATION ERROR:", error);
  }

  return Attendance.findById(attendance._id)
    .populate("user", "name email phone")
    .populate("event", "title location startDate endDate")
    .populate("checkedInBy", "name email");
};

module.exports = {
  generateEventQR,
  markAttendance,
};