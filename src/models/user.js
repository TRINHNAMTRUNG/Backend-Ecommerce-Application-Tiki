

import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";


const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        nickName: String,
        birthDate: Date,
        gender: {
            type: String,
            required: true
        },
        nationality: String,
        phoneNumber: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        avatar: String,
        age: Number,
        address: [{ String }]
    },
    {
        timeStamp: true
    }
);
userSchema.plugin(MongooseDelete, { overrideMethods: "all" });
const User = mongoose.model("user", userSchema);

export default User;
