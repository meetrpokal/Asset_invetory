import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Budget } from "../models/budget.models.js";
import { RoadProject } from "../models/roadProject.models.js";
import { AuditLog } from "../models/auditLog.models.js";
import { INDIAN_STATE_ROAD_BUDGETS } from "../constants/indianStateBudgets.js";

export const getAnnualBudget = asyncHandler(async (req, res) => {
    const { financialYear = "2026-2027" } = req.query;

    let budget = await Budget.findOne({ financialYear })
        .populate("allocations.roadProjectId", "proposalId name length estimatedConstructionCost")
        .populate("allocations.roadId", "roadId roadCode name condition")
        .populate("allocations.approvedBy", "name email role")
        .lean();

    // If budget document doesn't exist, create it with complete initial budget and state breakdown
    if (!budget) {
        const createdDoc = await Budget.create({
            financialYear: "2026-2027",
            totalAllocatedBudget: 3568000000000, // ₹3,56,800 Crore
            newConstructionBudget: 2200000000000, // ₹2,20,000 Crore
            maintenanceBudget: 1200000000000, // ₹1,20,000 Crore
            emergencyReserve: 168000000000, // ₹16,800 Crore
            spentNewConstruction: 45000000000, // ₹4,500 Crore
            spentMaintenance: 22000000000, // ₹2,200 Crore
            spentEmergency: 5000000000, // ₹500 Crore
            stateBudgets: INDIAN_STATE_ROAD_BUDGETS,
            createdBy: req.user?._id,
        });
        budget = createdDoc.toObject();
    }

    // Always ensure stateBudgets is present in response
    if (!budget.stateBudgets || budget.stateBudgets.length === 0) {
        budget.stateBudgets = INDIAN_STATE_ROAD_BUDGETS;
    }

    const spentNew = budget.spentNewConstruction || 0;
    const spentMaint = budget.spentMaintenance || 0;
    const spentEmerg = budget.spentEmergency || 0;

    const totalAllocated = budget.totalAllocatedBudget || 3568000000000;
    const newConst = budget.newConstructionBudget || 2200000000000;
    const maint = budget.maintenanceBudget || 1200000000000;
    const emergency = budget.emergencyReserve || 168000000000;

    const remainingNewConstruction = newConst - spentNew;
    const remainingMaintenance = maint - spentMaint;
    const remainingEmergency = emergency - spentEmerg;
    const totalRemaining = totalAllocated - (spentNew + spentMaint + spentEmerg);

    res.status(200).json({
        success: true,
        data: {
            ...budget,
            totalAllocatedBudget: totalAllocated,
            newConstructionBudget: newConst,
            maintenanceBudget: maint,
            emergencyReserve: emergency,
            spentNewConstruction: spentNew,
            spentMaintenance: spentMaint,
            spentEmergency: spentEmerg,
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
        budget = await Budget.create({ financialYear, stateBudgets: INDIAN_STATE_ROAD_BUDGETS });
    }

    let currentCategorySpent = 0;
    let categoryLimit = 0;

    if (type === "NEW_CONSTRUCTION") {
        currentCategorySpent = budget.spentNewConstruction || 0;
        categoryLimit = budget.newConstructionBudget || 2200000000000;
    } else if (type === "MAINTENANCE") {
        currentCategorySpent = budget.spentMaintenance || 0;
        categoryLimit = budget.maintenanceBudget || 1200000000000;
    } else {
        currentCategorySpent = budget.spentEmergency || 0;
        categoryLimit = budget.emergencyReserve || 168000000000;
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

    if (type === "NEW_CONSTRUCTION") budget.spentNewConstruction = (budget.spentNewConstruction || 0) + approvedAmount;
    else if (type === "MAINTENANCE") budget.spentMaintenance = (budget.spentMaintenance || 0) + approvedAmount;
    else budget.spentEmergency = (budget.spentEmergency || 0) + approvedAmount;

    await budget.save();

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
