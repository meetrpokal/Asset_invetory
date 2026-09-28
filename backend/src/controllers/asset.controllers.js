import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Asset } from "../models/asset.models.js";
import { AssetType } from "../models/assetType.models.js";
import { AssetHistory } from "../models/assetHistory.models.js";
import { Complaint } from "../models/complaint.models.js";
import { Maintenance } from "../models/maintenance.models.js";
import mongoose from "mongoose";

// Utility to generate Asset ID and Code if not provided
const generateAssetIdAndCode = async (assetType) => {
    const prefix = assetType
        ? assetType.toUpperCase().replace(/[^A-Z0-9]/g, "-").slice(0, 10)
        : "AST";
    const count = await Asset.countDocuments();
    const seq = (count + 1001).toString();
    const assetId = `AST-${seq}`;
    const assetCode = `${prefix}-${seq}`;
    return { assetId, assetCode };
};

// Seed default asset types if DB is empty
const seedInitialAssetTypes = async () => {
    const count = await AssetType.countDocuments();
    if (count === 0) {
        const initialTypes = [
            { name: "Road", code: "ROAD", description: "City roads, highways, and street pavements", defaultDepartmentCategory: "Road", icon: "road", slaHours: 72 },
            { name: "Bridge", code: "BRIDGE", description: "Bridges, flyovers, and pedestrian overpasses", defaultDepartmentCategory: "Road", icon: "bridge", slaHours: 72 },
            { name: "Street Light", code: "STREET_LIGHT", description: "Public street lighting and illumination poles", defaultDepartmentCategory: "Electricity", icon: "lightbulb", slaHours: 48 },
            { name: "Traffic Signal", code: "TRAFFIC_SIGNAL", description: "Traffic control lights, sensors, and gantries", defaultDepartmentCategory: "Traffic", icon: "traffic-cone", slaHours: 24 },
            { name: "Water Pipeline", code: "WATER_PIPE", description: "Main water supply pipelines, valves, and mains", defaultDepartmentCategory: "Water", icon: "droplet", slaHours: 24 },
            { name: "Drainage System", code: "DRAINAGE", description: "Stormwater drains, sewage lines, and manholes", defaultDepartmentCategory: "Drainage", icon: "waves", slaHours: 24 },
            { name: "CCTV Camera", code: "CCTV", description: "Surveillance and traffic monitoring cameras", defaultDepartmentCategory: "CCTV", icon: "camera", slaHours: 48 },
            { name: "Government Building", code: "GOVT_BLDG", description: "Municipal offices, public administrative buildings", defaultDepartmentCategory: "Public Building", icon: "building", slaHours: 72 },
            { name: "Electric Pole", code: "ELEC_POLE", description: "High-tension and low-tension electrical poles", defaultDepartmentCategory: "Electricity", icon: "zap", slaHours: 48 },
            { name: "Public Facility", code: "PUBLIC_FACILITY", description: "Public parks, bus stops, toilets, and plazas", defaultDepartmentCategory: "Public Building", icon: "users", slaHours: 48 },
        ];
        await AssetType.insertMany(initialTypes);
    }
};

// Seed on module load
seedInitialAssetTypes().catch((err) => console.error("Error seeding initial asset types:", err));

export const getAssetTypes = asyncHandler(async (req, res) => {
    const types = await AssetType.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
        success: true,
        data: types,
    });
});

export const createAssetType = asyncHandler(async (req, res) => {
    const { name, code, description, defaultDepartmentCategory, icon, slaHours } = req.body;
    if (!name || !code) {
        throw new ApiError(400, "Asset type name and code are required");
    }
    const existing = await AssetType.findOne({ $or: [{ name }, { code }] });
    if (existing) {
        throw new ApiError(409, "Asset type with this name or code already exists");
    }
    const assetType = await AssetType.create({
        name,
        code,
        description,
        defaultDepartmentCategory,
        icon,
        slaHours: slaHours || 48,
    });
    res.status(201).json({
        success: true,
        message: "Asset type created successfully",
        data: assetType,
    });
});

