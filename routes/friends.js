const router = require("express").Router();
const app = require("../index");
const authorization = require("../middlewares/authorization");
const pool = require("../src/db");

const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server);

io.of("/friendsIo").on("connect", (socket) => {
  socket.emit("requestIdFromServer");
  socket.on("idToServer", (data) => {
    socket.join(Number(data));
  });
});

//all users
router.post("/allusers", authorization, async (req, res) => {
  try {
    const userid = req.user;

    const users = await pool.query(
      "SELECT user_email, user_name, user_gender, user_birthdate FROM users WHERE NOT userid = $1",
      [userid]
    );

    let message = "";
    if (users.rows.length === 0) {
      message = "No users were found in the system";
      res.status(404).send({ error: true, data: null, message: message });
    } else {
      message = "Available users";
      res
        .status(201)
        .send({ error: false, data: users.rows, message: message });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

//send friend request
router.post("/addfriend", authorization, async (req, res) => {
  try {
    const { email } = req.body;
    const ownId = req.user;

    const getFriendId = await pool.query(
      "SELECT * FROM users WHERE user_email = $1",
      [email]
    );

    const friendId = getFriendId.rows[0].userid;
    const friendStatus = "Pending";

    const sendFriendRequest = await pool.query(
      "INSERT INTO user_friends (user_id, friend_id, friend_status) VALUES ($1, $2, $3) RETURNING *",
      [ownId, friendId, friendStatus]
    );

    let message = "Friend request was successfully send. ";
    return res.status(201).send({
      error: false,
      data: sendFriendRequest.rows[0],
      message: message,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

//cancel a friend request
router.post("/cancelrequest", authorization, async (req, res) => {
  try {
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

module.exports = router;
