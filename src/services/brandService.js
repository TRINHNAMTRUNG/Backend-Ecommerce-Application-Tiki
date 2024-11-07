

const joi = require("joi");
const Brand = require("../models/brand");
const { isValidObjectId } = require("mongoose");

const brandSchemaJoi = joi.object({
    name: joi.string()
        .trim()
        .required()
}).options({ allowUnknown: true });


const createBrandSvc = async (dataBrand) => {
    const { error } = brandSchemaJoi.validate(dataBrand);
    if (error) {
        throw {
            message: error.details[0].message,
            statusCode: 400
        }
    }
    try {
        const newBrand = await Brand.create(dataBrand);
        return newBrand;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Brand already exists"
            }
        }
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message,
        };
    }
}

const updateBrandSvc = async (dataBrand) => {
    if (!dataBrand.id || !isValidObjectId(dataBrand.id)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        }
    }

    const brand = await Brand.findById(dataBrand.id);
    if (!brand) {
        throw {
            statusCode: 404,
            message: "Brand not found"
        }
    }

    const { error } = brandSchemaJoi.validate(dataBrand);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }

    try {
        brand.name = dataBrand.name;
        const newBrand = await brand.save();
        return newBrand;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Brand already exists"
            }
        }
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message,
        }
    }
}


const getAllBrandSvc = async () => {
    try {
        const listBrand = Brand.find({});
        return listBrand;
    } catch (error) {
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message,
        }
    }
}

module.exports = {
    createBrandSvc,
    updateBrandSvc,
    getAllBrandSvc
}