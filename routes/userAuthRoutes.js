const express=require("express");
const router=express.Router();
const userAuthController=require("../controllers/userAuthController");

// routes d'authentification
router.post("/register", userAuthController.register);
router.post("/login", userAuthController.login);

module.exports = router;