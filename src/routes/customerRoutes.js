const express = require("express");
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });
const {
    createCustomerCtrl,
    getCustomerCtrl,
    getCustomerByIdCtrl,
    updateCustomerCtrl
} = require("../controllers/customerController");

router.post("/", upload.single('avatar'), createCustomerCtrl);
router.get("/all", getCustomerCtrl);
router.get("/", getCustomerByIdCtrl);
router.put("/", upload.single('avatar'), updateCustomerCtrl);


module.exports = router;