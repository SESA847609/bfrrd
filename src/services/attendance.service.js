const QRCode = require("qrcode");

const Attendance = require("../models/Attendance");

const Registration = require("../models/Registration");

const Event = require("../models/Event");

// // Generate QR for a registration
// const generateRegistrationQR = async (registrationId, userId) => {
//   const registration = await Registration.findById(registrationId);

//   if (!registration) {
//     const error = new Error("Registration not found");

//     error.status = 404;
//     throw error;
//   }

//   // Make sure this registration belongs
//   // to the logged-in user
//   if (registration.user.toString() !== userId.toString()) {
//     const error = new Error(
//       "You can only generate QR for your own registration",
//     );

//     error.status = 403;
//     throw error;
//   }

//   if (registration.status !== "registered") {
//     const error = new Error("This registration is not active");

//     error.status = 400;
//     throw error;
//   }

//   const qrData = JSON.stringify({
//     eventId: registration.event.toString(),
//   });

//   const qrCode = await QRCode.toDataURL(qrData);

//   return {
//     registrationId: registration._id,
//     qrCode,
//   };
// };
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
// Check in user
const markAttendance = async ({ eventId, userId }) => {
  // 1. Check event
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  // 2. Find logged-in user's registration for this event
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

  // 3. Check event timing
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

  // 4. Prevent duplicate attendance
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

  // 5. Create attendance
  const attendance = await Attendance.create({
    registration: registration._id,
    user: userId,
    event: eventId,
    checkedInBy: userId,
  });

  // 6. Update registration
  registration.status = "attended";

  await registration.save();

  // 7. Return attendance
  return Attendance.findById(attendance._id)
    .populate("user", "name email phone")
    .populate("event", "title location startDate endDate")
    .populate("checkedInBy", "name email");
};

module.exports = {
  // generateRegistrationQR,
  generateEventQR,
  markAttendance,
};
