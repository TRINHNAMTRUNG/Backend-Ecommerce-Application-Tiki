

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
const schemaChangePassJoi = joi.object({
    phoneNumber: joi.string()
        .trim()
        .required()
    ,
    newPassword: joi.string()
        .trim()
        .required()
    ,
    currentPassword: joi.string()
        .trim()
        .required()
    ,
}).unknown(false);

const createAccountSvc = async (dataRegister) => {
    let dataAccount = dataRegister.dataAccount;
    let dataUser = dataRegister.dataUser;
    const { error } = schemaAccountJoi.validate(dataAccount);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }
    try {
        let user = {};
        if (dataAccount.role === "customer") {
            user = await createCustomerSvc(dataUser);
        }
        let hashedPassword = await hashPassword(dataAccount.password);
        dataAccount.password = hashedPassword;
        dataAccount.user = user._id.toString();
        await Account.create(dataAccount);
        return user;
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
    const { phoneNumber, password } = dataLogin;
    const { error } = schemaVertifyJoi.validate(dataLogin);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }
    const account = await Account.findOne({ phoneNumber: phoneNumber }).populate("user");
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
    console.log(account);
    return account.user;
}

const changePassworSvc = async (dataChange) => {
    const { currentPassword, newPassword, phoneNumber } = dataChange;
    const { error } = schemaChangePassJoi.validate(dataChange);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].message
        }
    }

    try {
        const account = await Account.findOne({ phoneNumber: phoneNumber });
        if (!account) {
            throw {
                statusCode: 404,
                message: "Account not found"
            }
        }
        const resultVertify = await verifyPassword(currentPassword, account.password);
        if (!resultVertify) {
            throw {
                statusCode: 401,
                message: "Current password is incorrect"
            }
        }
        let hashedPassword = await hashPassword(newPassword);
        const resultUpdate = await Account.findOneAndUpdate({ phoneNumber: phoneNumber }, { password: hashedPassword });
        return resultUpdate;
    } catch (error) {
        throw {
            statusCode: error.statusCode || 500,
            message: error.message || 'Internal server error: ' + error.message
        }
    }
}

module.exports = {
    createAccountSvc,
    verifyAccountSvc,
    changePassworSvc
}