

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const accountSchema = new Schema(
    {
        phoneNumber: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['admin', 'seller', 'customer'],
            required: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        user: {
            type: Schema.Types.ObjectId,
            refPath: 'role',
            required: true,
        }
    },
    {
        timestamps: true,
        collection: "Account"
    }
);
accountSchema.plugin(MongooseDelete, { overrideMethod: "all" });
const Account = model("account", accountSchema);

module.exports = Account;