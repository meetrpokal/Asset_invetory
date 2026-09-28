import axiosInstance from "./axios";

// Road Asset APIs
export const getRoads = async (params = {}) => {
    const res = await axiosInstance.get("/roads", { params });
    return res.data;
};

export const getNearbyRoads = async (params = {}) => {
    const res = await axiosInstance.get("/roads/nearby", { params });
    return res.data;
};

export const getPublicRoadById = async (id) => {
    const res = await axiosInstance.get(`/roads/public/${id}`);
    return res.data;
};

export const seedDemoData = async () => {
    const res = await axiosInstance.post("/roads/seed-demo");
    return res.data;
};

export const getRoadById = async (id) => {
    const res = await axiosInstance.get(`/roads/${id}`);
    return res.data;
};

export const createRoad = async (data) => {
    const res = await axiosInstance.post("/roads", data);
    return res.data;
};

export const updateRoad = async (id, data) => {
    const res = await axiosInstance.put(`/roads/${id}`, data);
    return res.data;
};

export const updateRoadLifecycle = async (id, data) => {
    const res = await axiosInstance.put(`/roads/${id}/lifecycle`, data);
    return res.data;
};

export const updateRoadClosure = async (id, data) => {
    const res = await axiosInstance.put(`/roads/${id}/closure`, data);
    return res.data;
};

// Road Project Proposals APIs
export const getRoadProjects = async (params = {}) => {
    const res = await axiosInstance.get("/road-projects", { params });
    return res.data;
};

export const getRoadProjectById = async (id) => {
    const res = await axiosInstance.get(`/road-projects/${id}`);
    return res.data;
};

export const createRoadProject = async (data) => {
    const res = await axiosInstance.post("/road-projects", data);
    return res.data;
};

export const updateMaterialsAndCosts = async (id, data) => {
    const res = await axiosInstance.put(`/road-projects/${id}/materials`, data);
    return res.data;
};

export const updateConstructionProgress = async (id, data) => {
    const res = await axiosInstance.put(`/road-projects/${id}/progress`, data);
    return res.data;
};

export const updateProjectStatus = async (id, data) => {
    const res = await axiosInstance.put(`/road-projects/${id}/status`, data);
    return res.data;
};

export const convertProjectToRoadAsset = async (id) => {
    const res = await axiosInstance.post(`/road-projects/${id}/convert-to-road`);
    return res.data;
};

// Budget APIs
export const getAnnualBudget = async (params = {}) => {
    const res = await axiosInstance.get("/budget", { params });
    return res.data;
};

export const allocateBudget = async (data) => {
    const res = await axiosInstance.post("/budget/allocate", data);
    return res.data;
};

// Tender APIs
export const getTenders = async (params = {}) => {
    const res = await axiosInstance.get("/tenders", { params });
    return res.data;
};

export const createTender = async (data) => {
    const res = await axiosInstance.post("/tenders", data);
    return res.data;
};

export const submitContractorBid = async (id, data) => {
    const res = await axiosInstance.post(`/tenders/${id}/bids`, data);
    return res.data;
};

export const awardTenderToContractor = async (id, data) => {
    const res = await axiosInstance.post(`/tenders/${id}/award`, data);
    return res.data;
};

// Contractor APIs
export const getContractors = async (params = {}) => {
    const res = await axiosInstance.get("/contractors", { params });
    return res.data;
};

export const getContractorById = async (id) => {
    const res = await axiosInstance.get(`/contractors/${id}`);
    return res.data;
};

export const createContractor = async (data) => {
    const res = await axiosInstance.post("/contractors", data);
    return res.data;
};

// Inspection APIs
export const getInspections = async (params = {}) => {
    const res = await axiosInstance.get("/inspections", { params });
    return res.data;
};

export const createInspection = async (data) => {
    const res = await axiosInstance.post("/inspections", data);
    return res.data;
};

// Audit Logs APIs
export const getAuditLogs = async (params = {}) => {
    const res = await axiosInstance.get("/audit-logs", { params });
    return res.data;
};
