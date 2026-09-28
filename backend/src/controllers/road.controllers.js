import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { Road } from "../models/road.models.js";
import { RoadProject } from "../models/roadProject.models.js";
import { Inspection } from "../models/inspection.models.js";
import { Maintenance } from "../models/maintenance.models.js";
import { Complaint } from "../models/complaint.models.js";
import { Tender } from "../models/tender.models.js";
import { Contractor } from "../models/contractor.models.js";
import { Contract } from "../models/contract.models.js";
import { Budget } from "../models/budget.models.js";
import { RoadLifecycleHistory } from "../models/roadHistory.models.js";
import { AuditLog } from "../models/auditLog.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

// Helper: Calculate Road Concern Indicator based on factual metrics
export const calculateRoadConcernIndicator = (road, complaints, inspections) => {
    let score = 0;
    const openComplaints = complaints.filter((c) => c.status !== "resolved" && c.status !== "rejected").length;
    const repeatComplaints = complaints.filter((c) => (c.reopenedCount || 0) > 0).length;
    const failedInspections = inspections.filter((i) => i.result === "FAILED").length;

    score += openComplaints * 2;
    score += repeatComplaints * 3;
    score += failedInspections * 4;

    if (road.condition === "POOR" || road.condition === "CRITICAL") score += 5;
    if (road.healthStatus === "CRITICAL") score += 5;

    if (score >= 12) return "CRITICAL";
    if (score >= 7) return "HIGH";
    if (score >= 3) return "MODERATE";
    return "LOW";
};

// Generate Road ID & Code
const generateRoadIdAndCode = async () => {
    const count = await Road.countDocuments();
    const seq = (count + 1024).toString();
    return {
        roadId: `RD-${seq}`,
        roadCode: `ROAD-SURAT-${seq}`,
    };
};

export const createRoad = asyncHandler(async (req, res) => {
    const {
        roadId: reqRoadId,
        roadCode: reqRoadCode,
        name,
        description,
        startLocation,
        endLocation,
        location,
        geometry,
        length = 1.0,
        width = 10.0,
        lanes = 2,
        area,
        ward,
        city = "Surat",
        state = "Gujarat",
        departmentId,
        constructionProjectId,
        contractorId,
        inspectionOfficerId,
        constructionStartDate,
        constructionEndDate,
        constructionCost = 0,
        expectedLifeYears = 15,
        warrantyPeriodYears = 5,
        defectLiabilityPeriodYears = 2,
        condition = "GOOD",
        healthStatus = "HEALTHY",
        status = "ACTIVE",
    } = req.body;

    if (!name || !location || !location.coordinates) {
        throw new ApiError(400, "Road name and valid location coordinates are required");
    }

    let roadId = reqRoadId;
    let roadCode = reqRoadCode;

    if (!roadId || !roadCode) {
        const auto = await generateRoadIdAndCode();
        roadId = roadId || auto.roadId;
        roadCode = roadCode || auto.roadCode;
    }

    const existing = await Road.findOne({ $or: [{ roadId }, { roadCode }] });
    if (existing) {
        throw new ApiError(409, "A road with this roadId or roadCode already exists");
    }

    const now = new Date();
    const wStart = constructionEndDate ? new Date(constructionEndDate) : now;
    const wEnd = new Date(wStart.getTime() + warrantyPeriodYears * 365 * 24 * 60 * 60 * 1000);
    const dlStart = wStart;
    const dlEnd = new Date(dlStart.getTime() + defectLiabilityPeriodYears * 365 * 24 * 60 * 60 * 1000);

    const road = await Road.create({
        roadId,
        roadCode,
        name,
        description,
        startLocation: startLocation || { name: "", coordinates: location.coordinates },
        endLocation: endLocation || { name: "", coordinates: location.coordinates },
        location: {
            type: "Point",
            coordinates: [Number(location.coordinates[0]), Number(location.coordinates[1])],
        },
        geometry: geometry || {
            type: "LineString",
            coordinates: [location.coordinates, location.coordinates],
        },
        length,
        width,
        lanes,
        area,
        ward,
        city,
        state,
        departmentId: departmentId || null,
        constructionProjectId: constructionProjectId || null,
        contractorId: contractorId || null,
        inspectionOfficerId: inspectionOfficerId || null,
        constructionStartDate,
        constructionEndDate,
        constructionCost,
        currentValue: constructionCost,
        expectedLifeYears,
        warrantyStartDate: wStart,
        warrantyEndDate: wEnd,
        defectLiabilityStartDate: dlStart,
        defectLiabilityEndDate: dlEnd,
        condition,
        healthStatus,
        status,
        createdBy: req.user?._id,
        updatedBy: req.user?._id,
    });

    // Record initial RoadLifecycleHistory
    await RoadLifecycleHistory.create({
        roadId: road._id,
        roadProjectId: constructionProjectId || null,
        eventType: "ROAD_ACTIVATED",
        performedBy: req.user?._id,
        description: `Road Asset ${road.roadCode} created and activated in inventory.`,
        relatedCost: constructionCost,
        newStatus: status,
    });

    // Log Audit
    await AuditLog.create({
        user: req.user?._id,
        action: "ROAD_ASSET_CREATED",
        entity: "Road",
        entityId: road._id.toString(),
        newValue: { roadCode: road.roadCode, name: road.name, cost: constructionCost },
    });

    res.status(201).json({
        success: true,
        message: "Road Asset created successfully",
        data: road,
    });
});

