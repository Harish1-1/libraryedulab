const { v4: uuidv4 } = require('uuid');
const Borrowing = require('../models/borrowing.model');
const AuditLogService = require('../services/auditLog.service');

class BookService {
  constructor(bookModel, auditLogService) {
    this.bookModel = bookModel;
    this.auditLogService = auditLogService;
  }
  
    async createBook(bookData) {
        
        const existingBook = await this.bookModel.findOne({
          title: bookData.title,
          author: bookData.author,
        });
        
        if (existingBook) {
          throw new Error('Book with the same title and author already exists');
        }
    
       
        const book = new this.bookModel({
          ...bookData,
          bookId: uuidv4(),  
        });
    
        return await book.save();
      }
    
  
    async getBookById(bookId) {
      return await this.bookModel.findById(bookId).populate('author');
    }
  
    async updateBook(bookId, bookData) {
      return await this.bookModel.findByIdAndUpdate(bookId, bookData, { new: true });
    }
  
    async deleteBook(bookId) {
      return await this.bookModel.findByIdAndDelete(bookId);
    }
  
    async borrowBook(bookId, userId, dueDate) {
        
        const activeBorrowings = await Borrowing.countDocuments({
          user: userId,
          returnedAt: { $exists: false },
        });
    
        if (activeBorrowings >= MAX_BORROW_LIMIT) {
          throw new Error(`User has reached the maximum borrowing limit of ${MAX_BORROW_LIMIT} books.`);
        }
    
        
        const existingBorrowing = await Borrowing.findOne({
          user: userId,
          book: bookId,
          returnedAt: { $exists: false },
        });
    
        if (existingBorrowing) {
          throw new Error('User has already borrowed this book and has not returned it yet.');
        }
    
        
        const book = await this.bookModel.findById(bookId);
        if (!book) {
          throw new Error('Book not found.');
        }
    
        if (book.availableCopies < 1) {
          throw new Error('No available copies for this book.');
        }
    
        
        book.availableCopies -= 1;
        await book.save();
    
        const borrowing = new Borrowing({
          borrowingId: uuidv4(),
          user: userId,
          book: bookId,
          borrowedAt: new Date(),
          dueDate: dueDate,
        });
    
        const savedBorrowing = await borrowing.save();
    
        
        await this.auditLogService.logAction(
          'BORROW_BOOK',
          userId,
          'Book',
          bookId,
          { borrowingId: savedBorrowing.borrowingId, dueDate }
        );
    
        return savedBorrowing;
      }
  
      async returnBook(borrowingId) {
        const borrowing = await Borrowing.findOne({ borrowingId });
        if (!borrowing) {
          throw new Error('Borrowing record not found.');
        }
      
        if (borrowing.returnedAt) {
          throw new Error('This book has already been returned.');
        }
      
        borrowing.returnedAt = new Date();
        await borrowing.save();
      
        const book = await this.bookModel.findById(borrowing.book);
        book.availableCopies += 1;
        await book.save();
      
        
        await this.auditLogService.logAction(
          'RETURN_BOOK',
          borrowing.user,
          'Book',
          borrowing.book,
          { borrowingId }
        );
      
        return borrowing;
      }
      
      
      
      
      
  }
  
  module.exports = BookService;
  
