const AuditLogService = require('./auditLog.service');
const AuditLog = require('../models/auditLog.model');

const auditLogService = new AuditLogService(AuditLog);

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  async createUser(userData) {
    // Check if a user with the same email already exists
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });
    
    if (existingUser) {
      throw new Error('User with the same email already exists');
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create a new user with a unique userId and hashed password
    const user = new this.userModel({
      ...userData,
      userId: uuidv4(),  // Generate a UUID for userId
      password: hashedPassword,  // Store the hashed password
    });

    return await user.save();
  }

  async getUserById(userId) {
    return await this.userModel.findById(userId);
  }

  async updateUser(userId, userData) {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, userData, { new: true });

    // Log the action
    await auditLogService.logAction(
      'UPDATE_USER',
      userId,
      'User',
      userId,
      { userData }
    );

    return updatedUser;
  }

  async deleteUser(userId) {
    const deletedUser = await this.userModel.findByIdAndDelete(userId);

    // Log the action
    await auditLogService.logAction(
      'DELETE_USER',
      userId,
      'User',
      userId,
      {}
    );

    return deletedUser;
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
  
    // Generate JWT with user role
    const token = jwt.sign(
      { userId: user.userId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  
    return token;
}

  async changePassword(userId, newPassword) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
  
    user.password = hashedPassword;
    await user.save();
  
    // Log the password change action
    await auditLogService.logAction(
      'PASSWORD_CHANGE',
      userId,
      'User',
      userId,
      {}
    );
  
    return user;
  }
  
  
}

module.exports = UserService;
