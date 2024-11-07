const express = require("express");
const router = express.Router();
const {
    createProductCtrl,
    getListProductByCatgCtrl
} = require("../controllers/productController");

router.post("/", createProductCtrl);
router.get("/byCategory", getListProductByCatgCtrl);


module.exports = router;