import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoadById, updateRoadLifecycle, createInspection } from "../api/roadApi";
import {
  ArrowLeft,
  MapPin,
  Compass,
  FileText,
  DollarSign,
  Briefcase,
  Users,
  Wrench,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  QrCode,
  Activity,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Plus,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./RoadDetail.css";

export default function RoadDetail() {
  const { id } = useParams();
  const [road, setRoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Status transition modal
  const [showLifecycleModal, setShowLifecycleModal] = useState(false);
  const [newStatus, setNewStatus] = useState("UNDER_MAINTENANCE");
  const [eventType, setEventType] = useState("MAINTENANCE_REQUIRED");
  const [reason, setReason] = useState("");
  const [updating, setUpdating] = useState(false);

  // Inspection Modal
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspType, setInspType] = useState("Routine road inspection");
  const [inspRemarks, setInspRemarks] = useState("");
  const [inspResult, setInspResult] = useState("PASSED");
  const [submittingInsp, setSubmittingInsp] = useState(false);

  const fetchRoadData = async () => {
    setLoading(true);
    try {
      const res = await getRoadById(id);
      if (res.success && res.data) {
        setRoad(res.data);
      }
    } catch (err) {
      console.error("Error loading road details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadData();
  }, [id]);

  const handleLifecycleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateRoadLifecycle(road._id, {
        newStatus,
        eventType,
        reason,
      });
      setShowLifecycleModal(false);
      fetchRoadData();
    } catch (err) {
      alert("Failed to update status: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleInspectionSubmit = async (e) => {
    e.preventDefault();
    setSubmittingInsp(true);
    try {
      await createInspection({
        roadId: road._id,
        inspectionType: inspType,
        remarks: inspRemarks,
        result: inspResult,
      });
      setShowInspectionModal(false);
      setInspRemarks("");
      fetchRoadData();
    } catch (err) {
      alert("Failed to create inspection: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingInsp(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <Activity className="animate-spin" size={36} style={{ marginBottom: "1rem" }} />
          <p>Loading Road Asset Profile & Digital Passport...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!road) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <h2>Road Asset Not Found</h2>
          <Link to="/roads" style={{ color: "#60A5FA" }}>Return to Road Network</Link>
        </div>
        <Footer />
      </>
    );
  }

  // Define tab navigation buttons
  const tabs = [
    { id: "overview", label: "Overview", icon: <Compass size={16} /> },
    { id: "lifecycle", label: "Lifecycle", icon: <Activity size={16} /> },
    { id: "construction", label: "Construction", icon: <Layers size={16} /> },
    { id: "budget", label: "Budget", icon: <DollarSign size={16} /> },
    { id: "tender", label: "Tender", icon: <Briefcase size={16} /> },
    { id: "contractor", label: "Contractor", icon: <Award size={16} /> },
    { id: "inspection", label: "Inspection", icon: <ShieldCheck size={16} /> },
    { id: "maintenance", label: "Maintenance", icon: <Wrench size={16} /> },
    { id: "complaints", label: `Complaints (${road.complaintsCount || 0})`, icon: <AlertTriangle size={16} /> },
    { id: "citizens", label: "Citizen Interaction", icon: <Users size={16} /> },
    { id: "documents", label: "Documents", icon: <FileText size={16} /> },
    { id: "timeline", label: "Timeline", icon: <Clock size={16} /> },
  ];

  return (
    <>
      <Navbar />
      <div className="road-detail-container">
        {/* Topbar */}
        <div className="road-detail-topbar">
          <Link to="/roads" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none", fontWeight: "600" }}>
            <ArrowLeft size={16} /> Back to Road Network
          </Link>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn-lifecycle-change" onClick={() => setShowLifecycleModal(true)}>
              <RefreshCw size={16} style={{ display: "inline", marginRight: "0.4rem" }} /> Update Status
            </button>
            <button className="btn-submit" style={{ padding: "0.75rem 1.25rem" }} onClick={() => setShowInspectionModal(true)}>
              <Plus size={16} style={{ display: "inline", marginRight: "0.4rem" }} /> Add Inspection
            </button>
          </div>
        </div>

        {/* Hero Card */}
        <div className="road-hero-card">
          <div className="road-title-row">
            <div>
              <span className="asset-code-tag">{road.roadCode}</span>
              <h1 style={{ marginTop: "0.4rem" }}>{road.name}</h1>
            </div>

            <div className="road-badges-row">
              <span className={`status-badge status-${road.status}`}>{road.status}</span>
              <span className={`health-badge health-${road.healthStatus}`}>{road.healthStatus}</span>
              <span className={`concern-badge concern-${road.roadConcernIndicator}`}>
                CONCERN: {road.roadConcernIndicator}
              </span>
            </div>
          </div>

          <div className="road-meta-pills">
            <span><MapPin size={16} color="#60A5FA" /> {road.area ? `${road.area}, ` : ""}{road.city}, {road.state}</span>
            <span>•</span>
            <span><Compass size={16} color="#34D399" /> {road.length} km length • {road.width} m width • {road.lanes} Lanes</span>
            <span>•</span>
            <span><DollarSign size={16} color="#FBBF24" /> Cost: ₹{road.constructionCost?.toLocaleString()}</span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="road-tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`road-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div className="road-main-grid">
          {/* Main Content Pane */}
          <div>
            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div>
                <div className="road-content-card">
                  <h3 className="section-heading"><FileText size={18} /> Technical Specifications & Coordinates</h3>
                  <div className="key-val-grid">
                    <div className="kv-item"><label>Road ID</label><span>{road.roadId}</span></div>
                    <div className="kv-item"><label>Road Code</label><span>{road.roadCode}</span></div>
                    <div className="kv-item"><label>Length</label><span>{road.length} km</span></div>
                    <div className="kv-item"><label>Width</label><span>{road.width} meters</span></div>
                    <div className="kv-item"><label>Lanes</label><span>{road.lanes} Lanes</span></div>
                    <div className="kv-item"><label>Physical Condition</label><span>{road.condition}</span></div>
                    <div className="kv-item"><label>Expected Design Life</label><span>{road.expectedLifeYears} Years</span></div>
                    <div className="kv-item"><label>Ward / Zone</label><span>{road.ward || "Zone 4"}</span></div>
                  </div>
                </div>

                <div className="road-content-card">
                  <h3 className="section-heading"><ShieldCheck size={18} /> Contractual Warranty & Validity</h3>
                  <div className="key-val-grid">
                    <div className="kv-item">
                      <label>Warranty Status</label>
                      <span style={{ color: road.isUnderWarranty ? "#34D399" : "#9CA3AF" }}>
                        {road.isUnderWarranty ? "✓ ACTIVE WARRANTY" : "EXPIRED"}
                      </span>
                    </div>
                    <div className="kv-item">
                      <label>Defect Liability Status</label>
                      <span style={{ color: road.isUnderDefectLiability ? "#FBBF24" : "#9CA3AF" }}>
                        {road.isUnderDefectLiability ? "✓ WITHIN DEFECT LIABILITY" : "EXPIRED"}
                      </span>
                    </div>
                    <div className="kv-item">
                      <label>Warranty Expiry Date</label>
                      <span>{road.warrantyEndDate ? new Date(road.warrantyEndDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                    <div className="kv-item">
                      <label>Defect Liability Expiry</label>
                      <span>{road.defectLiabilityEndDate ? new Date(road.defectLiabilityEndDate).toLocaleDateString() : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: LIFECYCLE */}
            {activeTab === "lifecycle" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Activity size={18} /> Complete Road Lifecycle Progression</h3>
                <p style={{ color: "#9CA3AF", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                  System tracking from initial proposal through budget, tender, construction, active life, maintenance, and retirement.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    "Road Need Identified & Proposal Submitted",
                    "Cost Estimation & Material Planning",
                    "Budget Allocation & Approval",
                    "Tender Publication & Bidding",
                    "Contractor Awarded & Contract Signed",
                    "Construction & Stage Progress",
                    "Quality & Final Inspection Passed",
                    "Active Operational Road Asset",
                    "Routine Monitoring & Citizen Grievances",
                    "Maintenance Work Order & Repairs",
                    "Resurfacing / Rehabilitation",
                    "Reconstruction & Retirement",
                  ].map((stage, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: "1rem", background: "rgba(17,24,39,0.5)", padding: "0.85rem 1.25rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: idx <= 7 ? "#2563EB" : "#374151", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.8rem" }}>
                        {idx + 1}
                      </div>
                      <span style={{ fontWeight: "600", color: "#F3F4F6", flex: 1 }}>{stage}</span>
                      {idx <= 7 && <span style={{ color: "#34D399", fontSize: "0.8rem", fontWeight: "700" }}>✓ COMPLETED</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: CONSTRUCTION */}
            {activeTab === "construction" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Layers size={18} /> Construction Project Details</h3>
                {road.project ? (
                  <div>
                    <div className="key-val-grid" style={{ marginBottom: "1.5rem" }}>
                      <div className="kv-item"><label>Proposal ID</label><span>{road.project.proposalId}</span></div>
                      <div className="kv-item"><label>Current Stage</label><span>{road.project.constructionStage}</span></div>
                      <div className="kv-item"><label>Progress</label><span>{road.project.progressPercentage}%</span></div>
                      <div className="kv-item"><label>Estimated Cost</label><span>₹{road.project.estimatedConstructionCost?.toLocaleString()}</span></div>
                    </div>
                    <h4>Reason for Construction:</h4>
                    <p style={{ color: "#D1D5DB" }}>{road.project.reasonForConstruction}</p>
                  </div>
                ) : (
                  <p style={{ color: "#9CA3AF" }}>Constructed under municipal infrastructure program.</p>
                )}
              </div>
            )}

            {/* TAB 4: BUDGET */}
            {activeTab === "budget" && (
              <div className="road-content-card">
                <h3 className="section-heading"><DollarSign size={18} /> Project Budget & Cost Accounting</h3>
                <div className="key-val-grid">
                  <div className="kv-item"><label>Original Estimated Cost</label><span>₹{road.constructionCost?.toLocaleString()}</span></div>
                  <div className="kv-item"><label>Actual Spent Construction Cost</label><span>₹{road.constructionCost?.toLocaleString()}</span></div>
                  <div className="kv-item"><label>Current Asset Value</label><span>₹{road.currentValue?.toLocaleString()}</span></div>
                </div>
              </div>
            )}

            {/* TAB 5: TENDER */}
            {activeTab === "tender" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Briefcase size={18} /> Procurement Tender Details</h3>
                {road.tenders && road.tenders.length > 0 ? (
                  road.tenders.map((t) => (
                    <div key={t._id} style={{ background: "rgba(17,24,39,0.6)", padding: "1rem", borderRadius: "12px", marginBottom: "0.75rem" }}>
                      <div style={{ fontWeight: "700" }}>{t.tenderId} - {t.title}</div>
                      <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
                        Estimated: ₹{t.estimatedCost?.toLocaleString()} • Duration: {t.contractDurationMonths} months • Status: {t.status}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#9CA3AF" }}>Tender record archived.</p>
                )}
              </div>
            )}

            {/* TAB 6: CONTRACTOR */}
            {activeTab === "contractor" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Award size={18} /> Contractor Factual Performance Record</h3>
                {road.contractorId ? (
                  <div>
                    <div className="key-val-grid" style={{ marginBottom: "1.5rem" }}>
                      <div className="kv-item"><label>Company Name</label><span>{road.contractorId.companyName}</span></div>
                      <div className="kv-item"><label>Registration No.</label><span>{road.contractorId.registrationNumber}</span></div>
                      <div className="kv-item"><label>Total Projects Completed</label><span>{road.contractorId.completedProjects || 1}</span></div>
                      <div className="kv-item"><label>Inspection Failures Recorded</label><span>{road.contractorId.inspectionFailures || 0}</span></div>
                      <div className="kv-item"><label>Contact Email</label><span>{road.contractorId.email}</span></div>
                      <div className="kv-item"><label>Phone</label><span>{road.contractorId.phone}</span></div>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: "#9CA3AF" }}>No contractor associated directly.</p>
                )}
              </div>
            )}

            {/* TAB 7: INSPECTION */}
            {activeTab === "inspection" && (
              <div className="road-content-card">
                <h3 className="section-heading"><ShieldCheck size={18} /> Inspection Log & Quality Checks</h3>
                {!road.inspections || road.inspections.length === 0 ? (
                  <p style={{ color: "#9CA3AF" }}>No inspection reports recorded yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {road.inspections.map((i) => (
                      <div key={i._id} style={{ background: "rgba(17,24,39,0.6)", padding: "1rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: "700", color: "#60A5FA" }}>[{i.inspectionType}]</span>
                          <span className={`status-badge status-${i.result}`}>{i.result}</span>
                        </div>
                        <p style={{ color: "#E5E7EB", margin: "0.5rem 0" }}>{i.remarks}</p>
                        <div style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>
                          Officer: {i.officerId?.name || "Inspector"} • Date: {new Date(i.inspectionDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: MAINTENANCE */}
            {activeTab === "maintenance" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Wrench size={18} /> Maintenance & Repairs History</h3>
                {!road.maintenanceRecords || road.maintenanceRecords.length === 0 ? (
                  <p style={{ color: "#9CA3AF" }}>No maintenance operations performed yet.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {road.maintenanceRecords.map((m) => (
                      <div key={m._id} style={{ background: "rgba(17,24,39,0.6)", padding: "1rem", borderRadius: "12px" }}>
                        <div style={{ fontWeight: "700", color: "#F9FAFB" }}>{m.maintenanceId} - [{m.type}] {m.description}</div>
                        <div style={{ fontSize: "0.85rem", color: "#9CA3AF", marginTop: "0.25rem" }}>
                          Status: {m.status} • Scheduled: {new Date(m.startDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: COMPLAINTS */}
            {activeTab === "complaints" && (
              <div className="road-content-card">
                <h3 className="section-heading"><AlertTriangle size={18} color="#F59E0B" /> Linked Citizen Grievances</h3>
                {!road.complaints || road.complaints.length === 0 ? (
                  <p style={{ color: "#9CA3AF" }}>No complaints reported on this road.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {road.complaints.map((c) => (
                      <div key={c._id} style={{ background: "rgba(17,24,39,0.6)", padding: "1rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontWeight: "700", color: "#F9FAFB" }}>{c.title}</div>
                          <div style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>
                            Category: {c.category} • Repeat Complaints: {c.reopenedCount || 0}
                          </div>
                        </div>
                        <Link to={`/complaint/${c._id}`} style={{ color: "#60A5FA", textDecoration: "none", fontWeight: "600" }}>
                          View →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 10: CITIZEN INTERACTION */}
            {activeTab === "citizens" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Users size={18} /> Factual Citizen Interaction Metrics</h3>
                <div className="key-val-grid">
                  <div className="kv-item"><label>Total Public Views</label><span>{road.viewsCount || 0}</span></div>
                  <div className="kv-item"><label>Total Complaints Filed</label><span>{road.complaintsCount || 0}</span></div>
                  <div className="kv-item"><label>Repeat Complaints</label><span>{road.repeatComplaintsCount || 0}</span></div>
                  <div className="kv-item"><label>Resolved Complaints</label><span>{road.resolvedComplaintsCount || 0}</span></div>
                  <div className="kv-item"><label>Open Complaints</label><span>{road.openComplaintsCount || 0}</span></div>
                  <div className="kv-item"><label>Avg Resolution Time</label><span>{road.avgResolutionTimeHours || 24} hours</span></div>
                </div>
              </div>
            )}

            {/* TAB 11: DOCUMENTS */}
            {activeTab === "documents" && (
              <div className="road-content-card">
                <h3 className="section-heading"><FileText size={18} /> Road Asset Documents & Certificates</h3>
                <p style={{ color: "#9CA3AF" }}>Proposal estimates, BOQ, Inspection reports, and Completion certificates.</p>
              </div>
            )}

            {/* TAB 12: TIMELINE */}
            {activeTab === "timeline" && (
              <div className="road-content-card">
                <h3 className="section-heading"><Clock size={18} /> Immutable Road Lifecycle Timeline</h3>
                <div className="timeline-list">
                  {road.timelineHistory?.map((h) => (
                    <div key={h._id} className="timeline-item">
                      <div className="timeline-dot" />
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-action">{h.eventType}</span>
                          <span className="timeline-time">{new Date(h.date).toLocaleString()}</span>
                        </div>
                        <div style={{ color: "#E5E7EB" }}>{h.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="qr-card" style={{ marginBottom: "1.5rem" }}>
              <div className="qr-placeholder">
                <QrCode size={64} color="#1F2937" />
                <span style={{ fontSize: "0.75rem", marginTop: "0.4rem" }}>{road.roadCode}</span>
              </div>
              <div style={{ fontWeight: "700", fontSize: "0.9rem" }}>Road Digital Passport QR</div>
              <Link to={`/public-roads/${road._id}`} style={{ fontSize: "0.8rem", color: "#2563EB", textDecoration: "none", fontWeight: "600", marginTop: "0.4rem", display: "inline-block" }}>
                Open Public Passport →
              </Link>
            </div>
          </div>
        </div>

        {/* Modal: Lifecycle Transition */}
        {showLifecycleModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Update Road Lifecycle Status</h3>
              <form onSubmit={handleLifecycleUpdate}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>New Lifecycle Status</label>
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UNDER_INSPECTION">UNDER_INSPECTION</option>
                    <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
                    <option value="DAMAGED">DAMAGED</option>
                    <option value="REHABILITATION">REHABILITATION</option>
                    <option value="RECONSTRUCTION">RECONSTRUCTION</option>
                    <option value="RETIRED">RETIRED</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Reason for Transition *</label>
                  <textarea rows="3" required value={reason} onChange={(e) => setReason(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowLifecycleModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={updating}>{updating ? "Saving..." : "Save Status"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Inspection */}
        {showInspectionModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Perform Quality Inspection</h3>
              <form onSubmit={handleInspectionSubmit}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Inspection Type</label>
                  <select value={inspType} onChange={(e) => setInspType(e.target.value)}>
                    <option value="Routine road inspection">Routine road inspection</option>
                    <option value="Quality inspection">Quality inspection</option>
                    <option value="Maintenance inspection">Maintenance inspection</option>
                    <option value="Final construction inspection">Final construction inspection</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Inspection Result</label>
                  <select value={inspResult} onChange={(e) => setInspResult(e.target.value)}>
                    <option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REQUIRES_CORRECTION">REQUIRES_CORRECTION</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Inspector Remarks *</label>
                  <textarea rows="3" required value={inspRemarks} onChange={(e) => setInspRemarks(e.target.value)} />
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowInspectionModal(false)}>Cancel</button>
                  <button type="submit" className="btn-submit" disabled={submittingInsp}>{submittingInsp ? "Saving..." : "Submit Report"}</button>
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
