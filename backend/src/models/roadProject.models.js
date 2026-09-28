import mongoose, { Schema } from "mongoose";

const materialItemSchema = new Schema({
    materialName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, required: true }, // e.g., 'Tons', 'Cu.m', 'Bags'
    estimatedUnitPrice: { type: Number, required: true },
    estimatedTotalCost: { type: Number, required: true },
    actualQuantityUsed: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    supplier: { type: String, default: "" },
    qualityResult: { type: String, enum: ["PENDING", "PASSED", "FAILED"], default: "PENDING" },
});

const roadProjectSchema = new Schema(
    {
        proposalId: {
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
        startLocation: {
            name: { type: String, default: "" },
            coordinates: { type: [Number], default: [72.8311, 21.1702] },
        },
        endLocation: {
            name: { type: String, default: "" },
            coordinates: { type: [Number], default: [72.8350, 21.1750] },
        },
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        area: { type: String, default: "" },
        ward: { type: String, default: "" },
        city: { type: String, default: "Surat" },
        state: { type: String, default: "Gujarat" },
        length: { type: Number, required: true, default: 1.0 }, // km
        width: { type: Number, required: true, default: 10.0 }, // m
        lanes: { type: Number, default: 2 },
        expectedTraffic: { type: String, default: "Medium Traffic" },
        estimatedPopulationServed: { type: Number, default: 10000 },
        reasonForConstruction: { type: String, required: true },
        
        // Road Need Assessment & Priority Calculation
        needAssessment: {
            trafficVolume: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "HEAVY"], default: "HIGH" },
            populationServed: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "VERY_HIGH"], default: "HIGH" },
            existingRoadCondition: { type: String, enum: ["NONE", "POOR", "CRITICAL", "FAIR"], default: "POOR" },
            connectivityImportance: { type: String, enum: ["LOCAL", "DISTRICT", "STATE_HIGHWAY", "NATIONAL_HIGHWAY"], default: "DISTRICT" },
            nearbyFacilities: [{ type: String }], // e.g. ['School', 'Hospital', 'Market', 'Industrial Zone']
            safetyConcerns: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "MEDIUM" },
            citizenRequestsCount: { type: Number, default: 0 },
            landAvailability: { type: String, enum: ["AVAILABLE", "PARTIAL_ACQUISITION", "LAND_ACQUISITION_REQUIRED"], default: "AVAILABLE" }
        },
        priorityBreakdown: {
            score: { type: Number, default: 75 },
            indicator: { type: String, enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], default: "HIGH" },
            reasons: [{ type: String }]
        },

        priority: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
            default: "HIGH",
        },
        proposedStartDate: Date,
        expectedCompletionDate: Date,
        actualCompletionDate: Date,

        estimatedConstructionCost: { type: Number, required: true, default: 0 },
        actualConstructionCost: { type: Number, default: 0 },

        // Cost estimation breakdown
        costBreakdown: {
            landPreparation: { type: Number, default: 0 },
            materials: { type: Number, default: 0 },
            labour: { type: Number, default: 0 },
            equipment: { type: Number, default: 0 },
            drainage: { type: Number, default: 0 },
            roadMarking: { type: Number, default: 0 },
            safety: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
        },

        materials: [materialItemSchema],
        landRequirementDescription: { type: String, default: "" },

        departmentId: { type: Schema.Types.ObjectId, ref: "department" },
        proposedBy: { type: Schema.Types.ObjectId, ref: "user" },
        siteEngineerId: { type: Schema.Types.ObjectId, ref: "user" },
        inspectionOfficerId: { type: Schema.Types.ObjectId, ref: "user" },
        contractorId: { type: Schema.Types.ObjectId, ref: "contractor" },

        constructionStage: {
            type: String,
            enum: [
                "SITE_PREPARATION",
                "SUB_BASE",
                "BASE_LAYER",
                "ROAD_SURFACE",
                "DRAINAGE",
                "ROAD_MARKING",
                "SAFETY_INSTALLATION",
                "FINAL_INSPECTION",
                "COMPLETED",
            ],
            default: "SITE_PREPARATION",
        },
        progressPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },

        status: {
            type: String,
            enum: [
                "DRAFT",
                "SUBMITTED",
                "UNDER_REVIEW",
                "APPROVED",
                "BUDGET_PENDING",
                "BUDGET_APPROVED",
                "TENDER_PENDING",
                "TENDERED",
                "CONTRACTOR_SELECTED",
                "CONSTRUCTION",
                "INSPECTION",
                "COMPLETED",
                "REJECTED",
                "CANCELLED",
            ],
            default: "SUBMITTED",
            index: true,
        },

        createdRoadId: { type: Schema.Types.ObjectId, ref: "road", default: null },

        photos: [{ type: String }],
        documents: [{ type: String }],
        remarks: [{ author: String, text: String, date: { type: Date, default: Date.now } }],
    },
    { timestamps: true }
);

roadProjectSchema.index({ location: "2dsphere" });

export const RoadProject = mongoose.model("roadProject", roadProjectSchema);
