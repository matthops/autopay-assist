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
  },
  updateRules: (req, res) => {
    const db = req.app.get('db');
    const user = req.session.user.id;
    const user_rules = req.body.userRules;

    db.get_rules([user]).then(results => {
      console.log('rules results', results[0].category.weekly);
      console.log('user_rules', user_rules);
      let userRules = results[0].category.weekly;
      userRules.push(user_rules);

      console.log('userRules', userRules);
      db.set_rules([user, { weekly: userRules }]).then(response => {
        res.status(201).send(response);
      });
    });
  },
  deleteFromRules: (req, res) => {
    const db = req.app.get('db');
    const user = req.session.user.id;
    const userRules = req.body.userRules;

    db.set_rules([user, { weekly: userRules }]).then(response => {
      res.status(201).send(response);
    });
  }
};
