const express = require("express");
const router = express.Router();
const { sendOtpCtrl, verifyOtpCtrl } = require("../controllers/otpController");

router.post("/send", sendOtpCtrl);
router.post("/verify", verifyOtpCtrl);

module.exports = router;

