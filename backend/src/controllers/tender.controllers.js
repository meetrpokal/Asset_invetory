import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Tender } from "../models/tender.models.js";
import { RoadProject } from "../models/roadProject.models.js";
import { Contract } from "../models/contract.models.js";
import { Contractor } from "../models/contractor.models.js";
import { AuditLog } from "../models/auditLog.models.js";

const generateTenderId = async () => {
    const year = new Date().getFullYear();
    const count = await Tender.countDocuments();
    return `TND-${year}-${(count + 101).toString()}`;
};

export const createTender = asyncHandler(async (req, res) => {
    const {
        roadProjectId,
        title,
        estimatedCost,
        submissionDeadline,
        contractDurationMonths = 12,
        technicalRequirements = "",
        financialRequirements = "",
        requiredExperienceYears = 3,
        requiredDocuments = [],
    } = req.body;

    if (!roadProjectId || !title || !submissionDeadline) {
        throw new ApiError(400, "Road project ID, tender title, and submission deadline are required");
    }

    const project = await RoadProject.findById(roadProjectId);
    if (!project) {
        throw new ApiError(404, "Road Project not found");
    }

    const tenderId = await generateTenderId();

    const tender = await Tender.create({
        tenderId,
        roadProjectId,
        title,
        estimatedCost: estimatedCost || project.estimatedConstructionCost,
        tenderAmount: estimatedCost || project.estimatedConstructionCost,
        submissionDeadline,
        contractDurationMonths,
        technicalRequirements,
        financialRequirements,
        requiredExperienceYears,
        requiredDocuments,
        status: "PUBLISHED",
        activityLog: [
            {
                action: "TENDER_PUBLISHED",
                performedBy: req.user?._id,
                notes: `Tender ${tenderId} published for project ${project.proposalId}.`,
            },
        ],
    });

    project.status = "TENDERED";
    await project.save();

    res.status(201).json({
        success: true,
        message: "Tender published successfully",
        data: tender,
    });
});

export const getAllTenders = asyncHandler(async (req, res) => {
    const { roadProjectId, status } = req.query;

    const query = {};
    if (roadProjectId) query.roadProjectId = roadProjectId;
    if (status) query.status = status;

    const tenders = await Tender.find(query)
        .populate("roadProjectId", "proposalId name length estimatedConstructionCost")
        .populate("bids.contractorId", "companyName registrationNumber contactPerson phone email")
        .populate("awardedContractorId")
        .sort({ publicationDate: -1 })
        .lean();

    res.status(200).json({
        success: true,
        data: tenders,
    });
});

export const submitContractorBid = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { contractorId, bidAmount, proposalDocument, remarks } = req.body;

    if (!contractorId || !bidAmount) {
        throw new ApiError(400, "Contractor ID and bid amount are required");
    }

    const tender = await Tender.findById(id);
    if (!tender) {
        throw new ApiError(404, "Tender not found");
    }

    if (tender.status !== "PUBLISHED") {
        throw new ApiError(400, "Tender is not open for bidding");
    }

    // Check if contractor already submitted a bid
    const existingBidIndex = tender.bids.findIndex(
        (b) => b.contractorId.toString() === contractorId.toString()
    );

    if (existingBidIndex >= 0) {
        tender.bids[existingBidIndex].bidAmount = bidAmount;
        tender.bids[existingBidIndex].proposalDocument = proposalDocument || tender.bids[existingBidIndex].proposalDocument;
        tender.bids[existingBidIndex].remarks = remarks || tender.bids[existingBidIndex].remarks;
    } else {
        tender.bids.push({
            contractorId,
            bidAmount,
            proposalDocument,
            submissionDate: new Date(),
            status: "SUBMITTED",
            remarks,
        });
    }

    await tender.save();

    res.status(200).json({
        success: true,
        message: "Contractor bid submitted successfully",
        data: tender,
    });
});

// Select Contractor (Requirement 7: Officers record evaluation result and approve final contractor)
export const awardTenderToContractor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { contractorId, finalContractAmount, remarks } = req.body;

    if (!contractorId) {
        throw new ApiError(400, "Selected contractorId is required");
    }

    const tender = await Tender.findById(id);
    if (!tender) {
        throw new ApiError(404, "Tender not found");
    }

    const contractor = await Contractor.findById(contractorId);
    if (!contractor) {
        throw new ApiError(404, "Contractor not found");
    }

    tender.awardedContractorId = contractorId;
    tender.status = "AWARDED";
    tender.activityLog.push({
        action: "CONTRACTOR_AWARDED",
        performedBy: req.user?._id,
        notes: `Tender awarded to ${contractor.companyName} for amount ₹${finalContractAmount || tender.estimatedCost}`,
    });

    // Update bids statuses
    tender.bids.forEach((bid) => {
        if (bid.contractorId.toString() === contractorId.toString()) {
            bid.status = "SELECTED";
        } else {
            bid.status = "REJECTED";
        }
    });

    await tender.save();

    // Update RoadProject
    const project = await RoadProject.findById(tender.roadProjectId);
    if (project) {
        project.contractorId = contractorId;
        project.status = "CONTRACTOR_SELECTED";
        await project.save();
    }

    // Create Contract
    const count = await Contract.countDocuments();
    const contract = await Contract.create({
        contractId: `CNT-${new Date().getFullYear()}-${count + 101}`,
        roadProjectId: tender.roadProjectId,
        tenderId: tender._id,
        contractorId,
        contractAmount: finalContractAmount || tender.estimatedCost,
        startDate: new Date(),
        expectedCompletionDate: new Date(Date.now() + tender.contractDurationMonths * 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
    });

    // Update Contractor stats
    contractor.totalProjects += 1;
    await contractor.save();

    await AuditLog.create({
        user: req.user?._id,
        action: "CONTRACTOR_SELECTED",
        entity: "Tender",
        entityId: tender._id.toString(),
        newValue: { contractor: contractor.companyName, amount: contract.contractAmount },
    });

    res.status(200).json({
        success: true,
        message: `Tender successfully awarded to ${contractor.companyName}`,
        data: { tender, contract },
    });
});
