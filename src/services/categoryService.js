

const Category = require("../models/category");
const joi = require("joi");
const { isValidObjectId } = require("mongoose");

const categorySchemaJoi = joi.object({
    name: joi.string()
        .required()
    ,
    category: joi.string()
        .optional()
        .custom((value, helpers) => {
            if (value && !isValidObjectId(value)) {
                return helpers.error("Category must be an ObjectId");
            }
            return value;
        })
})

const createCategorySvc = async (dataCategory) => {
    if (dataCategory.category === "") {
        delete dataCategory.category;
    }
    const { error } = categorySchemaJoi.validate(dataCategory);
    if (error) {
        throw {
            statusCode: 400,
            message: error.details[0].map(error => error.message)
        }
    }
    try {
        const newCategory = await Category.create(dataCategory);
        return newCategory;
    } catch (error) {
        if (error.code === 11000) {
            throw {
                statusCode: 409,
                message: 'Category already exists.',
            };
        }
        throw {
            statusCode: 500,
            message: 'Internal server error: ' + error.message,
        };
    }
}

const getCategorySvc = async () => {
    const listCategory = await Category.find({}).populate("category").lean();

    if (!listCategory.length) {
        return [];
    }
    const map = {};
    const treeCategory = [];
    listCategory.forEach(category => {
        map[category._id] = { ...category, children: [] }
    });
    listCategory.forEach(category => {
        if (category.category) {
            map[category.category._id].children.push(map[category._id]);
        } else {
            treeCategory.push(map[category._id]);
        }
    })
    return treeCategory;
}


// const getCategoryByIdSvc = async (idCategory) => {
//     const category = await Category.findById(idCategory);
//     if (!category) {
//         throw {
//             statusCode: 404,
//             message: "Category not found"
//         }
//     }
//     return category;
// }
const getCategoryInTree = (idCategory, tree) => {
    for (const item of tree) {
        if (item._id.toString() === idCategory) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            const found = getCategoryInTree(idCategory, item.children);
            if (found) {
                return found;
            }
        }
    }
    return null;
}

const getLeafCategory = (branch, list) => {
    for (const item of branch.children) {
        if (item.children.length == 0) {
            console.log(">>item : ", item);
            list.push(item);
        }
        if (item.children && item.children.length > 0) {
            getLeafCategory(item.children, list);
        }
    }
    return list;
}



module.exports = {
    createCategorySvc,
    getCategorySvc,
    // getCategoryByIdSvc
    getCategoryInTree,
    getLeafCategory
}