const { isValidObjectId } = require('mongoose');
const Joi = require('joi');
const Invoice = require('../models/invoice');
const InvoiceDetail = require('../models/invoiceDetail');

// Schema Joi cho hóa đơn
const invoiceSchemaJoi = Joi.object({
    customer: Joi.string()
        .custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid customerId format");
            }
            return value;
        })
        .required(),
    paymentStatus: Joi.string()
        .valid("Pending", "Completed", "Failed", "Cancelled")
        .required(),
    totalAmount: Joi.number()
        .required(),
    shippingAddress: Joi.string()
        .required(),
    invoiceDate: Joi.date()
        .default(() => Date.now()) // Cung cấp giá trị mặc định là ngày hiện tại
        .required()
});


// Tạo hóa đơn
const createInvoiceSvc = async(invoiceData) => {
    const { error } = invoiceSchemaJoi.validate(invoiceData);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }
    try {
        const newInvoice = await Invoice.create(invoiceData);
        return newInvoice;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Invoice already exists"
            };
        }
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Lấy tất cả hóa đơn
const getAllInvoicesSvc = async() => {
    try {
        const listInvoice = await Invoice.find({});
        return listInvoice;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Lấy hóa đơn theo ID
const getInvoiceByIdSvc = async(idInvoice) => {
    if (!isValidObjectId(idInvoice)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        };
    }
    const invoice = await Invoice.findById(idInvoice);
    if (!invoice) {
        throw {
            statusCode: 404,
            message: "Invoice not found"
        };
    }
    return invoice;
};

// Lấy tất cả hóa đơn của khách hàng
const getInvoicesByCustomerIdSvc = async(customer) => {
    if (!isValidObjectId(customer)) {
        throw {
            statusCode: 400,
            message: "Invalid customerId format"
        };
    }
    return await Invoice.find({ customer });
};

// Schema Joi cho chi tiết hóa đơn
const invoiceDetailSchemaJoi = Joi.object({
    invoice: Joi.string()
        .custom((value, helper) => {
            if (!isValidObjectId(value)) {
                return helper.message("Invalid invoiceId format");
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
    productName: Joi.string()
        .required(),
    quantity: Joi.number()
        .min(1)
        .required(),
    unitPrice: Joi.number()
        .required(),
    subtotal: Joi.number()
        .required()
});

// Tạo chi tiết hóa đơn
const createInvoiceDetailSvc = async(invoiceDetailData) => {
    const { error } = invoiceDetailSchemaJoi.validate(invoiceDetailData);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }
    try {
        const newInvoiceDetail = await InvoiceDetail.create(invoiceDetailData);
        return newInvoiceDetail;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Lấy chi tiết hóa đơn theo invoiceId
const getInvoiceDetailsByInvoiceIdSvc = async(idInvoice) => {
    if (!isValidObjectId(idInvoice)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        };
    }
    const invoiceDetails = await InvoiceDetail.find({ invoice: idInvoice });
    if (invoiceDetails.length === 0) {
        throw {
            statusCode: 404,
            message: "No invoice details found for the given ID"
        };
    }
    return invoiceDetails;
};

module.exports = {
    createInvoiceSvc,
    getAllInvoicesSvc,
    getInvoiceByIdSvc,
    getInvoicesByCustomerIdSvc,
    createInvoiceDetailSvc,
    getInvoiceDetailsByInvoiceIdSvc
};