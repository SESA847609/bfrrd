const attendanceService = require("../services/attendance.service");

// GET event QR
const generateQR = async (req, res, next) => {
  try {
    const result = await attendanceService.generateEventQR(
      req.params.eventId
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST attendance
const markAttendance = async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required",
      });
    }

    const attendance = await attendanceService.markAttendance({
      eventId,
      userId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateQR,
  markAttendance,
};