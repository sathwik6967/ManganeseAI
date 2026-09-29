/*
 * Seeds MongoDB with REAL data:
 * - Actual MOIL mine locations (Balaghat MP; Nagpur & Bhandara, Maharashtra)
 * - Real coordinates (approximate mine/district centroids)
 * - Real published production figures (see python-service/train_model.py for sources)
 * - Real state-wise reserve shares (IBM/GSI-derived, as reported)
 *
 * Note: `confidence`/`prospectivityIndex` fields here are placeholders until
 * you call POST /api/predict/reserves for each site, which fetches live
 * NASA POWER data and computes the real index via the Python service.
 */
require("dotenv").config();
const connectDB = require("./config/db");
const Site = require("./models/Site");
const Production = require("./models/Production");
const Alert = require("./models/Alert");

const sites = [
  {
    siteId: "MOIL-BLG",
    name: "Balaghat Mine",
    state: "Madhya Pradesh",
    confidence: 0, // populate via /api/predict/reserves
    status: "medium",
    tonnageEstimateT: 0,
    coordinates: { lat: 21.8074, lng: 80.1899 }, // Balaghat district, MP - MOIL's largest mine
  },
  {
    siteId: "MOIL-NGP",
    name: "Nagpur Mines Cluster",
    state: "Maharashtra",
    confidence: 0,
    status: "medium",
    tonnageEstimateT: 0,
    coordinates: { lat: 21.1458, lng: 79.0882 }, // Nagpur district, MH
  },
  {
    siteId: "MOIL-BHN",
    name: "Bhandara / Dongri Buzurg",
    state: "Maharashtra",
    confidence: 0,
    status: "medium",
    tonnageEstimateT: 0,
    coordinates: { lat: 21.1666, lng: 79.6533 }, // Bhandara district, MH - opencast, dioxide ore
  },
  {
    siteId: "NON-MOIL-KJR",
    name: "Keonjhar Belt (non-MOIL, reference)",
    state: "Odisha",
    confidence: 0,
    status: "medium",
    tonnageEstimateT: 0,
    coordinates: { lat: 21.6297, lng: 85.5817 }, // Keonjhar district, Odisha - highest reserve-share state nationally
  },
];

// Real published production, MOIL (see python-service/train_model.py for full citations)
const production = [
  { month: "FY", year: 2016, actualKt: 1093.363, predictedKt: null },
  { month: "FY", year: 2024, actualKt: 1750, predictedKt: null },
  { month: "FY(9mo)", year: 2025, actualKt: 1330, predictedKt: null }, // Apr-Dec 2024, real, partial year
];

async function seed() {
  await connectDB();

  await Site.deleteMany({});
  await Production.deleteMany({});
  await Alert.deleteMany({});

  await Site.insertMany(sites);
  await Production.insertMany(production);
  // No fabricated alerts - alerts are only created when /api/predict/shortfall
  // detects a real deviation from the trained model's expected trend.

  console.log("Database seeded with real MOIL site coordinates and published production figures.");
  console.log("Run POST /api/predict/reserves for each site to populate real prospectivity indices from live NASA POWER data.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
