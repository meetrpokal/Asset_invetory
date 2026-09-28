import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAssets, getAssetTypes } from "../api/assetApi";
import {
  Plus,
  Search,
  Grid,
  List,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Activity,
  Layers,
  MapPin,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./AssetInventory.css";

export default function AssetInventory() {
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedHealth, setSelectedHealth] = useState("");
  const [selectedCriticality, setSelectedCriticality] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const fetchAssetTypesData = async () => {
    try {
      const res = await getAssetTypes();
      if (res.success) setAssetTypes(res.data || []);
    } catch (err) {
      console.error("Error fetching asset types:", err);
    }
  };

  const fetchAssetsData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getAssets({
        search,
        assetType: selectedType,
        status: selectedStatus,
        health: selectedHealth,
        criticality: selectedCriticality,
        page,
        limit: 12,
      });
      if (res.success) {
        setAssets(res.data || []);
        setPagination(res.pagination || { page: 1, totalPages: 1, total: 0 });
      }
    } catch (err) {
      console.error("Error fetching assets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetTypesData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAssetsData(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedType, selectedStatus, selectedHealth, selectedCriticality]);

  // Compute stat metrics
  const activeCount = assets.filter((a) => a.status === "ACTIVE").length;
  const maintenanceCount = assets.filter((a) => a.status === "MAINTENANCE").length;
  const warningCriticalCount = assets.filter(
    (a) => a.health === "WARNING" || a.health === "CRITICAL"
  ).length;

  return (
    <>
      <Navbar />
      <div className="asset-inventory-container">
        {/* Header Section */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Infrastructure Asset Inventory</h1>
            <p>Monitor, track, and manage all municipal government infrastructure lifecycle assets</p>
          </div>
          <Link to="/assets/new" className="btn-create-asset">
            <Plus size={18} /> Register New Asset
          </Link>
        </div>

        {/* Top Metric Cards */}
        <div className="asset-stats-grid">
          <div className="asset-stat-card">
            <div className="stat-icon-wrapper blue">
              <Layers size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{pagination.total || assets.length}</div>
              <div className="stat-label">Total Infrastructure Assets</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{activeCount}</div>
              <div className="stat-label">Active Operational Assets</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper amber">
              <Wrench size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{maintenanceCount}</div>
              <div className="stat-label">In Maintenance</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper red">
              <ShieldAlert size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{warningCriticalCount}</div>
              <div className="stat-label">Warning / Critical Health</div>
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="asset-filter-bar">
          <div className="filter-row-top">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search by Asset ID, Code, Name, or Address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Asset Types</option>
              {assetTypes.map((t) => (
                <option key={t._id || t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>

            <select
              className="filter-select"
              value={selectedHealth}
              onChange={(e) => setSelectedHealth(e.target.value)}
            >
              <option value="">All Health Conditions</option>
              <option value="HEALTHY">HEALTHY</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="UNKNOWN">UNKNOWN</option>
            </select>

            <select
              className="filter-select"
              value={selectedCriticality}
              onChange={(e) => setSelectedCriticality(e.target.value)}
            >
              <option value="">All Criticalities</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>

          {/* Status Pills */}
          <div className="filter-pills-row">
            <span style={{ fontSize: "0.85rem", color: "#9CA3AF", marginRight: "0.5rem" }}>
              Status:
            </span>
            {["", "ACTIVE", "MAINTENANCE", "PLANNED", "DEPLOYED", "DAMAGED", "RETIRED", "DISPOSED"].map(
              (st) => (
                <button
                  key={st}
                  className={`pill-btn ${selectedStatus === st ? "active" : ""}`}
                  onClick={() => setSelectedStatus(st)}
                >
                  {st === "" ? "ALL" : st}
                </button>
              )
            )}

            <div className="view-toggle-btns">
              <button
                className={`view-toggle-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={16} /> Grid
              </button>
              <button
                className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
              >
                <List size={16} /> Table
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Infrastructure Assets...</p>
          </div>
        ) : assets.length === 0 ? (
          <div className="no-assets-empty">
            <AlertTriangle size={48} style={{ color: "#F59E0B", marginBottom: "1rem" }} />
            <h3>No Infrastructure Assets Found</h3>
            <p>Try adjusting your search query or filter criteria, or register a new asset.</p>
            <Link to="/assets/new" className="btn-create-asset" style={{ marginTop: "1rem" }}>
              <Plus size={18} /> Register First Asset
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="assets-grid">
            {assets.map((asset) => (
              <div key={asset._id} className="asset-card">
                <div className="asset-card-header">
                  <div>
                    <span className="asset-code-tag">{asset.assetCode}</span>
                    <h3 className="asset-card-title">{asset.name}</h3>
                    <div className="asset-type-badge">
                      <Layers size={14} /> {asset.assetType}
                    </div>
                  </div>
                  <span className={`health-badge health-${asset.health}`}>
                    {asset.health}
                  </span>
                </div>

                <div className="asset-card-body">
                  <div className="asset-detail-row">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge status-${asset.status}`}>
                      {asset.status}
                    </span>
                  </div>

                  <div className="asset-detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">
                      {asset.departmentId?.name || "General Infra"}
                    </span>
                  </div>

                  <div className="asset-detail-row">
                    <span className="detail-label">Criticality:</span>
                    <span className={`criticality-badge crit-${asset.criticality}`}>
                      {asset.criticality}
                    </span>
                  </div>

                  <div className="asset-detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <MapPin size={14} color="#60A5FA" />
                      {asset.address || asset.area || "City Grid"}
                    </span>
                  </div>
                </div>

                <div className="asset-card-footer">
                  <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                    ID: {asset.assetId}
                  </span>
                  <Link to={`/assets/${asset._id}`} className="btn-view-details">
                    Details & Audit <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Asset Code / ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Department</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Health</th>
                  <th>Criticality</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset._id}>
                    <td>
                      <strong>{asset.assetCode}</strong>
                      <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{asset.assetId}</div>
                    </td>
                    <td style={{ fontWeight: "600" }}>{asset.name}</td>
                    <td>{asset.assetType}</td>
                    <td>{asset.departmentId?.name || "General Infra"}</td>
                    <td>{asset.address || asset.area || "Surat"}</td>
                    <td>
                      <span className={`status-badge status-${asset.status}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td>
                      <span className={`health-badge health-${asset.health}`}>
                        {asset.health}
                      </span>
                    </td>
                    <td>
                      <span className={`criticality-badge crit-${asset.criticality}`}>
                        {asset.criticality}
                      </span>
                    </td>
                    <td>
                      <Link to={`/assets/${asset._id}`} className="btn-view-details">
                        View <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2rem" }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`pill-btn ${pagination.page === p ? "active" : ""}`}
                onClick={() => fetchAssetsData(p)}
              >
                Page {p}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
