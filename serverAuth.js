//https://www.youtube.com/watch?v=mbsmsi7l3r4
//https://github.com/WebDevSimplified/JWT-Authentication

require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 4000;

app.use(express.json());

let refreshTokens = []; // this should be a redis or mongodb

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401); // Unauthorized
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // Forbidden

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden token bad
    // passed all checks here
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token); // keep everything except the one passed in
  res.sendStatus(204); // No Content success
});

app.post("/login", (req, res) => {
  // Authenticate User
  // Add the other tutorial here
  //https://www.youtube.com/watch?v=Ud5xKCYQTjM
  const username = req.body.username;
  const user = { name: username };

  // Create TOKEN run below two commands from cli
  // node
  //> require('crypto').randomBytes(64).toString('hex')

  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "120s",
  }); //make this 10m to 15m
  res.json({ accessToken: accessToken });
}

app.listen(PORT, () => {
  console.log("Server running on port %d", PORT);
});
