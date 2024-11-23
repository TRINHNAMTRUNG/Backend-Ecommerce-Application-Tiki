const {
    createCategorySvc,
    getCategorySvc,
    getCategoryInTree,
    getLeafCategory,
    getListRootCategorySvc
} = require("../services/categoryService");
const { formatResBodyFailed, formatResBodySuscess } = require("./fomatResponse");
const _ = require('lodash');
const cloudinary = require('cloudinary').v2;

const createCategoryCtrl = async(req, res) => {
    try {
        let dataCategory = req.body;
        if (req.file && req.file.path) {
            console.log(">>>>", req.file);
            // let results = await uploadSingleFile(req.files.avatar);
            imageURL = req.file.path;
            dataCategory = {...dataCategory, image: imageURL };
        }
        const newCategory = await createCategorySvc(dataCategory);
        return res.status(201).json(formatResBodySuscess(true, "Create successful category", newCategory));
    } catch (error) {
        if (req.file && req.file.path) {
            const publicId = req.file.filename;
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId);
        }
        return res.status(error.statusCode || 500)
            .json(formatResBodyFailed(false, "Create failed category", error.message));
    }
}

const getCategoryCtrl = async(req, res) => {
    const listCategory = await getCategorySvc();
    // const tree = getCategoryInTree("672356e321ced4f195a0a6a8", listCategory)
    // console.log(">>>  TRee/:", tree);
    // console.log(">>>  LEAF/:", getLeafCategory(tree, []));
    // console.log("tree: ", listCategory[0]._id.toString());
    return res.status(200).json(formatResBodySuscess(true, "Get successful list category", listCategory));
}

const getListRootCategoryCtrl = async(req, res) => {
    try {
        const listRoot = await getListRootCategorySvc();
        res.status(200).json(formatResBodySuscess(true, "Get successful list root category", listRoot));
    } catch (error) {
        res.status(error.statusCode).json(formatResBodyFailed(false, "Get successful list root category", error.message));
    }
}
const getListLeafCategoryCtrl = async(req, res) => {
    try {
        const idRoot = req.params.id;
        const listCategory = await getCategorySvc();
        const tree = getCategoryInTree(idRoot, listCategory)
        const listLeaf = await getLeafCategory(tree, []);
        res.status(200).json(formatResBodySuscess(true, "Get successful list root category", listLeaf));
    } catch (error) {
        res.status(error.statusCode).json(formatResBodyFailed(false, "Get successful list root category", error.message));
    }
}

module.exports = {
    createCategoryCtrl,
    getCategoryCtrl,
    getListRootCategoryCtrl,
    getListLeafCategoryCtrl
}