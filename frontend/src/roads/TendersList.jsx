import React, { useState, useEffect } from "react";
import { getTenders, createTender, submitContractorBid, awardTenderToContractor, getRoadProjects, getContractors } from "../api/roadApi";
import { Briefcase, Plus, Activity, Award, CheckCircle, Clock } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./TendersList.css";

export default function TendersList() {
  const [tenders, setTenders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Tender Modal
  const [showTenderModal, setShowTenderModal] = useState(false);
  const [roadProjectId, setRoadProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [estimatedCost, setEstimatedCost] = useState(80000000);
  const [deadline, setDeadline] = useState("");
  const [creating, setCreating] = useState(false);

  // Award Modal
  const [selectedTender, setSelectedTender] = useState(null);
  const [selectedContractorId, setSelectedContractorId] = useState("");
  const [awarding, setAwarding] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes, cRes] = await Promise.all([getTenders(), getRoadProjects(), getContractors()]);
      if (tRes.success) setTenders(tRes.data || []);
      if (pRes.success) setProjects(pRes.data || []);
      if (cRes.success) setContractors(cRes.data || []);
    } catch (err) {
      console.error("Error loading tenders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTender = async (e) => {
    e.preventDefault();
    if (!roadProjectId || !title || !deadline) {
      alert("All fields are required");
      return;
    }
    setCreating(true);
    try {
      await createTender({
        roadProjectId,
        title,
        estimatedCost: parseFloat(estimatedCost),
        submissionDeadline: deadline,
      });
      setShowTenderModal(false);
      fetchData();
    } catch (err) {
      alert("Failed to create tender: " + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
    }
  };

  const handleAwardContractor = async (e) => {
    e.preventDefault();
    if (!selectedTender || !selectedContractorId) return;
    setAwarding(true);
    try {
      await awardTenderToContractor(selectedTender._id, {
        contractorId: selectedContractorId,
      });
      setSelectedTender(null);
      fetchData();
    } catch (err) {
      alert("Awarding failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAwarding(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="tenders-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Road Construction Tenders & Bidding</h1>
            <p>Publish procurement tenders, receive contractor bids, and record authorized evaluation awards</p>
          </div>
          <button className="btn-create-asset" onClick={() => setShowTenderModal(true)}>
            <Plus size={18} /> Publish New Tender
          </button>
        </div>

        {/* List Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Tenders...</p>
          </div>
        ) : tenders.length === 0 ? (
          <div className="no-assets-empty">
            <Briefcase size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Tenders Published</h3>
            <p>Publish a tender for an approved road project budget.</p>
          </div>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Tender ID</th>
                  <th>Title / Road Project</th>
                  <th>Estimated Cost</th>
                  <th>Submission Deadline</th>
                  <th>Bids Count</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tenders.map((t) => (
                  <tr key={t._id}>
                    <td>
                      <strong style={{ color: "#60A5FA" }}>{t.tenderId}</strong>
                    </td>
                    <td>
                      <div style={{ fontWeight: "600" }}>{t.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "#9CA3AF" }}>
                        Project: {t.roadProjectId?.proposalId || ""} - {t.roadProjectId?.name || ""}
                      </div>
                    </td>
                    <td>₹{t.estimatedCost?.toLocaleString()}</td>
                    <td>{new Date(t.submissionDeadline).toLocaleDateString()}</td>
                    <td>{t.bids?.length || 0} Bids</td>
                    <td>
                      <span className={`status-badge status-${t.status}`}>{t.status}</span>
                    </td>
                    <td>
                      {t.status !== "AWARDED" ? (
                        <button
                          className="btn-submit"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", background: "#F59E0B" }}
                          onClick={() => setSelectedTender(t)}
                        >
                          Award Contractor
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: "700" }}>
                          ✓ Awarded ({t.awardedContractorId?.companyName || "Contractor"})
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Publish Tender */}
        {showTenderModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Publish Procurement Tender</h3>
              <form onSubmit={handleCreateTender}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Select Approved Road Project *</label>
                  <select value={roadProjectId} onChange={(e) => setRoadProjectId(e.target.value)} required>
                    <option value="">-- Choose Road Project --</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.proposalId} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Tender Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Construction Tender for Vesu Sector 4 Road"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowTenderModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={creating}>
                    {creating ? "Publishing..." : "Publish Tender"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Award Contractor */}
        {selectedTender && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Award Tender: {selectedTender.tenderId}</h3>
              <form onSubmit={handleAwardContractor}>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Select Approved Contractor *</label>
                  <select value={selectedContractorId} onChange={(e) => setSelectedContractorId(e.target.value)} required>
                    <option value="">-- Choose Qualified Contractor --</option>
                    {contractors.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.companyName} ({c.registrationNumber}) - {c.completedProjects} Projects Completed
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setSelectedTender(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={awarding}>
                    {awarding ? "Awarding..." : "Award Contract & Update Status"}
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
