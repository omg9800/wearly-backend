const Order = require("../model/order");
var mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

module.exports.getAllOrders = (req, res) => {
  const limit = Number(req.query.limit) || 0;
  const sort = req.query.sort == "desc" ? -1 : 1;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  Order.find({
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
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
    .select("-_id -products._id")
    .limit(limit)
    .sort({ id: sort })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => console.log(err));
};

module.exports.getOrdersbyUserid = (req, res) => {
  const userId = req.params.userid;
  const startDate = req.query.startdate || new Date("1970-1-1");
  const endDate = req.query.enddate || new Date();

  Order.find({
    userId,
    date: { $gte: new Date(startDate), $lt: new Date(endDate) },
  })
    .populate({
      path: "products",
      populate: {
        path: "productId",
        model: "product",
        select: "title price description image _id",
      },
    })
    .select("-_id -products._id -address")
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => console.log(err));
};

module.exports.getSingleOrder = (req, res) => {
  const id = req.params.id;
  Order.findOne({
    id,
  })
    .select("-_id -products._id")
    .then((order) => res.json(order))
    .catch((err) => console.log(err));
};

module.exports.addOrder = async (req, res) => {
  console.log("addorder");
  if (typeof req.body == undefined) {
    res.json({
      status: "error",
      message: "data is undefined",
    });
  } else {
    try {
      let order = await Order.create({
        userId: req.body.userId,
        date: Date.now(),
        products: req.body.products,
        address: req.body.address,
      });

      await order.save();
      res.sendStatus(200).json(order);
    } catch (e) {
      console.log(e.message);
    }
  }
};

module.exports.editOrder = (req, res) => {
  if (typeof req.body == undefined || req.params.id == null) {
    res.json({
      status: "error",
      message: "something went wrong! check your sent data",
    });
  } else {
    res.json({
      id: req.params.id,
      userId: req.body.userId,
      date: req.body.date,
      products: req.body.products,
    });
  }
};

module.exports.deleteOrder = (req, res) => {
  if (req.params.id == null) {
    res.json({
      status: "error",
      message: "Order id should be provided",
    });
  } else {
    Order.findOne({ id: req.params.id })
      .select("-_id -products._id")
      .then((order) => {
        res.json(order);
      })
      .catch((err) => console.log(err));
  }
};
