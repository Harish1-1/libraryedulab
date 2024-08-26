// borrowing.model.js

const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
  borrowingId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowedAt: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  returnedAt: { type: Date },
});

const Borrowing = mongoose.model('Borrowing', borrowingSchema);

module.exports = Borrowing;
