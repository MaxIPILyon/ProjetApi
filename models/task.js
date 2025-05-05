const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    label: { type : String, require: true },
    description: { type: String, require: true },
    dateTask: { type: Date, require: true },
    status: { type: Boolean, require: true },
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model('Task', taskSchema);