const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    imageBefore: {
      type: String,
      required: true,
    },

    imageAfter: {
      type: String,
      default: null,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    mlScore: {
      type: Number,
      required: true,
    },

    condition: {
      type: String,
      enum: ["GOOD", "MODERATE", "BAD"],
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "RESOLVED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
