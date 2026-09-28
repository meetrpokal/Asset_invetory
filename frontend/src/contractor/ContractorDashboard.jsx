import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { getRoadProjects, updateConstructionProgress, getInspections } from "../api/roadApi";
import {
  HardHat,
  Truck,
  Wrench,
  CheckCircle,
  AlertOctagon,
  Camera,
  Layers,
  Calendar,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Upload,
} from "lucide-react";
import "./ContractorDashboard.css";

export default function ContractorDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [progressInput, setProgressInput] = useState({});

  const fetchContractorData = async () => {
    setLoading(true);
    try {
      const [pRes, iRes] = await Promise.all([
        getRoadProjects(),
        getInspections(),
      ]);

      if (pRes.success) setProjects(pRes.data || []);
      if (iRes.success) setInspections(iRes.data || []);
    } catch (err) {
      console.error("Error loading contractor dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractorData();
  }, []);

  const handleUpdateProgress = async (projectId) => {
    const newProgress = Number(progressInput[projectId]);
    if (isNaN(newProgress) || newProgress < 0 || newProgress > 100) return;

    setUpdatingId(projectId);
    try {
      let stage = "SITE_PREPARATION";
      if (newProgress >= 100) stage = "COMPLETED";
      else if (newProgress >= 90) stage = "FINAL_INSPECTION";
      else if (newProgress >= 70) stage = "ROAD_SURFACE";
      else if (newProgress >= 40) stage = "BASE_LAYER";
      else if (newProgress >= 20) stage = "SUB_BASE";

      await updateConstructionProgress(projectId, {
        progressPercentage: newProgress,
        constructionStage: stage,
      });
      await fetchContractorData();
    } catch (err) {
      console.error("Progress update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contractor-dashboard-container">
        {/* Hero Section */}
        <div className="contractor-hero">
          <div>
            <h1>
              <HardHat size={28} /> Contractor Operations Portal
            </h1>
            <p>
              Execute approved road construction & maintenance tasks, track stages, log materials, and submit work for quality inspection.
            </p>
          </div>
          <div className="contractor-badge">
            Authorized Partner: ABC Infrastructure Pvt Ltd
          </div>
        </div>

        {/* Mandatory Security Boundary Notice */}
        <div className="contractor-restricted-notice">
          <ShieldAlert size={20} style={{ flexShrink: 0 }} />
          <span>
            <strong>Role Control Scoping:</strong> Contractor permissions are restricted to project execution, stage tracking, and photo uploads. You cannot alter municipal budgets, self-approve inspections, or evaluate tender bids.
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="contractor-tabs">
          <button
            className={`contractor-tab-btn ${activeTab === "projects" ? "active" : ""}`}
            onClick={() => setActiveTab("projects")}
          >
            <Truck size={18} /> Assigned Construction Projects ({projects.length})
          </button>
          <button
            className={`contractor-tab-btn ${activeTab === "inspections" ? "active" : ""}`}
            onClick={() => setActiveTab("inspections")}
          >
            <CheckCircle size={18} /> Quality Inspections ({inspections.length})
          </button>
          <button
            className={`contractor-tab-btn ${activeTab === "maintenance" ? "active" : ""}`}
            onClick={() => setActiveTab("maintenance")}
          >
            <Wrench size={18} /> Assigned Maintenance Works
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#94A3B8" }}>
            Loading contractor workspace...
          </div>
        ) : (
          <>
            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="contractor-card-grid">
                {projects.map((proj) => (
                  <div key={proj._id} className="contractor-card">
                    <div className="contractor-card-header">
                      <div>
                        <div className="contractor-card-title">{proj.name}</div>
                        <div className="contractor-card-subtitle">Proposal ID: {proj.proposalId} • {proj.city}</div>
                      </div>
                      <span
                        style={{
                          background: proj.status === "COMPLETED" ? "rgba(52, 211, 153, 0.15)" : "rgba(56, 189, 248, 0.15)",
                          color: proj.status === "COMPLETED" ? "#34D399" : "#38BDF8",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#CBD5E1", marginBottom: "0.75rem" }}>
                      <div><strong>Road Specifications:</strong> {proj.length} km length • {proj.width} m width • {proj.lanes} lanes</div>
                      <div style={{ marginTop: "0.25rem" }}><strong>Contract Value:</strong> ₹{(proj.estimatedConstructionCost / 10000000).toFixed(2)} Cr</div>
                      <div style={{ marginTop: "0.25rem" }}><strong>Current Stage:</strong> <span style={{ color: "#FBBF24" }}>{proj.constructionStage}</span></div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: 600, color: "#94A3B8" }}>
                      <span>Construction Progress</span>
                      <span style={{ color: "#38BDF8" }}>{proj.progressPercentage}%</span>
                    </div>
                    <div className="progress-bar-container">
                      <div className="progress-bar-fill" style={{ width: `${proj.progressPercentage}%` }}></div>
                    </div>

                    {/* Update Progress Input */}
                    <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="New %"
                        value={progressInput[proj._id] ?? ""}
                        onChange={(e) => setProgressInput({ ...progressInput, [proj._id]: e.target.value })}
                        style={{
                          width: "80px",
                          padding: "0.4rem 0.6rem",
                          background: "rgba(15, 23, 42, 0.8)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "6px",
                          color: "white",
                          fontSize: "0.85rem",
                        }}
                      />
                      <button
                        className="contractor-btn"
                        disabled={updatingId === proj._id}
                        onClick={() => handleUpdateProgress(proj._id)}
                      >
                        {updatingId === proj._id ? "Saving..." : "Update Progress"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* INSPECTIONS TAB */}
            {activeTab === "inspections" && (
              <div className="contractor-card-grid">
                {inspections.map((insp) => (
                  <div key={insp._id} className="contractor-card">
                    <div className="contractor-card-header">
                      <div>
                        <div className="contractor-card-title">Inspection ID: {insp.inspectionId}</div>
                        <div className="contractor-card-subtitle">Type: {insp.inspectionType}</div>
                      </div>
                      <span
                        style={{
                          background: insp.result === "PASS" ? "rgba(52, 211, 153, 0.2)" : "rgba(239, 68, 68, 0.2)",
                          color: insp.result === "PASS" ? "#34D399" : "#FCA5A5",
                          padding: "0.25rem 0.6rem",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                        }}
                      >
                        {insp.result}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#CBD5E1", margin: "0.5rem 0" }}>
                      <div><strong>Date:</strong> {new Date(insp.inspectionDate).toLocaleDateString()}</div>
                      <div style={{ marginTop: "0.25rem" }}><strong>Remarks:</strong> {insp.remarks}</div>
                    </div>

                    {insp.result !== "PASS" && (
                      <div style={{ marginTop: "0.75rem", background: "rgba(239, 68, 68, 0.1)", padding: "0.6rem", borderRadius: "6px", fontSize: "0.8rem", color: "#FCA5A5" }}>
                        <AlertOctagon size={14} style={{ marginRight: "0.4rem", verticalAlign: "middle" }} />
                        Correction Required: Address surface compaction and resubmit work for reinspection.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* MAINTENANCE TAB */}
            {activeTab === "maintenance" && (
              <div className="contractor-card">
                <h3><Wrench size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem" }} /> Active Maintenance Work Orders</h3>
                <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: "0.5rem 0 1rem" }}>
                  Contractor handles repair assignments issued by government inspectors. Upload before & after photo proof upon completion.
                </p>

                <div style={{ background: "rgba(15, 23, 42, 0.6)", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <div style={{ fontWeight: 700, color: "#38BDF8" }}>Work Order: MNT-RD-1024-001 (Pothole Repair)</div>
                  <div style={{ fontSize: "0.85rem", color: "#CBD5E1", margin: "0.4rem 0" }}>
                    Location: Ring Road Extension (Sector 12 Junction) • Approved Cost: ₹1,20,000
                  </div>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <div style={{ flex: 1, textAlign: "center", border: "1px stroke rgba(255,255,255,0.1)", padding: "0.5rem", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.2rem" }}>Before Repair</div>
                      <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=400&q=80" alt="Before" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "4px" }} />
                    </div>
                    <div style={{ flex: 1, textAlign: "center", border: "1px stroke rgba(255,255,255,0.1)", padding: "0.5rem", borderRadius: "6px" }}>
                      <div style={{ fontSize: "0.75rem", color: "#34D399", marginBottom: "0.2rem" }}>After Repair (Verified)</div>
                      <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80" alt="After" style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "4px" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
