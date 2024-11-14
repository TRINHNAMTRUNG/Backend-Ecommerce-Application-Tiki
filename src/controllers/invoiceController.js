// InvoiceCtr.js
const {
    createInvoiceSvc,
    getAllInvoicesSvc,
    getInvoiceByIdSvc,
    getInvoicesByCustomerIdSvc,
    createInvoiceDetailSvc,
    getInvoiceDetailsByInvoiceIdSvc
} = require("../services/invoiceService");
const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
const { uploadSingleFile } = require("../services/fileService");
const cloudinary = require('cloudinary').v2;

const createInvoiceCtr = async(req, res) => {
    let dataInvoice = req.body;

    // Chuyển address từ chuỗi JSON thành đối tượng nếu cần
    if (typeof dataInvoice.address === 'string') {
        dataInvoice.address = JSON.parse(dataInvoice.address);
    }
    if (req.file && req.file.path) {
        imageURL = req.file.path;
        dataSeller = {...dataSeller, avatar: imageURL };
    }
    if (!dataInvoice.invoiceDate) {
        dataInvoice.invoiceDate = new Date(); // Gán ngày hiện tại nếu không có ngày trong body
    }

    try {
        const newInvoice = await createInvoiceSvc(dataInvoice);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create Successful invoice", newInvoice));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);

        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Create failed invoice", error.message));
    }
};

// Lấy tất cả hóa đơn
const getAllInvoicesCtr = async(req, res) => {
    try {
        const invoices = await getAllInvoicesSvc();
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list of invoices", invoices));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed list of invoices", error.message));
    }
};


// Lấy hóa đơn theo ID
const getInvoiceByIdCtr = async(req, res) => {
    try {
        const invoice = await getInvoiceByIdSvc(req.params.id); // Đảm bảo gọi đúng service
        if (!invoice) {
            return res.status(404).json(formatResBodyFailed(false, "Invoice not found", "Invoice not found"));
        }
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful invoice", invoice));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed invoice", error.message));
    }
};


// Lấy hóa đơn theo customerId
const getInvoicesByCustomerIdCtr = async(req, res) => {
    try {
        const invoices = await getInvoicesByCustomerIdSvc(req.params.customer); // Đảm bảo gọi đúng service
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful invoices by customer", invoices));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed invoices by customer", error.message));
    }
};


// Tạo chi tiết hóa đơn
const createInvoiceDetailCtr = async(req, res) => {
    let dataInvoiceDetail = req.body;

    // Kiểm tra nếu có file được tải lên, cập nhật avatar cho invoice detail
    if (req.file && req.file.path) {
        const imageURL = req.file.path;
        dataInvoiceDetail = {...dataInvoiceDetail, image: imageURL }; // Thêm ảnh vào dữ liệu invoice detail
    }

    try {
        const invoiceDetail = await createInvoiceDetailSvc(dataInvoiceDetail); // Gọi đúng service
        return res.status(201).json(formatResBodySuscess(true, "Create Successful invoice detail", invoiceDetail));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename; // Xử lý xóa ảnh nếu có lỗi
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode || 500).json(formatResBodyFailed(false, "Create failed invoice detail", error.message));
    }
};


// Lấy chi tiết hóa đơn theo invoiceId
const getInvoiceDetailsByInvoiceIdCtr = async(req, res) => {
    try {
        const idInvoice = req.params.invoice;
        const { ObjectId } = require('mongoose').Types;
        if (!ObjectId.isValid(idInvoice)) {
            return res.status(400)
                .json(formatResBodyFailed(false, "Invalid ID format", "The provided ID is not valid"));
        }

        const invoiceDetails = await getInvoiceDetailsByInvoiceIdSvc(idInvoice);

        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful invoice details", invoiceDetails));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed invoice details", error.message));
    }
};


module.exports = {
    createInvoiceCtr,
    getAllInvoicesCtr,
    getInvoiceByIdCtr,
    getInvoicesByCustomerIdCtr,
    createInvoiceDetailCtr,
    getInvoiceDetailsByInvoiceIdCtr
};