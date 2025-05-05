const mongoose = require('mongoose');

const partenairesSchema = new mongoose.Schema({
  nomDuSite: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  idSychornisation: { type: String, required: true, unique: true },
  conditionsAffiliation: { type: String, required: true }
});

module.exports = mongoose.model('Partenaires', partenairesSchema);