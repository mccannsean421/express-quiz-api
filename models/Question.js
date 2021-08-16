const mongoose = require('mongoose');
const { Schema } = mongoose;

const QuestionSchema = new Schema({
    question: String,
    is_active: Boolean,
    choices: Array,
    categories: Array,
})

module.exports = mongoose.model('Question', QuestionSchema)
