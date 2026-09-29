const express = require("express");
const router = express.Router();
const axios = require("axios");

const pool = require("../config/db");

const AI_URL =
  process.env.PYTHON_AI_SERVICE_URL || "http://localhost:8000";


// POST /api/predict/reserves
// Sends the selected location to the Python AI service
router.post("/reserves", async (req, res) => {
  try {
    const { data } = await axios.post(
      `${AI_URL}/predict-reserves`,
      req.body
    );

    const siteName = data.siteId || req.body.name;

    const result = await pool.query(
      `
      UPDATE manganese_sites
      SET
        latitude = $1,
        longitude = $2,
        location = ST_SetSRID(
          ST_MakePoint($2, $1),
          4326
        )
      WHERE site_name = $3
      RETURNING
        id,
        site_name,
        district,
        state,
        mineral_type,
        latitude,
        longitude,
        source,
        ST_AsGeoJSON(location)::json AS location;
      `,
      [
        req.body.lat,
        req.body.lon,
        siteName
      ]
    );

    res.json({
      site: result.rows[0] || null,
      disclaimer: data.disclaimer,
      dataSource: data.dataSource,
      prediction: data
    });

  } catch (err) {
    console.error(
      "Python AI service call failed:",
      err.message
    );

    res.status(502).json({
      error: "Python AI service call failed",
      details: err.message
    });
  }
});


// POST /api/predict/shortfall
// Sends production information to the Python ML service
router.post("/shortfall", async (req, res) => {
  try {
    const { data } = await axios.post(
      `${AI_URL}/predict-shortfall`,
      req.body
    );

    // Create an alert for medium/high risk
    if (
      data.severity === "high" ||
      data.severity === "medium"
    ) {
      await pool.query(
        `
        INSERT INTO alerts
        (
          site,
          issue,
          severity,
          eta,
          resolved
        )
        VALUES ($1, $2, $3, $4, false);
        `,
        [
          data.site,
          data.issue,
          data.severity,
          data.eta ?? "—"
        ]
      );
    }

    res.json(data);

  } catch (err) {
    console.error(
      "Python AI service call failed:",
      err.message
    );

    res.status(502).json({
      error: "Python AI service call failed",
      details: err.message
    });
  }
});


module.exports = router;