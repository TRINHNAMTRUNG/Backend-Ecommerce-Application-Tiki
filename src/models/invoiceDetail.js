import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const invoiceDetailSchema = mongoose.Schema({
    invoiceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Liên kết tới bảng Sản Phẩm
        required: true
    },
    productName: {
        type: String,
        required: true // Tên sản phẩm (để dễ dàng truy xuất khi cần)
    },
    quantity: {
        type: Number,
        required: true,
        min: 1 // Số lượng sản phẩm trong hóa đơn, tối thiểu là 1
    },
    unitPrice: {
        type: Number,
        required: true // Giá mỗi sản phẩm
    },
    subtotal: {
        type: Number,
        required: true // Tổng tiền cho sản phẩm (quantity * unitPrice)
    }
}, {
    timestamps: true // Tự động thêm `createdAt` và `updatedAt`
});

// Sử dụng plugin mongoose-delete cho soft delete (xóa mềm)
invoiceDetailSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const InvoiceDetail = mongoose.model("InvoiceDetail", invoiceDetailSchema);

export default InvoiceDetail;