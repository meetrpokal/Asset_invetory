import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getRoadProjects,
  createRoadProject,
  updateConstructionProgress,
  convertProjectToRoadAsset,
  updateProjectStatus,
} from "../api/roadApi";
import { Plus, Layers, DollarSign, Activity, CheckCircle, MapPin, ChevronRight, ArrowRight } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./RoadProjectsList.css";

export default function RoadProjectsList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Proposal Modal
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalData, setProposalData] = useState({
    name: "",
    length: 3.2,
    width: 12.0,
    lanes: 4,
    reasonForConstruction: "",
    estimatedConstructionCost: 80000000, // ₹8 Crore
    longitude: 72.8311,
    latitude: 21.1702,
    area: "Vesu Sector 4",
    city: "Surat",
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);

  // Progress Update Modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [stage, setStage] = useState("SITE_PREPARATION");
  const [progress, setProgress] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [updatingProgress, setUpdatingProgress] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await getRoadProjects();
      if (res.success) setProjects(res.data || []);
    } catch (err) {
      console.error("Error loading road projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProposal = async (e) => {
    e.preventDefault();
    setSubmittingProposal(true);
    try {
      await createRoadProject({
        name: proposalData.name,
        length: parseFloat(proposalData.length),
        width: parseFloat(proposalData.width),
        lanes: parseInt(proposalData.lanes),
        reasonForConstruction: proposalData.reasonForConstruction,
        estimatedConstructionCost: parseFloat(proposalData.estimatedConstructionCost),
        location: {
          type: "Point",
          coordinates: [parseFloat(proposalData.longitude), parseFloat(proposalData.latitude)],
        },
        area: proposalData.area,
        city: proposalData.city,
        materials: [
          { materialName: "Asphalt", quantity: 500, unit: "Tons", estimatedUnitPrice: 10000, estimatedTotalCost: 5000000 },
          { materialName: "Aggregate Base", quantity: 1200, unit: "Cu.m", estimatedUnitPrice: 2500, estimatedTotalCost: 3000000 },
          { materialName: "Concrete & Marking", quantity: 200, unit: "Bags", estimatedUnitPrice: 15000, estimatedTotalCost: 3000000 },
        ],
        costBreakdown: {
          landPreparation: 10000000,
          materials: 40000000,
          labour: 15000000,
          equipment: 10000000,
          drainage: 5000000,
        },
      });
      setShowProposalModal(false);
      fetchProjects();
    } catch (err) {
      alert("Failed to create proposal: " + (err.response?.data?.message || err.message));
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleUpdateProgressSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setUpdatingProgress(true);
    try {
      await updateConstructionProgress(selectedProject._id, {
        constructionStage: stage,
        progressPercentage: parseInt(progress),
        remarks,
      });

      if (parseInt(progress) === 100) {
        await updateProjectStatus(selectedProject._id, { status: "COMPLETED" });
      }

      setSelectedProject(null);
      fetchProjects();
    } catch (err) {
      alert("Failed to update progress: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingProgress(false);
    }
  };

  const handleConvertToRoad = async (projId) => {
    try {
      const res = await convertProjectToRoadAsset(projId);
      if (res.success) {
        alert("Success! Completed Project converted into Active Road Asset " + (res.data?.roadCode || ""));
        fetchProjects();
      }
    } catch (err) {
      alert("Conversion failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="road-projects-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>New Road Proposals & Construction Management</h1>
            <p>Propose new roads, define material plans, cost estimations, and monitor stage progress</p>
          </div>
          <button className="btn-create-asset" onClick={() => setShowProposalModal(true)}>
            <Plus size={18} /> Propose New Road Project
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Road Proposals & Construction Projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="no-assets-empty">
            <Layers size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Road Proposals Found</h3>
            <p>Submit a new road proposal to initiate planning and budget request.</p>
            <button className="btn-create-asset" style={{ marginTop: "1rem" }} onClick={() => setShowProposalModal(true)}>
              <Plus size={18} /> Propose First Road
            </button>
          </div>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Proposal ID</th>
                  <th>Road Project Name</th>
                  <th>Dimensions</th>
                  <th>Estimated Cost</th>
                  <th>Stage</th>
                  <th>Progress</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong style={{ color: "#60A5FA" }}>{p.proposalId}</strong>
                    </td>
                    <td style={{ fontWeight: "600" }}>{p.name}</td>
                    <td>{p.length} km • {p.lanes} Lanes</td>
                    <td>₹{p.estimatedConstructionCost?.toLocaleString()}</td>
                    <td>
                      <span className="pill-btn" style={{ fontSize: "0.78rem" }}>{p.constructionStage}</span>
                    </td>
                    <td style={{ width: "120px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", height: "8px", borderRadius: "4px", overflow: "hidden" }}>
                          <div style={{ width: `${p.progressPercentage}%`, background: "#3B82F6", height: "100%" }} />
                        </div>
                        <span style={{ fontSize: "0.78rem" }}>{p.progressPercentage}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${p.status}`}>{p.status}</span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn-cancel"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                          onClick={() => {
                            setSelectedProject(p);
                            setStage(p.constructionStage);
                            setProgress(p.progressPercentage);
                          }}
                        >
                          Update Stage
                        </button>
                        {p.status !== "COMPLETED" && p.progressPercentage >= 100 && (
                          <button
                            className="btn-submit"
                            style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: "#10B981" }}
                            onClick={() => handleConvertToRoad(p._id)}
                          >
                            Convert → Road Asset
                          </button>
                        )}
                        {p.createdRoadId && (
                          <Link to={`/roads/${p.createdRoadId}`} style={{ color: "#34D399", fontSize: "0.8rem", fontWeight: "700", textDecoration: "none", alignSelf: "center" }}>
                            View Road →
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: New Proposal */}
        {showProposalModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>New Road Construction Proposal</h3>
              <form onSubmit={handleCreateProposal}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Proposed Road Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ring Road Connector Sector 4"
                    value={proposalData.name}
                    onChange={(e) => setProposalData({ ...proposalData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid-2" style={{ marginBottom: "1rem" }}>
                  <div className="form-group">
                    <label>Length (km) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={proposalData.length}
                      onChange={(e) => setProposalData({ ...proposalData, length: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Width (meters) *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={proposalData.width}
                      onChange={(e) => setProposalData({ ...proposalData, width: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Estimated Construction Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    value={proposalData.estimatedConstructionCost}
                    onChange={(e) => setProposalData({ ...proposalData, estimatedConstructionCost: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Reason for Construction *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Relieve traffic congestion, improve connectivity..."
                    value={proposalData.reasonForConstruction}
                    onChange={(e) => setProposalData({ ...proposalData, reasonForConstruction: e.target.value })}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowProposalModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={submittingProposal}>
                    {submittingProposal ? "Submitting..." : "Submit Proposal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Update Stage */}
        {selectedProject && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Update Construction Stage</h3>
              <form onSubmit={handleUpdateProgressSubmit}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Construction Stage</label>
                  <select value={stage} onChange={(e) => setStage(e.target.value)}>
                    <option value="SITE_PREPARATION">SITE_PREPARATION</option>
                    <option value="SUB_BASE">SUB_BASE</option>
                    <option value="BASE_LAYER">BASE_LAYER</option>
                    <option value="ROAD_SURFACE">ROAD_SURFACE</option>
                    <option value="DRAINAGE">DRAINAGE</option>
                    <option value="ROAD_MARKING">ROAD_MARKING</option>
                    <option value="SAFETY_INSTALLATION">SAFETY_INSTALLATION</option>
                    <option value="FINAL_INSPECTION">FINAL_INSPECTION</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Progress Percentage (0 - 100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Progress Remarks</label>
                  <textarea rows="3" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setSelectedProject(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={updatingProgress}>
                    {updatingProgress ? "Saving..." : "Save Progress"}
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
