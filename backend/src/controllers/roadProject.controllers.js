import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { RoadProject } from "../models/roadProject.models.js";
import { Road } from "../models/road.models.js";
import { RoadLifecycleHistory } from "../models/roadHistory.models.js";
import { AuditLog } from "../models/auditLog.models.js";
import mongoose from "mongoose";

const generateProposalId = async () => {
    const year = new Date().getFullYear();
    const count = await RoadProject.countDocuments();
    return `PROP-${year}-${(count + 101).toString()}`;
};

export const createRoadProject = asyncHandler(async (req, res) => {
    const {
        name,
        startLocation,
        endLocation,
        location,
        area,
        ward,
        city = "Surat",
        state = "Gujarat",
        length = 1.0,
        width = 10.0,
        lanes = 2,
        expectedTraffic,
        estimatedPopulationServed,
        reasonForConstruction,
        priority = "MEDIUM",
        proposedStartDate,
        expectedCompletionDate,
        estimatedConstructionCost = 0,
        materials = [],
        costBreakdown = {},
        landRequirementDescription = "",
        departmentId,
    } = req.body;

    if (!name || !reasonForConstruction || !location || !location.coordinates) {
        throw new ApiError(400, "Road proposal name, reason, and location coordinates are required");
    }

    const proposalId = await generateProposalId();

    const project = await RoadProject.create({
        proposalId,
        name,
        startLocation: startLocation || { name: "", coordinates: location.coordinates },
        endLocation: endLocation || { name: "", coordinates: location.coordinates },
        location: {
            type: "Point",
            coordinates: [Number(location.coordinates[0]), Number(location.coordinates[1])],
        },
        area,
        ward,
        city,
        state,
        length,
        width,
        lanes,
        expectedTraffic,
        estimatedPopulationServed,
        reasonForConstruction,
        priority,
        proposedStartDate,
        expectedCompletionDate,
        estimatedConstructionCost,
        materials,
        costBreakdown,
        landRequirementDescription,
        departmentId: departmentId || null,
        proposedBy: req.user?._id,
        status: "SUBMITTED",
    });

    // Record Lifecycle History
    await RoadLifecycleHistory.create({
        roadProjectId: project._id,
        eventType: "PROPOSAL_CREATED",
        performedBy: req.user?._id,
        description: `New road proposal ${proposalId} submitted for ${name} (${length} km).`,
        relatedCost: estimatedConstructionCost,
        newStatus: "SUBMITTED",
    });

    res.status(201).json({
        success: true,
        message: "New Road Proposal created successfully",
        data: project,
    });
});

export const getAllRoadProjects = asyncHandler(async (req, res) => {
    const { search, status, priority, stage, page = 1, limit = 20 } = req.query;

    const query = {};
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { proposalId: { $regex: search, $options: "i" } },
            { area: { $regex: search, $options: "i" } },
        ];
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (stage) query.constructionStage = stage;

    const skip = (Number(page) - 1) * Number(limit);

    const [projects, total] = await Promise.all([
        RoadProject.find(query)
            .populate("departmentId", "name category")
            .populate("proposedBy", "name email phone")
            .populate("contractorId", "companyName contactPerson email phone")
            .populate("inspectionOfficerId", "name email phone")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        RoadProject.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: projects,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});

export const getRoadProjectById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await RoadProject.findById(id)
        .populate("departmentId", "name category contact_email contact_phone")
        .populate("proposedBy", "name email phone")
        .populate("siteEngineerId", "name email phone")
        .populate("inspectionOfficerId", "name email phone")
        .populate("contractorId")
        .populate("createdRoadId")
        .lean();

    if (!project) {
        throw new ApiError(404, "Road Project Proposal not found");
    }

    const history = await RoadLifecycleHistory.find({ roadProjectId: project._id })
        .populate("performedBy", "name email role")
        .sort({ date: -1 })
        .lean();

    res.status(200).json({
        success: true,
        data: {
            ...project,
            history,
        },
    });
});

