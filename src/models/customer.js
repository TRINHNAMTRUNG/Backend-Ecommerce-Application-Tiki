

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');


const customerSchema = new Schema(
    {
        customerName: {
            type: String,
            required: true
        },
        nickName: {
            type: String
        },
        birthDate: {
            type: Date
        },
        nationality: {
            type: String
        },
        phoneNumber: {
            type: String,
            unique: true,
            index: true,
            required: true
        },
        email: {
            type: String,
            unique: true,
            index: true,
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
        }]
    },
    {
        timestamps: true,
        collection: "Customer"
    }
);
customerSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Customer = model("customer", customerSchema);

module.exports = Customer;
