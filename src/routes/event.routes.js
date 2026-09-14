const express = require("express");
const eventController = require("../controllers/event.controller");
const { authenticate, requireAdmin } = require("../middleware/auth.middleware");
const { createEventValidation } = require("../validators/event.validator");
const validate = require("../middleware/validation.middleware");
const router = express.Router(); 
// Public
router.get('/', eventController.getEvents);
router.get('/admin', authenticate, requireAdmin, eventController.getAdminEvents);
router.get('/:id', eventController.getEventById);

// Admin
router.post('/', authenticate, requireAdmin, createEventValidation, validate, eventController.createEvent);
router.put('/:id', authenticate, requireAdmin, createEventValidation, validate, eventController.updateEvent);
router.delete('/:id', authenticate, requireAdmin, eventController.cancelEvent);
module.exports = router;
