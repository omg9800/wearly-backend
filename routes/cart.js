const express = require("express");
const router = express.Router();
const cart = require("../controller/cart");

router.get("/", cart.getAllCarts);
router.get("/:id", cart.getSingleCart);
router.get("/user/:userid", cart.getCartsbyUserid);

router.post("/", cart.addCart);
//router.post('/:id',cart.addtoCart)

router.put("/user/:uid", cart.editCart);
// router.put("/:uid/:pid", cart.editSize);

// router.patch("/:id", cart.editCart);
router.delete("/:uid/:pid", cart.deleteCart);

module.exports = router;
