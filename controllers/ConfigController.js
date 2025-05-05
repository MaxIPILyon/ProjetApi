const Component = require("../models/component");
const componentService = require("../services/componentService");
const categoryService = require("../services/categoryService");
const Config = require("../models/config");

module.exports.createConfig = async (req, res) => {
    try {
        let config = await categoryService.getAllCategories();
        return res.status(200).json({ status: 200, data: categories, message: "Successfully Categories Retrieved" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.getComponentsByCategory = async (req, res) => {
    try {
        let components = await componentService.getComponentsByCategory({ category: req.params.id });
        return res.status(200).json({ status: 200, data: components, message: "Successfully Components Retrieved by Category" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.getComponentById = async (req, res) => {
    try {
        let component = await componentService.getComponentById({ _id: req.params.id });
        return res.status(200).json({ status: 200, data: component, message: "Successfully Component Retrieved" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.createConfig = async (req, res) => {
    try {
        let component = new config(req.body);
        component = await componentService.createComponent(component);
        return res.status(201).json({ status: 201, data: component, message: "Successfully Component Created" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.updateComponent = async (req, res) => {
    try {
        let data = await componentService.updateComponent({ _id: req.params.id }, req.body);
        return res.status(200).json({ status: 200, data: data, message: "Successfully Component Updated" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.deleteComponent = async (req, res) => {
    try {
        let data = await componentService.deleteComponent({ _id: req.params.id });
        return res.status(200).json({ status: 200, data: data, message: "Successfully Component Deleted" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
