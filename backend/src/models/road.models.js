import mongoose, { Schema } from "mongoose";

const roadSchema = new Schema(
    {
        roadId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        roadCode: {
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
        startLocation: {
            name: { type: String, default: "" },
            coordinates: { type: [Number], default: [72.8311, 21.1702] }, // [lng, lat]
        },
        endLocation: {
            name: { type: String, default: "" },
            coordinates: { type: [Number], default: [72.8350, 21.1750] }, // [lng, lat]
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude] center of road
                required: true,
            },
        },
        geometry: {
            type: {
                type: String,
                enum: ["LineString"],
                default: "LineString",
            },
            coordinates: {
                type: [[Number]], // Array of [lng, lat] points along the road
                default: [],
            },
        },
        length: {
            type: Number, // in kilometers
            required: true,
            default: 1.0,
        },
        width: {
            type: Number, // in meters
            required: true,
            default: 10.0,
        },
        lanes: {
            type: Number,
            default: 2,
        },
        area: {
            type: String,
            default: "",
        },
        ward: {
            type: String,
            default: "",
        },
        city: {
            type: String,
            default: "Surat",
        },
        state: {
            type: String,
            default: "Gujarat",
        },
        departmentId: {
            type: Schema.Types.ObjectId,
            ref: "department",
            index: true,
        },
        constructionProjectId: {
            type: Schema.Types.ObjectId,
            ref: "roadProject",
            default: null,
        },
        contractorId: {
            type: Schema.Types.ObjectId,
            ref: "contractor",
            default: null,
        },
        inspectionOfficerId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            default: null,
        },
        constructionStartDate: Date,
        constructionEndDate: Date,
        constructionCost: {
            type: Number,
            default: 0,
        },
        currentValue: {
            type: Number,
            default: 0,
        },
        expectedLifeYears: {
            type: Number,
            default: 15,
        },
        warrantyStartDate: Date,
        warrantyEndDate: Date,
        defectLiabilityStartDate: Date,
        defectLiabilityEndDate: Date,
        lastInspectionDate: Date,
        nextInspectionDate: Date,
        lastMaintenanceDate: Date,
        nextMaintenanceDate: Date,

        condition: {
            type: String,
            enum: ["EXCELLENT", "GOOD", "FAIR", "POOR", "CRITICAL"],
            default: "GOOD",
            index: true,
        },
        healthStatus: {
            type: String,
            enum: ["HEALTHY", "WARNING", "CRITICAL", "UNKNOWN"],
            default: "HEALTHY",
            index: true,
        },
        status: {
            type: String,
            enum: [
                "PLANNED",
                "UNDER_CONSTRUCTION",
                "ACTIVE",
                "UNDER_INSPECTION",
                "UNDER_MAINTENANCE",
                "DAMAGED",
                "REHABILITATION",
                "RECONSTRUCTION",
                "RETIRED",
            ],
            default: "ACTIVE",
            index: true,
        },

        // Factual Citizen Interaction Metrics
        viewsCount: { type: Number, default: 0 },
        uniqueVisitorsCount: { type: Number, default: 0 },
        complaintsCount: { type: Number, default: 0 },
        uniqueComplainantsCount: { type: Number, default: 0 },
        repeatComplaintsCount: { type: Number, default: 0 },
        resolvedComplaintsCount: { type: Number, default: 0 },
        openComplaintsCount: { type: Number, default: 0 },
        avgResolutionTimeHours: { type: Number, default: 24.0 },
        roadConcernIndicator: {
            type: String,
            enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"],
            default: "LOW",
        },

        images: [{ type: String }],
        documents: [{ type: String }],
        tags: [{ type: String }],

        createdBy: { type: Schema.Types.ObjectId, ref: "user" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

// Geospatial 2dsphere index for location queries
roadSchema.index({ location: "2dsphere" });
roadSchema.index({ status: 1, condition: 1 });

export const Road = mongoose.model("road", roadSchema);
