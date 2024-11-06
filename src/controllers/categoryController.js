const {
    createCategorySvc,
    getCategorySvc,
    getCategoryInTree,
    getLeafCategory
} = require("../services/categoryService");
const { formatResBodyFailed, formatResBodySuscess } = require("./fomatResponse");
const _ = require('lodash');

const createCategoryCtrl = async (req, res) => {
    try {
        const dataCategory = req.body;
        const newCategory = await createCategorySvc(dataCategory);
        return res.status(201).json(formatResBodySuscess(true, "Create successful category", newCategory));
    } catch (error) {
        console.log(">>>>>>> ERRROOOORRR TRUNG")
        return res.status(error.statusCode)
            .json(formatResBodyFailed(false, "Create failed category", error.message));
    }
}

const getCategoryCtrl = async (req, res) => {
    const listCategory = await getCategorySvc();
    const tree = getCategoryInTree("672356e321ced4f195a0a6a8", listCategory)
    console.log(">>>  TRee/:", tree);
    console.log(">>>  LEAF/:", getLeafCategory(tree, []));
    // console.log("tree: ", listCategory[0]._id.toString());
    return res.status(200).json(formatResBodySuscess(true, "Get successful list category", listCategory));
}

module.exports = {
    createCategoryCtrl,
    getCategoryCtrl
}