const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    college: String,
    program: String,
    startingYear: { type: Number, min: 2015, max: 2022},	
});

module.exports = mongoose.model('Student', StudentSchema);