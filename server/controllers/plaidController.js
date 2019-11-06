const plaid = require('plaid');
const moment = require('moment');
require('dotenv').config();

const {
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  REACT_APP_PLAID_PUBLIC_KEY
} = process.env;

const client = new plaid.Client(
  PLAID_CLIENT_ID,
  PLAID_SECRET,
  REACT_APP_PLAID_PUBLIC_KEY,
  plaid.environments.sandbox
);

module.exports = {
  getItemInfo: (req, res) => {
    const db = req.app.get('db');

    const weekAgoDateString = moment()
      .subtract(7, 'days')
      .format('YYYY-MM-DD');

    const monthAgoDateString = moment()
      .subtract(1, 'months')
      .format('YYYY-MM-DD');
    const todaysDate = moment().format('YYYY-MM-DD');

    db.get_item(req.session.user.id).then(results => {
      if (!results[0]) {
        return res.status(201).send(results);
      }
      client.getTransactions(
        results[0].access_token,
        monthAgoDateString,
        todaysDate,
        {
          count: 25,
          offset: 0
        },
        (err, response) => {
          // Handle err
          if (err) {
            console.log('error', err);
          }

          return res.status(201).send(response);
        }
      );
    });
  },
  getCategories: (req, res) => {
    client.getCategories(function(err, response) {
      if (err) {
        console.log('error', err);
      }
      res.status(201).send(response.categories);
    });
  },
  getAccessToken: async (request, response, next) => {
    const db = await request.app.get('db');
    let ACCESS_TOKEN = null;
    let ITEM_ID = null;
    let USER_ID = request.body.user_id;

    // db.make_rules([USER_ID, { weekly: [] }]);

    const PUBLIC_TOKEN = request.body.public_token;
    console.log(request.body);
    client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
      console.log(error);
      if (error != null) {
        console.log(`Could not exchange public_token! Error: ${error}`);
        return response.json({ error });
      }
      ACCESS_TOKEN = tokenResponse.access_token;
      ITEM_ID = tokenResponse.item_id;
      console.log('ACCESS_TOKEN', ACCESS_TOKEN);

      db.insert_item_id([ITEM_ID, USER_ID, ACCESS_TOKEN]);

      const weekAgoDateString = moment()
        .subtract(7, 'days')
        .format('YYYY-MM-DD');

      const todaysDate = moment().format('YYYY-MM-DD');

      client.getTransactions(
        ACCESS_TOKEN,
        weekAgoDateString,
        todaysDate,
        {
          count: 10,
          offset: 0
        },
        (err, result) => {
          // Handle err
          console.log('result transactions', result.transactions);
          return response.status(201).send(result.transactions);
        }
      );
    });
  }
};
