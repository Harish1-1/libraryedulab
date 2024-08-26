class AuthorService {
    constructor(authorModel) {
      this.authorModel = authorModel;
    }
  
    async createAuthor(authorData) {
        // Check if an author with the same name and bio already exists
        const existingAuthor = await this.authorModel.findOne({
          name: authorData.name,
          bio: authorData.bio,
        });
        
        if (existingAuthor) {
          throw new Error('Author with the same name and bio already exists');
        }
    
        // If not, create a new author with a unique authorId
        const author = new this.authorModel({
          ...authorData,
          authorId: uuidv4(),  // Generate a UUID for authorId
        });
    
        return await author.save();
      }
    
  
    async getAuthorById(authorId) {
      return await this.authorModel.findById(authorId);
    }
  
    async updateAuthor(authorId, authorData) {
      return await this.authorModel.findByIdAndUpdate(authorId, authorData, { new: true });
    }
  
    async deleteAuthor(authorId) {
      return await this.authorModel.findByIdAndDelete(authorId);
    }
  
    // Other author-related methods can be added here
  }
  
  module.exports = AuthorService;
  