// const UserAuth=require("../models/userAuth");
const User=require("../models/user");
// récupère un user
module.exports.getUser = async(query) => {
    try{
        let user = await User.findOne(query);
        return user;
    }catch(e) {
        throw Error("Error while query all one user : "+e);
    }
}
// crée un user
    module.exports.createUser = async(user) =>{
        try{ 
            return await user.save();
        }
        catch(e) {
            throw Error("Error while create user : "+e);
        }
    }