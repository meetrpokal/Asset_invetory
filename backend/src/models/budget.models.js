import mongoose, { Schema } from "mongoose";

const budgetAllocationSchema = new Schema({
    roadProjectId: { type: Schema.Types.ObjectId, ref: "roadProject", default: null },
    roadId: { type: Schema.Types.ObjectId, ref: "road", default: null },
    type: {
        type: String,
        enum: ["NEW_CONSTRUCTION", "MAINTENANCE", "EMERGENCY"],
        required: true,
    },
    requestedAmount: { type: Number, required: true },
    approvedAmount: { type: Number, required: true },
    allocatedAmount: { type: Number, required: true },
    spentAmount: { type: Number, default: 0 },
    approvedBy: { type: Schema.Types.ObjectId, ref: "user" },
    approvalDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "APPROVED",
    },
    notes: { type: String, default: "" },
});

const budgetSchema = new Schema(
    {
        financialYear: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
        },
        totalAllocatedBudget: { type: Number, required: true, default: 1000000000 }, // ₹100 Crore
        newConstructionBudget: { type: Number, required: true, default: 600000000 }, // ₹60 Crore
        maintenanceBudget: { type: Number, required: true, default: 350000000 }, // ₹35 Crore
        emergencyReserve: { type: Number, required: true, default: 50000000 }, // ₹5 Crore

        // Maintenance specific sub-allocations
        maintenanceBreakdown: {
            routineMaintenance: { type: Number, default: 100000000 }, // ₹10 Cr
            majorRepair: { type: Number, default: 150000000 }, // ₹15 Cr
            resurfacing: { type: Number, default: 70000000 }, // ₹7 Cr
            emergencyRepair: { type: Number, default: 30000000 }, // ₹3 Cr
        },

        spentNewConstruction: { type: Number, default: 0 },
        spentMaintenance: { type: Number, default: 0 },
        spentEmergency: { type: Number, default: 0 },

        stateBudgets: [
            {
                stateCode: { type: String, required: true },
                stateName: { type: String, required: true },
                totalBudgetCr: { type: Number, required: true },
                newConstructionCr: { type: Number, required: true },
                maintenanceCr: { type: Number, required: true },
                highwayLengthKm: { type: Number, default: 0 },
                activeProjectsCount: { type: Number, default: 0 },
                latitude: { type: Number, required: true },
                longitude: { type: Number, required: true }
            }
        ],

        allocations: [budgetAllocationSchema],
        createdBy: { type: Schema.Types.ObjectId, ref: "user" },
    },
    { timestamps: true }
);

export const Budget = mongoose.model("budget", budgetSchema);
