const express = require("express");
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const {
    createCategoryCtrl,
    getCategoryCtrl,
    getListRootCategoryCtrl,
    getListLeafCategoryCtrl
} = require("../controllers/categoryController");

router.post("/", upload.single('image'), createCategoryCtrl);
router.get("/", getCategoryCtrl);
router.get("/root", getListRootCategoryCtrl);
router.get("/leaf/:id", getListLeafCategoryCtrl);


module.exports = router;