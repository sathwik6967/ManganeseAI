const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "manganese_ai",
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

pool.on("error", (err) => {
  console.error("PostgreSQL error:", err.message);
});

module.exports = pool;