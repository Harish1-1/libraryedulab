const crypto = require('crypto');
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entity: { type: String, required: true },
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: Object },
  hash: { type: String, required: true },  
});


auditLogSchema.pre('save', function (next) {
  const logString = `${this.action}-${this.user}-${this.entity}-${this.entityId}-${this.timestamp}`;
  this.hash = crypto.createHash('sha256').update(logString).digest('hex');
  next();
});
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ timestamp: 1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
