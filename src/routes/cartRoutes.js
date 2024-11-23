const express = require("express");
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const {
    addProductToCartCtrl,
    getCartByCustomerIdCtrl,
    updateProductQtyCtrl,
    removeProductFromCartCtrl,
    createCartCtrl

} = require('../controllers/cartController');

router.put('/', addProductToCartCtrl);
router.post('/:id', createCartCtrl);
router.get('/:customerId', getCartByCustomerIdCtrl);
router.put('/:customerId/:productId/:qty', updateProductQtyCtrl);
router.delete('/:customerId/:productId', removeProductFromCartCtrl);


module.exports = router;