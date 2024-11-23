const Cart = require("../models/cart");
const { isValidObjectId } = require("mongoose");
const { addProductToCart, getCartByCustomerId, updateProductQty, removeProductFromCart, createCartSvc } = require("../services/cartService");
const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");

const addProductToCartCtrl = async (req, res) => {
    try {
        const data = req.body;
        const cart = await addProductToCart(data); // Service to add product to cart
        return res.status(200).json({
            success: true,
            message: 'Product has been added to the cart.',
            data: cart,
        });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Error adding product to cart.',
        });
    }
};


const getCartByCustomerIdCtrl = async (req, res) => {
    try {
        const { customerId } = req.params;
        const cart = await getCartByCustomerId(customerId); // Service to get the cart
        return res.status(200).json({
            success: true,
            message: 'Cart has been successfully retrieved.',
            data: cart,
        });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Error retrieving cart.',
        });
    }
};


const updateProductQtyCtrl = async (req, res) => {
    try {
        const { customerId, productId, qty } = req.params;
        const cart = await updateProductQty(customerId, productId, parseInt(qty)); // Service to update the quantity
        return res.status(200).json({
            success: true,
            message: 'Product quantity in the cart has been updated.',
            data: cart,
        });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Error updating product quantity.',
        });
    }
};


const removeProductFromCartCtrl = async (req, res) => {
    try {
        const { customerId, productId } = req.params;
        const cart = await removeProductFromCart(customerId, productId); // Service to remove product
        return res.status(200).json({
            success: true,
            message: 'Product has been removed from the cart.',
            data: cart,
        });
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Error removing product from the cart.',
        });
    }
};

const createCartCtrl = async (req, res) => {
    try {
        const dataBrand = {
            customer: req.params.id,
            listProduct: []
        }
        const newCart = await createCartSvc(dataBrand);
        return res.status(201).json(formatResBodySuscess(true, "Create successful cart", newCart));
    } catch (error) {
        return res.status(error.statusCode).json(formatResBodyFailed(false, "Create failed cart", error.message));
    }
}


module.exports = {
    addProductToCartCtrl,
    getCartByCustomerIdCtrl,
    updateProductQtyCtrl,
    removeProductFromCartCtrl,
    createCartCtrl
};