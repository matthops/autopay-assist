require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const ac = require('./controllers/authController');
const pc = require('./controllers/plaidController');
const mc = require('./controllers/mainController');
// const plaid = require("plaid");
// const auth = require("./middleware/authMiddleware");

const PORT = 4000;

const app = express();

app.use(bodyParser.json());

const { CONNECTION_STRING, PLAID_SECRET } = process.env;

massive(CONNECTION_STRING).then(db => {
  app.set('db', db);
  console.log('db connected');
});

app.use(
  session({
    resave: true,
    saveUninitialized: false,
    secret: PLAID_SECRET
  })
);

// app.use(auth);

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login);
app.post('/plaid/get_access_token', pc.getAccessToken);

app.get('/auth/logout', ac.logout);
app.get('/auth/me', ac.me);
app.get('/api/transactions', mc.getTransactions);

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
