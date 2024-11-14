const express = require("express");
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const {
    createSellerCtrl,
    getSellerCtrl,
    getSellerByIdCtrl,
    updateSellerCtrl
} = require("../controllers/sellerController");

router.post("/", upload.single('avatar'), createSellerCtrl);
router.get("/all", getSellerCtrl);
router.get("/", getSellerByIdCtrl);
router.put("/", upload.single('avatar'), updateSellerCtrl);

module.exports = router;