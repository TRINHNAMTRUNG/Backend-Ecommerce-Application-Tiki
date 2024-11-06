const {
    createBrandSvc,
    updateBrandSvc,
    getAllBrandSvc
} = require("../services/brandService");
const { formatResBodyFailed, formatResBodySuscess } = require("./fomatResponse");

const createBrandCtrl = async (req, res) => {
    try {
        const dataBrand = req.body;
        const newBrand = await createBrandSvc(dataBrand);
        return res.status(201).json(formatResBodySuscess(true, "Create successful brands", newBrand));
    } catch (error) {
        return res.status(error.statusCode).json(formatResBodyFailed(false, "Create failed brands", error.message));
    }
}

const updateBrandCtrl = async (req, res) => {
    try {
        const dataBrand = req.body;
        const newBrand = await updateBrandSvc(dataBrand);
        return res.status(200).json(formatResBodySuscess(true, "Update success brands", newBrand));
    } catch (error) {
        return res.status(error.statusCode || 500).json(formatResBodyFailed(false, "Update failed brands", error.message));
    }
}

const getAllBrandCtrl = async (req, res) => {
    try {
        const listBrand = await getAllBrandSvc();
        return res.status(200).json(formatResBodySuscess(true, "Get successful list brands", listBrand));
    } catch (error) {
        return res.status(error.statusCode).json(formatResBodyFailed(false, "Get failed list brands", error.message));
    }
}

module.exports = {
    createBrandCtrl,
    updateBrandCtrl,
    getAllBrandCtrl
}