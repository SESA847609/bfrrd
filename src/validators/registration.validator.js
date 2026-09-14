const { body } = require("express-validator");

const createRegistrationValidation = [
  body("eventId")
    .notEmpty()
    .withMessage("eventId is required")
    .isMongoId()
    .withMessage("Invalid event ID"),
];

module.exports = {
  createRegistrationValidation,
};