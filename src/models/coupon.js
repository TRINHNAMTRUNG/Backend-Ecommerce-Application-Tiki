

import { override } from "joi";
import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import { type } from "os";

const applicableProductsSchema = mongoose.Schema(
    { productId: mongoose.Schema.Types.ObjectId }
);
const conditionsSchema = mongoose.Schema(
    { minOrderValue: Number }
)

const couponSchema = mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "seller",
            required: true,
        },
        code: {
            type: String,
            required: true
        },
        discountValue: {
            type: Number,
            required: true
        },
        endDate: {
            type: Number,
            required: true
        },
        applicableProducts: [{ type: applicableProductsSchema, required: true }],
        usage_limit: {
            type: Number,
            default: -1,
        },
        conditions: {
            type: conditionsSchema,
            required: true
        },
        active: {
            type: Boolean,
            default: true,
        }
    },
    {
        timeStamp: true
    }
);
couponSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Coupon = mongoose.model(conditionsSchema, "coupon");

export default Coupon;