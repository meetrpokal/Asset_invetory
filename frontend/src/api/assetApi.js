import axiosInstance from "./axios";

export const getAssetTypes = async () => {
    const res = await axiosInstance.get("/assets/types");
    return res.data;
};

export const createAssetType = async (data) => {
    const res = await axiosInstance.post("/assets/types", data);
    return res.data;
};

export const getAssets = async (params = {}) => {
    const res = await axiosInstance.get("/assets", { params });
    return res.data;
};

export const getNearbyAssets = async (params = {}) => {
    const res = await axiosInstance.get("/assets/nearby", { params });
    return res.data;
};

export const getAssetById = async (id) => {
    const res = await axiosInstance.get(`/assets/${id}`);
    return res.data;
};

export const createAsset = async (data) => {
    const res = await axiosInstance.post("/assets", data);
    return res.data;
};

export const updateAsset = async (id, data) => {
    const res = await axiosInstance.put(`/assets/${id}`, data);
    return res.data;
};

export const updateAssetLifecycle = async (id, data) => {
    const res = await axiosInstance.put(`/assets/${id}/lifecycle`, data);
    return res.data;
};

export const deleteAsset = async (id) => {
    const res = await axiosInstance.delete(`/assets/${id}`);
    return res.data;
};

// Maintenance APIs
export const getMaintenanceList = async (params = {}) => {
    const res = await axiosInstance.get("/maintenance", { params });
    return res.data;
};

export const getPreventiveDashboard = async () => {
    const res = await axiosInstance.get("/maintenance/preventive");
    return res.data;
};

export const createMaintenance = async (data) => {
    const res = await axiosInstance.post("/maintenance", data);
    return res.data;
};

export const updateMaintenance = async (id, data) => {
    const res = await axiosInstance.put(`/maintenance/${id}`, data);
    return res.data;
};

// Complaint Reopen & Link Asset APIs
export const reopenComplaint = async (id, data) => {
    const res = await axiosInstance.post(`/complaints/${id}/reopen`, data);
    return res.data;
};

export const linkAssetToComplaint = async (id, data) => {
    const res = await axiosInstance.put(`/complaints/${id}/link-asset`, data);
    return res.data;
};
