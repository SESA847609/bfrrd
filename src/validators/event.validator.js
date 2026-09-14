const { body } = require("express-validator");

const createEventValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 150 })
    .withMessage("Title cannot exceed 150 characters"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Invalid start date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("Invalid end date"),

  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be at least 1"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["Innovation Talks", "Tech Talks", "Lab Safari"])
    .withMessage("Invalid category"),

  body("business")
    .optional()
    .trim(),

  body("speaker")
    .optional()
    .trim(),

  body("registrationType")
    .notEmpty()
    .withMessage("Registration type is required")
    .isIn(["talk", "lab"])
    .withMessage("Invalid registration type"),

  body("credits")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Credits cannot be negative"),
];

module.exports = {
  createEventValidation,
};