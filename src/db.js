const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "root",
  host: "localhost",
  database: "chatdb",
  port: 5432,
});

module.exports = pool;
