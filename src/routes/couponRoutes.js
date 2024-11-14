const express = require("express");
const router = express.Router();
const multer = require('multer'); // Import multer

// Cấu hình multer cho việc upload file
const storage = multer.memoryStorage(); // Lưu trữ file tạm trong bộ nhớ
const upload = multer({ storage }); // Tạo middleware upload

const {
    createCouponCtr,
    getAllCouponsCtr,
    getCouponByIdCtr,
    deleteCouponCtr,
    createProductCouponCtr,
    getProductCouponsByCouponIdCtr,
    updateCouponCtr,
    updateProductCouponCtr
} = require('../controllers/couponController');

// Định nghĩa các route
router.post('/', upload.single('image'), createCouponCtr); // Tạo coupon mới, có thể kèm hình ảnh
router.get('/all', getAllCouponsCtr); // Lấy danh sách tất cả coupons
router.get('/:id', getCouponByIdCtr); // Lấy coupon theo ID
router.delete('/:id', deleteCouponCtr); // Xóa coupon theo ID
router.put('/:idCoupon', updateCouponCtr);

// Định nghĩa các tuyến đường cho product-coupon
router.put('/productCoupon/:idProductCoupon', updateProductCouponCtr);
router.post('/productCoupon/create', createProductCouponCtr); // Tạo product coupon mới
router.get('/productCoupon/:idCoupon', getProductCouponsByCouponIdCtr); // Lấy các product coupons theo couponId

module.exports = router;