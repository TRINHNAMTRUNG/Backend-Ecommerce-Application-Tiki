
import MongooseDelete from "mongoose-delete";
import mongoose from "mongoose";

const sizeSchema = mongoose.Schema(
    {
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        weight: { type: Number, required: true }
    }
)

const discountSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        discountPercent: { type: Number, default: 0 },
        active: { type: Boolean, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        desc: String,
    }
)

const attributeSchema = mongoose.Schema(
    { name: String, value: String }
)

const productSchema = mongoose.Schema(
    {
        idSeller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "seller",
            required: true
        },
        idBrand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "brand",
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
        originalPrice: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        discount: discountSchema,
        quantity_sold: Number,
        reviewCounts: Number,
        ratingAverage: Number,
        favoriteCount: Number,
        images: [String],
        videos: [String],
        size: {
            type: sizeSchema,
            required: true
        },
        attribute: [attributeSchema]
    },
    {
        timeStamp: true
    }
);
productSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Product = mongoose.model("product", productSchema);

export default Product;
