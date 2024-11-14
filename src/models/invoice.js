const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const invoiceSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer", // Liên kết đến model User
        required: true
    },
    invoiceDate: {
        type: Date,
        default: Date.now, // Mặc định là ngày và giờ hiện tại
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Cancelled"],
        default: "Pending",
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: "Invoice"
});

invoiceSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Invoice = mongoose.model("invoice", invoiceSchema);

module.exports = Invoice;