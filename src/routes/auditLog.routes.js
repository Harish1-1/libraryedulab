const express = require('express');
const AuditLogService = require('../services/auditLog.service');
const AuditLog = require('../models/auditLog.model');

const router = express.Router();
const auditLogService = new AuditLogService(AuditLog);

router.get("/", async (req, res) => {
    try {
      // Extract and validate the query parameters
      const { startDate, endDate, limit, skip } = req.query;
  
      // Prepare options for filtering and pagination
      const options = {};
  
      // Validate and set the date range if provided
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start)) {
          options.startDate = start;
        } else {
          return res.status(400).json({ error: "Invalid startDate" });
        }
      }
  
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end)) {
          options.endDate = end;
        } else {
          return res.status(400).json({ error: "Invalid endDate" });
        }
      }
  
      // Validate and set pagination options if provided
      if (limit) {
        const parsedLimit = parseInt(limit, 10);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          options.limit = parsedLimit;
        } else {
          return res.status(400).json({ error: "Invalid limit" });
        }
      }
  
      if (skip) {
        const parsedSkip = parseInt(skip, 10);
        if (!isNaN(parsedSkip) && parsedSkip >= 0) {
          options.skip = parsedSkip;
        } else {
          return res.status(400).json({ error: "Invalid skip" });
        }
      }
  
      // Fetch the logs with the applied options
      const logs = await auditLogService.getLogs(req.query, options);
      res.json(logs);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  

module.exports = router;
