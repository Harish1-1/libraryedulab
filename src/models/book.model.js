const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const bookSchema = new mongoose.Schema({
  bookId: { type: String, default: uuidv4, unique: true },  
  title: { type: String, required: true },
  description: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
  availableCopies: { type: Number, required: true },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
