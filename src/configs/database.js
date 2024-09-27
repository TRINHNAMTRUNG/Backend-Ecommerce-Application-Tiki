
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbState = [
    {
        value: 0,
        label: "Disconnected"
    },
    {
        value: 1,
        label: "Connected"
    },
    {
        value: 2,
        label: "Connecting"
    },
    {
        value: 3,
        label: "Disconnecting"
    },
    {
        value: 99,
        label: "uninitialized"
    }
];
const connection = async () => {
    const option = {
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME
    }
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB_HOST, option);
    const stateConnectDB = Number(mongoose.connection.readyState);
    console.log(dbState.find(state => state.value === stateConnectDB).label);
}

export default connection;