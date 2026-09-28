import mongoose, { Schema } from "mongoose";

const roadHistorySchema = new Schema(
    {
        roadId: { type: Schema.Types.ObjectId, ref: "road", default: null, index: true },
        roadProjectId: { type: Schema.Types.ObjectId, ref: "roadProject", default: null, index: true },
        eventType: {
            type: String,
            required: true,
            enum: [
                "PROPOSAL_CREATED",
                "FEASIBILITY_PASSED",
                "COST_ESTIMATED",
                "MATERIAL_PLANNED",
                "BUDGET_REQUESTED",
                "BUDGET_APPROVED",
                "TENDER_PUBLISHED",
                "CONTRACTOR_AWARDED",
                "CONSTRUCTION_STARTED",
                "STAGE_COMPLETED",
                "INSPECTION_PASSED",
                "INSPECTION_FAILED",
                "FINAL_APPROVAL",
                "ROAD_ACTIVATED",
                "CITIZEN_COMPLAINT_FILED",
                "ROUTINE_INSPECTION",
                "MAINTENANCE_REQUIRED",
                "MAINTENANCE_APPROVED",
                "REPAIR_COMPLETED",
                "WARRANTY_REVIEW",
                "RESURFACED",
                "REHABILITATED",
                "RECONSTRUCTED",
                "RETIRED",
            ],
        },
        date: { type: Date, default: Date.now, index: true },
        performedBy: { type: Schema.Types.ObjectId, ref: "user" },
        description: { type: String, required: true },
        relatedCost: { type: Number, default: 0 },
        documents: [{ type: String }],
        photos: [{ type: String }],
        previousStatus: { type: String, default: null },
        newStatus: { type: String, default: null },
    },
    { timestamps: true }
);

roadHistorySchema.index({ roadId: 1, date: -1 });
roadHistorySchema.index({ roadProjectId: 1, date: -1 });

export const RoadLifecycleHistory = mongoose.model("roadLifecycleHistory", roadHistorySchema);
