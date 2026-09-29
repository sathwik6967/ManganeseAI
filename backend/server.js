require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const sitesRouter = require("./routes/sites");
const productionRouter = require("./routes/production");
const alertsRouter = require("./routes/alerts");
const predictRouter = require("./routes/predict");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "manganese-backend"
  });
});

// Routes
app.use("/api/sites", sitesRouter);
app.use("/api/production", productionRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/predict", predictRouter);

const PORT = process.env.PORT || 3000;

// Test PostgreSQL connection before starting server
pool.query("SELECT NOW()")
  .then(() => {
    console.log("PostgreSQL connection successful");

    app.listen(PORT, () => {
      console.log(`Manganese backend running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("PostgreSQL connection failed:", err.message);
    process.exit(1);
  });