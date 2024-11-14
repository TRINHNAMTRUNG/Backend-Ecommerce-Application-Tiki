
const { defaults } = require('joi');
const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const productSchema = new Schema(
    {
        seller: {
            type: Schema.Types.ObjectId,
            ref: "seller",
            required: true
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: "brand",
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "category",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        promotion: {
            type: Schema.Types.ObjectId,
            ref: "promotion"
        },
        stock: {
            type: Number,
            required: true
        },
        quantitySold: {
            type: Number,
            default: 0
        },
        reviewCounts: {
            type: Number,
            default: 0
        },
        ratingAverage: {
            type: Number,
            default: 0
        },
        favoriteCount: {
            type: Number,
            default: 0
        },
        images: {
            type: [String],
            required: true, // Mảng này cần phải có
        },
        madeIn: {
            type: String
        },
        // videos: [{
        //     type: String
        // }],
        size: {
            type: {
                width: {
                    type: Number,
                    required: true // Bắt buộc phải có width
                },
                height: {
                    type: Number,
                    required: true // Bắt buộc phải có height
                },
                weight: {
                    type: Number,
                    required: true // Bắt buộc phải có weight
                },
            },
            _id: false,
            required: true // Bắt buộc phải có đối tượng size
        },
        warranty: {
            type: {
                duration: {
                    type: Number,
                    required: true // Thời gian bảo hành, ví dụ: "12 tháng", "2 năm"
                },
                form: {
                    type: String,
                    enum: ["Hóa đơn", "Phiếu bảo hành", "Tem bảo hành", "Điện tử"],
                    required: true // Hình thức bảo hành, ví dụ: "bảo hành tại chỗ", "bảo hành theo vùng"
                }
            },
            _id: false
        },
        attribute: [{
            _id: false,
            name: {
                type: String,
                required: true
            },
            value: {
                type: String,
                required: true
            }
        }],
    },
    {
        timestamps: true,
        collection: "Product"
    }
);
productSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Product = model("product", productSchema);

module.exports = Product;
