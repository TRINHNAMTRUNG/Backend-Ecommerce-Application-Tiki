const Product = require("../models/product");
const joi = require("joi");
const { isValidObjectId } = require("mongoose");
const {
    getCategoryInTree,
    getLeafCategory,
    getCategorySvc
} = require("../services/categoryService");
const productSchemaJoi = joi.object({
    seller: joi.string()
        .custom((value, helpers) => {
            if (!isValidObjectId(value)) {
                return helpers.error("Seller must be an ObjectId");
            }
            return value;
        }).required()
    ,
    brand: joi.string()
        .custom((value, helpers) => {
            if (!isValidObjectId(value)) {
                return helpers.error("Brand must be an ObjectId");
            }
            return value;
        })
        .optional()
    ,
    category: joi.string()
        .custom((value, helpers) => {
            if (!isValidObjectId(value)) {
                return helpers.error("Category must be an ObjectId");
            }
            return value;
        })
    ,
    name: joi.string()
        .trim()
        .max(350)
        .required()
    ,
    madeIn: joi.string()
        .trim()
        .max(50)
    ,
    description: joi.string()
        .trim()
        .max(1500)
        .required()
    ,
    price: joi.number()
        .integer()
        .required()
    ,
    promotion: joi.string()
        .optional()
        .custom((value, helpers) => {
            if (!isValidObjectId(value)) {
                return helpers.error("Promotion must be an ObjectID");
            }
            return value;
        })
    ,
    stock: joi.number()
        .integer()
        .required()
    ,
    quantitySold: joi.number()
        .integer()
    ,
    reviewCounts: joi.number()
        .integer()
    ,
    ratingAverage: joi.number()
        .precision(2)
    ,
    favoriteCount: joi.number()
        .integer()
    ,
    images: joi.array()
        .items(joi.string())
        .min(1)
        .required()
    ,
    // videos: joi.array()
    //     .items(joi.string())
    // ,
    size: joi.object({
        width: joi.number()
            .integer()
        ,
        height: joi.number()
            .integer()
        ,
        weight: joi.number()
            .precision(2)
        ,
    }).required()
    ,
    attribute: joi.array()
        .items(joi.object({
            name: joi.string()
                .trim()
                .max(150)
                .required()
            ,
            value: joi.string()
                .trim()
                .max(150)
                .required()
            ,
        }))
    ,
    warranty: joi.object({
        duration: joi.number()
            .integer()
            .required()
        ,
        form: joi.string()
            .valid("Hóa đơn", "Phiếu bảo hành", "Tem bảo hành", "Điện tử")
            .required()
    })
})


const createProductSvc = async (dataProduct) => {
    // Validate input dataProduct with joi
    if (dataProduct.promotion === "") {
        delete dataProduct.promotion;
    }
    const { error } = productSchemaJoi.validate(dataProduct);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details.map(error => error.message).join(', ')
        }
    }

    try {
        const newProduct = await Product.create(dataProduct);
        return newProduct;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: 'Product already exists.',
            };
        }
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message,
        };
    }
}

const getSortedProducts = async (page, limit) => {

}

const getListProductByCatgSvc = async (idCategory, page, limit) => {
    try {
        const tree = await getCategorySvc();
        const branch = getCategoryInTree(idCategory, tree);
        if (branch) {
            const categoryIds = getLeafCategory(branch, []);
            const skip = (page - 1) * limit;
            const listProduct = await Product.find({
                category: { $in: categoryIds }
            })
                .skip(skip)
                .limit(limit)
            const totalProducts = await Product.countDocuments({
                category: { $in: categoryIds }
            });
            console.log("count: ", totalProducts)
            return {
                totalPages: totalProducts <= limit ? 1 : Math.ceil(totalProducts / limit),
                currentPage: parseInt(page),
                listProduct
            };
        }
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error: ' + error.message
        }
    }
}

const getListProductConditionsScv = async (limit, page) => {
    try {
        const skip = (page - 1) * limit;
        const listProductSort = await Product.find({}).skip(skip).limit(limit).sort({ price: 1 })
        return listProductSort;
    } catch (error) {
        throw {
            statusCode: 500,
            message: error.message || 'Internal server error: ' + error.message
        }
    }
}

module.exports = {
    createProductSvc,
    getListProductByCatgSvc,
    getListProductConditionsScv
}