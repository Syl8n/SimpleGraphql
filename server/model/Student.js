const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    id: String,
    password: String,
    firstName: String,
    lastName: String,
    program: String,
    token: String
});

module.exports = mongoose.model('Student', StudentSchema);