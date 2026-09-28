import mongoose, { Schema } from "mongoose";

const contractorSchema = new Schema(
    {
        contractorId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        contactPerson: { type: String, default: "" },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, default: "" },
        licenseInfo: { type: String, default: "" },

        // Factual performance metrics
        totalProjects: { type: Number, default: 0 },
        completedProjects: { type: Number, default: 0 },
        delayedProjects: { type: Number, default: 0 },
        avgCompletionDurationDays: { type: Number, default: 0 },
        inspectionFailures: { type: Number, default: 0 },
        reportedDefects: { type: Number, default: 0 },
        warrantyIssues: { type: Number, default: 0 },

        documents: [{ type: String }],
        isBlacklisted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Contractor = mongoose.model("contractor", contractorSchema);
