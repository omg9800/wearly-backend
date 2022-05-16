const Product = require("../model/product");

module.exports.getAllProducts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find()
    // .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
  const id = req.params.id;

  Product.findOne({
    id,
  })
    // .select(["-_id"])
    .then((product) => {
      res.json(product);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
  Product.distinct("category")
    .then((categories) => {
      res.json(categories);
    })
    .catch((err) => console.log(err));
};

// module.exports.getProductCategories = (req, res) => {
//   Product.distinct("rating")
//     .then((categories) => {
//       res.json(categories);
//     })
//     .catch((err) => console.log(err));
// };

module.exports.getProductBrands = (req, res) => {
  Product.distinct("title")
    .then((brands) => {
      res.json(brands);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
  const category = req.params.category;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find({
    category,
  })
    .select()
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.getProductsInGender = (req, res) => {
  const gender = req.params.gender;
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;

  Product.find({
    gender,
  })
    // .select(["-_id"])
    .limit(limit)
    .sort({ id: sort })
    .then((products) => {
      res.json(products);
    })
    .catch((err) => console.log(err));
};

module.exports.addProduct = (req, res) => {
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    let productCount = 0;
    Product.find()
      .countDocuments(function (err, count) {
        productCount = count;
      })
      .then(() => {
        const product = new Product({
          id: productCount + 1,
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          image: req.body.image,
          category: req.body.category,
          size: req.body.size,
          color: req.body.color,
          discount: req.body.discount,
          rating: {
            star: req.body.rating.star,
            count: req.body.rating.count,
          },
          gender: req.body.gender,
        });
        product
          .save()
          .then((product) => res.json(product))
          .catch((err) => console.log(err));
        res.json(product);
      });
  }
};

module.exports.editProduct = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    res.json({
      id: req.params.id,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
    });
  }
};

module.exports.deleteProduct = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "cart id should be provided",
    });
  } else {
    Product.findOne({
      id: req.params.id,
    })
      .select(["-_id"])
      .then((product) => {
        res.json(product);
      })
      .catch((err) => console.log(err));
  }
};
