
const {
    createCustomerSvc,
    getCustomerSvc,
    getCustomerByIdSvc,
    updateCustomerSvc
} = require("../services/customerService");
const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
const { uploadSingleFile } = require("../services/fileService");
const cloudinary = require('cloudinary').v2;

const createCustomerCtrl = async (req, res) => {
    let dataCustomer = req.body;
    if (typeof dataCustomer.address === 'string') {
        dataCustomer.address = JSON.parse(dataCustomer.address);
    }
    console.log(">>>>", req.file)
    if (req.file && req.file.path) {
        console.log(">>>>", req.file.secure_url)
        // let results = await uploadSingleFile(req.files.avatar);
        imageURL = req.file.path;
        dataCustomer = { ...dataCustomer, avatar: imageURL };
    }
    try {
        const newCustomer = await createCustomerSvc(dataCustomer);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create Successful customer", newCustomer));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Create failed customer", error.message));
    }
}

const getCustomerCtrl = async (req, res) => {
    try {
        const listCustomer = await getCustomerSvc();
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list customers", listCustomer));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list customers", error.message));
    }
}

const getCustomerByIdCtrl = async (req, res) => {
    try {
        const idCustomer = req.body.id;
        const customer = await getCustomerByIdSvc(idCustomer);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful customer", customer));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed customer", error.message));
    }
}

const updateCustomerCtrl = async (req, res) => {
    let dataCustomer = req.body;
    if (typeof dataCustomer.address === 'string') {
        dataCustomer.address = JSON.parse(dataCustomer.address);
    }
    // console.log(">>>>", dataCustomer)
    if (req.file && req.file.path) {
        // console.log(">>>>", req.file.secure_url)
        // let results = await uploadSingleFile(req.files.avatar);
        imageURL = req.file.path;
        dataCustomer = { ...dataCustomer, avatar: imageURL };
    }
    try {
        const customerUpdate = await updateCustomerSvc(dataCustomer);
        return res.status(200)
            .json(formatResBodySuscess(true, "Update successful customer", customerUpdate));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Update failed customer", error.message));
    }
}


module.exports = {
    createCustomerCtrl,
    getCustomerCtrl,
    getCustomerByIdCtrl,
    updateCustomerCtrl
}