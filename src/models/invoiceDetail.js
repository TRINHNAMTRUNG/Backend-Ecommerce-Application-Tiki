const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const invoiceDetailSchema = mongoose.Schema({
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invoice", // Liên kết đến model Invoice
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product", // Liên kết đến model Product
        required: true
    },
    productName: {
        type: String,
        required: true // Tên sản phẩm
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Số lượng sản phẩm tối thiểu là 1
    },
    unitPrice: {
        type: Number,
        required: true
    },
    subtotal: {
        type: Number,
        required: true // Tổng tiền của sản phẩm (quantity * unitPrice)
    }
}, {
    timestamps: true,
    collection: "InvoiceDetail"
});


invoiceDetailSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const InvoiceDetail = mongoose.model("invoiceDetail", invoiceDetailSchema);

module.exports = InvoiceDetail;