const express = require("express");

const registrationController = require("../controllers/registration.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const { createRegistrationValidation } = require("../validators/registration.validator");
const validate = require("../middleware/validation.middleware");
const router = express.Router();

router.post("/", authenticate, createRegistrationValidation, validate, registrationController.createRegistration);

router.get("/my", authenticate, registrationController.getMyRegistrations);

router.get(
  "/event/:eventId",
  authenticate,
  requireAdmin,
  registrationController.getEventRegistrations,
);

router.delete("/:id", authenticate, registrationController.cancelRegistration);

module.exports = router;
