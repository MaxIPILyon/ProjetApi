const mongoose = require('mongoose');
const component = require('./component');

const configSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    name: { type:String, required:true }, 
    component: { type:[component]},

}); 

module.exports = mongoose.model('Config', configSchema); 