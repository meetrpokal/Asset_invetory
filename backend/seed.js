import dotenv from "dotenv";
import mongoose from "mongoose";
import { User } from "./src/models/user.models.js";
import { Road } from "./src/models/road.models.js";
import { Complaint } from "./src/models/complaint.models.js";
import { Inspection } from "./src/models/inspection.models.js";
import { Maintenance } from "./src/models/maintenance.models.js";
import { Contractor } from "./src/models/contractor.models.js";
import { RoadLifecycleHistory } from "./src/models/roadHistory.models.js";
import { Budget } from "./src/models/budget.models.js";
import { INDIAN_STATE_ROAD_BUDGETS } from "./src/constants/indianStateBudgets.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

const seedDatabase = async () => {
    try {
        console.log("Connecting to MongoDB at:", MONGODB_URI);
        await mongoose.connect(`${MONGODB_URI}/lodge`);
        console.log("Connected successfully to MongoDB.");

        console.log("\nClearing existing seed/demo data...");
        await User.deleteMany({});
        await Road.deleteMany({});
        await Complaint.deleteMany({});
        await Inspection.deleteMany({});
        await Maintenance.deleteMany({});
        await Contractor.deleteMany({});
        await RoadLifecycleHistory.deleteMany({});
        await Budget.deleteMany({});
        console.log("Database cleared successfully.");

        // ==========================================
        // 1. CREATE DEMO USERS (12 Users)
        // ==========================================
        console.log("\nSeeding Demo Users...");

        // Passwords will be automatically hashed by userSchema.pre('save')
        const usersData = [
            {
                name: "System Administrator",
                email: "admin@roadasset.demo",
                password: "Admin@12345",
                role: "ADMIN",
                phone: "+91 9900000001",
                user_level: 5,
                address: "State Road Authority HQ, Gandhinagar",
                latitude: 23.2156,
                longitude: 72.6369,
            },
            {
                name: "Rajesh Sharma (Chief Road Officer)",
                email: "officer@roadasset.demo",
                password: "Officer@12345",
                role: "ROAD_OFFICER",
                phone: "+91 9900000002",
                user_level: 4,
                officer_category: "Road Infrastructure",
                address: "Municipal Corporation Office, Ahmedabad",
                latitude: 23.0225,
                longitude: 72.5714,
            },
            {
                name: "Vikram Patel (Executive Road Officer)",
                email: "officer2@roadasset.demo",
                password: "Officer@12345",
                role: "ROAD_OFFICER",
                phone: "+91 9900000003",
                user_level: 3,
                officer_category: "Road Infrastructure",
                address: "Surat Urban Development Authority, Surat",
                latitude: 21.1702,
                longitude: 72.8311,
            },
            {
                name: "Gujarat Road Works (Demo Contractor)",
                email: "contractor@roadasset.demo",
                password: "Contractor@12345",
                role: "CONTRACTOR",
                phone: "+91 9900000004",
                user_level: 2,
                address: "SG Highway Commercial Complex, Ahmedabad",
                latitude: 23.0300,
                longitude: 72.5200,
            },
            {
                name: "Inspector Amit Verma",
                email: "inspector1@roadasset.demo",
                password: "Inspector@12345",
                role: "INSPECTION_OFFICER",
                phone: "+91 9900000005",
                user_level: 2,
                address: "Road Testing Lab, Vadodara",
                latitude: 22.3072,
                longitude: 73.1812,
            },
            {
                name: "Inspector Priya Mehta",
                email: "inspector2@roadasset.demo",
                password: "Inspector@12345",
                role: "INSPECTION_OFFICER",
                phone: "+91 9900000006",
                user_level: 2,
                address: "Quality Control Division, Rajkot",
                latitude: 22.3039,
                longitude: 70.8022,
            },
            {
                name: "Inspector Sanjay Desai",
                email: "inspector3@roadasset.demo",
                password: "Inspector@12345",
                role: "INSPECTION_OFFICER",
                phone: "+91 9900000007",
                user_level: 2,
                address: "PWD Circle Office, Gandhinagar",
                latitude: 23.2200,
                longitude: 72.6500,
            },
            {
                name: "Demo Citizen (Public)",
                email: "customer@roadasset.demo",
                password: "Customer@12345",
                role: "CUSTOMER",
                phone: "+91 9900000008",
                user_level: 0,
                address: "Satellite, Ahmedabad",
                latitude: 23.0300,
                longitude: 72.5100,
            },
            {
                name: "Aarav Joshi",
                email: "citizen2@roadasset.demo",
                password: "Customer@12345",
                role: "CUSTOMER",
                phone: "+91 9900000009",
                user_level: 0,
                address: "Adajan, Surat",
                latitude: 21.1900,
                longitude: 72.7900,
            },
            {
                name: "Neha Trivedi",
                email: "citizen3@roadasset.demo",
                password: "Customer@12345",
                role: "CUSTOMER",
                phone: "+91 9900000010",
                user_level: 0,
                address: "Alkapuri, Vadodara",
                latitude: 22.3100,
                longitude: 73.1700,
            },
            {
                name: "Rahul Shah",
                email: "citizen4@roadasset.demo",
                password: "Customer@12345",
                role: "CUSTOMER",
                phone: "+91 9900000011",
                user_level: 0,
                address: "Kalawad Road, Rajkot",
                latitude: 22.2900,
                longitude: 70.7800,
            },
            {
                name: "Ananya Bhatt",
                email: "citizen5@roadasset.demo",
                password: "Customer@12345",
                role: "CUSTOMER",
                phone: "+91 9900000012",
                user_level: 0,
                address: "Sector 7, Gandhinagar",
                latitude: 23.2100,
                longitude: 72.6300,
            }
        ];

        const users = [];
        for (const u of usersData) {
            const user = new User(u);
            await user.save();
            users.push(user);
        }
        console.log(`Seeded ${users.length} Users successfully.`);

        const adminUser = users.find((u) => u.email === "admin@roadasset.demo");
        const officer1 = users.find((u) => u.email === "officer@roadasset.demo");
        const officer2 = users.find((u) => u.email === "officer2@roadasset.demo");
        const contractorUser = users.find((u) => u.email === "contractor@roadasset.demo");
        const inspector1 = users.find((u) => u.email === "inspector1@roadasset.demo");
        const inspector2 = users.find((u) => u.email === "inspector2@roadasset.demo");
        const inspector3 = users.find((u) => u.email === "inspector3@roadasset.demo");
        const customer1 = users.find((u) => u.email === "customer@roadasset.demo");
        const customer2 = users.find((u) => u.email === "citizen2@roadasset.demo");

        // ==========================================
        // 2. CREATE DEMO CONTRACTORS (7 Contractors)
        // ==========================================
        console.log("\nSeeding Contractors...");
        const contractorsData = [
            {
                contractorId: "CONT-001",
                companyName: "Gujarat Road Works",
                registrationNumber: "REG-GUJ-2021-091",
                contactPerson: "Ramesh Solanki",
                email: "contractor@roadasset.demo",
                phone: "+91 9876543210",
                address: "102 Industry Park, SG Highway, Ahmedabad",
                licenseInfo: "Class-A Highway Contractor License",
                totalProjects: 14,
                completedProjects: 11,
                delayedProjects: 1,
                avgCompletionDurationDays: 45,
                inspectionFailures: 0,
            },
            {
                contractorId: "CONT-002",
                companyName: "Urban Infra Solutions",
                registrationNumber: "REG-GUJ-2020-044",
                contactPerson: "Deepak Shah",
                email: "contact@urbaninfra.demo",
                phone: "+91 9876543211",
                address: "405 Commercial Center, Ring Road, Surat",
                licenseInfo: "Class-A Civil Infrastructure License",
                totalProjects: 19,
                completedProjects: 16,
                delayedProjects: 2,
                avgCompletionDurationDays: 38,
                inspectionFailures: 1,
            },
            {
                contractorId: "CONT-003",
                companyName: "Metro Road Services",
                registrationNumber: "REG-GUJ-2019-112",
                contactPerson: "Hardik Patel",
                email: "info@metroroad.demo",
                phone: "+91 9876543212",
                address: "78 Tech Hub, Sector 11, Gandhinagar",
                licenseInfo: "Class-B Road Asphalt Specialist",
                totalProjects: 9,
                completedProjects: 8,
                delayedProjects: 0,
                avgCompletionDurationDays: 25,
                inspectionFailures: 0,
            },
            {
                contractorId: "CONT-004",
                companyName: "City Infrastructure Works",
                registrationNumber: "REG-GUJ-2022-088",
                contactPerson: "Sunil Mehta",
                email: "contact@cityinfra.demo",
                phone: "+91 9876543213",
                address: "12 RC Dutt Road, Alkapuri, Vadodara",
                licenseInfo: "Class-A Municipal Infrastructure License",
                totalProjects: 12,
                completedProjects: 10,
                delayedProjects: 1,
                avgCompletionDurationDays: 50,
                inspectionFailures: 1,
            },
            {
                contractorId: "CONT-005",
                companyName: "Highway Maintenance Group",
                registrationNumber: "REG-GUJ-2018-019",
                contactPerson: "Karan Malhotra",
                email: "contact@highwaymaint.demo",
                phone: "+91 9876543214",
                address: "88 Kalawad Road, Rajkot",
                licenseInfo: "Class-A Heavy Highway Paving License",
                totalProjects: 22,
                completedProjects: 20,
                delayedProjects: 1,
                avgCompletionDurationDays: 30,
                inspectionFailures: 0,
            },
            {
                contractorId: "CONT-006",
                companyName: "Apex Paving Ltd",
                registrationNumber: "REG-GUJ-2023-150",
                contactPerson: "Suresh Rathod",
                email: "info@apexpaving.demo",
                phone: "+91 9876543215",
                address: "SG Highway Circle, Ahmedabad",
                licenseInfo: "Class-B Concrete Paving License",
                totalProjects: 6,
                completedProjects: 5,
                delayedProjects: 0,
                avgCompletionDurationDays: 20,
                inspectionFailures: 0,
            },
            {
                contractorId: "CONT-007",
                companyName: "Western Infra Corp",
                registrationNumber: "REG-GUJ-2021-301",
                contactPerson: "Bhavesh Joshi",
                email: "contact@westerninfra.demo",
                phone: "+91 9876543216",
                address: "Dumas Road, Surat",
                licenseInfo: "Class-A Drainage & Roadways License",
                totalProjects: 11,
                completedProjects: 9,
                delayedProjects: 1,
                avgCompletionDurationDays: 42,
                inspectionFailures: 0,
            },
        ];

        const contractors = await Contractor.insertMany(contractorsData);
        console.log(`Seeded ${contractors.length} Contractors successfully.`);

        // ==========================================
        // 3. CREATE DEMO ROAD ASSETS (25 Roads)
        // ==========================================
        console.log("\nSeeding Road Assets...");

        const sampleRoadsRaw = [
            // Ahmedabad Roads (6)
            {
                roadId: "ROAD-001",
                roadCode: "RC-AHM-001",
                name: "Sarkhej - Gandhinagar (SG) Highway",
                description: "Major arterial corridor connecting Sarkhej with Gandhinagar",
                area: "Sola / Bodakdev",
                ward: "Ward 12 - Bodakdev",
                city: "Ahmedabad",
                state: "Gujarat",
                length: 18.5,
                width: 30.0,
                lanes: 6,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 45000000,
                currentValue: 42000000,
                startLocation: { name: "Sarkhej Cross Roads", coordinates: [72.5012, 23.0015] },
                endLocation: { name: "Gota Circle", coordinates: [72.5350, 23.1050] },
                location: { type: "Point", coordinates: [72.5200, 23.0500] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.5012, 23.0015], [72.5200, 23.0500], [72.5350, 23.1050]],
                },
                contractorId: contractors[0]._id,
                inspectionOfficerId: officer1._id,
            },
            {
                roadId: "ROAD-002",
                roadCode: "RC-AHM-002",
                name: "Chimanlal Girdharlal (CG) Road",
                description: "Prime commercial shopping street in Navrangpura",
                area: "Navrangpura",
                ward: "Ward 8 - Navrangpura",
                city: "Ahmedabad",
                state: "Gujarat",
                length: 3.2,
                width: 24.0,
                lanes: 4,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 18000000,
                currentValue: 17500000,
                startLocation: { name: "Stadium Cross Roads", coordinates: [72.5580, 23.0370] },
                endLocation: { name: "Ellisbridge Circle", coordinates: [72.5680, 23.0210] },
                location: { type: "Point", coordinates: [72.5620, 23.0290] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.5580, 23.0370], [72.5620, 23.0290], [72.5680, 23.0210]],
                },
                contractorId: contractors[5]._id,
                inspectionOfficerId: officer1._id,
            },
            {
                roadId: "ROAD-003",
                roadCode: "RC-AHM-003",
                name: "132 Feet Ring Road (Satellite Stretch)",
                description: "Heavy commercial ring road carrying inter-city traffic",
                area: "Satellite",
                ward: "Ward 14 - Satellite",
                city: "Ahmedabad",
                state: "Gujarat",
                length: 8.4,
                width: 36.0,
                lanes: 6,
                condition: "POOR",
                healthStatus: "CRITICAL",
                status: "PARTIALLY_CLOSED",
                closureDetails: {
                    isClosed: true,
                    closureStartDate: new Date("2026-09-20"),
                    expectedReopeningDate: new Date("2026-10-05"),
                    reason: "Resurfacing & Storm Drain Repair",
                    affectedArea: "Shivranjani to Jhansi ki Rani Circle",
                    diversionRouteDescription: "Divert via Anandnagar Road and 100 Feet Road",
                    trafficImpact: "HIGH",
                    constructionProgress: 60,
                },
                constructionCost: 28000000,
                currentValue: 21000000,
                startLocation: { name: "IIM Cross Roads", coordinates: [72.5310, 23.0300] },
                endLocation: { name: "Shivranjani Crossroads", coordinates: [72.5220, 23.0200] },
                location: { type: "Point", coordinates: [72.5265, 23.0250] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.5310, 23.0300], [72.5265, 23.0250], [72.5220, 23.0200]],
                },
                contractorId: contractors[0]._id,
                inspectionOfficerId: officer1._id,
            },
            {
                roadId: "ROAD-004",
                roadCode: "RC-AHM-004",
                name: "Ashram Road Heritage Corridor",
                description: "Historic north-south arterial road running along Sabarmati Riverfront",
                area: "Usmanpura",
                ward: "Ward 5 - Ashram Road",
                city: "Ahmedabad",
                state: "Gujarat",
                length: 6.8,
                width: 28.0,
                lanes: 4,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 22000000,
                currentValue: 20000000,
                startLocation: { name: "Vadaj Circle", coordinates: [72.5700, 23.0550] },
                endLocation: { name: "Paldi Circle", coordinates: [72.5630, 23.0110] },
                location: { type: "Point", coordinates: [72.5665, 23.0330] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.5700, 23.0550], [72.5665, 23.0330], [72.5630, 23.0110]],
                },
                contractorId: contractors[0]._id,
                inspectionOfficerId: officer1._id,
            },
            {
                roadId: "ROAD-005",
                roadCode: "RC-AHM-005",
                name: "Prahladnagar 100 Feet Road",
                description: "Upscale residential & IT commercial hub road",
                area: "Prahladnagar",
                ward: "Ward 15 - Prahladnagar",
                city: "Ahmedabad",
                state: "Gujarat",
                length: 4.1,
                width: 30.0,
                lanes: 4,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 15000000,
                currentValue: 14800000,
                startLocation: { name: "Corporate Road Junction", coordinates: [72.5050, 23.0120] },
                endLocation: { name: "SG Highway Underpass", coordinates: [72.5180, 23.0150] },
                location: { type: "Point", coordinates: [72.5115, 23.0135] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.5050, 23.0120], [72.5115, 23.0135], [72.5180, 23.0150]],
                },
                contractorId: contractors[5]._id,
                inspectionOfficerId: officer1._id,
            },
            {
                roadId: "ROAD-006",
                roadCode: "RC-AHM-006",
                name: "Kankaria Lake Ring Road",
                description: "Scenic circular promenade road surrounding historical Kankaria Lake",
                area: "Maninagar",
                ward: "Ward 22 - Kankaria",
                city: "Ahmedabad",
                state: "Gujarat",
                length: 2.3,
                width: 18.0,
                lanes: 2,
                condition: "CRITICAL",
                healthStatus: "CRITICAL",
                status: "CLOSED",
                closureDetails: {
                    isClosed: true,
                    closureStartDate: new Date("2026-09-15"),
                    expectedReopeningDate: new Date("2026-10-10"),
                    reason: "Emergency Drainage & Pavement Reconstruction",
                    affectedArea: "Gate 1 to Gate 4 Outer Circle",
                    diversionRouteDescription: "Divert via Maninagar Main Road and Railway Station Road",
                    trafficImpact: "HIGH",
                    constructionProgress: 45,
                },
                constructionCost: 9500000,
                currentValue: 6000000,
                startLocation: { name: "Kankaria Gate 1", coordinates: [72.6000, 22.9980] },
                endLocation: { name: "Kankaria Gate 4", coordinates: [72.6080, 23.0030] },
                location: { type: "Point", coordinates: [72.6040, 23.0005] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.6000, 22.9980], [72.6040, 23.0005], [72.6080, 23.0030]],
                },
                contractorId: contractors[0]._id,
                inspectionOfficerId: officer1._id,
            },

            // Surat Roads (5)
            {
                roadId: "ROAD-007",
                roadCode: "RC-SUR-001",
                name: "Dumas Beach Highway Corridor",
                description: "Key coastal tourism and airport access road in South Surat",
                area: "Dumas / Vesu",
                ward: "Ward 30 - Vesu",
                city: "Surat",
                state: "Gujarat",
                length: 12.0,
                width: 32.0,
                lanes: 6,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 35000000,
                currentValue: 34000000,
                startLocation: { name: "Surat Airport Circle", coordinates: [72.7520, 21.1180] },
                endLocation: { name: "Dumas Beach Terminal", coordinates: [72.7150, 21.0850] },
                location: { type: "Point", coordinates: [72.7335, 21.1015] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.7520, 21.1180], [72.7335, 21.1015], [72.7150, 21.0850]],
                },
                contractorId: contractors[1]._id,
                inspectionOfficerId: officer2._id,
            },
            {
                roadId: "ROAD-008",
                roadCode: "RC-SUR-002",
                name: "Ghod Dod Road Avenue",
                description: "High-density retail and residential boulevard",
                area: "Athwa",
                ward: "Ward 21 - Athwa",
                city: "Surat",
                state: "Gujarat",
                length: 4.8,
                width: 24.0,
                lanes: 4,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 20000000,
                currentValue: 19200000,
                startLocation: { name: "Majura Gate Circle", coordinates: [72.8180, 21.1780] },
                endLocation: { name: "Parle Point Junction", coordinates: [72.7950, 21.1650] },
                location: { type: "Point", coordinates: [72.8065, 21.1715] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.8180, 21.1780], [72.8065, 21.1715], [72.7950, 21.1650]],
                },
                contractorId: contractors[1]._id,
                inspectionOfficerId: officer2._id,
            },
            {
                roadId: "ROAD-009",
                roadCode: "RC-SUR-003",
                name: "Varachha Diamond Market Main Road",
                description: "Bustling industrial and diamond manufacturing corridor",
                area: "Varachha",
                ward: "Ward 10 - Varachha East",
                city: "Surat",
                state: "Gujarat",
                length: 6.2,
                width: 28.0,
                lanes: 4,
                condition: "FAIR",
                healthStatus: "WARNING",
                status: "PARTIALLY_CLOSED",
                closureDetails: {
                    isClosed: true,
                    closureStartDate: new Date("2026-09-18"),
                    expectedReopeningDate: new Date("2026-10-02"),
                    reason: "Flyover Expansion & Bitumen Overlay",
                    affectedArea: "Mini Bazar to Baroda Crest Flyover",
                    diversionRouteDescription: "Divert via AK Road and Lambe Hanuman Road",
                    trafficImpact: "HIGH",
                    constructionProgress: 75,
                },
                constructionCost: 24000000,
                currentValue: 20500000,
                startLocation: { name: "Surat Railway Station East", coordinates: [72.8420, 21.2050] },
                endLocation: { name: "Hirabaug Circle", coordinates: [72.8750, 21.2220] },
                location: { type: "Point", coordinates: [72.8585, 21.2135] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.8420, 21.2050], [72.8585, 21.2135], [72.8750, 21.2220]],
                },
                contractorId: contractors[6]._id,
                inspectionOfficerId: officer2._id,
            },
            {
                roadId: "ROAD-010",
                roadCode: "RC-SUR-004",
                name: "Adajan Hazira Expressway Link",
                description: "Heavy industrial export connector route connecting Hazira port",
                area: "Adajan",
                ward: "Ward 18 - Adajan",
                city: "Surat",
                state: "Gujarat",
                length: 15.0,
                width: 36.0,
                lanes: 6,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 48000000,
                currentValue: 46000000,
                startLocation: { name: "Cable Bridge Adajan End", coordinates: [72.7900, 21.1980] },
                endLocation: { name: "Mora Village Junction", coordinates: [72.6800, 21.1500] },
                location: { type: "Point", coordinates: [72.7350, 21.1740] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.7900, 21.1980], [72.7350, 21.1740], [72.6800, 21.1500]],
                },
                contractorId: contractors[6]._id,
                inspectionOfficerId: officer2._id,
            },
            {
                roadId: "ROAD-011",
                roadCode: "RC-SUR-005",
                name: "Vesu VIP Canal Road",
                description: "Modern landscaped canal road with high residential density",
                area: "Vesu",
                ward: "Ward 31 - Vesu South",
                city: "Surat",
                state: "Gujarat",
                length: 5.5,
                width: 26.0,
                lanes: 4,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 19500000,
                currentValue: 19000000,
                startLocation: { name: "University Circle", coordinates: [72.7820, 21.1550] },
                endLocation: { name: "Abhwa Canal Bridge", coordinates: [72.7550, 21.1320] },
                location: { type: "Point", coordinates: [72.7685, 21.1435] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.7820, 21.1550], [72.7685, 21.1435], [72.7550, 21.1320]],
                },
                contractorId: contractors[1]._id,
                inspectionOfficerId: officer2._id,
            },

            // Gandhinagar Roads (4)
            {
                roadId: "ROAD-012",
                roadCode: "RC-GAN-001",
                name: "GIFT City Expressway Boulevard",
                description: "Smart 8-lane global financial city access highway",
                area: "GIFT City",
                ward: "GIFT SEZ Zone",
                city: "Gandhinagar",
                state: "Gujarat",
                length: 7.5,
                width: 45.0,
                lanes: 8,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 65000000,
                currentValue: 64000000,
                startLocation: { name: "Koba Circle", coordinates: [72.6200, 23.1600] },
                endLocation: { name: "GIFT One Tower Gate", coordinates: [72.6850, 23.1580] },
                location: { type: "Point", coordinates: [72.6525, 23.1590] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.6200, 23.1600], [72.6525, 23.1590], [72.6850, 23.1580]],
                },
                contractorId: contractors[2]._id,
                inspectionOfficerId: inspector3._id,
            },
            {
                roadId: "ROAD-013",
                roadCode: "RC-GAN-002",
                name: "CH-3 Secretariat Central Avenue",
                description: "Government administrative spine road connecting Vidhan Sabha",
                area: "Sector 10",
                ward: "Capital Ward 1",
                city: "Gandhinagar",
                state: "Gujarat",
                length: 5.0,
                width: 30.0,
                lanes: 6,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 21000000,
                currentValue: 20000000,
                startLocation: { name: "CH-0 Circle", coordinates: [72.6400, 23.2000] },
                endLocation: { name: "CH-6 Circle", coordinates: [72.6600, 23.2450] },
                location: { type: "Point", coordinates: [72.6500, 23.2225] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.6400, 23.2000], [72.6500, 23.2225], [72.6600, 23.2450]],
                },
                contractorId: contractors[2]._id,
                inspectionOfficerId: inspector3._id,
            },
            {
                roadId: "ROAD-014",
                roadCode: "RC-GAN-003",
                name: "Infocity IT Corridor Road",
                description: "High-tech software park avenue with heavy commuter transit",
                area: "Infocity / Sector 0",
                ward: "Capital Ward 4",
                city: "Gandhinagar",
                state: "Gujarat",
                length: 3.8,
                width: 24.0,
                lanes: 4,
                condition: "FAIR",
                healthStatus: "WARNING",
                status: "UNDER_MAINTENANCE",
                closureDetails: {
                    isClosed: false,
                    closureStartDate: new Date("2026-09-22"),
                    expectedReopeningDate: new Date("2026-10-04"),
                    reason: "Fiber Cable Laying & Patchwork",
                    affectedArea: "Infocity Gate 1 to DA-IICT Corner",
                    diversionRouteDescription: "Single lane operational with flaggers",
                    trafficImpact: "MEDIUM",
                    constructionProgress: 50,
                },
                constructionCost: 14000000,
                currentValue: 12500000,
                startLocation: { name: "GH-0 Circle", coordinates: [72.6280, 23.1850] },
                endLocation: { name: "Indroda Park Cross Roads", coordinates: [72.6450, 23.1950] },
                location: { type: "Point", coordinates: [72.6365, 23.1900] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.6280, 23.1850], [72.6365, 23.1900], [72.6450, 23.1950]],
                },
                contractorId: contractors[2]._id,
                inspectionOfficerId: inspector3._id,
            },
            {
                roadId: "ROAD-015",
                roadCode: "RC-GAN-004",
                name: "Koba - Airport Link Highway",
                description: "State highway link to Ahmedabad International Airport",
                area: "Koba",
                ward: "Capital Suburbs",
                city: "Gandhinagar",
                state: "Gujarat",
                length: 9.2,
                width: 32.0,
                lanes: 6,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 31000000,
                currentValue: 29500000,
                startLocation: { name: "Koba Circle Gandhinagar", coordinates: [72.6250, 23.1550] },
                endLocation: { name: "Apollo Hospital Circle", coordinates: [72.6100, 23.1000] },
                location: { type: "Point", coordinates: [72.6175, 23.1275] },
                geometry: {
                    type: "LineString",
                    coordinates: [[72.6250, 23.1550], [72.6175, 23.1275], [72.6100, 23.1000]],
                },
                contractorId: contractors[2]._id,
                inspectionOfficerId: inspector3._id,
            },

            // Vadodara Roads (5)
            {
                roadId: "ROAD-016",
                roadCode: "RC-VAD-001",
                name: "Alkapuri RC Dutt Main Road",
                description: "Central business district street with heritage structures",
                area: "Alkapuri",
                ward: "Ward 4 - Alkapuri",
                city: "Vadodara",
                state: "Gujarat",
                length: 3.5,
                width: 24.0,
                lanes: 4,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 16000000,
                currentValue: 15200000,
                startLocation: { name: "Vadodara Station West", coordinates: [73.1810, 22.3100] },
                endLocation: { name: "Inox Circle Alkapuri", coordinates: [73.1650, 22.3180] },
                location: { type: "Point", coordinates: [73.1730, 22.3140] },
                geometry: {
                    type: "LineString",
                    coordinates: [[73.1810, 22.3100], [73.1730, 22.3140], [73.1650, 22.3180]],
                },
                contractorId: contractors[3]._id,
                inspectionOfficerId: inspector1._id,
            },
            {
                roadId: "ROAD-017",
                roadCode: "RC-VAD-002",
                name: "OP Road Commercial Spine",
                description: "Old Padra arterial commercial avenue",
                area: "Old Padra Road",
                ward: "Ward 9 - OP Road",
                city: "Vadodara",
                state: "Gujarat",
                length: 6.0,
                width: 28.0,
                lanes: 4,
                condition: "POOR",
                healthStatus: "WARNING",
                status: "PARTIALLY_CLOSED",
                closureDetails: {
                    isClosed: true,
                    closureStartDate: new Date("2026-09-24"),
                    expectedReopeningDate: new Date("2026-10-08"),
                    reason: "Storm Water Pipeline Repair & Pothole Filling",
                    affectedArea: "Bird Circle to Malhar Point",
                    diversionRouteDescription: "Divert traffic via Vasna Road and Akota Stadium Link",
                    trafficImpact: "MEDIUM",
                    constructionProgress: 35,
                },
                constructionCost: 22000000,
                currentValue: 18000000,
                startLocation: { name: "Akota Stadium Circle", coordinates: [73.1600, 22.2980] },
                endLocation: { name: "Subhanpura High Street", coordinates: [73.1400, 22.3150] },
                location: { type: "Point", coordinates: [73.1500, 22.3065] },
                geometry: {
                    type: "LineString",
                    coordinates: [[73.1600, 22.2980], [73.1500, 22.3065], [73.1400, 22.3150]],
                },
                contractorId: contractors[3]._id,
                inspectionOfficerId: inspector1._id,
            },
            {
                roadId: "ROAD-018",
                roadCode: "RC-VAD-003",
                name: "Sayajiganj University Circle Road",
                description: "Educational and cultural district avenue surrounding MSU",
                area: "Sayajiganj",
                ward: "Ward 2 - Sayajiganj",
                city: "Vadodara",
                state: "Gujarat",
                length: 2.8,
                width: 20.0,
                lanes: 4,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 11000000,
                currentValue: 10800000,
                startLocation: { name: "Kala Ghoda Circle", coordinates: [73.1900, 22.3120] },
                endLocation: { name: "MSU Dome Gate", coordinates: [73.1850, 22.3210] },
                location: { type: "Point", coordinates: [73.1875, 22.3165] },
                geometry: {
                    type: "LineString",
                    coordinates: [[73.1900, 22.3120], [73.1875, 22.3165], [73.1850, 22.3210]],
                },
                contractorId: contractors[3]._id,
                inspectionOfficerId: inspector1._id,
            },
            {
                roadId: "ROAD-019",
                roadCode: "RC-VAD-004",
                name: "Vasna - Bhayli Smart Expressway",
                description: "Rapidly expanding residential suburb boulevard",
                area: "Bhayli",
                ward: "Ward 12 - Bhayli",
                city: "Vadodara",
                state: "Gujarat",
                length: 7.2,
                width: 30.0,
                lanes: 6,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 27000000,
                currentValue: 26000000,
                startLocation: { name: "Vasna Canal Cross", coordinates: [73.1350, 22.2850] },
                endLocation: { name: "Bhayli Railway Station Flyover", coordinates: [73.1020, 22.2700] },
                location: { type: "Point", coordinates: [73.1185, 22.2775] },
                geometry: {
                    type: "LineString",
                    coordinates: [[73.1350, 22.2850], [73.1185, 22.2775], [73.1020, 22.2700]],
                },
                contractorId: contractors[3]._id,
                inspectionOfficerId: inspector1._id,
            },
            {
                roadId: "ROAD-020",
                roadCode: "RC-VAD-005",
                name: "Makarpura GIDC Industrial Highway",
                description: "Heavy logistics industrial manufacturing corridor",
                area: "Makarpura",
                ward: "Ward 15 - Makarpura",
                city: "Vadodara",
                state: "Gujarat",
                length: 11.0,
                width: 32.0,
                lanes: 6,
                condition: "FAIR",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 38000000,
                currentValue: 34000000,
                startLocation: { name: "Makarpura Bus Depot", coordinates: [73.1950, 22.2400] },
                endLocation: { name: "NH-48 Junction", coordinates: [73.2150, 22.2000] },
                location: { type: "Point", coordinates: [73.2050, 22.2200] },
                geometry: {
                    type: "LineString",
                    coordinates: [[73.1950, 22.2400], [73.2050, 22.2200], [73.2150, 22.2000]],
                },
                contractorId: contractors[3]._id,
                inspectionOfficerId: inspector1._id,
            },

            // Rajkot Roads (5)
            {
                roadId: "ROAD-021",
                roadCode: "RC-RAJ-001",
                name: "150 Feet Ring Road Corridor",
                description: "Rajkot city's primary peripheral traffic loop",
                area: "Kalawad Road Corner",
                ward: "Ward 10 - Rajkot West",
                city: "Rajkot",
                state: "Gujarat",
                length: 14.5,
                width: 40.0,
                lanes: 6,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 52000000,
                currentValue: 50000000,
                startLocation: { name: "Mondhia Circle", coordinates: [70.7650, 22.2750] },
                endLocation: { name: "Kuvadva Road Junction", coordinates: [70.8250, 22.3250] },
                location: { type: "Point", coordinates: [70.7950, 22.3000] },
                geometry: {
                    type: "LineString",
                    coordinates: [[70.7650, 22.2750], [70.7950, 22.3000], [70.8250, 22.3250]],
                },
                contractorId: contractors[4]._id,
                inspectionOfficerId: inspector2._id,
            },
            {
                roadId: "ROAD-022",
                roadCode: "RC-RAJ-002",
                name: "Kalawad Road University Highway",
                description: "Saurashtra University and medical hub highway",
                area: "University Area",
                ward: "Ward 8 - Kalawad",
                city: "Rajkot",
                state: "Gujarat",
                length: 8.0,
                width: 30.0,
                lanes: 4,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 26000000,
                currentValue: 25200000,
                startLocation: { name: "Mahila College Circle", coordinates: [70.7920, 22.2900] },
                endLocation: { name: "Metoda GIDC Gate", coordinates: [70.7200, 22.2600] },
                location: { type: "Point", coordinates: [70.7560, 22.2750] },
                geometry: {
                    type: "LineString",
                    coordinates: [[70.7920, 22.2900], [70.7560, 22.2750], [70.7200, 22.2600]],
                },
                contractorId: contractors[4]._id,
                inspectionOfficerId: inspector2._id,
            },
            {
                roadId: "ROAD-023",
                roadCode: "RC-RAJ-003",
                name: "Yagnik Road Commercial Boulevard",
                description: "Heritage city center retail corridor",
                area: "Jilla Panchayat Circle",
                ward: "Ward 3 - Central Rajkot",
                city: "Rajkot",
                state: "Gujarat",
                length: 3.1,
                width: 22.0,
                lanes: 4,
                condition: "POOR",
                healthStatus: "CRITICAL",
                status: "CLOSED",
                closureDetails: {
                    isClosed: true,
                    closureStartDate: new Date("2026-09-21"),
                    expectedReopeningDate: new Date("2026-10-06"),
                    reason: "Asphalt Concrete Overhaul & Underground Utilities",
                    affectedArea: "Ramkrishna Ashram to Imperial Palace",
                    diversionRouteDescription: "Divert via Tagore Road and Kasturba Road",
                    trafficImpact: "HIGH",
                    constructionProgress: 55,
                },
                constructionCost: 12000000,
                currentValue: 9000000,
                startLocation: { name: "Astron Circle", coordinates: [70.7980, 22.2950] },
                endLocation: { name: "Trikon Baug", coordinates: [70.8060, 22.3020] },
                location: { type: "Point", coordinates: [70.8020, 22.2985] },
                geometry: {
                    type: "LineString",
                    coordinates: [[70.7980, 22.2950], [70.8020, 22.2985], [70.8060, 22.3020]],
                },
                contractorId: contractors[4]._id,
                inspectionOfficerId: inspector2._id,
            },
            {
                roadId: "ROAD-024",
                roadCode: "RC-RAJ-004",
                name: "Aji Dam Riverfront Road",
                description: "Recreational waterfront boulevard along Aji river",
                area: "Aji Vasahat",
                ward: "Ward 14 - East Rajkot",
                city: "Rajkot",
                state: "Gujarat",
                length: 5.4,
                width: 24.0,
                lanes: 4,
                condition: "GOOD",
                healthStatus: "HEALTHY",
                status: "OPEN",
                constructionCost: 17500000,
                currentValue: 17000000,
                startLocation: { name: "Chunarawad Chowk", coordinates: [70.8250, 22.2850] },
                endLocation: { name: "Aji Dam Gate 1", coordinates: [70.8450, 22.2600] },
                location: { type: "Point", coordinates: [70.8350, 22.2725] },
                geometry: {
                    type: "LineString",
                    coordinates: [[70.8250, 22.2850], [70.8350, 22.2725], [70.8450, 22.2600]],
                },
                contractorId: contractors[4]._id,
                inspectionOfficerId: inspector2._id,
            },
            {
                roadId: "ROAD-025",
                roadCode: "RC-RAJ-005",
                name: "AIIMS Rajkot Connector Highway",
                description: "Newly planned medical expressway link to AIIMS Khandheri",
                area: "Khandheri",
                ward: "Rajkot North Extension",
                city: "Rajkot",
                state: "Gujarat",
                length: 10.2,
                width: 36.0,
                lanes: 6,
                condition: "EXCELLENT",
                healthStatus: "HEALTHY",
                status: "UNDER_CONSTRUCTION",
                constructionCost: 42000000,
                currentValue: 41000000,
                startLocation: { name: "Jamnagar Highway Bypass", coordinates: [70.7500, 22.3300] },
                endLocation: { name: "AIIMS Main Campus Gate", coordinates: [70.7100, 22.3700] },
                location: { type: "Point", coordinates: [70.7300, 22.3500] },
                geometry: {
                    type: "LineString",
                    coordinates: [[70.7500, 22.3300], [70.7300, 22.3500], [70.7100, 22.3700]],
                },
                contractorId: contractors[4]._id,
                inspectionOfficerId: inspector2._id,
            },
        ];

        const roads = [];
        for (const r of sampleRoadsRaw) {
            const road = new Road({
                ...r,
                createdBy: adminUser._id,
                updatedBy: adminUser._id,
                lastInspectionDate: new Date("2026-08-15"),
                nextInspectionDate: new Date("2026-11-15"),
                lastMaintenanceDate: new Date("2026-07-01"),
                nextMaintenanceDate: new Date("2026-12-01"),
                constructionStartDate: new Date("2023-01-10"),
                constructionEndDate: new Date("2024-03-30"),
                warrantyStartDate: new Date("2024-04-01"),
                warrantyEndDate: new Date("2027-04-01"),
                defectLiabilityStartDate: new Date("2024-04-01"),
                defectLiabilityEndDate: new Date("2026-04-01"),
            });
            await road.save();
            roads.push(road);
        }
        console.log(`Seeded ${roads.length} Road Assets successfully.`);

        // ==========================================
        // 4. CREATE ROAD ISSUES (40 Issues / Complaints)
        // ==========================================
        console.log("\nSeeding Road Issues / Complaints...");

        // Severity Distribution required:
        // Critical: 5% (~2)
        // High: 20% (~8)
        // Medium: 45% (~18)
        // Low: 30% (~12)
        const categories = [
            "POTHOLE",
            "POTHOLE",
            "CRACK",
            "DAMAGED_SURFACE",
            "WATER_LOGGING",
            "DRAINAGE",
            "ROAD_MARKING",
            "TRAFFIC_SAFETY",
            "STREET_OBSTRUCTION",
            "ACCIDENT_RISK",
            "DAMAGED_DIVIDER",
            "DAMAGED_FOOTPATH",
        ];

        const complaintsData = [];
        let count = 0;

        // Generate 40 issues spread over the 25 roads
        for (let i = 0; i < 40; i++) {
            const road = roads[i % roads.length];

            let severity = "medium"; // Default Medium
            if (i < 2) severity = "high"; // (Mapped as critical priority)
            else if (i < 10) severity = "high";
            else if (i < 28) severity = "medium";
            else severity = "low";

            const category = categories[i % categories.length];
            const reporter = users[7 + (i % 5)]; // Cycle through customer users
            const assignedOfficer = (road.city === "Surat") ? officer2 : officer1;

            let status = "pending";
            if (i % 3 === 0) status = "resolved";
            else if (i % 2 === 0) status = "in_progress";
            else status = "pending";

            // Generate offset coordinates near the road center
            const lngOffset = (Math.random() - 0.5) * 0.008;
            const latOffset = (Math.random() - 0.5) * 0.008;
            const compLng = road.location.coordinates[0] + lngOffset;
            const compLat = road.location.coordinates[1] + latOffset;

            complaintsData.push({
                title: `${category.replace(/_/g, " ")} reported on ${road.name}`,
                description: `Sample demo report: Observed severe ${category.toLowerCase().replace(/_/g, " ")} causing inconvenience to commuters near ${road.area}. Immediate repair suggested.`,
                roadId: road._id,
                user_id: reporter._id,
                assigned_officer_id: assignedOfficer._id,
                category: category,
                severity: severity,
                status: status,
                priority: severity === "high" ? 9 : (severity === "medium" ? 5 : 2),
                address: `${road.name}, ${road.area}, ${road.city}`,
                location: {
                    type: "Point",
                    coordinates: [compLng, compLat],
                },
                upvote: Math.floor(Math.random() * 15),
                downvote: Math.floor(Math.random() * 2),
                officer_notes: status !== "pending" ? "Officer inspected site and dispatched repair crew." : "",
            });
        }

        const complaints = await Complaint.insertMany(complaintsData);
        console.log(`Seeded ${complaints.length} Road Issues / Complaints successfully.`);

        // ==========================================
        // 5. CREATE INSPECTION DATA (25 Records)
        // ==========================================
        console.log("\nSeeding Road Inspection Records...");

        const inspectionTypes = [
            "Routine road inspection",
            "Maintenance inspection",
            "Quality inspection",
            "Post-maintenance inspection",
            "Pre-construction inspection",
            "Emergency inspection",
        ];

        const inspectionResults = ["PASSED", "PASSED", "PASSED", "REQUIRES_CORRECTION", "FAILED"];
        const inspectors = [inspector1, inspector2, inspector3, officer1];

        const inspectionsData = [];
        for (let i = 0; i < 25; i++) {
            const road = roads[i % roads.length];
            const inspector = inspectors[i % inspectors.length];
            const inspResult = inspectionResults[i % inspectionResults.length];

            inspectionsData.push({
                inspectionId: `INSP-2026-${100 + i}`,
                roadId: road._id,
                officerId: inspector._id,
                inspectionDate: new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000)),
                inspectionType: inspectionTypes[i % inspectionTypes.length],
                roadCondition: road.condition,
                materialQuality: inspResult === "PASSED" ? "SATISFACTORY" : "DEFECTIVE",
                surfaceQuality: inspResult === "PASSED" ? "SMOOTH" : "POTHOLES",
                roadThickness: 12 + (i % 5),
                roadWidth: road.width,
                drainageCondition: inspResult === "PASSED" ? "FUNCTIONAL" : "BLOCKED",
                cracksObserved: inspResult !== "PASSED",
                potholesObserved: inspResult === "FAILED",
                safetyIssues: inspResult !== "PASSED" ? "Inadequate road markings and minor shoulder degradation." : "None",
                remarks: `Standard quality control check conducted on ${road.name}. Result: ${inspResult}.`,
                result: inspResult,
            });
        }

        const inspections = await Inspection.insertMany(inspectionsData);
        console.log(`Seeded ${inspections.length} Inspections successfully.`);

        // ==========================================
        // 6. CREATE MAINTENANCE WORK ORDERS (20 Records)
        // ==========================================
        console.log("\nSeeding Maintenance Work Orders...");

        const maintenanceTypes = [
            "POTHOLE_REPAIR",
            "RESURFACING",
            "CRACK_REPAIR",
            "DRAINAGE_REPAIR",
            "ROAD_MARKING",
            "EMERGENCY_REPAIR",
            "STRUCTURAL_REPAIR",
            "ROUTINE",
        ];

        const maintenanceStatuses = ["SCHEDULED", "IN_PROGRESS", "COMPLETED", "COMPLETED"];

        const maintenanceData = [];
        for (let i = 0; i < 20; i++) {
            const road = roads[i % roads.length];
            const complaint = complaints[i % complaints.length];
            const contractorObj = contractors[i % contractors.length];
            const maintStatus = maintenanceStatuses[i % maintenanceStatuses.length];

            maintenanceData.push({
                maintenanceId: `WO-2026-${500 + i}`,
                roadId: road._id,
                complaintId: complaint._id,
                technicianId: contractorUser._id,
                type: maintenanceTypes[i % maintenanceTypes.length],
                status: maintStatus,
                description: `Work order for ${maintenanceTypes[i % maintenanceTypes.length].replace(/_/g, " ")} on ${road.name} near ${road.area}.`,
                cost: 45000 + (i * 12500),
                startDate: new Date(Date.now() - (i * 4 * 24 * 60 * 60 * 1000)),
                completionDate: maintStatus === "COMPLETED" ? new Date(Date.now() - (i * 2 * 24 * 60 * 60 * 1000)) : undefined,
                nextMaintenanceDate: new Date(Date.now() + (90 * 24 * 60 * 60 * 1000)),
                maintenanceFrequency: "Quarterly",
                notes: `Assigned to ${contractorObj.companyName}. Status: ${maintStatus}.`,
                createdBy: officer1._id,
            });
        }

        const maintenanceRecords = await Maintenance.insertMany(maintenanceData);
        console.log(`Seeded ${maintenanceRecords.length} Maintenance Work Orders successfully.`);

        // ==========================================
        // 7. CREATE ROAD LIFECYCLE HISTORY
        // ==========================================
        console.log("\nSeeding Road Lifecycle History...");

        const historyEvents = [
            { type: "PROPOSAL_CREATED", desc: "Initial road infrastructure project proposed by urban authority." },
            { type: "FEASIBILITY_PASSED", desc: "Environmental and traffic feasibility study cleared." },
            { type: "BUDGET_APPROVED", desc: "Municipal capital allocation approved by finance committee." },
            { type: "TENDER_PUBLISHED", desc: "Public tender published for construction & surfacing." },
            { type: "CONTRACTOR_AWARDED", desc: "Contract awarded following competitive bidding." },
            { type: "CONSTRUCTION_STARTED", desc: "Heavy civil construction works commenced on site." },
            { type: "INSPECTION_PASSED", desc: "Quality assurance test passed by certified road inspector." },
            { type: "ROAD_ACTIVATED", desc: "Road commissioned and opened for public transit." },
            { type: "ROUTINE_INSPECTION", desc: "Periodic health inspection conducted." },
            { type: "MAINTENANCE_REQUIRED", desc: "Routine resurfacing work scheduled." },
            { type: "REPAIR_COMPLETED", desc: "Patchwork and bitumen resurfacing completed successfully." },
        ];

        const historyData = [];
        for (const road of roads) {
            // Generate 4-6 historical timeline events per road
            const eventCount = 4 + Math.floor(Math.random() * 3);
            for (let k = 0; k < eventCount; k++) {
                const ev = historyEvents[k % historyEvents.length];
                historyData.push({
                    roadId: road._id,
                    eventType: ev.type,
                    description: `${ev.desc} (${road.name})`,
                    date: new Date(Date.now() - ((10 - k) * 30 * 24 * 60 * 60 * 1000)),
                    performedBy: adminUser._id,
                    relatedCost: k === 2 ? road.constructionCost : (k === 10 ? 150000 : 0),
                    previousStatus: k === 0 ? "PLANNED" : "UNDER_CONSTRUCTION",
                    newStatus: road.status,
                });
            }
        }

        const historyEntries = await RoadLifecycleHistory.insertMany(historyData);
        console.log(`Seeded ${historyEntries.length} Road Lifecycle History events successfully.`);

        // Count closures
        const closedRoadsCount = roads.filter((r) => r.status === "CLOSED" || r.status === "PARTIALLY_CLOSED" || r.status === "UNDER_MAINTENANCE").length;

        console.log(`
==================================================
  DEMO DATA SEEDED SUCCESSFULLY
==================================================
  Users:        ${users.length}
  Roads:        ${roads.length}
  Issues:       ${complaints.length}
  Inspections:  ${inspections.length}
  Maintenance:  ${maintenanceRecords.length}
  Contractors:  ${contractors.length}
  Closures:     ${closedRoadsCount}
  History Log:  ${historyEntries.length}
==================================================
`);

        process.exit(0);
    } catch (error) {
        console.error("FATAL ERROR seeding database:", error);
        process.exit(1);
    }
};

seedDatabase();
