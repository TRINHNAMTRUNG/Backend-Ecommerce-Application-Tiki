

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const userReviewSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        image: [{
            type: String
        }],
        rating: {
            type: String,
            required: true
        },
        product: {
            type: Schema.Types.ObjectId,
            ref: "product",
            required: true
        },
    },
    {
        timeStamp: true,
        collection: "UserReview"
    }
);
userReviewSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const UserReview = model("userReview", productCouponSchema);

module.exports = UserReview;
