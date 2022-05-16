const express = require("express");
const router = express.Router();
const product = require("../controller/product");
const auth = require("../controller/auth");
//  auth.checkToken,
router.get("/", product.getAllProducts);
router.get("/categories", product.getProductCategories);
// router.get("/categories", product.getProductCategories);

router.get("/brands", product.getProductBrands);

router.get("/category/:category", product.getProductsInCategory);
router.get("/gender/:gender", product.getProductsInGender);

router.get("/:id", product.getProduct);
router.post("/", product.addProduct);
router.put("/:id", product.editProduct);
router.patch("/:id", product.editProduct);
router.delete("/:id", product.deleteProduct);

module.exports = router;