export const getAllRoads = asyncHandler(async (req, res) => {
    const {
        search,
        status,
        condition,
        healthStatus,
        area,
        city,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = req.query;

    const query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { roadId: { $regex: search, $options: "i" } },
            { roadCode: { $regex: search, $options: "i" } },
            { area: { $regex: search, $options: "i" } },
            { ward: { $regex: search, $options: "i" } },
        ];
    }

    if (status) query.status = status;
    if (condition) query.condition = condition;
    if (healthStatus) query.healthStatus = healthStatus;
    if (area) query.area = area;
    if (city) query.city = city;

    const skip = (Number(page) - 1) * Number(limit);
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const [roads, total] = await Promise.all([
        Road.find(query)
            .populate("departmentId", "name category")
            .populate("contractorId", "companyName contactPerson email phone")
            .populate("inspectionOfficerId", "name email phone")
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Road.countDocuments(query),
    ]);

    res.status(200).json({
        success: true,
        data: roads,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
        },
    });
});

export const getNearbyRoads = asyncHandler(async (req, res) => {
    const { latitude, longitude, maxDistance = 5000 } = req.query;

    if (!latitude || !longitude) {
        throw new ApiError(400, "Latitude and Longitude are required");
    }

    const roads = await Road.find({
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [parseFloat(longitude), parseFloat(latitude)],
                },
                $maxDistance: parseFloat(maxDistance),
            },
        },
    })
        .populate("departmentId", "name category")
        .limit(20)
        .lean();

    res.status(200).json({
        success: true,
        count: roads.length,
        data: roads,
    });
});

export const getPublicRoadById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { _id: id };
    } else {
        query = { $or: [{ roadId: id }, { roadCode: id }] };
    }

    const road = await Road.findOne(query)
        .select("-createdBy -updatedBy")
        .populate("departmentId", "name contact_phone")
        .lean();

    if (!road) {
        throw new ApiError(404, "Public Road Asset not found");
    }

    // Increment public view count
    await Road.updateOne({ _id: road._id }, { $inc: { viewsCount: 1 } });

    res.status(200).json({
        success: true,
        data: {
            roadId: road.roadId,
            roadCode: road.roadCode,
            name: road.name,
            description: road.description,
            length: road.length,
            width: road.width,
            lanes: road.lanes,
            area: road.area,
            city: road.city,
            condition: road.condition,
            healthStatus: road.healthStatus,
            status: road.status,
            roadConcernIndicator: road.roadConcernIndicator,
            viewsCount: (road.viewsCount || 0) + 1,
            complaintsCount: road.complaintsCount || 0,
            location: road.location,
            geometry: road.geometry,
        },
    });
});

