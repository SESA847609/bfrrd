const registrationService = require("../services/registration.service");

const createRegistration = async (req, res, next) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,

        message: "eventId is required",
      });
    }

    const registration = await registrationService.createRegistration({
      userId: req.user.userId,

      eventId,
    });

    return res.status(201).json({
      success: true,

      message: "Registration successful",

      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await registrationService.getMyRegistrations(
      req.user.userId,
    );

    return res.status(200).json({
      success: true,

      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

const getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await registrationService.getEventRegistrations(
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

const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await registrationService.cancelRegistration({
      registrationId: req.params.id,

      userId: req.user.userId,
    });

    return res.status(200).json({
      success: true,

      message: "Registration cancelled successfully",

      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRegistration,

  getMyRegistrations,

  getEventRegistrations,

  cancelRegistration,
};