export const createAsset = asyncHandler(async (req, res) => {
    const {
        assetId: reqAssetId,
        assetCode: reqAssetCode,
        name,
        description,
        assetType,
        departmentId,
        responsibleAdminId,
        responsibleTechnicianId,
        location,
        address,
        city,
        state,
        area,
        status = "ACTIVE",
        health = "HEALTHY",
        criticality = "MEDIUM",
        purchaseDate,
        installationDate,
        warrantyStartDate,
        warrantyEndDate,
        vendor,
        purchaseCost,
        currentValue,
        images = [],
        documents = [],
        tags = [],
    } = req.body;

    if (!name || !assetType || !location) {
        throw new ApiError(400, "Name, assetType, and location are required fields");
    }

    if (!location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        throw new ApiError(400, "Location coordinates must be an array of [longitude, latitude]");
    }

    let assetId = reqAssetId;
    let assetCode = reqAssetCode;

    if (!assetId || !assetCode) {
        const auto = await generateAssetIdAndCode(assetType);
        assetId = assetId || auto.assetId;
        assetCode = assetCode || auto.assetCode;
    }

    const existingAsset = await Asset.findOne({ $or: [{ assetId }, { assetCode }] });
    if (existingAsset) {
        throw new ApiError(409, "An asset with this assetId or assetCode already exists");
    }

    const asset = await Asset.create({
        assetId,
        assetCode,
        name,
        description,
        assetType,
        departmentId: departmentId || null,
        responsibleAdminId: responsibleAdminId || null,
        responsibleTechnicianId: responsibleTechnicianId || null,
        location: {
            type: "Point",
            coordinates: [Number(location.coordinates[0]), Number(location.coordinates[1])],
        },
        address,
        city,
        state,
        area,
        status,
        health,
        criticality,
        purchaseDate,
        installationDate,
        warrantyStartDate,
        warrantyEndDate,
        vendor,
        purchaseCost,
        currentValue,
        images,
        documents,
        tags,
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
    });

    // Record initial AssetHistory
    await AssetHistory.create({
        assetId: asset._id,
        previousStatus: null,
        newStatus: status,
        action: "CREATED",
        reason: "Initial asset registration into inventory",
        performedBy: req.user?._id,
        department: departmentId || null,
        location: asset.location,
        notes: `Asset ${asset.assetCode} created.`,
    });

    res.status(201).json({
        success: true,
        message: "Infrastructure Asset created successfully",
        data: asset,
    });
});

export const getAllAssets = asyncHandler(async (req, res) => {
    const {
        search,
        assetType,
        departmentId,
        status,
        health,
        criticality,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = req.query;

    const query = {};

    // Department Access Control for Department Admins / Technicians
    if (req.user && req.user.role !== "SUPER_ADMIN" && req.user.role !== "admin") {
        if (req.user.department_id) {
            query.departmentId = req.user.department_id;
        }
    }

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { assetId: { $regex: search, $options: "i" } },
            { assetCode: { $regex: search, $options: "i" } },
            { address: { $regex: search, $options: "i" } },
            { area: { $regex: search, $options: "i" } },
        ];
    }

    if (assetType) query.assetType = assetType;
    if (departmentId) query.departmentId = departmentId;
    if (status) query.status = status;
    if (health) query.health = health;
    if (criticality) query.criticality = criticality;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [assets, total] = await Promise.all([
        Asset.find(query)
            .populate("departmentId", "name category")
            .populate("responsibleAdminId", "name email phone")
            .populate("responsibleTechnicianId", "name email phone")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Asset.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: assets,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});

export const getNearbyAssets = asyncHandler(async (req, res) => {
    const { latitude, longitude, maxDistance = 5000, assetType } = req.query;

    if (!latitude || !longitude) {
        throw new ApiError(400, "Latitude and longitude parameters are required");
    }

    const query = {
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: parseFloat(maxDistance),
            },
        },
    };

    if (assetType) {
        query.assetType = assetType;
    }

    const assets = await Asset.find(query)
        .populate("departmentId", "name category")
        .limit(25)
        .lean();

    res.status(200).json({
        success: true,
        count: assets.length,
        data: assets,
    });
});

