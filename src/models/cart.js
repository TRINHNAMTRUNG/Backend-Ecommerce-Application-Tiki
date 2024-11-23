const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const cartSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer",
        required: true,
        unique: true,
    },
    listProduct: [{
        _id: false,
        product: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        itemsQty: {
            type: Number,
            default: 1
        }
    }]
}, {
    timestamps: true,
    collection: "Cart"
});

cartSchema.index({ customer: 1 }, { collation: { locale: 'vi', strength: 2 } });

// Plugin xóa mềm
cartSchema.plugin(MongooseDelete, { overrideMethods: "all" });

const Cart = model("cart", cartSchema);

module.exports = Cart;