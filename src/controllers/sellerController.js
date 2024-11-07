const {
    createSellerSvc,
    getSellerSvc,
    getSellerByIdSvc,
    updateSellerSvc
} = require("../services/sellerService");
const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
const { uploadSingleFile } = require("../services/fileService");
const cloudinary = require('cloudinary').v2;

// Controller for creating a new seller
const createSellerCtrl = async(req, res) => {
    let dataSeller = req.body;

    if (typeof dataSeller.address === 'string') {
        dataSeller.address = JSON.parse(dataSeller.address);
    }
    console.log(">>>> <<<< ", dataSeller)
    if (req.file && req.file.path) {
        imageURL = req.file.path;
        dataSeller = {...dataSeller, avatar: imageURL };
    }

    try {
        const newSeller = await createSellerSvc(dataSeller);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create successful seller", newSeller));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId); // Clean up uploaded avatar
        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Create failed seller", error.message));
    }
};

// Controller for getting all sellers
const getSellerCtrl = async(req, res) => {
    try {
        const listSeller = await getSellerSvc();
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list of sellers", listSeller));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed list of sellers", error.message));
    }
};

// Controller for getting a seller by ID
const getSellerByIdCtrl = async(req, res) => {
    try {
        const idSeller = req.body.id; // Retrieve ID from route params
        const seller = await getSellerByIdSvc(idSeller);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful seller", seller));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed seller", error.message));
    }
};

// Controller for updating a seller
const updateSellerCtrl = async(req, res) => {
    let dataSeller = req.body;
    if (typeof dataSeller.address === 'string') {
        dataSeller.address = JSON.parse(dataSeller.address);
    }

    // Handle avatar update
    if (req.file && req.file.path) {
        imageURL = req.file.path;
        dataSeller = {...dataSeller, avatar: imageURL };
    }

    try {
        const updatedSeller = await updateSellerSvc(dataSeller);
        return res.status(200)
            .json(formatResBodySuscess(true, "Update successful seller", updatedSeller));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId); // Clean up uploaded avatar
        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Update failed seller", error.message));
    }
};

module.exports = {
    createSellerCtrl,
    getSellerCtrl,
    getSellerByIdCtrl,
    updateSellerCtrl
};