const Partenaires = require("../models/partenaires");
const partenairesService = require("../services/partenairesService");

module.exports.getPartenaires = async (req, res) => {
    try {
        let partenaires = await partenairesService.getAllPartenaires();
        return res.status(200).json({ status: 200, data: partenaires, message: "Successfully Partenaires Retrieved" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};

module.exports.createPartenaires = async (req, res) => {
    try {
        let partenaires = new Partenaires(req.body);
        partenaires = await partenairesService.createPartenaires(partenaires);
        return res.status(201).json({ status: 201, data: partenaires, message: "Successfully Partenaires Created" });
    }
    catch (e) {
        return res.status(400).json({ status: 400, message: e.message });
    }
};
