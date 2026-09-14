const Event = require("../models/Event");
const Registration = require("../models/Registration");
const eventService = require("../services/event.service");

const createEvent = async (req, res, next) => {
  try {
    console.log("REQUEST BODY:", req.body);
    console.log("REQUEST USER:", req.user);

    const {
      title,
      description,
      location,
      startDate,
      endDate,
      image,
      capacity,
      category,
      business,
      speaker,
      registrationType,
      credits,
    } = req.body;

    if (!title || !location || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Title, location, start date and end date are required",
      });
    }

    const event = await eventService.createEvent({
      title,
      description,
      location,
      startDate,
      endDate,
      image,
      capacity,
      category,
      business,
      speaker,
      registrationType,
      credits,
      createdBy: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// const getEvents = async (req, res, next) => {
//   try {
//     const events = await Event.find({
//       status: "published",
//     })
//       .populate("createdBy", "name email")
//       .sort({ startDate: 1 });

//     return res.status(200).json({
//       success: true,
//       data: events,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const getEvents = async (req, res, next) => {
  try {
    const events = await eventService.getEvents();

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
const getAdminEvents = async (req, res, next) => {
  try {
    const events = await eventService.getAdminEvents();

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// const getEventById = async (req, res, next) => {
//   try {
//     const event = await Event.findById(req.params.id).populate(
//       "createdBy",
//       "name email",
//     );

//     if (!event) {
//       return res.status(404).json({
//         success: false,
//         message: "Event not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       data: event,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
const getEventById = async (req, res, next) => {
  try {
    const event = await eventService.getEventById(req.params.id);

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
const updateEvent = async (req, res, next) => {
  try {
    console.log("UPDATE EVENT ID:", req.params.id);
    console.log("UPDATE EVENT BODY:", req.body);

    const event = await eventService.updateEvent(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};
const cancelEvent = async (req, res, next) => {
  try {
    const event = await eventService.cancelEvent(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Event cancelled successfully",
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getAdminEvents,
  getEventById,
  updateEvent,
  cancelEvent,
};
