const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const sellerSchema = new Schema({
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
        type: String
    },
    address: [{
        city: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        ward: {
            type: String,
            required: true
        },
        addressLine: {
            type: String,
            required: true
        },
        status: {
            type: Boolean,
            required: true
        }
    }],
    nationality: {
        type: String,
        required: true
    }
}, {
    timeStamp: true,
    collection: "Seller"
});
sellerSchema.plugin(MongooseDelete, { overrideMethod: "all" });
const Seller = model("seller", sellerSchema);

module.exports = Seller;