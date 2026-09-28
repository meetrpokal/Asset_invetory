import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Maintenance } from "../models/maintenance.models.js";
import { Asset } from "../models/asset.models.js";
import { AssetHistory } from "../models/assetHistory.models.js";
import mongoose from "mongoose";

const generateMaintenanceId = async () => {
    const count = await Maintenance.countDocuments();
    return `MNT-${count + 201}`;
};

export const createMaintenance = asyncHandler(async (req, res) => {
    const {
        assetId,
        complaintId,
        technicianId,
        description,
        type = "Corrective",
        status = "SCHEDULED",
        startDate,
        completionDate,
        nextMaintenanceDate,
        maintenanceFrequency = "None",
        cost = 0,
        notes = "",
        images = [],
        documents = [],
    } = req.body;

    if (!assetId || !description) {
        throw new ApiError(400, "Asset ID and description are required");
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
        throw new ApiError(404, "Target asset not found");
    }

    const maintenanceId = await generateMaintenanceId();

    const maintenance = await Maintenance.create({
        maintenanceId,
        assetId,
        complaintId: complaintId || null,
        technicianId: technicianId || asset.responsibleTechnicianId || null,
        description,
        type,
        status,
        startDate: startDate || new Date(),
        completionDate,
        nextMaintenanceDate,
        maintenanceFrequency,
        cost,
        notes,
        images,
        documents,
        createdBy: req.user?._id,
    });

    // Update Asset status to MAINTENANCE if active or scheduled
    if (status === "SCHEDULED" || status === "IN_PROGRESS") {
        const prevStatus = asset.status;
        asset.status = "MAINTENANCE";
        asset.updatedBy = req.user?._id;
        await asset.save();

        await AssetHistory.create({
            assetId: asset._id,
            previousStatus: prevStatus,
            newStatus: "MAINTENANCE",
            action: "MAINTENANCE_SCHEDULED",
            reason: `Maintenance record ${maintenanceId} initiated (${type})`,
            performedBy: req.user?._id,
            department: asset.departmentId,
            notes: description,
        });
    }

    res.status(201).json({
        success: true,
        message: "Maintenance record created successfully",
        data: maintenance,
    });
});

export const getAllMaintenance = asyncHandler(async (req, res) => {
    const {
        assetId,
        technicianId,
        type,
        status,
        page = 1,
        limit = 20,
    } = req.query;

    const query = {};
    if (assetId) query.assetId = assetId;
    if (technicianId) query.technicianId = technicianId;
    if (type) query.type = type;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [records, total] = await Promise.all([
        Maintenance.find(query)
            .populate({
                path: "assetId",
                select: "assetId assetCode name assetType status health location address departmentId",
                populate: { path: "departmentId", select: "name category" },
            })
            .populate("technicianId", "name email phone")
            .populate("complaintId", "title status priority")
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Maintenance.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: records,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});

export const getPreventiveDashboard = asyncHandler(async (req, res) => {
    const now = new Date();
    const nextSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [overdue, dueSoon, inProgress, totalCount] = await Promise.all([
        Maintenance.find({
            status: "SCHEDULED",
            startDate: { $lt: now },
        })
            .populate("assetId", "assetId assetCode name assetType location address")
            .populate("technicianId", "name email")
            .lean(),
        Maintenance.find({
            status: "SCHEDULED",
            startDate: { $gte: now, $lte: nextSevenDays },
        })
            .populate("assetId", "assetId assetCode name assetType location address")
            .populate("technicianId", "name email")
            .lean(),
        Maintenance.find({ status: "IN_PROGRESS" })
            .populate("assetId", "assetId assetCode name assetType location address")
            .populate("technicianId", "name email")
            .lean(),
        Maintenance.countDocuments(),
    ]);

    res.status(200).json({
        success: true,
        data: {
            metrics: {
                totalCount,
                overdueCount: overdue.length,
                dueSoonCount: dueSoon.length,
                inProgressCount: inProgress.length,
            },
            overdue,
            dueSoon,
            inProgress,
        },
    });
});

export const updateMaintenance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        status,
        cost,
        notes,
        images,
        documents,
        completionDate,
        assetHealth = "HEALTHY",
    } = req.body;

    const maintenance = await Maintenance.findById(id);
    if (!maintenance) {
        throw new ApiError(404, "Maintenance record not found");
    }

    if (status) maintenance.status = status;
    if (cost !== undefined) maintenance.cost = cost;
    if (notes) maintenance.notes = notes;
    if (images) maintenance.images = images;
    if (documents) maintenance.documents = documents;

    if (status === "COMPLETED") {
        maintenance.completionDate = completionDate || new Date();

        // Update target asset status to ACTIVE and update health condition
        const asset = await Asset.findById(maintenance.assetId);
        if (asset) {
            const prevStatus = asset.status;
            asset.status = "ACTIVE";
            asset.health = assetHealth;
            asset.updatedBy = req.user?._id;
            await asset.save();

            await AssetHistory.create({
                assetId: asset._id,
                previousStatus: prevStatus,
                newStatus: "ACTIVE",
                action: "MAINTENANCE_COMPLETED",
                reason: `Maintenance ${maintenance.maintenanceId} completed`,
                performedBy: req.user?._id,
                department: asset.departmentId,
                notes: `Asset health set to ${assetHealth}. Repair details: ${notes || "Completed"}`,
            });
        }
    }

    await maintenance.save();

    res.status(200).json({
        success: true,
        message: "Maintenance record updated successfully",
        data: maintenance,
    });
});