export const getRoadById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    let query = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { _id: id };
    } else {
        query = { $or: [{ roadId: id }, { roadCode: id }] };
    }

    const road = await Road.findOne(query)
        .populate("departmentId", "name category contact_email contact_phone")
        .populate("contractorId")
        .populate("inspectionOfficerId", "name email phone profileImage")
        .populate("constructionProjectId")
        .populate("createdBy", "name email")
        .populate("updatedBy", "name email")
        .lean();

    if (!road) {
        throw new ApiError(404, "Road Asset not found");
    }

    // Fetch complete related entities for tabs
    const [project, complaints, maintenanceRecords, inspections, timelineHistory, contract, tenders] =
        await Promise.all([
            road.constructionProjectId ? RoadProject.findById(road.constructionProjectId).lean() : null,
            Complaint.find({ roadId: road._id })
                .populate("user_id", "name email profileImage")
                .sort({ createdAt: -1 })
                .lean(),
            Maintenance.find({ roadId: road._id })
                .populate("technicianId", "name email phone")
                .sort({ startDate: -1 })
                .lean(),
            Inspection.find({ roadId: road._id })
                .populate("officerId", "name email phone")
                .sort({ inspectionDate: -1 })
                .lean(),
            RoadLifecycleHistory.find({ roadId: road._id })
                .populate("performedBy", "name email role")
                .sort({ date: -1 })
                .lean(),
            Contract.findOne({ roadProjectId: road.constructionProjectId }).populate("contractorId").lean(),
            Tender.find({ roadProjectId: road.constructionProjectId }).lean(),
        ]);

    // Recalculate factual interaction metrics & Concern Indicator
    const openComplaintsCount = complaints.filter(
        (c) => c.status !== "resolved" && c.status !== "rejected"
    ).length;
    const resolvedComplaintsCount = complaints.filter((c) => c.status === "resolved").length;
    const repeatComplaintsCount = complaints.filter((c) => (c.reopenedCount || 0) > 0).length;

    const concernIndicator = calculateRoadConcernIndicator(road, complaints, inspections);

    // Check Warranty
    const now = new Date();
    const isUnderWarranty = road.warrantyEndDate ? new Date(road.warrantyEndDate) > now : false;
    const isUnderDefectLiability = road.defectLiabilityEndDate
        ? new Date(road.defectLiabilityEndDate) > now
        : false;

    res.status(200).json({
        success: true,
        data: {
            ...road,
            roadConcernIndicator: concernIndicator,
            openComplaintsCount,
            resolvedComplaintsCount,
            repeatComplaintsCount,
            complaintsCount: complaints.length,
            isUnderWarranty,
            isUnderDefectLiability,
            project,
            complaints,
            maintenanceRecords,
            inspections,
            timelineHistory,
            contract,
            tenders,
        },
    });
});

export const updateRoad = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = { ...req.body, updatedBy: req.user?._id };

    const road = await Road.findById(id);
    if (!road) {
        throw new ApiError(404, "Road Asset not found");
    }

    const prevStatus = road.status;
    const prevCondition = road.condition;

    Object.assign(road, updates);
    await road.save();

    if (updates.status && updates.status !== prevStatus) {
        await RoadLifecycleHistory.create({
            roadId: road._id,
            eventType: "ROUTINE_INSPECTION",
            performedBy: req.user?._id,
            description: `Road status changed from ${prevStatus} to ${road.status}`,
            previousStatus: prevStatus,
            newStatus: road.status,
        });
    }

    res.status(200).json({
        success: true,
        message: "Road Asset updated successfully",
        data: road,
    });
});

export const updateRoadLifecycle = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { newStatus, eventType, reason, notes, relatedCost } = req.body;

    if (!newStatus) {
        throw new ApiError(400, "newStatus is required");
    }

    const road = await Road.findById(id);
    if (!road) {
        throw new ApiError(404, "Road Asset not found");
    }

    const prevStatus = road.status;
    road.status = newStatus;
    road.updatedBy = req.user?._id;
    await road.save();

    const historyRecord = await RoadLifecycleHistory.create({
        roadId: road._id,
        eventType: eventType || "ROUTINE_INSPECTION",
        performedBy: req.user?._id,
        description: reason || notes || `Transitioned status to ${newStatus}`,
        relatedCost: relatedCost || 0,
        previousStatus: prevStatus,
        newStatus,
    });

    res.status(200).json({
        success: true,
        message: `Road status updated to ${newStatus}`,
        data: { road, historyRecord },
    });
});

