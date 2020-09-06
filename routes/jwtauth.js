const router = require("express").Router();
const pool = require("../src/db");
const jwtGenerator = require("../services/jwtGenerator");
const bcrypt = require("bcrypt");
const { json } = require("express");
const authorization = require("../middlewares/authorization");

router.post("/register", async (req, res) => {
  try {
    const { name, email, gender, birthdate, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    let message = "";
    if (user.rows.length !== 0) {
      message = "You already have an account with us. Kindly login";

      res.status(409).send({ error: true, data: null, message: message });
    } else {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(password, salt);

      const accountStatus = "Active";

      const createUser = await pool.query(
        "INSERT INTO users (user_name, user_email, user_password, user_gender, user_birthdate, account_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [name, email, bcryptPassword, gender, birthdate, accountStatus]
      );

      const token = jwtGenerator(createUser.rows[0].userid);
      res.json({ token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [
      email,
    ]);

    let message = "";
    if (user.rows.length === 0) {
      message = `User with email ${email} was not found in the system.`;
      res.status(404).send({ error: true, data: null, message: message });
    } else {
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].user_password
      );

      if (!validPassword) {
        message = "Login failed. Check your email or password.";
        res.status(401).send({ error: true, data: null, message: message });
      } else {
        const token = jwtGenerator(user.rows[0].userid);
        res.json({ token });
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

router.get("/is-verify", authorization, async (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

module.exports = router;
