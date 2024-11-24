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

const addProductToCart = async (data) => {
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


const getCartByCustomerId = async (customerId) => {
    if (!isValidObjectId(customerId)) {
        throw {
            statusCode: 400,
            message: "Customer ID must be a valid ObjectId",
        };
    }

    const cart = await Cart.findOne({ customer: customerId })
        .populate({
            path: "listProduct.product", // Populate product từ listProduct
            populate: {
                path: "seller", // Populate seller bên trong product
                select: "nameStore email", // Chọn trường cụ thể trong seller (tùy chọn)
            },
        })
        .lean();

    if (!cart) {
        throw {
            statusCode: 404,
            message: "Cart not found for this customer.",
        };
    }

    return cart;
};

const updateProductQty = async (customerId, productId, qty) => {
    if (!isValidObjectId(customerId) || !isValidObjectId(productId)) {
        throw {
            statusCode: 400,
            message: "Customer ID and Product ID must be valid ObjectIds",
        };
    }

    // Tìm giỏ hàng của customer
    const cart = await Cart.findOne({ customer: customerId });
    if (!cart) {
        throw {
            statusCode: 404,
            message: "Cart not found for this customer.",
        };
    }

    // Tìm vị trí sản phẩm trong giỏ hàng
    const productIndex = cart.listProduct.findIndex(
        (item) => item.product.toString() === productId
    );

    if (qty <= 0) {
        // Nếu số lượng <= 0, xóa sản phẩm khỏi giỏ hàng
        if (productIndex !== -1) {
            cart.listProduct.splice(productIndex, 1);
        } else {
            throw {
                statusCode: 404,
                message: "Product not found in cart.",
            };
        }
    } else if (productIndex !== -1 && qty > 0) {
        // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
        cart.listProduct[productIndex].itemsQty += qty;
    } else if (productIndex === -1 && qty > 0) {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        cart.listProduct.push({
            product: productId,
            itemsQty: qty,
        });
    }

    await cart.save();
    return cart.populate({
        path: "listProduct.product", // Populate product từ listProduct
        populate: {
            path: "seller", // Populate seller bên trong product
            select: "nameStore email", // Chọn trường cụ thể trong seller (tùy chọn)
        },
    });
};


const removeProductFromCart = async (customerId, productId) => {
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

const createCartSvc = async (dataCart) => {
    const { error } = cartSchemaJoi.validate(dataCart);
    if (error) {
        throw {
            message: error.details[0].message,
            statusCode: 400
        }
    }
    try {
        const newCart = await Cart.create(dataCart);
        return newCart;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Cart already exists for this customer"
            }
        }
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message,
        };
    }
}

module.exports = {
    addProductToCart,
    getCartByCustomerId,
    updateProductQty,
    removeProductFromCart,
    createCartSvc
};