const express = require("express");
const router = express.Router();
const {
    createProductCtrl,
    getListProductByCatgCtrl,
    getListProductConditionsCtrl,
    getListProductDealBookCtrl,
    getListProductNewCtrl,
    getSearchProductCtrl
} = require("../controllers/productController");

router.post("/", createProductCtrl);
router.get("/byCategory", getListProductByCatgCtrl);
router.get("/top-deal", getListProductConditionsCtrl);
router.get("/top-deal-book", getListProductDealBookCtrl);
router.get("/top-deal-new", getListProductNewCtrl);
router.get("/search", getSearchProductCtrl);


module.exports = router;