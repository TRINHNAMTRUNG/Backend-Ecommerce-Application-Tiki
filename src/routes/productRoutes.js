const express = require("express");
const router = express.Router();
const {
    createProductCtrl,
    getListProductByCatgCtrl,
    getListProductConditionsCtrl
} = require("../controllers/productController");

router.post("/", createProductCtrl);
router.get("/byCategory", getListProductByCatgCtrl);
router.get("/top-deal", getListProductConditionsCtrl);


module.exports = router;