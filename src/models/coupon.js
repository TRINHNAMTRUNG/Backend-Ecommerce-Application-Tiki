const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');


const couponSchema = new Schema({
    seller: {
        type: Schema.Types.ObjectId,
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
        type: Date,
        required: true
    },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: 'product', required: true }],
    usageLimit: {
        type: Number,
        required: true
    },
    conditions: {
        minOrderValue: {
            type: Number,
            required: true
        }
    },
    active: {
        type: Boolean,
        required: true
    },
}, {
    timestamps: true,
    collection: "Coupon"
});
couponSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Coupon = model("coupon", couponSchema);

module.exports = Coupon;