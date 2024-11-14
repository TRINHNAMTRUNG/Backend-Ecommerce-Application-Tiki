const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');


const reviewSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    image: {
        type: [String],
    },
    rating: {
        type: String, // Theo dữ liệu, rating là kiểu String, tuy nhiên nếu cần tính toán, nên chuyển thành Number.
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comment"
    }]
}, {
    timestamps: true,
    collection: "Review"
});

// Sử dụng xóa mềm
reviewSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Review = mongoose.model('review', reviewSchema);
module.exports = Review;