export const updateMaterialsAndCosts = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { materials, costBreakdown, estimatedConstructionCost } = req.body;

    const project = await RoadProject.findById(id);
    if (!project) {
        throw new ApiError(404, "Road Project not found");
    }

    if (materials) project.materials = materials;
    if (costBreakdown) project.costBreakdown = costBreakdown;
    if (estimatedConstructionCost !== undefined)
        project.estimatedConstructionCost = estimatedConstructionCost;

    await project.save();

    await RoadLifecycleHistory.create({
        roadProjectId: project._id,
        eventType: "MATERIAL_PLANNED",
        performedBy: req.user?._id,
        description: `Material planning and cost estimates updated. Total: ₹${project.estimatedConstructionCost}`,
        relatedCost: project.estimatedConstructionCost,
    });

    res.status(200).json({
        success: true,
        message: "Material plan and cost breakdown updated",
        data: project,
    });
});

export const updateConstructionProgress = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { constructionStage, progressPercentage, remarks, actualCost } = req.body;

    const project = await RoadProject.findById(id);
    if (!project) {
        throw new ApiError(404, "Road Project not found");
    }

    const prevStage = project.constructionStage;
    if (constructionStage) project.constructionStage = constructionStage;
    if (progressPercentage !== undefined) project.progressPercentage = progressPercentage;
    if (actualCost !== undefined) project.actualConstructionCost = actualCost;

    if (remarks) {
        project.remarks.push({
            author: req.user?.name || "Site Engineer",
            text: remarks,
            date: new Date(),
        });
    }

    await project.save();

    await RoadLifecycleHistory.create({
        roadProjectId: project._id,
        eventType: "STAGE_COMPLETED",
        performedBy: req.user?._id,
        description: `Construction stage updated to ${project.constructionStage} (${project.progressPercentage}%). Notes: ${remarks || ""}`,
    });

    res.status(200).json({
        success: true,
        message: "Construction progress updated successfully",
        data: project,
    });
});

export const updateProjectStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const project = await RoadProject.findById(id);
    if (!project) {
        throw new ApiError(404, "Road Project not found");
    }

    const prevStatus = project.status;
    project.status = status;
    await project.save();

    await RoadLifecycleHistory.create({
        roadProjectId: project._id,
        eventType: status === "APPROVED" ? "FEASIBILITY_PASSED" : "PROPOSAL_CREATED",
        performedBy: req.user?._id,
        description: `Road proposal status changed from ${prevStatus} to ${status}. ${remarks || ""}`,
        previousStatus: prevStatus,
        newStatus: status,
    });

    res.status(200).json({
        success: true,
        message: `Road proposal status updated to ${status}`,
        data: project,
    });
});

// Convert completed road project into an active Road Asset (Requirement 12 & Demo Flow)
export const convertProjectToRoadAsset = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const project = await RoadProject.findById(id);
    if (!project) {
        throw new ApiError(404, "Road Project not found");
    }

    if (project.createdRoadId) {
        const existingRoad = await Road.findById(project.createdRoadId);
        return res.status(200).json({
            success: true,
            message: "Road Asset already created for this project",
            data: existingRoad,
        });
    }

    const count = await Road.countDocuments();
    const seq = (count + 1024).toString();

    const road = await Road.create({
        roadId: `RD-${seq}`,
        roadCode: `ROAD-SURAT-${seq}`,
        name: project.name,
        description: project.reasonForConstruction,
        startLocation: project.startLocation,
        endLocation: project.endLocation,
        location: project.location,
        length: project.length,
        width: project.width,
        lanes: project.lanes,
        area: project.area,
        ward: project.ward,
        city: project.city,
        state: project.state,
        departmentId: project.departmentId,
        constructionProjectId: project._id,
        contractorId: project.contractorId,
        inspectionOfficerId: project.inspectionOfficerId,
        constructionStartDate: project.proposedStartDate || new Date(),
        constructionEndDate: new Date(),
        constructionCost: project.actualConstructionCost || project.estimatedConstructionCost,
        currentValue: project.actualConstructionCost || project.estimatedConstructionCost,
        condition: "GOOD",
        healthStatus: "HEALTHY",
        status: "ACTIVE",
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
    });

    project.status = "COMPLETED";
    project.createdRoadId = road._id;
    project.actualCompletionDate = new Date();
    await project.save();

    await RoadLifecycleHistory.create({
        roadId: road._id,
        roadProjectId: project._id,
        eventType: "ROAD_ACTIVATED",
        performedBy: req.user?._id,
        description: `Project ${project.proposalId} completed & converted into active Road Asset ${road.roadCode}.`,
        relatedCost: road.constructionCost,
        newStatus: "ACTIVE",
    });

    res.status(201).json({
        success: true,
        message: "Road Project successfully converted into Active Road Asset!",
        data: road,
    });
});
