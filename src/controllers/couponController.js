// couponController.js
const {
    createCouponSvc,
    getAllCouponsSvc,
    getCouponByIdSvc,
    deleteCouponSvc,
    createProductCouponSvc,
    getProductCouponsByCouponIdSvc,
    updateCouponSvc,
    updateProductCouponSvc
} = require("../services/couponService");
const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
const { uploadSingleFile } = require("../services/fileService");
const cloudinary = require('cloudinary').v2;

// Create a new coupon
const createCouponCtr = async(req, res) => {
    let dataCoupon = req.body;

    // If an image is uploaded, update the coupon data with the image URL
    if (req.file && req.file.path) {
        const imageURL = req.file.path;
        dataCoupon = {...dataCoupon, image: imageURL };
    }

    try {
        const newCoupon = await createCouponSvc(dataCoupon);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create Successful coupon", newCoupon));
    } catch (error) {
        // If an error occurs, handle the uploaded image deletion (if any)
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Create failed coupon", error.message));
    }
};

// Get all coupons
const getAllCouponsCtr = async(req, res) => {
    try {
        const coupons = await getAllCouponsSvc();
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list of coupons", coupons));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed list of coupons", error.message));
    }
};

// Get coupon by ID
const getCouponByIdCtr = async(req, res) => {
    try {
        const coupon = await getCouponByIdSvc(req.params.id);
        if (!coupon) {
            return res.status(404).json(formatResBodyFailed(false, "Coupon not found", "Coupon not found"));
        }
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful coupon", coupon));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed coupon", error.message));
    }
};

// Delete a coupon by ID
const deleteCouponCtr = async(req, res) => {
    try {
        const deletedCoupon = await deleteCouponSvc(req.params.id);
        if (!deletedCoupon) {
            return res.status(404).json(formatResBodyFailed(false, "Coupon not found", "Coupon not found"));
        }
        return res.status(200)
            .json(formatResBodySuscess(true, "Delete successful coupon", deletedCoupon));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Delete failed coupon", error.message));
    }
};

// Create a product coupon
const createProductCouponCtr = async(req, res) => {
    let dataProductCoupon = req.body;

    try {
        const newProductCoupon = await createProductCouponSvc(dataProductCoupon);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create Successful product coupon", newProductCoupon));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Create failed product coupon", error.message));
    }
};

// Get product coupons by coupon ID
const getProductCouponsByCouponIdCtr = async(req, res) => {
    try {
        const productCoupons = await getProductCouponsByCouponIdSvc(req.params.couponId);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful product coupons", productCoupons));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed product coupons", error.message));
    }
};
const updateCouponCtr = async(req, res) => {
    const { idCoupon } = req.params;
    const updateData = req.body;

    try {
        const updatedCoupon = await updateCouponSvc(idCoupon, updateData);
        return res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: updatedCoupon
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

const updateProductCouponCtr = async(req, res) => {
    const { idProductCoupon } = req.params;
    const updateData = req.body;

    try {
        const updatedProductCoupon = await updateProductCouponSvc(idProductCoupon, updateData);
        return res.status(200).json({
            success: true,
            message: "ProductCoupon updated successfully",
            data: updatedProductCoupon
        });
    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};
module.exports = {
    createCouponCtr,
    getAllCouponsCtr,
    getCouponByIdCtr,
    deleteCouponCtr,
    createProductCouponCtr,
    getProductCouponsByCouponIdCtr,
    updateCouponCtr,
    updateProductCouponCtr
};