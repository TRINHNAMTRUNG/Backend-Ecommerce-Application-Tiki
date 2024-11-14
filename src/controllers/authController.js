

const { createAccountSvc, verifyAccountSvc, changePassworSvc } = require("../services/authService");
const { formatResBodyFailed, formatResBodySuscess } = require("./fomatResponse");

const registerAccountCtrl = async (req, res) => {
    try {
        const { customerName, phoneNumber, password, role, email } = req.body
        const dataRegister = {
            dataUser: {
                customerName,
                phoneNumber,
                email
            },
            dataAccount: {
                phoneNumber,
                email,
                password,
                role
            }
        }
        const dataUser = await createAccountSvc(dataRegister);
        return res.status(201).json(formatResBodySuscess(true, "Register account successful", dataUser));
    } catch (error) {
        return res.status(error.statusCode).json(formatResBodyFailed(false, "Register account failed", error.message));
    }
}

const loginAccountCtrl = async (req, res) => {
    try {
        const dataLogin = req.body;
        const dataUser = await verifyAccountSvc(dataLogin);
        return res.status(200).json(formatResBodySuscess(true, "Login account successful", dataUser));
    } catch (error) {
        return res.status(error.statusCode || 500).json(formatResBodyFailed(false, "Login account failed", error.message));
    }
}

const changePasswordCtrl = async (req, res) => {
    try {
        const dataChange = req.body;
        const result = await changePassworSvc(dataChange);
        return res.status(200).json(formatResBodySuscess(true, "Change Password successful", result));
    } catch (error) {
        return res.status(error.statusCode).json(formatResBodyFailed(false, "Change Password failed", error.message));
    }
}


module.exports = {
    registerAccountCtrl,
    loginAccountCtrl,
    changePasswordCtrl
}