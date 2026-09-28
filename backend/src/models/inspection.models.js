import mongoose, { Schema } from "mongoose";

const inspectionSchema = new Schema(
    {
        inspectionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        roadId: { type: Schema.Types.ObjectId, ref: "road", default: null, index: true },
        roadProjectId: { type: Schema.Types.ObjectId, ref: "roadProject", default: null, index: true },
        maintenanceId: { type: Schema.Types.ObjectId, ref: "maintenance", default: null },
        officerId: { type: Schema.Types.ObjectId, ref: "user", required: true },

        inspectionDate: { type: Date, default: Date.now },
        inspectionType: {
            type: String,
            enum: [
                "Pre-construction inspection",
                "Material inspection",
                "Construction progress inspection",
                "Quality inspection",
                "Final construction inspection",
                "Routine road inspection",
                "Maintenance inspection",
                "Post-maintenance inspection",
                "Emergency inspection",
            ],
            required: true,
        },

        // Detailed Ratings / Scores
        roadCondition: { type: String, enum: ["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"], default: "GOOD" },
        materialQuality: { type: String, enum: ["EXCELLENT", "SATISFACTORY", "DEFECTIVE"], default: "SATISFACTORY" },
        surfaceQuality: { type: String, enum: ["SMOOTH", "MINOR_CRACKS", "POTHOLES", "SEVERELY_DAMAGED"], default: "SMOOTH" },
        roadThickness: { type: Number, default: 0 }, // in cm or mm
        roadWidth: { type: Number, default: 0 }, // in meters
        drainageCondition: { type: String, enum: ["FUNCTIONAL", "BLOCKED", "DAMAGED"], default: "FUNCTIONAL" },
        cracksObserved: { type: Boolean, default: false },
        potholesObserved: { type: Boolean, default: false },
        safetyIssues: { type: String, default: "" },
        constructionQuality: { type: String, default: "" },

        photos: [{ type: String }],
        documents: [{ type: String }],
        remarks: { type: String, required: true },

        result: {
            type: String,
            enum: ["PASSED", "FAILED", "REQUIRES_CORRECTION", "REINSPECTION_REQUIRED"],
            required: true,
            default: "PASSED",
        },
        reinspectionOfId: { type: Schema.Types.ObjectId, ref: "inspection", default: null },
    },
    { timestamps: true }
);

inspectionSchema.index({ roadId: 1, inspectionDate: -1 });
inspectionSchema.index({ roadProjectId: 1, inspectionDate: -1 });

export const Inspection = mongoose.model("inspection", inspectionSchema);
