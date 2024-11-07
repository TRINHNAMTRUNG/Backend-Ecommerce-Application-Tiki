

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const commentSchema = new Schema(
    {
        commentator: {
            type: String,
            enum: ["customer", "seller"],
            required: true
        },
        content: {
            type: String,
            required: true
        },
        commentBy: {
            type: Schema.Types.ObjectId,
            refPath: 'commentator',
            required: true
        }
    },
    {
        timeStamp: true,
        collection: "Comment"
    }
);
commentSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const Comment = model("comment", productCouponSchema);

module.exports = Comment;
