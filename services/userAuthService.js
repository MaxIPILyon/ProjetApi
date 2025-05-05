const UserAuth=require("../models/userAuth");

// récupère un user
module.exports.getUser = async(query) => {
    try{
        let user = await UserAuth.findOne(query);
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