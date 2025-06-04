/** @type {import('drizzle-kit').Config} */
const config = {
  schema: "./drizzle/schema.js", // path to your JS schema file
  out: "./drizzle/migrations", // folder for migrations
  dialect: "postgresql",
  dbCredentials: {
    host: "localhost",
    port: 5433,
    user: "postgres",
    password: "123456",
      database: "tasky",
    ssl: false, // set to true if you want to use SSL
  },
};

module.exports = config;
