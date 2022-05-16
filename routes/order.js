const express = require("express");
const router = express.Router();
const order = require("../controller/order");

router.get("/", order.getAllOrders);
router.get("/:id", order.getSingleOrder);
router.get("/user/:userid", order.getOrdersbyUserid);

// router.post("/", order.addOrder);
router.post("/:id", order.addOrder);

router.put("/:id", order.editOrder);
router.patch("/:id", order.editOrder);
router.delete("/:id", order.deleteOrder);

module.exports = router;
