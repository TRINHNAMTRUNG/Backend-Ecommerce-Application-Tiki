

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const productCouponSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        coupon: {
            type: Schema.Types.ObjectId,
            ref: "coupon",
            required: true
        },
    },
    {
        timeStamp: true,
        collection: "ProductCoupon"
    }
);
productCouponSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const ProductCoupon = model("productCoupon", productCouponSchema);

module.exports = ProductCoupon;
