

import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";


const productCouponSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        couponId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "coupon",
            required: true
        },
    },
    {
        timeStamp: true
    }
);
productCouponSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const ProductCoupon = mongoose.model("productCoupon", productCouponSchema);

export default ProductCoupon;
