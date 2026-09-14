const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      default: null,
    },

    capacity: {
      type: Number,
      default: null,
      min: 1,
    },

    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "draft",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["Innovation Talks", "Tech Talks", "Lab Safari"],
      required: true,
    },
    business: {
      type: String,
      trim: true,
    },
    speaker: {
      type: String,
      trim: true,
    },
    registrationType: {
      type: String,
      enum: ["talk", "lab"],
      required: true,
    },
    credits: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Event", eventSchema);
