const bcrypt = require("bcrypt");

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    console.log("body", req.body);
    const db = req.app.get("db");
    const result = await db.get_user([username]);
    const existingUser = result[0];
    if (existingUser) {
      res.status(409).send("Username taken");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.register_user([isAdmin, username, hash]);
    const user = registeredUser[0];
    req.session.user = {
      isAdmin: user.is_Admin,
      username: user.username,
      id: user.id
    };
    console.log("registered");
    return res.status(201).send(req.session.user);
  },

  login: async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await req.app.get("db").get_user([username]);
    const user = foundUser[0];
    if (!user) {
      return res
        .status(401)
        .send("User not found, Please register as a new user to login");
    }
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      return res.status(403).send("Incorrect Password");
    }
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    };
    return res.send(req.session.user);
  },

  logout: async (req, res) => {
    req.session.destroy();
    return res.sendStatus(200);
  },

  me: async (req, res) => {
    res.json(req.session.user);
  }
};
