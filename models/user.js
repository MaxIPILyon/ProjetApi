const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: { type:String, required:true }, 
    lastName:  { type:String, required:true }, 
    email:     { type:String, required:true }, 
    username:  { type:String, required:true, unique:true},
    password:  { type:String, required:true },
    admin:     { type:Boolean, required:true, default:false}
    //tasks: [ {type: mongoose.Schema.Types.ObjectId, ref: "Task"} ]
}); 

module.exports = mongoose.model('User', userSchema); 