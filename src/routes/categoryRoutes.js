
const express = require("express");
const router = express.Router();

const {
    createCategoryCtrl,
    getCategoryCtrl
} = require("../controllers/categoryController");

router.post("/", createCategoryCtrl);
router.get("/", getCategoryCtrl);


module.exports = router;