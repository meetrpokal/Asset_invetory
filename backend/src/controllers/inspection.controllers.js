import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Inspection } from "../models/inspection.models.js";
import { Road } from "../models/road.models.js";
import { RoadProject } from "../models/roadProject.models.js";
import { Contractor } from "../models/contractor.models.js";
import { RoadLifecycleHistory } from "../models/roadHistory.models.js";

const generateInspectionId = async () => {
    const count = await Inspection.countDocuments();
    return `INSP-${count + 801}`;
};

export const createInspection = asyncHandler(async (req, res) => {
    const {
        roadId,
        roadProjectId,
        maintenanceId,
        inspectionType,
        roadCondition = "GOOD",
        materialQuality = "SATISFACTORY",
        surfaceQuality = "SMOOTH",
        roadThickness = 0,
        roadWidth = 0,
        drainageCondition = "FUNCTIONAL",
        cracksObserved = false,
        potholesObserved = false,
        safetyIssues = "",
        constructionQuality = "",
        photos = [],
        documents = [],
        remarks,
        result = "PASSED",
        reinspectionOfId,
    } = req.body;

    if (!inspectionType || !remarks) {
        throw new ApiError(400, "Inspection type and remarks are required");
    }

    const inspectionId = await generateInspectionId();

    const inspection = await Inspection.create({
        inspectionId,
        roadId: roadId || null,
        roadProjectId: roadProjectId || null,
        maintenanceId: maintenanceId || null,
        officerId: req.user?._id,
        inspectionDate: new Date(),
        inspectionType,
        roadCondition,
        materialQuality,
        surfaceQuality,
        roadThickness,
        roadWidth,
        drainageCondition,
        cracksObserved,
        potholesObserved,
        safetyIssues,
        constructionQuality,
        photos,
        documents,
        remarks,
        result,
        reinspectionOfId: reinspectionOfId || null,
    });

    // Update Road or RoadProject state
    if (roadId) {
        const road = await Road.findById(roadId);
        if (road) {
            road.lastInspectionDate = new Date();
            road.condition = roadCondition;
            if (result === "FAILED" || result === "REQUIRES_CORRECTION") {
                road.healthStatus = "WARNING";
            } else if (result === "PASSED") {
                road.healthStatus = "HEALTHY";
            }
            await road.save();

            // Track inspection failure for contractor if applicable
            if (result === "FAILED" && road.contractorId) {
                await Contractor.updateOne({ _id: road.contractorId }, { $inc: { inspectionFailures: 1 } });
            }
        }
    }

    if (roadProjectId) {
        const project = await RoadProject.findById(roadProjectId);
        if (project) {
            if (inspectionType === "Final construction inspection" && result === "PASSED") {
                project.status = "INSPECTION";
                await project.save();
            } else if (result === "FAILED" && project.contractorId) {
                await Contractor.updateOne({ _id: project.contractorId }, { $inc: { inspectionFailures: 1 } });
            }
        }
    }

    // Log in History
    await RoadLifecycleHistory.create({
        roadId: roadId || null,
        roadProjectId: roadProjectId || null,
        eventType: result === "PASSED" ? "INSPECTION_PASSED" : "INSPECTION_FAILED",
        performedBy: req.user?._id,
        description: `[${inspectionType}] Result: ${result}. ${remarks}`,
        photos,
        documents,
    });

    res.status(201).json({
        success: true,
        message: `Inspection record ${inspectionId} created with result: ${result}`,
        data: inspection,
    });
});

export const getAllInspections = asyncHandler(async (req, res) => {
    const { roadId, roadProjectId, result, type } = req.query;

    const query = {};
    if (roadId) query.roadId = roadId;
    if (roadProjectId) query.roadProjectId = roadProjectId;
    if (result) query.result = result;
    if (type) query.inspectionType = type;

    const inspections = await Inspection.find(query)
        .populate("officerId", "name email phone role")
        .populate("roadId", "roadId roadCode name condition")
        .populate("roadProjectId", "proposalId name")
        .sort({ inspectionDate: -1 })
        .lean();

    res.status(200).json({
        success: true,
        data: inspections,
    });
});
