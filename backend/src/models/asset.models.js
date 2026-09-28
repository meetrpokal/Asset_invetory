import mongoose, { Schema } from "mongoose";

const assetSchema = new Schema(
    {
        assetId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        assetCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        assetType: {
            type: String,
            required: true,
            index: true,
        },
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "department",
            index: true,
        },
        responsibleAdminId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        responsibleTechnicianId: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
        },
        address: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        area: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: [
                "PLANNED",
                "ACQUIRED",
                "REGISTERED",
                "DEPLOYED",
                "ACTIVE",
                "MAINTENANCE",
                "DAMAGED",
                "TRANSFERRED",
                "RETIRED",
                "DISPOSED",
            ],
            default: "ACTIVE",
            index: true,
        },
        health: {
            type: String,
            enum: ["HEALTHY", "WARNING", "CRITICAL", "UNKNOWN"],
            default: "HEALTHY",
            index: true,
        },
        criticality: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "MEDIUM",
            index: true,
        },
        purchaseDate: {
            type: Date,
        },
        installationDate: {
            type: Date,
        },
        warrantyStartDate: {
            type: Date,
        },
        warrantyEndDate: {
            type: Date,
        },
        vendor: {
            type: String,
            default: "",
        },
        purchaseCost: {
            type: Number,
            default: 0,
        },
        currentValue: {
            type: Number,
            default: 0,
        },
        images: [
            {
                type: String,
            },
        ],
        documents: [
            {
                type: String,
            },
        ],
        tags: [
            {
                type: String,
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
    },
    { timestamps: true }
);

// Create 2dsphere index for geospatial location queries
assetSchema.index({ location: "2dsphere" });
assetSchema.index({ departmentId: 1, status: 1 });
assetSchema.index({ assetType: 1, health: 1 });

export const Asset = mongoose.model("asset", assetSchema);
