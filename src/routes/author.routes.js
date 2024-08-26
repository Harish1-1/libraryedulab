const express = require('express');
const AuthorService = require('../services/author.service');
const Author = require('../models/author.model');

const router = express.Router();
const authorService = new AuthorService(Author);

router.post('/', async (req, res) => {
  try {
    const author = await authorService.createAuthor(req.body);
    res.status(201).json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const author = await authorService.getAuthorById(req.params.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }
    res.json(author);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});



module.exports = router;
