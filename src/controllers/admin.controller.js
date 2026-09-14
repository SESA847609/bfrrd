const adminService = require("../services/admin.service");

// GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await adminService.getUsers();

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/events
const getAllEvents = async (req, res, next) => {
  try {
    const events = await adminService.getAllEvents();

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// GET registrations
const getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await adminService.getEventRegistrations(
      req.params.eventId,
    );

    return res.status(200).json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// GET attendance
const getEventAttendance = async (req, res, next) => {
  try {
    const attendance = await adminService.getEventAttendance(
      req.params.eventId,
    );

    return res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};
const getDashboardStats =
  async (req, res, next) => {

    try {

      const stats =
        await adminService
          .getDashboardStats();

      return res.status(200).json({
        success: true,
        data: stats,
      });

    } catch (error) {
      next(error);
    }
  };
module.exports = {
  getUsers,
  getUserById,
  getAllEvents,
  getEventRegistrations,
  getEventAttendance,
  getDashboardStats,
};
