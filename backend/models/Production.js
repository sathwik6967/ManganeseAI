const mongoose = require("mongoose");

const productionSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },   // e.g. "Apr", "May" (or use a real Date if you prefer)
    year: { type: Number, required: true, default: () => new Date().getFullYear() },
    actualKt: { type: Number, default: null },   // null when the month hasn't happened yet
    predictedKt: { type: Number, required: true },
    siteId: { type: String },                    // optional link to a Site
  },
  { timestamps: true }
);

module.exports = mongoose.model("Production", productionSchema);
