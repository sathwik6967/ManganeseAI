const express = require("express");
const router = express.Router();

const pool = require("../config/db");

// GET /api/sites -> list all sites
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        site_name,
        district,
        state,
        mineral_type,
        latitude,
        longitude,
        source,
        ST_AsGeoJSON(location)::json AS location
      FROM manganese_sites
      ORDER BY id;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch sites:", err.message);
    res.status(500).json({
      error: "Failed to fetch sites",
      details: err.message
    });
  }
});

// GET /api/sites/:siteId -> single site
router.get("/:siteId", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        site_name,
        district,
        state,
        mineral_type,
        latitude,
        longitude,
        source,
        ST_AsGeoJSON(location)::json AS location
      FROM manganese_sites
      WHERE id = $1;
      `,
      [req.params.siteId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Site not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to fetch site:", err.message);
    res.status(500).json({
      error: "Failed to fetch site",
      details: err.message
    });
  }
});

// POST /api/sites -> add a new site
router.post("/", async (req, res) => {
  try {
    const {
      site_name,
      district,
      state,
      mineral_type,
      latitude,
      longitude,
      source
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO manganese_sites
      (
        site_name,
        district,
        state,
        mineral_type,
        latitude,
        longitude,
        source,
        location
      )
      VALUES
      ($1, $2, $3, $4, $5, $6, $7,
       ST_SetSRID(ST_MakePoint($6, $5), 4326))
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
        site_name,
        district,
        state,
        mineral_type,
        latitude,
        longitude,
        source
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create site:", err.message);
    res.status(400).json({
      error: "Failed to create site",
      details: err.message
    });
  }
});

module.exports = router;