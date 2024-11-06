

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const sellerSchema = new Schema(
    {
        nameStore: {
            type: String,
            required: true
        },
        productIndustry: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        nameOwner: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        nationality: {
            type: String,
            required: true
        }
    },
    {
        timeStamp: true,
        collection: "Seller"
    }
);
sellerSchema.plugin(MongooseDelete, { overrideMethod: "all" });
const Seller = model("seller", accountSchema);

module.exports = Seller;