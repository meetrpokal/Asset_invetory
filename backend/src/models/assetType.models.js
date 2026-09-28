import mongoose, { Schema } from "mongoose";

const assetTypeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true,
        },
        description: {
            type: String,
            default: "",
        },
        defaultDepartmentCategory: {
            type: String,
            default: "Other",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        icon: {
            type: String,
            default: "wrench",
        },
        slaHours: {
            type: Number,
            default: 48,
        },
    },
    { timestamps: true }
);

export const AssetType = mongoose.model("assetType", assetTypeSchema);
