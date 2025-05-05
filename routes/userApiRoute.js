const express = require("express");
const router = express.Router();
const User = require("../models/user");
const userApiService = require("../services/userApiService");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const userApiController = require("../controllers/userApiController");

router.route("/users").get(userApiController.getUsers);
router.route("/:id").get(userApiController.getUser);
router.route("/").post(userApiController.createUser);
router.route("/:id").put(userApiController.updateUser);
router.route("/:id").delete(userApiController.deleteUser);

//router.route("/:id")
// .put(async (req, res) => {

//     let salt = await bcrypt.genSalt(10);
//     req.body.password = await bcrypt.hash(req.body.password, salt);

//     userApiService.updateUser({_id: req.params.id}, req.body)
//     .then((user) =>res.status(200).json({status: 200, data: user, message: "Succesfully Users Updated"}))
//     .catch((error) =>res.status(400).json({status: 400, message: error.message}));
    
// })

// .delete((req, res) => {
//     userApiService.deleteUser({_id: req.params.id})
//     .then((user) =>res.status(200).json({status: 200, data: user, message: "Succesfully Users Deleted"}))
//     .catch((error) =>res.status(400).json({status: 400, message: error.message}));
// })


// router.route("/")
//     .post(async (req, res) => {

//         let salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);

//         // req.body.password = crypto.createHmac("sha512", process.env.SECRET_KEY)
//         // .update(req.body.password)
//         // .digest("base64");

//         let user = new User(req.body);

//         userApiService.createUser(user)
//         .then((user) =>res.status(201).json({status: 201, data: user, message: "Succesfully Users Saved"}))
//         .catch((error) =>res.status(400).json({status: 400, message: error.message}));
//     })

module.exports = router;