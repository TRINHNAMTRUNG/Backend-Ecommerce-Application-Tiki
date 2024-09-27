

import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";
import { type } from "os";

const productSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        }
    }
)

const listProdduct = mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "seller",
            required: true
        },
        product: [{ type: productSchema, required: true }]
    }
)

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        itemsCount: {
            type: Number,
            default: 0
        },
        itemsQty: {
            type: Number,
            default: 0
        },
        sellers: [listProdduct]
    },
    {
        timeStamp: true
    }
);
cartSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Cart = mongoose.model("productCoupon", cartSchema);

export default Cart;
