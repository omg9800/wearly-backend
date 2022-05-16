const User = require("../model/user");

module.exports.getAllUser = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  User.find()
    .select(["-_id"])
    .limit(limit)
    .sort({
      id: sort,
    })
    .then((users) => {
      res.json(users);
    })
    .catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
  const id = req.params.id;

  User.findOne({
    _id: id,
  })
    .select(["-_id"])
    .then((user) => {
      res.json(user);
    })
    .catch((err) => console.log(err));
};

module.exports.addUser = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name: {
        firstname: req.body.name.firstname,
        lastname: req.body.name.lastname,
      },

      phone: req.body.phone,
    });
    // console.log(user);
    user
      .save()
      .then((user) => res.json(user))
      .catch((err) => console.log(err));
  }
};

module.exports.addAddress = async (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let user = await User.findOne({ _id: req.params.userId });
    // console.log(user);
    if (user) {
      user.address.push(req.body.address);
    }
    await user.save();
    res.json(user);
  }
};

module.exports.editAddress = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    User.updateOne(
      { _id: req.params.userId },
      {
        $set: {
          "address.$[p]": req.body.address,
        },
      },
      { arrayFilters: [{ "p._id": req.params.address_id }] },

      function (err, model) {
        if (err) {
          console.log(err);
          return res.send(err);
        } else {
          res.json(model);
        }
      }
    );
  }
};

module.exports.deleteAddress = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    User.updateOne(
      { _id: req.params.userId },
      {
        $pull: {
          address: { _id: req.params.address_id },
        },
      },
      // { arrayFilters: [{ "p._id": req.params.address_id }] },

      { safe: true }
    )
      .then((id) => {
        console.log("deleted");
        res.json(id);
      })
      .catch((err) => console.log(err));
  }
};

module.exports.getAddress = async (req, res) => {
  let user = await User.find({ _id: req.params.userId });
  // console.log(user);
  if (user) {
    res.json(user.address);
  } else {
    console.log("user not found.");
  }
};

// module.exports.editUser = (req, res) => {
//   if (typeof req.body == undefined || req.params.id == null) {
//     res.json({
//       status: "error",
//       message: "something went wrong! check your sent data",
//     });
//   } else {

//      User.updateOne(
//       { _id: req.params.userId },
//       {
//             user:req.body.user
//       }

//     }
// };

module.exports.deleteUser = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    User.findOne({ id: req.params.id })
      .select(["-_id"])
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
  }
};
