

const express = require("express");
const router = express.Router();

const {
    createBrandCtrl,
    updateBrandCtrl,
    getAllBrandCtrl
} = require("../controllers/brandController");

router.post("/", createBrandCtrl);
router.put("/", updateBrandCtrl);
router.get("/", getAllBrandCtrl);

module.exports = router;