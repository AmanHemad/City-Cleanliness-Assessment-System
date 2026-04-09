const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    imageBefore: {
      type: String,
      required: true,
    },

    imageML: {
      type: String, // 🔥 ML processed image
      default: null,
    },

    imageAfter: {
      type: String, // 🔥 Admin resolved image
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

    username: {
      type: String,
      default: "Anonymous",
    },

    email: {
      type: String,
    },
    assignedContractor: {
  type: String,
  default: null,
},

contractorStatus: {
  type: String,
  enum: ["PENDING", "IN_PROGRESS", "COMPLETED"],
  default: "PENDING",
},

resolvedAt: {
  type: Date,
  default: null,
},
resolvedImage: {
  type: String,
  default: null,
},

resolvedML: {
  type: String,
  default: null,
},

userConfirmed: {
  type: Boolean,
  default: false,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);