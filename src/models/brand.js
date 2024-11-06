

const { Schema, model } = require('mongoose');
const MongooseDelete = require('mongoose-delete');

const brandSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true
        }
    },
    {
        timeStamp: true,
        collection: "Brand"
    }
);
brandSchema.plugin(MongooseDelete, { overrideMethod: "all" });
const Brand = model("brand", brandSchema);

module.exports = Brand;