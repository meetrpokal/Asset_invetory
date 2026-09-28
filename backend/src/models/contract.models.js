import mongoose, { Schema } from "mongoose";

const contractSchema = new Schema(
    {
        contractId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        roadProjectId: { type: Schema.Types.ObjectId, ref: "roadProject", required: true },
        tenderId: { type: Schema.Types.ObjectId, ref: "tender", default: null },
        contractorId: { type: Schema.Types.ObjectId, ref: "contractor", required: true },

        contractAmount: { type: Number, required: true },
        startDate: { type: Date, required: true },
        expectedCompletionDate: { type: Date, required: true },
        actualCompletionDate: Date,

        warrantyPeriodYears: { type: Number, default: 5 },
        defectLiabilityPeriodYears: { type: Number, default: 2 },
        warrantyStartDate: Date,
        warrantyEndDate: Date,
        defectLiabilityStartDate: Date,
        defectLiabilityEndDate: Date,

        paymentInformation: { type: String, default: "" },
        terms: { type: String, default: "" },
        documents: [{ type: String }],
        status: {
            type: String,
            enum: ["ACTIVE", "COMPLETED", "TERMINATED", "DEFECT_LIABILITY"],
            default: "ACTIVE",
        },
    },
    { timestamps: true }
);

export const Contract = mongoose.model("contract", contractSchema);
