import mongoose, { Schema } from "mongoose";

const maintenanceSchema = new Schema(
    {
        maintenanceId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        assetId: {
            type: Schema.Types.ObjectId,
            ref: "asset",
            default: null,
            index: true,
        },
        roadId: {
            type: Schema.Types.ObjectId,
            ref: "road",
            default: null,
            index: true,
        },
        complaintId: {
            type: Schema.Types.ObjectId,
            ref: "complaint",
            default: null,
        },
        technicianId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: [
                "ROUTINE",
                "POTHOLE_REPAIR",
                "CRACK_REPAIR",
                "RESURFACING",
                "DRAINAGE_REPAIR",
                "ROAD_MARKING",
                "STRUCTURAL_REPAIR",
                "EMERGENCY_REPAIR",
                "MAJOR_REHABILITATION",
                "RECONSTRUCTION",
                "Preventive",
                "Corrective",
                "Emergency",
                "Inspection",
                "Upgrade",
            ],
            default: "POTHOLE_REPAIR",
            index: true,
        },
        status: {
            type: String,
            enum: ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
            default: "SCHEDULED",
            index: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        completionDate: {
            type: Date,
        },
        nextMaintenanceDate: {
            type: Date,
        },
        maintenanceFrequency: {
            type: String,
            enum: ["None", "Daily", "Weekly", "Monthly", "Quarterly", "Bi-Annual", "Annual"],
            default: "None",
        },
        cost: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
            default: "",
        },
        beforeImages: [{ type: String }],
        afterImages: [{ type: String }],
        images: [{ type: String }],
        documents: [{ type: String }],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

maintenanceSchema.index({ assetId: 1, status: 1 });
maintenanceSchema.index({ nextMaintenanceDate: 1, status: 1 });

export const Maintenance = mongoose.model("maintenance", maintenanceSchema);
