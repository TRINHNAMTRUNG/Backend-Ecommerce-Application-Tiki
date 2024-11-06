

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const cartSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: "customer",
            required: true
        },
        listProduct: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: "product",
                required: true
            },
            itemsQty: {
                type: Number,
                defaults: 1
            }
        }]
    },
    {
        timeStamp: true,
        collation: "Cart"
    }
);
cartSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Cart = model("cart", cartSchema);

module.exports = Cart;
