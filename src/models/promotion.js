const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const promotionSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    discountPercent: {
        type: Number,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    orderLimitPerPurchase: {
        type: Number,
        required: true
    },
    promotionQuantityLimit: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    }
}, {
    timeStamp: true,
    collection: "Promotion"
});
promotionSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Promotion = model("promotion", promotionSchema);

module.exports = Promotion;