import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const invoiceSchema = mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Liên kết đến bảng User (Người dùng)
        required: true
    },
    invoiceDate: {
        type: Date,
        default: Date.now, // Ngày tạo hóa đơn, mặc định là thời gian hiện tại
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Credit Card", "Bank Transfer", "Cash", "Momo", "ZaloPay"], // Các phương thức thanh toán
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Completed", "Failed", "Cancelled"], // Trạng thái thanh toán
        default: "Pending",
        required: true
    },
    totalAmount: {
        type: Number,
        required: true // Tổng tiền của hóa đơn
    },
    shippingAddress: {
        type: String,
        required: true // Địa chỉ giao hàng
    }
}, {
    timestamps: true // Tự động thêm `createdAt` và `updatedAt`
});

// Sử dụng plugin mongoose-delete cho soft delete (xóa mềm)
invoiceSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;