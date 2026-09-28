import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Budget } from "../models/budget.models.js";
import { RoadProject } from "../models/roadProject.models.js";
import { AuditLog } from "../models/auditLog.models.js";

export const getAnnualBudget = asyncHandler(async (req, res) => {
    const { financialYear = "2026-2027" } = req.query;

    let budget = await Budget.findOne({ financialYear })
        .populate("allocations.roadProjectId", "proposalId name length estimatedConstructionCost")
        .populate("allocations.roadId", "roadId roadCode name condition")
        .populate("allocations.approvedBy", "name email role")
        .lean();

    if (!budget) {
        // Seed default annual budget for 2026-2027 if none exists
        budget = await Budget.create({
            financialYear: "2026-2027",
            totalAllocatedBudget: 1000000000, // ₹100 Crore
            newConstructionBudget: 600000000, // ₹60 Crore
            maintenanceBudget: 350000000, // ₹35 Crore
            emergencyReserve: 50000000, // ₹5 Crore
            createdBy: req.user?._id,
        });
    }

    // Formulas:
    const remainingNewConstruction = budget.newConstructionBudget - budget.spentNewConstruction;
    const remainingMaintenance = budget.maintenanceBudget - budget.spentMaintenance;
    const remainingEmergency = budget.emergencyReserve - budget.spentEmergency;
    const totalRemaining =
        budget.totalAllocatedBudget -
        (budget.spentNewConstruction + budget.spentMaintenance + budget.spentEmergency);

    res.status(200).json({
        success: true,
        data: {
            ...budget,
            metrics: {
                remainingNewConstruction,
                remainingMaintenance,
                remainingEmergency,
                totalRemaining,
            },
        },
    });
});

export const allocateBudget = asyncHandler(async (req, res) => {
    const { financialYear = "2026-2027", roadProjectId, roadId, type, requestedAmount, approvedAmount, notes } =
        req.body;

    if (!type || !approvedAmount) {
        throw new ApiError(400, "Budget allocation type and approvedAmount are required");
    }

    let budget = await Budget.findOne({ financialYear });
    if (!budget) {
        budget = await Budget.create({ financialYear });
    }

    // Budget constraint check
    let currentCategorySpent = 0;
    let categoryLimit = 0;

    if (type === "NEW_CONSTRUCTION") {
        currentCategorySpent = budget.spentNewConstruction;
        categoryLimit = budget.newConstructionBudget;
    } else if (type === "MAINTENANCE") {
        currentCategorySpent = budget.spentMaintenance;
        categoryLimit = budget.maintenanceBudget;
    } else {
        currentCategorySpent = budget.spentEmergency;
        categoryLimit = budget.emergencyReserve;
    }

    if (currentCategorySpent + approvedAmount > categoryLimit && req.user?.role !== "SUPER_ADMIN") {
        throw new ApiError(
            400,
            `Allocation of ₹${approvedAmount} exceeds available ${type} budget. Require explicit SUPER_ADMIN approval.`
        );
    }

    budget.allocations.push({
        roadProjectId: roadProjectId || null,
        roadId: roadId || null,
        type,
        requestedAmount: requestedAmount || approvedAmount,
        approvedAmount,
        allocatedAmount: approvedAmount,
        spentAmount: approvedAmount,
        approvedBy: req.user?._id,
        approvalDate: new Date(),
        status: "APPROVED",
        notes: notes || "",
    });

    if (type === "NEW_CONSTRUCTION") budget.spentNewConstruction += approvedAmount;
    else if (type === "MAINTENANCE") budget.spentMaintenance += approvedAmount;
    else budget.spentEmergency += approvedAmount;

    await budget.save();

    // If allocated to a RoadProject, update project status to BUDGET_APPROVED
    if (roadProjectId) {
        const project = await RoadProject.findById(roadProjectId);
        if (project) {
            project.status = "BUDGET_APPROVED";
            await project.save();
        }
    }

    await AuditLog.create({
        user: req.user?._id,
        action: "BUDGET_ALLOCATED",
        entity: "Budget",
        entityId: budget._id.toString(),
        newValue: { type, approvedAmount, roadProjectId, roadId },
    });

    res.status(200).json({
        success: true,
        message: `₹${approvedAmount.toLocaleString()} allocated successfully for ${type}`,
        data: budget,
    });
});
