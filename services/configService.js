const Config = require('../models/config');

// module.exports.getComponentById = async (query) => {
//     try {
//         let component = await Component.findOne(query).populate('category');
//         return component;
//     } catch (e) {
//         throw Error('Error while query one Component: ' + e);
//     }
// };

// module.exports.getComponentsByCategory = async (query) => {
//     try {
//         let components = await Component.find(query);
//         return components;
//     } catch (e) {
//         throw Error('Error while query Components by Category: ' + e);
//     }
// };

module.exports.createConfig = async (config) => {
    try {
        return await Config.save();
    } catch (e) {
        throw Error('Error while creating Config: ' + e);
    }
};

module.exports.updateConfig = async (query, data) => {
    try {
        return await Config.updateOne(query, data);
    } catch (e) {
        throw Error('Error while updating Config: ' + e);
    }
};

module.exports.deleteConfig = async (query) => {
    try {
        return await Config.deleteOne(query);
    } catch (e) {
        throw Error('Error while deleting Config: ' + e);
    }
};
