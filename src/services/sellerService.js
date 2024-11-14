const Joi = require("joi");
const Seller = require("../models/seller");
const { isValidObjectId } = require("mongoose");
const cloudinary = require("cloudinary").v2;

// Joi schema for creating a seller
const sellerSchemaJoi = Joi.object({
    nameStore: Joi.string()
        .pattern(/^[a-zA-Z_ -]+$/)
        .required(),
    productIndustry: Joi.string()
        .optional()
        .required(),
    email: Joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required(),
    phoneNumber: Joi.string()
        .trim()
        .pattern(/^(84|0[3|5|7|8|9])[0-9]{8}$/)
        .required(),
    nameOwner: Joi.string()
        .pattern(/^[a-zA-Z_ -]+$/)
        .required(),
    avatar: Joi.string()
        .optional(),
    address: Joi.array()
        .items(Joi.object({
            city: Joi.string()
                .required(),
            district: Joi.string()
                .required(),
            ward: Joi.string()
                .required(),
            addressLine: Joi.string()
                .required(),
            status: Joi.boolean()
                .required()
        })),

    nationality: Joi.string()
        .optional(),
});
// Joi schema for updating a seller (optional fields)
const sellerUpdateSchemaJoi = Joi.object({
    nameStore: Joi.string()
        .optional()
        .trim(),
    productIndustry: Joi.string()
        .optional()
        .trim(),

    nameOwner: Joi.string()
        .optional()
        .trim(),
    avatar: Joi.string()
        .optional(),
    nationality: Joi.string()
        .optional()
        .trim()
}).unknown(false);

// Service for creating a new seller
const createSellerSvc = async(dataSeller) => {
    const { error } = sellerSchemaJoi.validate(dataSeller);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        };
    }
    try {
        const newSeller = await Seller.create(dataSeller);
        return newSeller;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Seller already exists"
            };
        }
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Service for getting all sellers
const getSellerSvc = async() => {
    try {
        const listSeller = await Seller.find({});
        return listSeller;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        };
    }
};

// Service for getting a seller by ID
const getSellerByIdSvc = async(idSeller) => {
    if (!isValidObjectId(idSeller)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        }
    }
    const seller = await Seller.findById(idSeller);
    if (!seller) {
        throw {
            statusCode: 404,
            message: "Seller not found"
        }
    }
    return seller;
};


// Service for updating a seller
const updateSellerSvc = async(dataUpdate) => {
    const idSeller = dataUpdate.id;
    delete dataUpdate.id;
    console.log("ID: ", idSeller)

    if (!isValidObjectId(idSeller)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        }
    }

    const { error } = sellerUpdateSchemaJoi.validate(dataUpdate);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }

    const seller = await Seller.findById(idSeller);
    if (!seller) {
        throw {
            statusCode: 404,
            message: "Seller not found"
        }
    }

    // Handle avatar removal if updated
    const sellerUpdate = await Seller.updateOne({ _id: idSeller }, { $set: dataUpdate }, { runValidators: true });
    if (sellerUpdate && dataUpdate.avatar) {

        const publicId = seller.avatar.split("/").slice(-2).join("/").split(".")[0];
        console.log("OLD: >> ", publicId);
        await cloudinary.uploader.destroy(publicId);
    }
    return sellerUpdate;
};

module.exports = {
    createSellerSvc,
    getSellerSvc,
    getSellerByIdSvc,
    updateSellerSvc
};