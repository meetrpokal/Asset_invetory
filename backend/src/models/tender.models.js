import mongoose, { Schema } from "mongoose";

const bidSchema = new Schema({
    contractorId: { type: Schema.Types.ObjectId, ref: "contractor", required: true },
    bidAmount: { type: Number, required: true },
    proposalDocument: { type: String, default: "" },
    submissionDate: { type: Date, default: Date.now },
    technicalPassed: { type: Boolean, default: true },
    financialPassed: { type: Boolean, default: true },
    status: {
        type: String,
        enum: ["SUBMITTED", "UNDER_REVIEW", "SELECTED", "REJECTED"],
        default: "SUBMITTED",
    },
    remarks: { type: String, default: "" },
});

const tenderSchema = new Schema(
    {
        tenderId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        roadProjectId: {
            type: Schema.Types.ObjectId,
            ref: "roadProject",
            required: true,
            index: true,
        },
        title: { type: String, required: true },
        estimatedCost: { type: Number, required: true },
        tenderAmount: { type: Number, default: 0 },
        publicationDate: { type: Date, default: Date.now },
        submissionDeadline: { type: Date, required: true },
        contractDurationMonths: { type: Number, default: 12 },

        technicalRequirements: { type: String, default: "" },
        financialRequirements: { type: String, default: "" },
        requiredExperienceYears: { type: Number, default: 3 },
        requiredDocuments: [{ type: String }],

        bids: [bidSchema],
        awardedContractorId: { type: Schema.Types.ObjectId, ref: "contractor", default: null },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "PUBLISHED",
                "CLOSED",
                "UNDER_EVALUATION",
                "APPROVED",
                "AWARDED",
                "CANCELLED",
            ],
            default: "PUBLISHED",
            index: true,
        },

        activityLog: [
            {
                action: String,
                performedBy: { type: Schema.Types.ObjectId, ref: "user" },
                timestamp: { type: Date, default: Date.now },
                notes: String,
            },
        ],
    },
    { timestamps: true }
);

export const Tender = mongoose.model("tender", tenderSchema);
