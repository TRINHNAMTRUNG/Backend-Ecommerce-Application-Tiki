const { isValidObjectId } = require('mongoose');
const Joi = require('joi');
const Coupon = require('../models/coupon');
const ProductCoupon = require('../models/productCoupon');

// Schema Joi cho Coupon
const couponSchemaJoi = Joi.object({
    seller: Joi.string()
        .custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid sellerId format");
            }
            return value;
        }).required(),

    code: Joi.string()
        .min(5)
        .required(),

    discountValue: Joi.number()
        .min(0)
        .required(),

    endDate: Joi.date()
        .greater('now')
        .required(),

    applicableProducts: Joi.array()
        .items(Joi.string().custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid productId format");
            }
            return value;
        }))
        .required(),

    usageLimit: Joi.number()
        .min(1)
        .required(),

    conditions: Joi.object({
        minOrderValue: Joi.number()
            .min(0)
    }).optional(),

    active: Joi.boolean()
        .required()
});

// Tạo Coupon
const createCouponSvc = async(couponData) => {
    const { error } = couponSchemaJoi.validate(couponData);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }
    try {
        const newCoupon = await Coupon.create(couponData);
        return newCoupon;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Coupon already exists"
            };
        }
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Lấy tất cả Coupon
const getAllCouponsSvc = async() => {
    try {
        const listCoupon = await Coupon.find({});
        return listCoupon;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Lấy Coupon theo ID
const getCouponByIdSvc = async(idCoupon) => {
    if (!isValidObjectId(idCoupon)) {
        throw {
            statusCode: 400,
            message: "Invalid Coupon ID format"
        };
    }
    const coupon = await Coupon.findById(idCoupon);
    if (!coupon) {
        throw {
            statusCode: 404,
            message: "Coupon not found"
        };
    }
    return coupon;
};

// Xóa Coupon theo ID
const deleteCouponSvc = async(idCoupon) => {
    if (!isValidObjectId(idCoupon)) {
        throw {
            statusCode: 400,
            message: "Invalid Coupon ID format"
        };
    }
    const deletedCoupon = await Coupon.findByIdAndDelete(idCoupon);
    if (!deletedCoupon) {
        throw {
            statusCode: 404,
            message: "Coupon not found"
        };
    }
    return deletedCoupon;
};

// Schema Joi cho ProductCoupon
const productCouponSchemaJoi = Joi.object({
    coupon: Joi.string()
        .custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid couponId format");
            }
            return value;
        }).required(),
    product: Joi.string()
        .custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid productId format");
            }
            return value;
        }).required(),

});

// Tạo ProductCoupon
const createProductCouponSvc = async(productCouponData) => {
    const { error } = productCouponSchemaJoi.validate(productCouponData);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }
    try {
        const newProductCoupon = await ProductCoupon.create(productCouponData);
        return newProductCoupon;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Lấy tất cả ProductCoupon của một coupon
const getProductCouponsByCouponIdSvc = async(idCoupon) => {
    if (!isValidObjectId(idCoupon)) {
        throw {
            statusCode: 400,
            message: "Invalid Coupon ID format"
        };
    }
    const productCoupons = await ProductCoupon.find({ coupon: idCoupon });
    if (productCoupons.length === 0) {
        throw {
            statusCode: 404,
            message: "No product coupons found for the given coupon ID"
        };
    }
    return productCoupons;
};
// Schema Joi cho cập nhật Coupon
const couponUpdateSchemaJoi = Joi.object({
    seller: Joi.string()
        .custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid sellerId format");
            }
            return value;
        }).optional(),

    code: Joi.string()
        .min(5)
        .optional(),

    discountValue: Joi.number()
        .min(0)
        .optional(),

    endDate: Joi.date()
        .greater('now')
        .optional(),

    applicableProducts: Joi.array()
        .items(Joi.string().custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid productId format");
            }
            return value;
        }))
        .optional(),

    usageLimit: Joi.number()
        .min(1)
        .optional(),

    conditions: Joi.object({
        minOrderValue: Joi.number()
            .min(0)
            .optional(),
    }).optional(),

    active: Joi.boolean()
        .optional(),
}).unknown(false); // Chỉ cho phép các trường được định nghĩa trong schema

const updateCouponSvc = async(dataUpdate) => {
    const idCoupon = dataUpdate.id;
    delete dataUpdate.id; // Loại bỏ ID khỏi dữ liệu cập nhật
    console.log("ID: ", idCoupon);

    if (!isValidObjectId(idCoupon)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        };
    }

    const coupon = await Coupon.findById(idCoupon);
    if (!coupon) {
        throw {
            statusCode: 404,
            message: "Coupon not found"
        };
    }

    const { error } = couponUpdateSchemaJoi.validate(dataUpdate);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }

    const couponUpdate = await Coupon.updateOne({ _id: idCoupon }, { $set: dataUpdate }, { runValidators: true });

    // Xử lý logic nếu coupon bị hủy kích hoạt hoặc có thay đổi đặc biệt
    if (couponUpdate && dataUpdate.active === false) {
        console.log("Coupon deactivated: ", idCoupon);
    }

    return couponUpdate;
};


const updateProductCouponSvc = async(idProductCoupon, updateData) => {
    if (!isValidObjectId(idProductCoupon)) {
        throw {
            statusCode: 400,
            message: "Invalid ProductCoupon ID format"
        };
    }

    // Kiểm tra xem product coupon có tồn tại không
    const productCoupon = await ProductCoupon.findById(idProductCoupon);
    if (!productCoupon) {
        throw {
            statusCode: 404,
            message: "ProductCoupon not found"
        };
    }

    // Cập nhật product coupon
    try {
        const updatedProductCoupon = await ProductCoupon.findByIdAndUpdate(idProductCoupon, updateData, { new: true });
        return updatedProductCoupon;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};
module.exports = {
    createCouponSvc,
    getAllCouponsSvc,
    getCouponByIdSvc,
    deleteCouponSvc,
    createProductCouponSvc,
    getProductCouponsByCouponIdSvc,
    updateCouponSvc,
    updateProductCouponSvc
};