const express = require("express");
const router = express.Router();
const user = require("../controller/user");
console.log(user);
router.get("/", user.getAllUser);
router.get("/:id", user.getUser);
router.post("/", user.addUser);
router.put("/:userId", user.addAddress);
router.put("/:userId/:address_id", user.editAddress);
router.delete("/:userId/:address_id", user.deleteAddress);

// router.get("/:userId", user.getAddress);

// router.put("/:id", user.editUser);
// router.patch("/:id", user.editUser);
router.delete("/:id", user.deleteUser);

module.exports = router;