export const getAssetById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { _id: id };
    } else {
        query = { $or: [{ assetId: id }, { assetCode: id }] };
    }

    const asset = await Asset.findOne(query)
        .populate("departmentId", "name category contact_email contact_phone")
        .populate("responsibleAdminId", "name email phone profileImage")
        .populate("responsibleTechnicianId", "name email phone profileImage")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean();

    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    // Fetch related complaints, maintenance records, and history
    const [complaints, maintenanceRecords, history] = await Promise.all([
        Complaint.find({ assetId: asset._id })
            .populate("user_id", "name email profileImage")
            .populate("assigned_officer_id", "name email")
            .sort({ createdAt: -1 })
            .lean(),
        Maintenance.find({ assetId: asset._id })
            .populate("technicianId", "name email phone")
            .sort({ startDate: -1 })
            .lean(),
        AssetHistory.find({ assetId: asset._id })
            .populate("performedBy", "name email role")
            .populate("department", "name category")
            .sort({ timestamp: -1 })
            .lean(),
    ]);

    res.status(200).json({
        success: true,
        data: {
            ...asset,
            complaints,
            maintenanceRecords,
            history,
        },
    });
});

export const updateAsset = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body, updatedBy: req.user?._id };

    const asset = await Asset.findById(id);
    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    const prevStatus = asset.status;
    const prevHealth = asset.health;

    Object.assign(asset, updates);
    await asset.save();

    // Log history if status or health changed
    if (updates.status && updates.status !== prevStatus) {
        await AssetHistory.create({
            assetId: asset._id,
            previousStatus: prevStatus,
            newStatus: asset.status,
            action: "STATUS_CHANGE",
            reason: updates.reason || "Asset status updated",
            performedBy: req.user?._id,
            department: asset.departmentId,
            notes: `Status changed from ${prevStatus} to ${asset.status}`,
        });
    } else if (updates.health && updates.health !== prevHealth) {
        await AssetHistory.create({
            assetId: asset._id,
            previousStatus: asset.status,
            newStatus: asset.status,
            action: "HEALTH_UPDATE",
            reason: updates.reason || "Asset health condition updated",
            performedBy: req.user?._id,
            department: asset.departmentId,
            notes: `Health condition changed from ${prevHealth} to ${asset.health}`,
        });
    }

    res.status(200).json({
        success: true,
        message: "Asset updated successfully",
        data: asset,
    });
});

export const updateAssetLifecycle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newStatus, reason, notes, departmentId, health } = req.body;

    if (!newStatus) {
        throw new ApiError(400, "newStatus parameter is required");
    }

    const asset = await Asset.findById(id);
    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    const prevStatus = asset.status;
    asset.status = newStatus;
    if (health) asset.health = health;
    if (departmentId) asset.departmentId = departmentId;
    asset.updatedBy = req.user?._id;

    await asset.save();

    const historyRecord = await AssetHistory.create({
        assetId: asset._id,
        previousStatus: prevStatus,
        newStatus: newStatus,
        action: newStatus === "MAINTENANCE" ? "MAINTENANCE_SCHEDULED" : "STATUS_CHANGE",
        reason: reason || `Lifecycle transition to ${newStatus}`,
        performedBy: req.user?._id,
        department: departmentId || asset.departmentId,
        notes: notes || `Asset status set to ${newStatus}`,
    });

    res.status(200).json({
        success: true,
        message: `Asset status transitioned to ${newStatus}`,
        data: {
            asset,
            historyRecord,
        },
    });
});

export const deleteAsset = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const asset = await Asset.findById(id);

    if (!asset) {
        throw new ApiError(404, "Asset not found");
    }

    asset.status = "DISPOSED";
    asset.updatedBy = req.user?._id;
    await asset.save();

    await AssetHistory.create({
        assetId: asset._id,
        previousStatus: asset.status,
        newStatus: "DISPOSED",
        action: "DISPOSED",
        reason: "Asset disposed / retired from inventory",
        performedBy: req.user?._id,
    });

    res.status(200).json({
        success: true,
        message: "Asset marked as DISPOSED",
    });
});
