
const Partenaires = require('../models/partenaires');

module.exports.getAllPartenaires = async () => {
    try {
        let partenaires = await Partenaires.find();
        return partenaires;
    } catch (e) {
        throw Error('Error while querying Partenaires: ' + e);
    }
};

module.exports.createPartenaires = async (partenaires) => {
    try {
        return await partenaires.save();
    } catch (e) {
        throw Error('Error while creating Partenaires: ' + e);
    }
};

module.exports.updatePartenaires = async (query, data) => {
    try {
        return await Partenaires.updateOne(query, data);
    } catch (e) {
        throw Error('Error while updating Partenaires: ' + e);
    }
};

module.exports.deletePartenaires = async (query) => {
    try {
        return await Partenaires.deleteOne(query);
    } catch (e) {
        throw Error('Error while deleting Partenaires: ' + e);
    }
};

// Partenaires , partenaires

