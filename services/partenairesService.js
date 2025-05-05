
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

// Partenaires , partenaires

