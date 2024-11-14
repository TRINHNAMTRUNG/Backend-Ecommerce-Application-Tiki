const express = require('express');
const router = express.Router();

const { storage } = require('../storage/storage');
const multer = require('multer');
const upload = multer({ storage });

const {
    createInvoiceCtr,
    getAllInvoicesCtr,
    getInvoiceByIdCtr,
    getInvoicesByCustomerIdCtr,
    createInvoiceDetailCtr,
    getInvoiceDetailsByInvoiceIdCtr
} = require("../controllers/invoiceController");

router.post('/', createInvoiceCtr);
router.get('/all', getAllInvoicesCtr);
router.get('/invoices/:id', getInvoiceByIdCtr);
router.get('/invoices/customer/:customer', getInvoicesByCustomerIdCtr);

router.post('/invoiceDetails', createInvoiceDetailCtr);
router.get('/invoiceDetails/:invoice', getInvoiceDetailsByInvoiceIdCtr);

module.exports = router;