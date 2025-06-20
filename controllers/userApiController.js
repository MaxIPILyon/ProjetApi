const User = require ("../models/user");
const userApiService = require("../services/userService");
const bcrypt = require("bcrypt");

module.exports.getUsers = async (req, res) => {
    try {
        let users = await userApiService.getUsers({})
        return res.status(200).json({status: 200, data: users, message: "Succesfully Users Retrieved"});
    }
    catch(e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}

module.exports.getUser = async (req, res) => {
    try {
        let users = await userApiService.getUser({ _id: req.params.id })
        return res.status(200).json({status: 200, data: users, message: "Succesfully User Retrieved"});
    }
    catch(e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}

module.exports.createUser = async (req, res) => {
    try {
        let salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        
                let user = new User(req.body);
        
                user = await userApiService.createUser(user)
                return res.status(201).json({status: 201, data: user, message: "Succesfully Users Saved"})
    }
    catch(e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}

module.exports.updateUser = async (req, res) => {
  try {
    // Si un mot de passe est fourni, on le hash
    if (req.body.password && req.body.password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    } else {
      // Si pas de mot de passe, on ne met pas à jour ce champ
      delete req.body.password;
    }

    const data = await userApiService.updateUser({ _id: req.params.id }, req.body);

    return res
      .status(200)
      .json({ status: 200, data: data, message: "Succesfully Users Updated" });
  } catch (e) {
    return res.status(400).json({ status: 400, message: e.message });
  }
};

module.exports.deleteUser = async (req, res) => {
    try {      
                data = await userApiService.deleteUser({_id: req.params.id})
                return res.status(200).json({status: 200, data: data, message: "Succesfully Users Deleted"})
    }
    catch(e) {
        return res.status(400).json({status: 400, message: e.message});
    }
}