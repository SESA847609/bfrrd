const Event = require("../models/Event");
const Registration = require("../models/Registration");
const createEvent = async ({
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
  createdBy,
}) => {
  if (new Date(endDate) <= new Date(startDate)) {
    const error = new Error("End date must be after start date");
    error.status = 400;
    throw error;
  }

  const event = await Event.create({
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
    createdBy,
  });

  return event;
};
// const getRegisteredCount = async (eventId) => {
//   return Registration.countDocuments({
//     event: eventId,
//     status: "registered",
//   });
// };
// const getRegisteredCount = async (eventId) => {
//   const totalCount = await Registration.countDocuments({
//     event: eventId,
//   });

//   const registeredCount = await Registration.countDocuments({
//     event: eventId,
//     status: "registered",
//   });

//   console.log({
//     eventId: eventId.toString(),
//     totalCount,
//     registeredCount,
//   });

//   return registeredCount;
// };
const getRegisteredCount = async (eventId) => {
  return Registration.countDocuments({
    event: eventId,
    status: { $ne: "cancelled" },
  });
};
const getEvents = async () => {
  const events = await Event.find({ status: "published" })
    .populate("createdBy", "name email")
    .sort({ startDate: 1 });

  return Promise.all(
    events.map(async (event) => ({
      ...event.toObject(),
      registeredCount: await getRegisteredCount(event._id),
    })),
  );
};

const getAdminEvents = async () => {
  const events = await Event.find()
    .populate("createdBy", "name email")
    .sort({ startDate: 1 });

  return Promise.all(
    events.map(async (event) => ({
      ...event.toObject(),
      registeredCount: await getRegisteredCount(event._id),
    })),
  );
};

const getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate(
    "createdBy",
    "name email",
  );

  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  return {
    ...event.toObject(),
    registeredCount: await getRegisteredCount(event._id),
  };
};
const updateEvent = async (eventId, data) => {
  if (
    data.startDate &&
    data.endDate &&
    new Date(data.endDate) <= new Date(data.startDate)
  ) {
    const error = new Error("End date must be after start date");
    error.status = 400;
    throw error;
  }

  // Never allow createdBy to be changed
  delete data.createdBy;
  const event = await Event.findByIdAndUpdate(eventId, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }

  return event;
};
const cancelEvent = async (eventId) => {
  const event = await Event.findByIdAndUpdate(
    eventId,
    { status: "cancelled" },
    { returnDocument: "after" },
  );
  if (!event) {
    const error = new Error("Event not found");
    error.status = 404;
    throw error;
  }
  return event;
};
module.exports = {
  createEvent,
  getEvents,
  getAdminEvents,
  getEventById,
  updateEvent,
  cancelEvent,
};
