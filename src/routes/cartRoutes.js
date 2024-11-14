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

} = require('../controllers/cartController');

router.post('/', addProductToCartCtrl);
router.get('/:customerId', getCartByCustomerIdCtrl);
router.put('/:customerId/:productId/:qty', updateProductQtyCtrl);
router.delete('/:customerId/:productId', removeProductFromCartCtrl);


module.exports = router;