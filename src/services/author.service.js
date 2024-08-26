class AuthorService {
    constructor(authorModel) {
      this.authorModel = authorModel;
    }
  
    async createAuthor(authorData) {
       
        const existingAuthor = await this.authorModel.findOne({
          name: authorData.name,
          bio: authorData.bio,
        });
        
        if (existingAuthor) {
          throw new Error('Author with the same name and bio already exists');
        }
    
       
        const author = new this.authorModel({
          ...authorData,
          authorId: uuidv4(), 
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
  
    
  }
  
  module.exports = AuthorService;
  
