const { body } = require("express-validator");

const checkInValidation = [
  body("registrationId")
    .notEmpty()
    .withMessage("registrationId is required")
    .isMongoId()
    .withMessage("Invalid registration ID"),
];

module.exports = {
  checkInValidation,
};