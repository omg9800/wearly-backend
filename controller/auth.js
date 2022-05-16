const jwt = require("jsonwebtoken");
const User = require("../model/user");

module.exports.login = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    User.findOne({
      username,
      password,
    })
      .select("-password")
      .then((user) => {
        if (!user) {
          res.sendStatus(403).json({
            status: "Error",
            msg: "username or password is incorrect",
          });
        } else {
          const accessToken = jwt.sign({ user }, "privatekey");
          res.json({
            accessToken: accessToken,
            user: user,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.sendStatus(400).send("Usename and password is required");
  }
};

module.exports.checkToken = (req, res, next) => {
  const header = req.headers["authorization"];

  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];

    jwt.verify(token, "privatekey", (err, user) => {
      if (err) return sendStatus(401);
      req.user = user;
      next();
    });

    // req.accessToken = accessToken;
    // next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
};
