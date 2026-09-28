import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAssetById, updateAssetLifecycle, createMaintenance } from "../api/assetApi";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Layers,
  Wrench,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  User,
  Building,
  QrCode,
  CheckCircle,
  Activity,
  Plus,
  RefreshCw,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./AssetDetail.css";

export default function AssetDetail() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Lifecycle Modal
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);
  const [newStatus, setNewStatus] = useState("MAINTENANCE");
  const [newHealth, setNewHealth] = useState("WARNING");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [updatingLifecycle, setUpdatingLifecycle] = useState(false);

  // Maintenance Schedule Modal
  const [showMntModal, setShowMntModal] = useState(false);
  const [mntDescription, setMntDescription] = useState("");
  const [mntType, setMntType] = useState("Preventive");
  const [schedulingMnt, setSchedulingMnt] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const res = await getAssetById(id);
      if (res.success && res.data) {
        setAsset(res.data);
        setNewStatus(res.data.status || "ACTIVE");
        setNewHealth(res.data.health || "HEALTHY");
      }
    } catch (err) {
      console.error("Error fetching asset details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleLifecycleUpdate = async (e) => {
    e.preventDefault();
    setUpdatingLifecycle(true);
    try {
      await updateAssetLifecycle(asset._id, {
        newStatus,
        health: newHealth,
        reason,
        notes,
      });
      setShowLifecycleModal(false);
      fetchDetails();
    } catch (err) {
      alert("Failed to update asset status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingLifecycle(false);
    }
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    setSchedulingMnt(true);
    try {
      await createMaintenance({
        assetId: asset._id,
        description: mntDescription,
        type: mntType,
        status: "SCHEDULED",
      });
      setShowMntModal(false);
      setMntDescription("");
      fetchDetails();
    } catch (err) {
      alert("Failed to schedule maintenance: " + (err.response?.data?.message || err.message));
    } finally {
      setSchedulingMnt(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <Activity className="animate-spin" size={36} style={{ marginBottom: "1rem" }} />
          <p>Loading Asset Details & Audit Trail...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!asset) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <h2>Asset Not Found</h2>
          <Link to="/assets" style={{ color: "#60A5FA" }}>
            Return to Inventory
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="asset-detail-container">
        {/* Topbar navigation */}
        <div className="asset-detail-topbar">
          <Link to="/assets" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none", fontWeight: "600" }}>
            <ArrowLeft size={16} /> Back to Inventory
          </Link>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link to={`/assets/${asset._id}/edit`} className="btn-cancel" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              <Edit size={16} /> Edit Details
            </Link>
            <button className="btn-lifecycle-change" onClick={() => setShowLifecycleModal(true)}>
              <RefreshCw size={16} style={{ display: "inline", marginRight: "0.4rem" }} /> Transition Status
            </button>
          </div>
        </div>

        {/* Main Content & Sidebar Grid */}
        <div className="asset-detail-main-card">
          {/* Main Column */}
          <div>
            {/* Hero Header Card */}
            <div className="asset-hero-box">
              <div className="hero-code-row">
                <span className="asset-code-tag" style={{ fontSize: "0.9rem", padding: "0.35rem 0.8rem" }}>
                  {asset.assetCode}
                </span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <span className={`status-badge status-${asset.status}`}>
                    {asset.status}
                  </span>
                  <span className={`health-badge health-${asset.health}`}>
                    {asset.health}
                  </span>
                </div>
              </div>

              <h1 className="asset-code-title">{asset.name}</h1>

              <div className="asset-sub-meta">
                <span><Layers size={14} style={{ display: "inline", marginRight: "0.2rem" }} /> {asset.assetType}</span>
                <span>•</span>
                <span><Building size={14} style={{ display: "inline", marginRight: "0.2rem" }} /> {asset.departmentId?.name || "Infrastructure Dept"}</span>
                <span>•</span>
                <span><MapPin size={14} style={{ display: "inline", marginRight: "0.2rem" }} /> {asset.address || asset.area || "Surat"}</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tab-nav-bar">
              <button className={`tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
                Overview & Location
              </button>
              <button className={`tab-btn ${activeTab === "complaints" ? "active" : ""}`} onClick={() => setActiveTab("complaints")}>
                Associated Complaints ({asset.complaints?.length || 0})
              </button>
              <button className={`tab-btn ${activeTab === "maintenance" ? "active" : ""}`} onClick={() => setActiveTab("maintenance")}>
                Maintenance Work ({asset.maintenanceRecords?.length || 0})
              </button>
              <button className={`tab-btn ${activeTab === "audit" ? "active" : ""}`} onClick={() => setActiveTab("audit")}>
                Lifecycle Audit Timeline ({asset.history?.length || 0})
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <div className="detail-section-card">
                  <h3 className="section-heading"><FileText size={18} /> Asset Description & Details</h3>
                  <p style={{ color: "#D1D5DB", lineHeight: "1.6" }}>
                    {asset.description || "No specific technical notes provided for this infrastructure asset."}
                  </p>

                  <div className="key-val-grid" style={{ marginTop: "1.5rem" }}>
                    <div className="kv-item">
                      <label>Asset ID</label>
                      <span>{asset.assetId}</span>
                    </div>
                    <div className="kv-item">
                      <label>Criticality Level</label>
                      <span className={`criticality-badge crit-${asset.criticality}`}>{asset.criticality}</span>
                    </div>
                    <div className="kv-item">
                      <label>Vendor / Maker</label>
                      <span>{asset.vendor || "N/A"}</span>
                    </div>
                    <div className="kv-item">
                      <label>Purchase Cost</label>
                      <span>₹{asset.purchaseCost?.toLocaleString() || "0"}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section-card">
                  <h3 className="section-heading"><MapPin size={18} /> Location & Geographical Info</h3>
                  <div className="key-val-grid">
                    <div className="kv-item">
                      <label>Latitude / Longitude</label>
                      <span>{asset.location?.coordinates?.[1]}, {asset.location?.coordinates?.[0]}</span>
                    </div>
                    <div className="kv-item">
                      <label>Address</label>
                      <span>{asset.address || "N/A"}</span>
                    </div>
                    <div className="kv-item">
                      <label>Area / Sector</label>
                      <span>{asset.area || "N/A"}</span>
                    </div>
                    <div className="kv-item">
                      <label>City & State</label>
                      <span>{asset.city || "Surat"}, {asset.state || "Gujarat"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COMPLAINTS */}
            {activeTab === "complaints" && (
              <div className="detail-section-card">
                <h3 className="section-heading">
                  <span><AlertTriangle size={18} color="#F59E0B" /> Linked Citizen Complaints</span>
                </h3>

                {!asset.complaints || asset.complaints.length === 0 ? (
                  <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>No citizen complaints filed against this asset.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {asset.complaints.map((c) => (
                      <div key={c._id} style={{ background: "rgba(17, 24, 39, 0.6)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: "700", color: "#F9FAFB", marginBottom: "0.25rem" }}>{c.title}</div>
                          <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
                            Filed by {c.user_id?.name || "Citizen"} • Severity: {c.severity}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span className={`status-badge status-${c.status?.toUpperCase()}`}>{c.status}</span>
                          <Link to={`/complaint/${c._id}`} style={{ color: "#60A5FA", textDecoration: "none", fontWeight: "600", fontSize: "0.88rem" }}>
                            View Complaint →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MAINTENANCE WORK */}
            {activeTab === "maintenance" && (
              <div className="detail-section-card">
                <div className="section-heading">
                  <span><Wrench size={18} color="#3B82F6" /> Maintenance Logs & Work Orders</span>
                  <button className="btn-submit" style={{ padding: "0.4rem 0.9rem", fontSize: "0.85rem" }} onClick={() => setShowMntModal(true)}>
                    <Plus size={14} style={{ display: "inline", marginRight: "0.3rem" }} /> Schedule Repair
                  </button>
                </div>

                {!asset.maintenanceRecords || asset.maintenanceRecords.length === 0 ? (
                  <p style={{ color: "#9CA3AF", fontStyle: "italic" }}>No maintenance operations logged yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {asset.maintenanceRecords.map((m) => (
                      <div key={m._id} style={{ background: "rgba(17, 24, 39, 0.6)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: "700", color: "#F9FAFB" }}>
                            <span style={{ color: "#60A5FA", marginRight: "0.5rem" }}>{m.maintenanceId}</span> [{m.type}] {m.description}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#9CA3AF", marginTop: "0.25rem" }}>
                            Technician: {m.technicianId?.name || "Unassigned"} • Scheduled: {new Date(m.startDate).toLocaleDateString()}
                          </div>
                        </div>
                        <span className={`status-badge status-${m.status}`}>{m.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: LIFECYCLE AUDIT TIMELINE */}
            {activeTab === "audit" && (
              <div className="detail-section-card">
                <h3 className="section-heading"><Clock size={18} /> Asset History Audit Log (Immutable)</h3>
                <div className="timeline-list">
                  {asset.history?.map((h) => (
                    <div key={h._id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-action">{h.action}</span>
                          <span className="timeline-time">{new Date(h.timestamp).toLocaleString()}</span>
                        </div>
                        <div style={{ fontSize: "0.9rem", color: "#E5E7EB", marginBottom: "0.25rem" }}>
                          {h.reason || h.notes || "Status update"}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>
                          Performed by: {h.performedBy?.name || "System Admin"} ({h.performedBy?.role || "Admin"})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="asset-sidebar-box">
            {/* QR Code Component */}
            <div className="qr-card">
              <div className="qr-placeholder">
                <QrCode size={64} color="#1F2937" />
                <span style={{ fontSize: "0.75rem", marginTop: "0.4rem" }}>{asset.assetCode}</span>
              </div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Asset Digital Passport</div>
              <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>Scan in field to file report or view maintenance records</div>
            </div>

            {/* Personnel & Responsibilities */}
            <div style={{ background: "rgba(17, 24, 39, 0.5)", padding: "1.25rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ fontWeight: "700", color: "#F9FAFB", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <User size={16} color="#60A5FA" /> Personnel Assignment
              </div>

              <div style={{ fontSize: "0.85rem", marginBottom: "0.6rem" }}>
                <div style={{ color: "#9CA3AF" }}>Department Admin:</div>
                <div style={{ color: "#E5E7EB", fontWeight: "600" }}>{asset.responsibleAdminId?.name || "Unassigned Dept Admin"}</div>
              </div>

              <div style={{ fontSize: "0.85rem" }}>
                <div style={{ color: "#9CA3AF" }}>Assigned Technician:</div>
                <div style={{ color: "#E5E7EB", fontWeight: "600" }}>{asset.responsibleTechnicianId?.name || "Field Officer"}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Transition Lifecycle Status */}
        {showLifecycleModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0", color: "#F9FAFB" }}>Transition Asset Lifecycle</h3>

              <form onSubmit={handleLifecycleUpdate}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>New Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="DAMAGED">DAMAGED</option>
                    <option value="TRANSFERRED">TRANSFERRED</option>
                    <option value="RETIRED">RETIRED</option>
                    <option value="DISPOSED">DISPOSED</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Health Condition</label>
                  <select value={newHealth} onChange={(e) => setNewHealth(e.target.value)}>
                    <option value="HEALTHY">HEALTHY</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="UNKNOWN">UNKNOWN</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Reason for Transition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scheduled annual repair, Citizen complaint fix..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Notes</label>
                  <textarea
                    rows="3"
                    placeholder="Additional work notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowLifecycleModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={updatingLifecycle}>
                    {updatingLifecycle ? "Updating..." : "Save Transition"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule Maintenance */}
        {showMntModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0", color: "#F9FAFB" }}>Schedule Maintenance Work Order</h3>

              <form onSubmit={handleScheduleMaintenance}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Type of Maintenance</label>
                  <select value={mntType} onChange={(e) => setMntType(e.target.value)}>
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
                    placeholder="e.g. Replace damaged streetlight bulb and wiring..."
                    value={mntDescription}
                    onChange={(e) => setMntDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowMntModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={schedulingMnt}>
                    {schedulingMnt ? "Scheduling..." : "Create Work Order"}
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
