import express from "express"
import path from "path";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";

import connection from "./configs/database.js";

const app = express();
dotenv.config();
const hostName = process.env.HOST_NAME;
const port = process.env.PORT || 8087;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

(async () => {
    try {
        await connection();
        app.listen(port, hostName, () => {
            console.log(`Example app listening on port ${port}`);
        })
    } catch (error) {
        console.log("BACKEND ECOMMERCE ERROR CONNECT TO DBS: ", error);
    }
})();



