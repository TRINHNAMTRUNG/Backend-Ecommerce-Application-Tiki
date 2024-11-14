const joi = require("joi");
const Promotion = require("../models/promotion");
const { isValidObjectId } = require("mongoose");
const cloudinary = require('cloudinary').v2;

// Joi schema cho tạo mới khuyến mãi
const promotionSchemaJoi = joi.object({
    title: joi.string()
        .required(),
    discountPercent: joi.number()
        .min(0)
        .max(100)
        .required(),
    active: joi.boolean()
        .required(),
    startDate: joi.date()
        .iso()
        .required(),
    endDate: joi.date()
        .iso()
        .greater(joi.ref('startDate'))
        .required(),
    description: joi.string()
        .required(),
    orderLimitPerPurchase: joi.number()
        .required(),
    promotionQuantityLimit: joi.number()
        .required(),
    discountedPrice: joi.number()
        .required()
});

// Joi schema cho cập nhật khuyến mãi
const promotionUpdateSchemaJoi = joi.object({
    title: joi.string()
        .optional(),
    discountPercent: joi.number()
        .min(0)
        .max(100)
        .optional(),
    active: joi.boolean()
        .optional(),
    startDate: joi.date()
        .iso()
        .optional(),
    endDate: joi.date()
        .iso()
        .greater(joi.ref('startDate'))
        .optional(),
    description: joi.string()
        .optional(),
    orderLimitPerPurchase: joi.number()
        .optional(),
    promotionQuantityLimit: joi.number()
        .optional(),
    discountedPrice: joi.number()
        .optional()
}).unknown(false);

// Dịch vụ tạo khuyến mãi mới
const createPromotionSvc = async(dataPromotion) => {
    const { error } = promotionSchemaJoi.validate(dataPromotion);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }
    try {
        const newPromotion = await Promotion.create(dataPromotion);
        return newPromotion;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Promotion already exists"
            };
        }
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Dịch vụ lấy danh sách khuyến mãi
const getPromotionsSvc = async() => {
    try {
        const promotions = await Promotion.find({});
        return promotions;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Dịch vụ lấy thông tin khuyến mãi theo ID
const getPromotionByIdSvc = async(idPromotion) => {
    if (!isValidObjectId(idPromotion)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        };
    }
    const promotion = await Promotion.findById(idPromotion);
    if (!promotion) {
        throw {
            statusCode: 404,
            message: "Promotion not found"
        };
    }
    return promotion;
};

// Dịch vụ cập nhật thông tin khuyến mãi
const updatePromotionSvc = async(dataUpdate) => {
    const idPromotion = dataUpdate.id;
    delete dataUpdate.id;

    if (!isValidObjectId(idPromotion)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        };
    }

    const promotion = await Promotion.findById(idPromotion);
    if (!promotion) {
        throw {
            statusCode: 404,
            message: "Promotion not found"
        };
    }

    const { error } = promotionUpdateSchemaJoi.validate(dataUpdate);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }

    const promotionUpdate = await Promotion.updateOne({ _id: idPromotion }, { $set: dataUpdate }, { runValidators: true });
    return promotionUpdate;
};

// Dịch vụ xóa khuyến mãi (soft delete)
const deletePromotionSvc = async(idPromotion) => {
    if (!isValidObjectId(idPromotion)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        };
    }

    const promotion = await Promotion.findById(idPromotion);
    if (!promotion) {
        throw {
            statusCode: 404,
            message: "Promotion not found"
        };
    }

    const deletedPromotion = await Promotion.delete({ _id: idPromotion });
    return deletedPromotion;
};

module.exports = {
    createPromotionSvc,
    getPromotionsSvc,
    getPromotionByIdSvc,
    updatePromotionSvc,
    deletePromotionSvc
};