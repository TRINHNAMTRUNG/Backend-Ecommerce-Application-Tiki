import mongoose from 'mongoose';
import MongooseDelete from "mongoose-delete";

const reviewSchema = new mongoose.Schema({
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
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Sử dụng xóa mềm
reviewSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Review = mongoose.model('Review', reviewSchema);
export default Review;