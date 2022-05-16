const Cart = require("../model/cart");
var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { login } = require("./auth");

module.exports.getAllCarts = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);

  // Cart.find({
  //   date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  // })
  Cart.find({ date: { $gte: new Date(startDate), $lt: new Date(endDate) } })
    .populate({
      path: "products",
      populate: {
        path: "productId",
        model: "product",
      },
    })
    .populate({
      path: "userId",
      model: "user",
    })
    .select("-_id -products._id ")
    .limit(limit)
    .sort({ id: sort })
    .then((carts) => {
      res.json(carts);
      console.log("ran");
    })
    .catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = (req, res) => {
  const userId = req.params.userid;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  console.log(startDate, endDate);
  console.log(userId);
  // -_id -products._id -products.productId.rating -products.productId.size -products.productId.category -products.productId.gender
  Cart.find({
    userId: ObjectId(req.params.userid),
  })
    .populate({
      path: "products",
      populate: {
        path: "productId",
        model: "product",
        select: "title price description size image _id",
      },
    })
    .select("-_id -products._id")
    .then((carts) => {
      console.log(carts);
      res.json(carts);
    })
    .catch((err) => console.log(err));
};

module.exports.getSingleCart = (req, res) => {
  const id = req.params.id;
  Cart.findOne({
    _id: id,
  })
    .select("-_id -products._id")
    .then((cart) => res.json(cart))
    .catch((err) => console.log(err));
};

module.exports.addCart = async (req, res) => {
  console.log(req.body);
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    try {
      let cart = await Cart.findOne({ userId: ObjectId(req.body.userId) });

      if (cart) {
        // console.log(req.body.products);
        cart.products.push({
          productId: ObjectId(req.body.product.productId),
          quantity: req.body.product.quantity,
          size: req.body.product.size,
        });
      } else {
        cart = await Cart.create({
          userId: req.body.userId,
          date: Date.now(),
          products: [req.body.product],
        });
      }
      await cart.save();
      res.json(cart);
    } catch (e) {
      console.log(e.message);
    }
  }
};

module.exports.editCart = async (req, res) => {
  if (
    typeof req.body == undefined ||
    req.params.uid == null
    // req.params.pid == null
  ) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    // console.log(req.body.quantity, req.body.size);
    // Cart.updateOne(
    //   { userId: req.params.uid },
    //   {
    //     $set: {
    //       products: req.body.items,
    //       userId: req.body.userId,
    //     },
    //   },
    //   { userId: req.params.uid },
    //   {
    //     $set: {
    //       "products.$[p].quantity": req.body.quantity,
    //       "products.$[p].size": req.body.size,
    //     },
    //   },
    //   { arrayFilters: [{ "p.productId": req.params.pid }] },

    //   function (err, model) {
    //     if (err) {
    //       console.log(err);
    //       return res.send(err);
    //     }
    //     return res.json(model);
    //   }
    // );

    try {
      console.log(req.body.items, req.body.userId);
      const cart = await Cart.updateOne(
        {
          userId: req.body.userId,
        },
        {
          $set: {
            products: req.body.items,
            userId: req.params.uid,
          },
        },
        {
          upsert: true,
        }
      );

      res.json(cart);
      console.log("cart updated", cart);
    } catch (err) {
      console.error(err);
      throw err;
    }

    // try {
    //   let cart = await Cart.findOne({ userId: ObjectId(req.body.userId) });
    //   console.log(req.body.items);
    //   if (cart) {
    //     cart.userId = req.params.uid;
    //     cart.products = req.body.items;
    //   } else {
    //     cart = await Cart.create({
    //       userId: req.params.uid,
    //       date: Date.now(),
    //       products: [...req.body.items],
    //     });
    //   }
    //   await cart.save();
    //   console.log(cart);
    //   res.json(cart);
    // } catch (e) {
    //   console.log(e.message);
    // }
  }
};

module.exports.editSize = (req, res) => {
  if (
    typeof req.body == undefined ||
    req.params.uid == null ||
    req.params.pid == null
  ) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    // console.log(req.params.uid, req.params.pid);
    Cart.updateOne(
      // { userId: req.params.uid },
      // {
      //   $set: {
      //     "products.0.quantity": req.body.quantity,
      //     "products.0.size": req.body.size,
      //   },
      // },

      { userId: req.params.uid },
      {
        $set: {
          // "products.$[p].quantity": req.body.quantity,
          "products.$[p].size": req.body.size,
        },
      },
      { arrayFilters: [{ "p.productId": req.params.pid }] },

      function (err, model) {
        if (err) {
          console.log(err);
          console.log("err");
          return res.send(err);
        }
        return res.json(model);
      }
    );
  }
};

module.exports.deleteCart = (req, res) => {
  if (req.params.uid == null || req.params.pid == null) {
    res.json({
      status: "error",
      message: "Id should be provided",
    });
  } else {
    console.log(req.params.uid, req.params.pid);
    Cart.updateOne(
      { userId: req.params.uid },
      {
        $pull: {
          products: { productId: req.params.pid },
        },
      },
      { safe: true }
    )
      .select("-_id -products._id")
      .then((cart) => {
        console.log("deleted");
        res.json(cart);
      })
      .catch((err) => console.log(err));
  }
};
