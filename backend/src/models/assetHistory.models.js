import mongoose, { Schema } from "mongoose";

const assetHistorySchema = new Schema(
    {
        assetId: {
            type: Schema.Types.ObjectId,
            ref: "asset",
            required: true,
            index: true,
        },
        previousStatus: {
            type: String,
            default: null,
        },
        newStatus: {
            type: String,
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: [
                "CREATED",
                "STATUS_CHANGE",
                "HEALTH_UPDATE",
                "MAINTENANCE_SCHEDULED",
                "MAINTENANCE_COMPLETED",
                "DEPARTMENT_TRANSFER",
                "TECHNICIAN_ASSIGNED",
                "DETAILS_UPDATED",
                "RETIRED",
                "DISPOSED",
            ],
        },
        reason: {
            type: String,
            default: "",
        },
        performedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        department: {
            type: Schema.Types.ObjectId,
            ref: "department",
        },
        location: {
            type: Object,
            default: null,
        },
        notes: {
            type: String,
            default: "",
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    { timestamps: true }
);

assetHistorySchema.index({ assetId: 1, timestamp: -1 });

export const AssetHistory = mongoose.model("assetHistory", assetHistorySchema);
