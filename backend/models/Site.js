const mongoose = require("mongoose");

const siteSchema = new mongoose.Schema(
  {
    siteId: { type: String, required: true, unique: true }, // e.g. "MN-04"
    name: { type: String, required: true },                  // e.g. "Balaghat Belt"
    state: { type: String, required: true },                 // e.g. "Madhya Pradesh"
    confidence: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ["high", "medium", "low"], required: true },
    tonnageEstimateT: { type: Number, required: true },       // tonnes, e.g. 2400000
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    indicators: {
      ndvi: { type: Number },           // vegetation index
      soilMoisture: { type: Number },   // %
      landSurfaceTempC: { type: Number },
      rainfallMm: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Site", siteSchema);
