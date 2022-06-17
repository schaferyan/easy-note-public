const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String,
    color: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);