import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Contractor } from "../models/contractor.models.js";
import { Contract } from "../models/contract.models.js";
import { Road } from "../models/road.models.js";
import { RoadProject } from "../models/roadProject.models.js";

const generateContractorId = async () => {
    const count = await Contractor.countDocuments();
    return `CON-${count + 501}`;
};

export const createContractor = asyncHandler(async (req, res) => {
    const { companyName, registrationNumber, contactPerson, email, phone, address, licenseInfo } = req.body;

    if (!companyName || !registrationNumber || !email || !phone) {
        throw new ApiError(400, "Company name, registration number, email, and phone are required");
    }

    const existing = await Contractor.findOne({ $or: [{ registrationNumber }, { email }] });
    if (existing) {
        throw new ApiError(409, "Contractor with this registration number or email already exists");
    }

    const contractorId = await generateContractorId();

    const contractor = await Contractor.create({
        contractorId,
        companyName,
        registrationNumber,
        contactPerson,
        email,
        phone,
        address,
        licenseInfo,
    });

    res.status(201).json({
        success: true,
        message: "Contractor profile created successfully",
        data: contractor,
    });
});

export const getAllContractors = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const query = {};
    if (search) {
        query.$or = [
            { companyName: { $regex: search, $options: "i" } },
            { registrationNumber: { $regex: search, $options: "i" } },
            { contactPerson: { $regex: search, $options: "i" } },
        ];
    }

    const contractors = await Contractor.find(query).sort({ companyName: 1 }).lean();

    res.status(200).json({
        success: true,
        data: contractors,
    });
});

export const getContractorById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const contractor = await Contractor.findById(id).lean();
    if (!contractor) {
        throw new ApiError(404, "Contractor profile not found");
    }

    const [contracts, projects, roads] = await Promise.all([
        Contract.find({ contractorId: contractor._id })
            .populate("roadProjectId", "proposalId name length estimatedConstructionCost")
            .lean(),
        RoadProject.find({ contractorId: contractor._id }).lean(),
        Road.find({ contractorId: contractor._id }).lean(),
    ]);

    res.status(200).json({
        success: true,
        data: {
            ...contractor,
            contracts,
            projects,
            roads,
        },
    });
});
