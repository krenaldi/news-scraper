// Require mongoose
const mongoose = require('mongoose');

// Saved reference to the Schema constructor
const Schema = mongoose.Schema;

// Using the Schema constructor, create a new NoteSchema object
let NoteSchema = new Schema({
    title: String,
    body: String
});

// Create model from schema
const Note = mongoose.model('Note', NoteSchema);

module.exports = Note;