export const deleteRoad = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const road = await Road.findById(id);

    if (!road) {
        throw new ApiError(404, "Road Asset not found");
    }

    road.status = "RETIRED";
    road.updatedBy = req.user?._id;
    await road.save();

    await RoadLifecycleHistory.create({
        roadId: road._id,
        eventType: "RETIRED",
        performedBy: req.user?._id,
        description: "Road Asset retired from active network",
        previousStatus: road.status,
        newStatus: "RETIRED",
    });

    res.status(200).json({
        success: true,
        message: "Road Asset marked as RETIRED",
    });
});

export const seedDemoData = asyncHandler(async (req, res) => {
    // 1. Ensure/Find Demo Admin & Citizen Users
    let admin = await User.findOne({ role: "SUPER_ADMIN" });
    if (!admin) {
        admin = await User.create({
            name: "Super Admin",
            email: "admin@roadinfra.gov.in",
            phone: "+919876543210",
            password: "password123",
            role: "SUPER_ADMIN",
            isEmailVerified: true,
            isPhoneVerified: true,
        });
    }

    let citizen = await User.findOne({ role: "CITIZEN" });
    if (!citizen) {
        citizen = await User.create({
            name: "Rajesh Kumar",
            email: "citizen@example.com",
            phone: "+919876543211",
            password: "password123",
            role: "CITIZEN",
            isEmailVerified: true,
            isPhoneVerified: true,
        });
    }

    // 2. Create/Update Annual Budget
    let budget = await Budget.findOne({ financialYear: "2026-2027" });
    if (!budget) {
        budget = await Budget.create({
            financialYear: "2026-2027",
            totalBudget: 1000000000, // ₹100 Cr
            newConstructionBudget: 600000000, // ₹60 Cr
            maintenanceBudget: 350000000, // ₹35 Cr
            emergencyReserveBudget: 50000000, // ₹5 Cr
            allocatedNewConstruction: 84000000,
            spentNewConstruction: 84000000,
            allocatedMaintenance: 120000,
            spentMaintenance: 120000,
            approvedBy: admin._id,
            status: "APPROVED",
        });
    }

    // 3. Create Contractor
    let contractor = await Contractor.findOne({ registrationNumber: "REG-INFRA-8842" });
    if (!contractor) {
        contractor = await Contractor.create({
            companyName: "ABC Infrastructure Pvt Ltd",
            registrationNumber: "REG-INFRA-8842",
            contactPerson: "Vikram Sharma",
            email: "contact@abcinfra.com",
            phone: "+919825012345",
            licenseNumber: "LIC-GUJ-ROAD-2024-99",
            licenseExpiry: new Date("2030-12-31"),
            address: "Plot 45, GIDC Industrial Estate, Surat, Gujarat",
            projectsCompleted: 18,
            projectsDelayed: 2,
            averageCompletionDays: 140,
            inspectionFailuresCount: 1,
            defectsReportedCount: 3,
            warrantyComplaintsCount: 0,
            factSheet: {
                totalContractValue: 450000000,
                activeProjectsCount: 2,
                satisfactionRating: 4.8,
            },
        });
    }

    // 4. Create Road Project (RD-1024)
    let project = await RoadProject.findOne({ proposalId: "PROP-1024" });
    if (!project) {
        project = await RoadProject.create({
            proposalId: "PROP-1024",
            name: "Ring Road Extension Project (Sector 12 to Ring Road)",
            startLocation: { name: "Sector 12 Junction", coordinates: [72.8311, 21.1702] },
            endLocation: { name: "Outer Ring Road Interchange", coordinates: [72.835, 21.175] },
            location: { type: "Point", coordinates: [72.8311, 21.1702] },
            area: "Varachha",
            ward: "Ward 8",
            city: "Surat",
            state: "Gujarat",
            length: 3.2,
            width: 12.0,
            lanes: 4,
            expectedTraffic: "25,000 Vehicles/Day",
            estimatedPopulationServed: 85000,
            reasonForConstruction:
                "Critical bypass road connecting Sector 12 industrial corridor to Outer Ring Road to alleviate congestion and serve major healthcare and educational institutions.",
            needAssessment: {
                trafficVolume: "HIGH",
                populationServed: "HIGH",
                existingRoadCondition: "POOR",
                connectivityImportance: "DISTRICT",
                nearbyFacilities: ["Hospital", "School", "Industrial Zone", "Market"],
                safetyConcerns: "HIGH",
                citizenRequestsCount: 142,
                landAvailability: "AVAILABLE",
            },
            priorityBreakdown: {
                score: 85,
                indicator: "HIGH",
                reasons: [
                    "High traffic volume connecting industrial corridor",
                    "Serves over 85,000 citizens and 3 major schools/hospitals",
                    "Reduces accident risks on narrow legacy route",
                ],
            },
            priority: "HIGH",
            proposedStartDate: new Date("2026-03-15"),
            expectedCompletionDate: new Date("2026-08-30"),
            actualCompletionDate: new Date("2026-08-30"),
            estimatedConstructionCost: 84000000, // ₹8.4 Cr
            actualConstructionCost: 84000000,
            costBreakdown: {
                landPreparation: 8000000,
                materials: 40000000,
                labour: 15000000,
                equipment: 12000000,
                drainage: 5000000,
                roadMarking: 2000000,
                safety: 2000000,
            },
            materials: [
                { materialName: "Asphalt Grade VG-30", quantity: 1200, unit: "Tons", estimatedUnitPrice: 15000, estimatedTotalCost: 18000000, actualQuantityUsed: 1200, actualCost: 18000000, supplier: "Gujarat Bitumen Corp", qualityResult: "PASSED" },
                { materialName: "Crushed Stone Aggregate", quantity: 2500, unit: "Cu.m", estimatedUnitPrice: 4000, estimatedTotalCost: 10000000, actualQuantityUsed: 2500, actualCost: 10000000, supplier: "Surat Quarry Works", qualityResult: "PASSED" },
                { materialName: "OPC 53 Cement", quantity: 10000, unit: "Bags", estimatedUnitPrice: 400, estimatedTotalCost: 4000000, actualQuantityUsed: 10000, actualCost: 4000000, supplier: "Ultratech Cement", qualityResult: "PASSED" },
                { materialName: "Thermoplastic Road Paint", quantity: 50, unit: "Drums", estimatedUnitPrice: 16000, estimatedTotalCost: 800000, actualQuantityUsed: 50, actualCost: 800000, supplier: "Asian Paints Infra", qualityResult: "PASSED" },
            ],
            proposedBy: admin._id,
            contractorId: contractor._id,
            constructionStage: "COMPLETED",
            progressPercentage: 100,
            status: "COMPLETED",
        });
    }

    // 5. Create Tender
    let tender = await Tender.findOne({ tenderId: "TND-2026-1024" });
    if (!tender) {
        tender = await Tender.create({
            tenderId: "TND-2026-1024",
            roadProjectId: project._id,
            title: "Construction of 4-Lane Ring Road Extension (3.2 km)",
            estimatedCost: 84000000,
            tenderAmount: 84000000,
            publicationDate: new Date("2026-02-15"),
            submissionDeadline: new Date("2026-03-01"),
            technicalRequirements: "Minimum 5 years experience in asphalt paving, ISO 9001 certified machinery.",
            financialRequirements: "Annual turnover > ₹25 Cr for past 3 years.",
            contractDurationDays: 180,
            selectedContractorId: contractor._id,
            awardedAmount: 84000000,
            awardDate: new Date("2026-03-10"),
            status: "AWARDED",
            approvedBy: admin._id,
        });
    }

    // 6. Create Contract
    let contract = await Contract.findOne({ contractNumber: "CNT-RD-1024-2026" });
    if (!contract) {
        contract = await Contract.create({
            contractNumber: "CNT-RD-1024-2026",
            tenderId: tender._id,
            roadProjectId: project._id,
            contractorId: contractor._id,
            contractAmount: 84000000,
            startDate: new Date("2026-03-15"),
            expectedEndDate: new Date("2026-08-30"),
            warrantyPeriodYears: 5,
            defectLiabilityPeriodYears: 2,
            warrantyStartDate: new Date("2026-09-01"),
            warrantyEndDate: new Date("2031-09-01"),
            defectLiabilityStartDate: new Date("2026-09-01"),
            defectLiabilityEndDate: new Date("2028-09-01"),
            status: "ACTIVE",
        });
    }

    // 7. Create Road Asset (RD-1024)
    let road = await Road.findOne({ roadId: "RD-1024" });
    if (!road) {
        road = await Road.create({
            roadId: "RD-1024",
            roadCode: "ROAD-SURAT-1024",
            name: "Ring Road Extension Asset (Sector 12)",
            description: "High-density 4-lane asphalt road asset serving Ring Road corridor.",
            startLocation: { name: "Sector 12 Junction", coordinates: [72.8311, 21.1702] },
            endLocation: { name: "Outer Ring Road Interchange", coordinates: [72.835, 21.175] },
            location: { type: "Point", coordinates: [72.8311, 21.1702] },
            geometry: {
                type: "LineString",
                coordinates: [
                    [72.8311, 21.1702],
                    [72.833, 21.1725],
                    [72.835, 21.175],
                ],
            },
            length: 3.2,
            width: 12.0,
            lanes: 4,
            area: "Varachha",
            ward: "Ward 8",
            city: "Surat",
            state: "Gujarat",
            constructionProjectId: project._id,
            contractorId: contractor._id,
            constructionStartDate: new Date("2026-03-15"),
            constructionEndDate: new Date("2026-08-30"),
            constructionCost: 84000000,
            currentValue: 84000000,
            expectedLifeYears: 15,
            warrantyStartDate: new Date("2026-09-01"),
            warrantyEndDate: new Date("2031-09-01"),
            defectLiabilityStartDate: new Date("2026-09-01"),
            defectLiabilityEndDate: new Date("2028-09-01"),
            lastInspectionDate: new Date("2026-09-15"),
            lastMaintenanceDate: new Date("2026-09-12"),
            condition: "GOOD",
            healthStatus: "HEALTHY",
            status: "ACTIVE",
            viewsCount: 1420,
            uniqueVisitorsCount: 980,
            complaintsCount: 1,
            openComplaintsCount: 0,
            resolvedComplaintsCount: 1,
            repeatComplaintsCount: 0,
            roadConcernIndicator: "LOW",
            createdBy: admin._id,
        });

        project.createdRoadId = road._id;
        await project.save();
    }

    // 8. Create Final Quality Inspection
    let inspection = await Inspection.findOne({ roadId: road._id, inspectionType: "FINAL" });
    if (!inspection) {
        inspection = await Inspection.create({
            inspectionId: "INSP-RD-1024-FINAL",
            roadId: road._id,
            roadProjectId: project._id,
            officerId: admin._id,
            inspectionType: "FINAL",
            inspectionDate: new Date("2026-08-30"),
            checklist: {
                materialQualityPass: true,
                roadThicknessPass: true,
                roadWidthPass: true,
                surfaceQualityPass: true,
                drainagePass: true,
                noCracksOrPotholesPass: true,
                safetySignagePass: true,
            },
            result: "PASS",
            remarks: "All technical specifications, compaction tests, and thickness benchmarks satisfied.",
            location: { type: "Point", coordinates: [72.8311, 21.1702] },
        });
    }

    // 9. Create Citizen Complaint
    let complaint = await Complaint.findOne({ title: "Severe Potholes near Sector 12 Junction" });
    if (!complaint) {
        complaint = await Complaint.create({
            user_id: citizen._id,
            title: "Severe Potholes near Sector 12 Junction",
            description: "Rain caused asphalt erosion creating a deep 2-foot pothole near the main turn.",
            address: "Sector 12 Ring Road Extension, Surat",
            latitude: 21.1702,
            longitude: 72.8311,
            officer_category: "Road",
            status: "resolved",
            roadId: road._id,
            roadName: road.name,
            roadCode: road.roadCode,
            complaintType: "POTHOLE",
            severityLevel: "HIGH",
            assigned_officer_id: admin._id,
            isEscalated: false,
        });
    }

    // 10. Create Maintenance Work with Before/After Proof
    let maintenance = await Maintenance.findOne({ roadId: road._id });
    if (!maintenance) {
        maintenance = await Maintenance.create({
            maintenanceId: "MNT-RD-1024-001",
            roadId: road._id,
            complaintId: complaint._id,
            problemDescription: "Severe asphalt erosion pothole repair near Sector 12 Junction.",
            type: "POTHOLE_REPAIR",
            severity: "HIGH",
            estimatedCost: 120000,
            approvedCost: 120000,
            actualCost: 120000,
            contractorId: contractor._id,
            technicianId: admin._id,
            inspectionOfficerId: admin._id,
            startDate: new Date("2026-09-11"),
            expectedCompletionDate: new Date("2026-09-12"),
            actualCompletionDate: new Date("2026-09-12"),
            beforeImages: ["https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"],
            afterImages: ["https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"],
            inspectionResult: "PASS",
            inspectionNotes: "Pothole filled with cold asphalt mix, compacted and level verified.",
            status: "COMPLETED",
            remarks: "Emergency repair executed within 24 hours under warranty coverage.",
        });
    }

    // 11. Create Complete Visual Timeline Events in RoadLifecycleHistory
    const existingEventsCount = await RoadLifecycleHistory.countDocuments({ roadId: road._id });
    if (existingEventsCount < 5) {
        await RoadLifecycleHistory.deleteMany({ roadId: road._id });
        await RoadLifecycleHistory.insertMany([
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "NEED_IDENTIFIED",
                performedBy: admin._id,
                description: "Need identified: Traffic bypass & population connectivity assessed for Sector 12 corridor.",
                date: new Date("2026-01-10"),
                previousStatus: "PLANNED",
                newStatus: "PLANNED",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "PROPOSAL_SUBMITTED",
                performedBy: admin._id,
                description: "Proposal PROP-1024 submitted with High Priority Indicator (Score: 85). Estimated cost: ₹8.4 Cr.",
                date: new Date("2026-01-20"),
                previousStatus: "PLANNED",
                newStatus: "SUBMITTED",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "BUDGET_APPROVED",
                performedBy: admin._id,
                description: "₹8.4 Cr budget allocated from FY 2026-27 Annual New Construction Budget.",
                date: new Date("2026-02-01"),
                relatedCost: 84000000,
                previousStatus: "SUBMITTED",
                newStatus: "BUDGET_APPROVED",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "TENDER_PUBLISHED",
                performedBy: admin._id,
                description: "Tender TND-2026-1024 published for 4-lane Ring Road Extension.",
                date: new Date("2026-02-15"),
                previousStatus: "BUDGET_APPROVED",
                newStatus: "TENDERED",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "CONTRACTOR_AWARDED",
                performedBy: admin._id,
                description: "Contract CNT-RD-1024-2026 awarded to ABC Infrastructure Pvt Ltd after technical/financial evaluation.",
                date: new Date("2026-03-10"),
                previousStatus: "TENDERED",
                newStatus: "CONTRACTOR_SELECTED",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "CONSTRUCTION_STARTED",
                performedBy: admin._id,
                description: "Groundbreaking site preparation and sub-base laying initiated.",
                date: new Date("2026-03-15"),
                previousStatus: "CONTRACTOR_SELECTED",
                newStatus: "UNDER_CONSTRUCTION",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "FINAL_INSPECTION_PASS",
                performedBy: admin._id,
                description: "Final quality inspection INSP-RD-1024-FINAL completed with PASS result.",
                date: new Date("2026-08-30"),
                previousStatus: "UNDER_CONSTRUCTION",
                newStatus: "FINAL_INSPECTION",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "ROAD_ACTIVATED",
                performedBy: admin._id,
                description: "Road Asset RD-1024 officially created, activated, and opened for public transit.",
                date: new Date("2026-09-01"),
                relatedCost: 84000000,
                previousStatus: "FINAL_INSPECTION",
                newStatus: "ACTIVE",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "CITIZEN_COMPLAINT_RECEIVED",
                performedBy: citizen._id,
                description: "Citizen reported pothole issue near Sector 12 Junction.",
                date: new Date("2026-09-10"),
                previousStatus: "ACTIVE",
                newStatus: "DAMAGED",
            },
            {
                roadId: road._id,
                roadProjectId: project._id,
                eventType: "MAINTENANCE_COMPLETED",
                performedBy: admin._id,
                description: "Pothole repair MNT-RD-1024-001 executed and verified with before/after photo proof.",
                date: new Date("2026-09-12"),
                relatedCost: 120000,
                previousStatus: "DAMAGED",
                newStatus: "ACTIVE",
            },
        ]);
    }

    res.status(200).json({
        success: true,
        message: "Hackathon demo data seeded successfully for Road RD-1024!",
        data: {
            roadId: road.roadId,
            roadDbId: road._id,
            roadName: road.name,
            projectProposalId: project.proposalId,
            tenderId: tender.tenderId,
            contractorName: contractor.companyName,
            maintenanceId: maintenance.maintenanceId,
        },
    });
});
