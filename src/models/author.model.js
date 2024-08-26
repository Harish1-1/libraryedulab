const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const authorSchema = new mongoose.Schema({
  authorId: { type: String, default: uuidv4, unique: true },  
  name: { type: String, required: true, unique: true },
  bio: String,
});

const Author = mongoose.model('Author', authorSchema);

module.exports = Author;
