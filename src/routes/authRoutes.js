
const express = require("express");
const router = express.Router();
const { registerAccountCtrl, loginAccountCtrl, changePasswordCtrl } = require("../controllers/authController");

router.post("/register", registerAccountCtrl);
router.get("/login", loginAccountCtrl);
router.put("/change-password", changePasswordCtrl);


module.exports = router;