class AuditLogService {
    constructor(auditLogModel) {
      this.auditLogModel = auditLogModel;
    }
  
    async logAction(action, user, entity, entityId, details = {}) {
      const logEntry = new this.auditLogModel({
        action,
        user,
        entity,
        entityId,
        details,
      });
      return await logEntry.save();
    }
  
    async getLogs(filter = {}, options = {}) {
        const query = this.auditLogModel.find(filter);
      
        // Apply date range filtering if provided
        if (options.startDate || options.endDate) {
          const dateFilter = {};
          if (options.startDate) {
            dateFilter.$gte = options.startDate;
          }
          if (options.endDate) {
            dateFilter.$lte = options.endDate;
          }
          if (Object.keys(dateFilter).length > 0) {
            query.where("timestamp").gte(dateFilter.$gte || new Date(0)).lte(dateFilter.$lte || new Date());
          }
        }
      
        // Apply pagination if provided
        if (options.limit) {
          query.limit(parseInt(options.limit, 10)); // Convert limit to integer
        }
        if (options.skip) {
          query.skip(parseInt(options.skip, 10)); // Convert skip to integer
        }
      
        return await query.populate("user").exec();
      }
      
  
    // Add additional methods for filtering, paginating, etc.
  }
  
  module.exports = AuditLogService;
  