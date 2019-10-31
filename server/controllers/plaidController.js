const plaid = require('plaid');
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
  plaid.environments.development
);

module.exports = {
  getItemInfo: (req, res) => {
    const db = req.app.get('db');

    db.get_item(req.session.user.id).then(results => {
      client.getTransactions(
        results[0].access_token,
        '2019-10-12',
        '2019-10-25',
        {
          count: 25,
          offset: 0
        },
        (err, response) => {
          // Handle err
          if (err) {
            console.log('error', err);
          }

          response.transactions.forEach(transact => {
            console.log(transact.category);
          });

          res.status(201).send(response);
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

    const PUBLIC_TOKEN = request.body.public_token;
    // console.log(PUBLIC_TOKEN, PLAID_PUBLIC_KEY);
    console.log(request.body);
    client.exchangePublicToken(PUBLIC_TOKEN, (error, tokenResponse) => {
      console.log(error);
      if (error != null) {
        console.log(`Could not exchange public_token! Error: ${error}`);
        return response.json({ error });
      }
      ACCESS_TOKEN = tokenResponse.access_token;
      ITEM_ID = tokenResponse.item_id;

      // console.log("Access Token: " + ACCESS_TOKEN);
      // console.log("Item ID: " + ITEM_ID);
      response.json({ error: false });
      db.insert_item_id([ITEM_ID, USER_ID, ACCESS_TOKEN]);

      client.getTransactions(
        ACCESS_TOKEN,
        '2018-01-01',
        '2018-02-01',
        {
          count: 5,
          offset: 0
        },
        (err, result) => {
          // Handle err
          const transactions = result.transactions;
          console.log(transactions);
          transactions.forEach(val => {
            db.insert_transactions([
              val.account_id,
              val.account_owner,
              val.amount,
              val.category,
              val.category_id,
              val.date,
              val.ios_currency_code,
              val.location,
              val.name,
              val.payment_meta,
              val.pending,
              val.pending_transaction_id,
              val.transaction_id,
              val.transaction_type,
              val.unofficial_currency_code
            ]);
          });
        }
      );
    });
  }
};
