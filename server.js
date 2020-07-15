require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;

const posts = [
  {
    username: "Bill",
    title: "Post 1",
  },
  {
    username: "Kyle",
    title: "Post 2",
  },
];

app.use(express.json());

app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name)); // only returns data user has access to
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  // Bearer TOKEN
  // {
  //     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS3lsZSIsImlhdCI6MTU5NDc1Njg4N30.NaAF2v9OGUBz3G5sXoF7LGmYaMmqOeSjhb0DH7-g4ks"
  // }
  // below gets eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS3lsZSIsImlhdCI6MTU5NDc1Njg4N30.NaAF2v9OGUBz3G5sXoF7LGmYaMmqOeSjhb0DH7-g4ks
  // return undefined or TOKEN
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401); // no token

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // token is not valid
    // we know the token is valid here
    req.user = user;
    next();
  });
}

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});
