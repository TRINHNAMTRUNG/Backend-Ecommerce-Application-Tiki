const Cart = require("../models/cart");
const joi = require("joi");
const { isValidObjectId } = require("mongoose");

// Schema dùng để validate dữ liệu
const cartSchemaJoi = joi.object({
    customer: joi.string()
        .required()
        .custom((value, helpers) => {
            if (!isValidObjectId(value)) {
                return helpers.error("any.invalid", { message: "Customer must be a valid ObjectId" });
            }
            return value;
        }),
    listProduct: joi.array().items(
        joi.object({
            product: joi.string()
                .required()
                .custom((value, helpers) => {
                    if (!isValidObjectId(value)) {
                        return helpers.error("any.invalid", { message: "Product must be a valid ObjectId" });
                    }
                    return value;
                }),
            itemsQty: joi.number().integer().min(1).default(1),
        })
    ),
});

/**
 * Thêm sản phẩm vào giỏ hàng.
 * @param {Object} data - Dữ liệu giỏ hàng cần thêm.
 * @returns {Object} - Giỏ hàng đã được cập nhật.
 */
const addProductToCart = async(data) => {
    const { error } = cartSchemaJoi.validate(data);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details.map((err) => err.message),
        };
    }

    const { customer, listProduct } = data;
    let cart = await Cart.findOne({ customer });

    if (!cart) {
        cart = new Cart({
            customer,
            listProduct,
        });
    } else {
        listProduct.forEach(({ product, itemsQty }) => {
            const productIndex = cart.listProduct.findIndex(
                (item) => item.product.toString() === product
            );

            if (productIndex > -1) {
                cart.listProduct[productIndex].itemsQty += itemsQty;
            } else {
                cart.listProduct.push({ product, itemsQty });
            }
        });
    }

    await cart.save();
    return cart.populate("listProduct.product");
};

/**
 * Lấy giỏ hàng của khách hàng.
 * @param {String} customerId - ID của khách hàng.
 * @returns {Object} - Giỏ hàng của khách hàng.
 */
const getCartByCustomerId = async(customerId) => {
    if (!isValidObjectId(customerId)) {
        throw {
            statusCode: 400,
            message: "Customer ID must be a valid ObjectId",
        };
    }

    const cart = await Cart.findOne({ customer: customerId })
        .populate("listProduct.product")
        .lean();

    if (!cart) {
        throw {
            statusCode: 404,
            message: "Cart not found for this customer.",
        };
    }

    return cart;
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng.
 * @param {String} customerId - ID của khách hàng.
 * @param {String} productId - ID của sản phẩm.
 * @param {Number} qty - Số lượng mới.
 * @returns {Object} - Giỏ hàng đã được cập nhật.
 */
const updateProductQty = async(customerId, productId, qty) => {
    if (!isValidObjectId(customerId) || !isValidObjectId(productId)) {
        throw {
            statusCode: 400,
            message: "Customer ID and Product ID must be valid ObjectIds",
        };
    }

    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
        throw {
            statusCode: 404,
            message: "Cart not found for this customer.",
        };
    }

    const productIndex = cart.listProduct.findIndex(
        (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
        throw {
            statusCode: 404,
            message: "Product not found in cart.",
        };
    }

    if (qty <= 0) {
        cart.listProduct.splice(productIndex, 1);
    } else {
        cart.listProduct[productIndex].itemsQty = qty;
    }

    await cart.save();
    return cart.populate("listProduct.product");
};

/**
 * Xóa sản phẩm khỏi giỏ hàng.
 * @param {String} customerId - ID của khách hàng.
 * @param {String} productId - ID của sản phẩm.
 * @returns {Object} - Giỏ hàng đã được cập nhật.
 */
const removeProductFromCart = async(customerId, productId) => {
    if (!isValidObjectId(customerId) || !isValidObjectId(productId)) {
        throw {
            statusCode: 400,
            message: "Customer ID and Product ID must be valid ObjectIds",
        };
    }

    const cart = await Cart.findOne({ customer: customerId });

    if (!cart) {
        throw {
            statusCode: 404,
            message: "Cart not found for this customer.",
        };
    }

    cart.listProduct = cart.listProduct.filter(
        (item) => item.product.toString() !== productId
    );

    await cart.save();
    return cart.populate("listProduct.product");
};

module.exports = {
    addProductToCart,
    getCartByCustomerId,
    updateProductQty,
    removeProductFromCart,
};