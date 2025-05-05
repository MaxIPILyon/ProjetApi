const Category = require('../models/category');

module.exports.getAllCategories = async () => {
    try {
        let categories = await Category.find();
        return categories;
    } catch (e) {
        throw Error('Error while querying Categories: ' + e);
    }
};

module.exports.createCategory = async (category) => {
    try {
        return await category.save();
    } catch (e) {
        throw Error('Error while creating Category: ' + e);
    }
};
