

const joi = require("joi");
const { isValidObjectId } = require("mongoose");
const Account = require("../models/account");
const { verifyPassword, hashPassword } = require("./encryptionService");
const { createCustomerSvc } = require("./customerService");
const schemaAccountJoi = joi.object({
    phoneNumber: joi.string()
        .trim()
        .pattern(/^(84|0[3|5|7|8|9])[0-9]{8}$/)
        .required()
    ,
    password: joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .required()
    ,
    role: joi.string()
        .trim()
        .valid('admin', 'seller', 'customer')
        .required()
    ,
    email: joi.string()
        .trim()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
    ,
}).unknown(false);

const schemaVertifyJoi = joi.object({
    phoneNumber: joi.string()
        .trim()
        .required()
    ,
    password: joi.string()
        .required()
    ,
}).unknown(false);

const createAccountSvc = async (data) => {
    const dataAccount = data.account;
    const dataUser = data.user;
    const { error } = schemaAccountJoi.validate(dataAccount);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }
    try {
        const user = {};
        if (account.role === "customer") {
            user = await createCustomerSvc(dataUser);
        }
        const hashedPassword = await hashPassword(dataAccount.password);
        dataAccount.password = hashedPassword;
        dataAccount.user = user._id.toString();
        const account = await Account.create(dataAccount);
        return account;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: "Account is ready exists"
            }
        }
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message
        }
    }
}

const verifyAccountSvc = async (dataLogin) => {
    const { error } = schemaVertifyJoi.validate(dataLogin);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }
    const account = Account.find({ phoneNumber: dataLogin.dataLogin });
    if (!account) {
        throw {
            statusCode: 404,
            message: "Account not found"
        }
    }
    const resultVertify = await verifyPassword(password, account.password);
    if (!resultVertify) {
        throw {
            statusCode: 401,
            message: "password is incorrect"
        }
    }
    return account.user;
}




module.exports = {
    createAccountSvc,
    verifyAccountSvc
}