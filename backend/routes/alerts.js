const express = require("express");

const router = express.Router();

const pool = require("../config/db");

// GET /api/alerts
// Shows unresolved alerts by default
router.get("/", async (req, res) => {
  try {
    const showAll = req.query.all === "true";

    let query = `
      SELECT
        id,
        site,
        issue,
        severity,
        eta,
        resolved,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      FROM alerts
    `;

    if (!showAll) {
      query += ` WHERE resolved = false`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch alerts:", err.message);

    res.status(500).json({
      error: "Failed to fetch alerts",
      details: err.message
    });
  }
});

// POST /api/alerts
// Creates a new alert
router.post("/", async (req, res) => {
  try {
    const {
      site,
      issue,
      severity,
      eta,
      resolved
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO alerts
      (
        site,
        issue,
        severity,
        eta,
        resolved
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        id,
        site,
        issue,
        severity,
        eta,
        resolved,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [
        site,
        issue,
        severity,
        eta ?? "—",
        resolved ?? false
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Failed to create alert:", err.message);

    res.status(400).json({
      error: "Failed to create alert",
      details: err.message
    });
  }
});

// PATCH /api/alerts/:id/resolve
// Marks an alert as resolved
router.patch("/:id/resolve", async (req, res) => {
  try {
    const result = await pool.query(
      `
      UPDATE alerts
      SET
        resolved = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING
        id,
        site,
        issue,
        severity,
        eta,
        resolved,
        created_at AS "createdAt",
        updated_at AS "updatedAt";
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Alert not found"
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to resolve alert:", err.message);

    res.status(400).json({
      error: "Failed to resolve alert",
      details: err.message
    });
  }
});

module.exports = router;