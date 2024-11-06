require("dotenv").config();
const express = require("express");
const path = require("path");
const fileUpload = require("express-fileupload");

// Routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const brandRoutes = require("./routes/brandRoutes");
const customerRoutes = require("./routes/customerRoutes");

const connection = require("../src/configs/database");

const app = express();
const hostName = process.env.HOST_NAME;
const port = process.env.PORT || 8087;

// chuyển đổi dữ liệu body từ application/json sang object js
app.use(express.json());
// chuyển đổi dữ liệu body từ application/x-www-form-urlencoded sang object js
app.use(express.urlencoded({ extended: true }));
// phân tích và xử lý yêu cầu http chứa file upload do client định dạng dữ liệu multipart/form-data, cho phép truy cập thông qua req.files
// app.use(fileUpload());

app.use("/v1/api/product", productRoutes);
app.use("/v1/api/category", categoryRoutes);
app.use("/v1/api/brand", brandRoutes);
app.use("/v1/api/customer", customerRoutes);

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
