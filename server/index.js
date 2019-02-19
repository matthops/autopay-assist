require("dotenv").config();
const express = require("express");
const session = require("express-session");
const massive = require("massive");
const bodyParser = require("body-parser");
const ac = require("./controllers/authController");
// const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const app = express();

app.use(bodyParser.json());

const { CONNECTION_STRING, SESSION_SECRET } = process.env;

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  console.log("db connected");
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
  })
);

// app.use(auth);

app.post("/auth/register", ac.register);
app.post("/auth/login", ac.login);
app.get("/auth/logout", ac.logout);

app.get("/auth/me", ac.me);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
