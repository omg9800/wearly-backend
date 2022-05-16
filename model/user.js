const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  address: [
    {
      name: String,
      phone: String,
      city: String,
      state: String,
      street: String,
      houseNumber: String,
      zipcode: String,
      addressType: String,
    },
  ],
  // phone: String,
});

module.exports = mongoose.model("user", userSchema);
