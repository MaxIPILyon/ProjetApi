const User = require('../models/user');

//récupère la liste des users
module.exports.getUsers = async (query) => {
    try {
        let users = await User.find(query);
        return users;
    }
    catch(e) {
        throw Error('Error while query all Users :' + e);
    }
}

//récupère un users
module.exports.getUser = async (query) => {
    try {
        let users = await User.findOne(query);
        return users;
    }
    catch(e) {
        throw Error('Error while query one User :' + e);
    }
}

//ajout un users
module.exports.createUser = async (user) => {
    try {
        return await user.save();
    }
    catch(e) {
        throw Error('Error while query create User :' + e);
    }
}

//update un users
module.exports.updateUser = async (query, user) => {
    try {
        return await User.updateOne(query, user);
    }
    catch(e) {
        throw Error('Error while query update User :' + e);
    }
}

//update un users
module.exports.deleteUser = async (query) => {
    try {
        return await User.deleteOne(query);
    }
    catch(e) {
        throw Error('Error while query delete User :' + e);
    }
}