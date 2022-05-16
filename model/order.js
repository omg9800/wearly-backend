const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Product = require("./product");
const User = require("./user");

const orderSchema = new schema({
  userId: {
    type: schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  products: [
    {
      productId: {
        type: schema.Types.ObjectId,
        ref: Product,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      size: {
        type: Number,
      },
    },
  ],
  address: {
    name: String,
    phone: String,
    city: String,
    state: String,
    street: String,
    houseNumber: String,
    zipcode: String,
    addressType: String,
  },
});

module.exports = mongoose.model("order", orderSchema);
