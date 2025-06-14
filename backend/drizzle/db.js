const { Pool } = require("pg");
const { drizzle } = require("drizzle-orm/node-postgres");
require("dotenv").config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

const db = drizzle(pool);

module.exports = { db };
