const {
    createProductSvc,
    getListProductByCatgSvc,
    getListProductConditionsScv,
    getListProductDealBookSvc,
    getListProductNewScv,
    getSearchProductSvc
} = require("../services/productService");

const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
// const { uploadMultipleFiles, uploadSingleFile } = require("../services/fileService");



const createProductCtrl = async (req, res) => {
    try {
        const dataProduct = req.body;
        // const size = JSON.parse(dataProduct.size);
        // const attribute = JSON.parse(dataProduct.attribute);
        // const images = req.files.images
        // let arrResourceImage;
        // let arrImage;
        // if (images.length === 1) {
        //     arrResourceImage = await uploadSingleFile(images);
        //     arrImage = [arrResourceImage.path];
        // } else if (images.length > 1) {
        //     arrResourceImage = await uploadMultipleFiles(images);
        //     arrImage = arrResourceImage.detail.map((item) => item.path);

        // } else {
        //     arrImage = []
        // }
        // console.log(">>>> checkRes: ", dataProduct);

        // const newProduct = await createProductSvc({ ...dataProduct, images: arrImage, size, attribute });
        const newProduct = await createProductSvc(dataProduct);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create successful products", newProduct));
    } catch (error) {
        console.log(error.message);
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Create failed products", error.message));
    }
}

const getListProductByCatgCtrl = async (req, res) => {
    try {
        const idCategory = req.body.id;
        const { limit, page } = req.query;
        const listProduct = await getListProductByCatgSvc(idCategory, page, limit);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list products by category", listProduct));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list products by category", error.message));
    }
}
const getListProductDealBookCtrl = async (req, res) => {
    try {
        const idCategory = "672e1c4927462a2f1d9d1547";
        const { limit, page } = req.query;
        const listProduct = await getListProductDealBookSvc(idCategory, page, limit);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list products by category", listProduct));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list products by category", error.message));
    }
}

const getListProductConditionsCtrl = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const listProduct = await getListProductConditionsScv(limit, page);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list products", listProduct));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list products", error.message));
    }
}
const getListProductNewCtrl = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const listProduct = await getListProductNewScv(limit, page);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list products", listProduct));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list products", error.message));
    }
}
const getSearchProductCtrl = async (req, res) => {
    try {
        const { name, limit, page } = req.query;
        const listProduct = await getSearchProductSvc(name, page, limit);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list products", listProduct));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list products", error.message));
    }
}

module.exports = {
    createProductCtrl,
    getListProductByCatgCtrl,
    getListProductConditionsCtrl,
    getListProductDealBookCtrl,
    getListProductNewCtrl,
    getSearchProductCtrl
}