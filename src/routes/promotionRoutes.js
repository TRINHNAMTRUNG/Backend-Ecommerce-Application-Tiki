const express = require("express");
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });
const {
    createPromotionCtrl,
    getPromotionsCtrl,
    getPromotionByIdCtrl,
    updatePromotionCtrl,
    deletePromotionCtrl
} = require("../controllers/promotionController");

// Route tạo mới chương trình khuyến mãi
router.post("/", upload.single('image'), createPromotionCtrl);
// Route lấy danh sách tất cả chương trình khuyến mãi
router.get("/all", getPromotionsCtrl);
// Route lấy thông tin chương trình khuyến mãi theo ID
router.get("/", getPromotionByIdCtrl);
// Route cập nhật thông tin chương trình khuyến mãi
router.put("/", upload.single('image'), updatePromotionCtrl);
// Route xóa chương trình khuyến mãi
router.delete("/", deletePromotionCtrl);

module.exports = router;