const {
    createPromotionSvc,
    getPromotionsSvc,
    getPromotionByIdSvc,
    updatePromotionSvc,
    deletePromotionSvc
} = require("../services/promotionService");
const { formatResBodySuscess, formatResBodyFailed } = require("./fomatResponse");
const { uploadSingleFile } = require("../services/fileService");
const cloudinary = require('cloudinary').v2;

const createPromotionCtrl = async(req, res) => {
    let dataPromotion = req.body;

    // Kiểm tra và chuyển đổi nếu cần thiết
    if (typeof dataPromotion.conditions === 'string') {
        dataPromotion.conditions = JSON.parse(dataPromotion.conditions);
    }

    if (req.file && req.file.path) {
        console.log("Image URL: ", req.file.secure_url);
        imageURL = req.file.path;
        dataPromotion = {...dataPromotion, image: imageURL };
    }

    try {
        const newPromotion = await createPromotionSvc(dataPromotion);
        return res.status(201)
            .json(formatResBodySuscess(true, "Create successful promotion", newPromotion));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Create failed promotion", error.message));
    }
};

const getPromotionsCtrl = async(req, res) => {
    try {
        const listPromotion = await getPromotionsSvc();
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful list promotions", listPromotion));
    } catch (error) {
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Get failed list promotions", error.message));
    }
};

const getPromotionByIdCtrl = async(req, res) => {
    try {
        const idPromotion = req.body.id;
        const promotion = await getPromotionByIdSvc(idPromotion);
        return res.status(200)
            .json(formatResBodySuscess(true, "Get successful promotion", promotion));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Get failed promotion", error.message));
    }
};

const updatePromotionCtrl = async(req, res) => {
    let dataPromotion = req.body;

    // Kiểm tra và chuyển đổi nếu cần thiết
    if (typeof dataPromotion.conditions === 'string') {
        dataPromotion.conditions = JSON.parse(dataPromotion.conditions);
    }

    if (req.file && req.file.path) {
        imageURL = req.file.path;
        dataPromotion = {...dataPromotion, image: imageURL };
    }

    try {
        const promotionUpdate = await updatePromotionSvc(dataPromotion);
        return res.status(200)
            .json(formatResBodySuscess(true, "Update successful promotion", promotionUpdate));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Update failed promotion", error.message));
    }
};

const deletePromotionCtrl = async(req, res) => {
    const idPromotion = req.body.id;

    try {
        const promotionToDelete = await getPromotionByIdSvc(idPromotion); // Kiểm tra xem chương trình khuyến mãi có tồn tại không
        if (promotionToDelete.image) {
            const publicId = promotionToDelete.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId); // Xóa ảnh từ Cloudinary nếu có
        }

        const deleteResult = await deletePromotionSvc(idPromotion);
        return res.status(200)
            .json(formatResBodySuscess(true, "Delete successful promotion", deleteResult));
    } catch (error) {
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Delete failed promotion", error.message));
    }
};

module.exports = {
    createPromotionCtrl,
    getPromotionsCtrl,
    getPromotionByIdCtrl,
    updatePromotionCtrl,
    deletePromotionCtrl
};