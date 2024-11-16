const express = require("express");
const router = express.Router();
const {
    createProductCtrl,
    getListProductByCatgCtrl,
    getListProductConditionsCtrl,
    getListProductDealBookCtrl
} = require("../controllers/productController");

router.post("/", createProductCtrl);
router.get("/byCategory", getListProductByCatgCtrl);
router.get("/top-deal", getListProductConditionsCtrl);
router.get("/top-deal-book", getListProductDealBookCtrl);


module.exports = router;