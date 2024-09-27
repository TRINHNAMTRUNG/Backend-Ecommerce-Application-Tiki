

import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const accountSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        role: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timeStamp: true
    }
);
accountSchema.plugin(MongooseDelete, { overrideMethod: "all" });
const Account = mongoose.model("account", accountSchema);

export default accountSchema;