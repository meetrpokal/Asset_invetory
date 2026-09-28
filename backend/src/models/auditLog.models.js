import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "user", required: true },
        action: { type: String, required: true }, // e.g., 'BUDGET_APPROVAL', 'CONTRACTOR_SELECTION', 'INSPECTION_FAILURE'
        entity: { type: String, required: true }, // e.g., 'Road', 'RoadProject', 'Tender', 'Budget'
        entityId: { type: String, required: true },
        oldValue: { type: Schema.Types.Mixed, default: null },
        newValue: { type: Schema.Types.Mixed, default: null },
        ipAddress: { type: String, default: "127.0.0.1" },
        userAgent: { type: String, default: "" },
        timestamp: { type: Date, default: Date.now, index: true },
    },
    { timestamps: true }
);

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ user: 1, timestamp: -1 });

export const AuditLog = mongoose.model("auditLog", auditLogSchema);
