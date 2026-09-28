import { asyncHandler } from "../../utils/asyncHandler.js";
import { AuditLog } from "../models/auditLog.models.js";

export const getAuditLogs = asyncHandler(async (req, res) => {
    const { action, entity, page = 1, limit = 50 } = req.query;

    const query = {};
    if (action) query.action = action;
    if (entity) query.entity = entity;

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
        AuditLog.find(query)
            .populate("user", "name email role")
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        AuditLog.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: logs,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});
