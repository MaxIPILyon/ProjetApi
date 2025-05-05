const Component = require('../models/component');

module.exports.getComponentById = async (query) => {
    try {
        let component = await Component.findOne(query).populate('category');
        return component;
    } catch (e) {
        throw Error('Error while query one Component: ' + e);
    }
};

module.exports.getComponentsByCategory = async (query) => {
    try {
        let components = await Component.find(query);
        return components;
    } catch (e) {
        throw Error('Error while query Components by Category: ' + e);
    }
};

module.exports.createComponent = async (component) => {
    try {
        return await component.save();
    } catch (e) {
        throw Error('Error while creating Component: ' + e);
    }
};

module.exports.updateComponent = async (query, data) => {
    try {
        return await Component.updateOne(query, data);
    } catch (e) {
        throw Error('Error while updating Component: ' + e);
    }
};

module.exports.deleteComponent = async (query) => {
    try {
        return await Component.deleteOne(query);
    } catch (e) {
        throw Error('Error while deleting Component: ' + e);
    }
};
