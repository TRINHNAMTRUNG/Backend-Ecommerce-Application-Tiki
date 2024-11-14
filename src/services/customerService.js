const joi = require("joi");
const Customer = require("../models/customer");
const { isValidObjectId } = require("mongoose");
const cloudinary = require('cloudinary').v2;

const customerSchemaJoi = joi.object({
    customerName: joi.string()
        .pattern(/^[a-zA-Z_ -]+$/)
        .required(),
    nickName: joi.string()
        .optional(),
    birthDate: joi.date()
        .iso()
        .less("now")
        .greater("1900-01-01")
        .optional(),
    nationality: joi.string()
        .optional(),
    phoneNumber: joi.string()
        .trim()
        .pattern(/^(84|0[3|5|7|8|9])[0-9]{8}$/)
        .required(),
    email: joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required(),
    avatar: joi.string()
        .optional(),
    address: joi.array()
        .items(joi.object({
            city: joi.string()
                .required(),
            district: joi.string()
                .required(),
            ward: joi.string()
                .required(),
            addressLine: joi.string()
                .required(),
            status: joi.boolean()
                .required()
        }))
});

const customerUpdateSchemaJoi = joi.object({
    customerName: joi.string()
        .pattern(/^[a-zA-Z_ -]+$/)
        .optional(),
    nickName: joi.string()
        .optional(),
    birthDate: joi.date()
        .iso()
        .less("now")
        .greater("1900-01-01")
        .optional(),
    nationality: joi.string()
        .optional(),
    avatar: joi.string()
        .optional()
}).unknown(false);


const createCustomerSvc = async(dataCustomer) => {
    const { error } = customerSchemaJoi.validate(dataCustomer);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }
    try {
        const newCustomer = await Customer.create(dataCustomer);
        return newCustomer;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Customer ready exists"
            }
        }
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        }
    }
}

const getCustomerSvc = async() => {
    try {
        const listCustomer = await Customer.find({});
        return listCustomer;
    } catch (error) {
        throw {
            statusCode: 500,
            message: "Internal server error: " + error.message
        }
    }
}
const getCustomerByIdSvc = async(idCustomer) => {

    if (!isValidObjectId(idCustomer)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        }
    }
    const customer = await Customer.findById(idCustomer);
    if (!customer) {
        throw {
            statusCode: 404,
            message: "Customer not found"
        }
    }
    return customer;
}

const updateCustomerSvc = async(dataUpdate) => {
    const idCustomer = dataUpdate.id;
    delete dataUpdate.id;
    console.log("ID: ", idCustomer)
    if (!isValidObjectId(idCustomer)) {
        throw {
            statusCode: 400,
            message: "Invalid ID format"
        }
    }

    const customer = await Customer.findById(idCustomer);
    if (!customer) {
        throw {
            statusCode: 404,
            message: "Customer not found"
        }
    }

    const { error } = customerUpdateSchemaJoi.validate(dataUpdate);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }

    const customerUpdate = await Customer.updateOne({ _id: idCustomer }, { $set: dataUpdate }, { runValidators: true });
    if (customerUpdate && dataUpdate.avatar) {

        const publicId = customer.avatar.split('/').slice(-2).join('/').split('.')[0];
        console.log("OLD: >> ", publicId);
        await cloudinary.uploader.destroy(publicId);
    }
    return customerUpdate;
}


module.exports = {
    createCustomerSvc,
    getCustomerSvc,
    getCustomerByIdSvc,
    updateCustomerSvc
}