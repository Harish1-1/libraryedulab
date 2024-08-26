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
      
        
        if (options.limit) {
          query.limit(parseInt(options.limit, 10)); 
        }
        if (options.skip) {
          query.skip(parseInt(options.skip, 10)); 
        }
      
        return await query.populate("user").exec();
      }
      
  
    
  }
  
  module.exports = AuditLogService;
  
