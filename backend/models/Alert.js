const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    site: { type: String, required: true },
    issue: { type: String, required: true },
    severity: { type: String, enum: ["high", "medium", "low"], required: true },
    eta: { type: String, default: "—" }, // e.g. "3 days"
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
