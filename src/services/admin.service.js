const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Attendance = require("../models/Attendance");

// Get all users
const getUsers = async () => {
  const users = await User.find()
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();

  const usersWithStats = await Promise.all(
    users.map(async (user) => {
      const [registrationCount, attendanceCount] =
        await Promise.all([
          Registration.countDocuments({
            user: user._id,
          }),
          Attendance.countDocuments({
            user: user._id,
          }),
        ]);

      return {
        ...user,
        registrationCount,
        attendanceCount,
      };
    }),
  );

  return usersWithStats;
};

// Get user by ID
const getUserById = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  return user;
};

// Get all events
const getAllEvents = async () => {
  return Event.find()
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Get registrations for event
const getEventRegistrations = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  return Registration.find({
    event: eventId,
  })
    .populate("user", "name email phone")
    .populate("event", "title location startDate endDate")
    .sort({ createdAt: -1 });
};

// Get attendance for event
const getEventAttendance = async (eventId) => {
  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  return Attendance.find({
    event: eventId,
  })
    .populate("user", "name email phone")
    .populate("checkedInBy", "name email")
    .sort({ checkedInAt: -1 });
};
const getDashboardStats = async () => {

  const now = new Date();

  const [
    totalUsers,
    totalEvents,
    publishedEvents,
    cancelledEvents,
    totalRegistrations,
    activeRegistrations,
    totalAttendance,
    upcomingEvents,
  ] = await Promise.all([

    // Total users
    User.countDocuments(),

    // Total events
    Event.countDocuments(),

    // Published events
    Event.countDocuments({
      status: "published",
    }),

    // Cancelled events
    Event.countDocuments({
      status: "cancelled",
    }),

    // All registrations
    Registration.countDocuments(),

    // Active registrations
    Registration.countDocuments({
      status: "registered",
    }),

    // Attendance
    Attendance.countDocuments(),

    // Upcoming events
    Event.find({
      status: "published",
      startDate: {
        $gte: now,
      },
    })
      .sort({
        startDate: 1,
      })
      .limit(5)
      .select(
        "title location startDate endDate capacity status"
      ),
  ]);


  return {
    users: {
      total: totalUsers,
    },

    events: {
      total: totalEvents,
      published: publishedEvents,
      cancelled: cancelledEvents,
    },

    registrations: {
      total: totalRegistrations,
      active: activeRegistrations,
    },

    attendance: {
      total: totalAttendance,
    },

    upcomingEvents,
  };
};
module.exports = {
  getUsers,
  getUserById,
  getAllEvents,
  getEventRegistrations,
  getEventAttendance,
  getDashboardStats,
};
