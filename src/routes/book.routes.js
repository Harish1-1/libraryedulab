const express = require('express');
const BookService = require('../services/book.service');
const Book = require('../models/book.model');

const router = express.Router();
const bookService = new BookService(Book);

router.post('/', async (req, res) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add routes for borrowing, returning, updating, and deleting books
router.post('/borrow', async (req, res) => {
    try {
      const { bookId, userId, dueDate } = req.body;
      const borrowing = await bookService.borrowBook(bookId, userId, dueDate);
      res.status(201).json(borrowing);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.post('/return', async (req, res) => {
    try {
      const { borrowingId } = req.body;
      const returning = await bookService.returnBook(borrowingId);
      res.status(200).json(returning);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  

module.exports = router;
