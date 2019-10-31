module.exports = {
  getTransactions: (req, res) => {
    const db = req.app.get('db');
    const user = req.session.user.id;
    console.log('USER', user);

    db.get_transactions(user).then(results => {
      return res.status(201).send(results);
    });
  },
  getRules: (req, res) => {
    const db = req.app.get('db');
    const user = req.session.user.id;

    db.get_rules(user).then(results => {
      return res.status(201).send(results);
    });
  }
};
