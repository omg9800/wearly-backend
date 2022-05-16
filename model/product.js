const mongoose = require("mongoose");
const schema = mongoose.Schema;

// function colorValidator (v) {
//     if (v.indexOf('#') == 0) {
//         if (v.length == 7) {  // #f0f0f0
//             return true;
//         } else if (v.length == 4) {  // #fff
//             return true;
//         }
//     }
//     return COLORS.indexOf(v) > -1;
// };

const productSchema = new schema({
  _id: { type: schema.Types.ObjectId, required: true },
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: String,
  image: [String],
  category: String,
  size: [Number],
  color: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  rating: {
    star: {
      type: Number,
      default: 3.5,
    },
    count: {
      type: Number,
      default: 99,
    },
  },
});

module.exports = mongoose.model("product", productSchema);
