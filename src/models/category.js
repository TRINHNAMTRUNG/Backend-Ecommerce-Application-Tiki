

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: "category"
        },
        image: {
            type: String
        }
    },
    {
        timestamps: true,
        collection: "Category"
    }
);
categorySchema.plugin(MongooseDelete, { overrideMethod: "all" });
const Category = model("category", categorySchema);

module.exports = Category;