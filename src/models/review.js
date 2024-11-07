import mongoose from 'mongoose';
import MongooseDelete from "mongoose-delete";

const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    image: [{
        type: String
    }],
    rating: {
        type: String, // Theo dữ liệu, rating là kiểu String, tuy nhiên nếu cần tính toán, nên chuyển thành Number.
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Sử dụng xóa mềm
reviewSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const UserReview = mongoose.model('UserReview', reviewSchema);
export default UserReview;