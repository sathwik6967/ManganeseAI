const express = require("express");

const router = express.Router();

const pool = require("../config/db");

// GET /api/production
// Returns production records for the actual-vs-predicted chart
router.get("/", async (req, res) => {
  try {
    const { siteId } = req.query;

    let query = `
      SELECT
        id,
        month,
        year,
        actual_kt AS "actualKt",
        predicted_kt AS "predictedKt",
        site_id AS "siteId",
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM production
    `;

    const values = [];

    if (siteId) {
      query += ` WHERE site_id = $1`;
      values.push(siteId);
    }

    query += ` ORDER BY created_at ASC`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch production data:", err.message);

    res.status(500).json({
      error: "Failed to fetch production data",
      details: err.message
    });
  }
});

// POST /api/production
// Adds a new production record
router.post("/", async (req, res) => {
  try {
    const {
      month,
      year,
      actualKt,
      predictedKt,
      siteId
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO production
      (
        month,
        year,
        actual_kt,
        predicted_kt,
        site_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        month,
        year,
        actual_kt AS "actualKt",
        predicted_kt AS "predictedKt",
        site_id AS "siteId",
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [
        month,
        year,
        actualKt ?? null,
        predictedKt,
        siteId ?? null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create production record:", err.message);

    res.status(400).json({
      error: "Failed to create production record",
      details: err.message
    });
  }
});

module.exports = router;