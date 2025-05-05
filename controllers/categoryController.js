const Category = require("../models/category");
const categoryService = require("../services/categoryService");

module.exports.getCategories = async (req, res) => {
    try {
        let categories = await categoryService.getAllCategories();
        return res.status(200).json({ status: 200, data: categories, message: "Successfully Categories Retrieved" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.createCategory = async (req, res) => {
    try {
        let category = new Category(req.body);
        category = await categoryService.createCategory(category);
        return res.status(201).json({ status: 201, data: category, message: "Successfully Category Created" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
