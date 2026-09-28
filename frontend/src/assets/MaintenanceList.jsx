import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMaintenanceList, getPreventiveDashboard, updateMaintenance, createMaintenance, getAssets } from "../api/assetApi";
import { Wrench, Clock, CheckCircle2, AlertCircle, Plus, Calendar, Activity, Check } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./MaintenanceList.css";

export default function MaintenanceList() {
  const [maintenance, setMaintenance] = useState([]);
  const [preventiveData, setPreventiveData] = useState(null);
  const [assetsList, setAssetsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Complete Maintenance Modal
  const [selectedMnt, setSelectedMnt] = useState(null);
  const [cost, setCost] = useState(0);
  const [notes, setNotes] = useState("");
  const [assetHealth, setAssetHealth] = useState("HEALTHY");
  const [completing, setCompleting] = useState(false);

  // New Maintenance Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAssetId, setNewAssetId] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newType, setNewType] = useState("Preventive");
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, dashboardRes, assetsRes] = await Promise.all([
        getMaintenanceList({ status: statusFilter, type: typeFilter }),
        getPreventiveDashboard(),
        getAssets({ limit: 100 }),
      ]);

      if (listRes.success) setMaintenance(listRes.data || []);
      if (dashboardRes.success) setPreventiveData(dashboardRes.data || null);
      if (assetsRes.success) setAssetsList(assetsRes.data || []);
    } catch (err) {
      console.error("Error fetching maintenance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, typeFilter]);

  const handleCompleteRepair = async (e) => {
    e.preventDefault();
    if (!selectedMnt) return;
    setCompleting(true);
    try {
      await updateMaintenance(selectedMnt._id, {
        status: "COMPLETED",
        cost: parseFloat(cost) || 0,
        notes,
        assetHealth,
      });
      setSelectedMnt(null);
      fetchData();
    } catch (err) {
      alert("Failed to complete repair: " + (err.response?.data?.message || err.message));
    } finally {
      setCompleting(false);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newAssetId || !newDescription) {
      alert("Please select an asset and enter description");
      return;
    }
    setCreating(true);
    try {
      await createMaintenance({
        assetId: newAssetId,
        description: newDescription,
        type: newType,
        status: "SCHEDULED",
      });
      setShowCreateModal(false);
      setNewDescription("");
      fetchData();
    } catch (err) {
      alert("Failed to schedule maintenance: " + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="mnt-container">
        {/* Header */}
        <div className="mnt-header-section">
          <div className="mnt-title-area">
            <h1>Preventive & Corrective Maintenance</h1>
            <p>Schedule repairs, track technician work orders, and perform asset health checks</p>
          </div>
          <button className="btn-create-asset" onClick={() => setShowCreateModal(true)}>
            <Plus size={18} /> Schedule Work Order
          </button>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="mnt-stats-grid">
          <div className="asset-stat-card">
            <div className="stat-icon-wrapper red">
              <AlertCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{preventiveData?.metrics?.overdueCount || 0}</div>
              <div className="stat-label">Overdue Maintenance</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper amber">
              <Clock size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{preventiveData?.metrics?.dueSoonCount || 0}</div>
              <div className="stat-label">Due in Next 7 Days</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper blue">
              <Wrench size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{preventiveData?.metrics?.inProgressCount || 0}</div>
              <div className="stat-label">Work Orders In Progress</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle2 size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{preventiveData?.metrics?.totalCount || maintenance.length}</div>
              <div className="stat-label">Total Work Orders Logged</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="asset-filter-bar" style={{ padding: "1rem 1.25rem" }}>
          <div className="filter-row-top" style={{ alignItems: "center" }}>
            <span style={{ fontWeight: "600", color: "#D1D5DB" }}>Filters:</span>
            <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <select className="filter-select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All Maintenance Types</option>
              <option value="Preventive">Preventive</option>
              <option value="Corrective">Corrective</option>
              <option value="Emergency">Emergency</option>
              <option value="Inspection">Inspection</option>
              <option value="Upgrade">Upgrade</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Maintenance Logs...</p>
          </div>
        ) : maintenance.length === 0 ? (
          <div className="no-assets-empty">
            <Wrench size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Maintenance Records Found</h3>
            <p>No work orders match the selected filters.</p>
          </div>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Work Order ID</th>
                  <th>Target Asset</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Scheduled Date</th>
                  <th>Technician</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <strong style={{ color: "#60A5FA" }}>{m.maintenanceId}</strong>
                    </td>
                    <td>
                      <Link to={`/assets/${m.assetId?._id}`} style={{ color: "#F3F4F6", textDecoration: "none", fontWeight: "600" }}>
                        {m.assetId?.assetCode || "AST"} - {m.assetId?.name || "Asset"}
                      </Link>
                    </td>
                    <td>
                      <span className="pill-btn" style={{ fontSize: "0.78rem" }}>{m.type}</span>
                    </td>
                    <td style={{ maxWidth: "250px" }}>{m.description}</td>
                    <td>{new Date(m.startDate).toLocaleDateString()}</td>
                    <td>{m.technicianId?.name || "Unassigned"}</td>
                    <td>
                      <span className={`status-badge status-${m.status}`}>{m.status}</span>
                    </td>
                    <td>
                      {m.status !== "COMPLETED" ? (
                        <button
                          className="btn-submit"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
                          onClick={() => setSelectedMnt(m)}
                        >
                          <Check size={14} /> Complete Repair
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: "600" }}>✓ Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Complete Maintenance Work */}
        {selectedMnt && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0", color: "#F9FAFB" }}>
                Complete Repair: {selectedMnt.maintenanceId}
              </h3>

              <form onSubmit={handleCompleteRepair}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Total Repair Cost (₹)</label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Updated Asset Health Condition</label>
                  <select value={assetHealth} onChange={(e) => setAssetHealth(e.target.value)}>
                    <option value="HEALTHY">HEALTHY</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Completion Notes & Repair Details *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Describe parts replaced, tests performed..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setSelectedMnt(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={completing}>
                    {completing ? "Saving..." : "Mark Completed & Update Asset"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule New Work Order */}
        {showCreateModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0", color: "#F9FAFB" }}>Schedule New Work Order</h3>

              <form onSubmit={handleScheduleSubmit}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Select Infrastructure Asset *</label>
                  <select value={newAssetId} onChange={(e) => setNewAssetId(e.target.value)} required>
                    <option value="">-- Choose Asset --</option>
                    {assetsList.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.assetCode} - {a.name} ({a.assetType})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Maintenance Type</label>
                  <select value={newType} onChange={(e) => setNewType(e.target.value)}>
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Upgrade">Upgrade</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Work Order Description *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Details of required repair or maintenance check..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={creating}>
                    {creating ? "Scheduling..." : "Create Work Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
