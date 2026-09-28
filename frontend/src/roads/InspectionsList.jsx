import React, { useState, useEffect } from "react";
import { getInspections, createInspection, getRoads } from "../api/roadApi";
import { ShieldCheck, Plus, Activity, CheckCircle, XCircle } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./InspectionsList.css";

export default function InspectionsList() {
  const [inspections, setInspections] = useState([]);
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [roadId, setRoadId] = useState("");
  const [type, setType] = useState("Routine road inspection");
  const [remarks, setRemarks] = useState("");
  const [result, setResult] = useState("PASSED");
  const [creating, setCreating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [iRes, rRes] = await Promise.all([getInspections(), getRoads()]);
      if (iRes.success) setInspections(iRes.data || []);
      if (rRes.success) setRoads(rRes.data || []);
    } catch (err) {
      console.error("Error loading inspections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateInspection = async (e) => {
    e.preventDefault();
    if (!remarks) return;
    setCreating(true);
    try {
      await createInspection({
        roadId: roadId || undefined,
        inspectionType: type,
        remarks,
        result,
      });
      setShowModal(false);
      setRemarks("");
      fetchData();
    } catch (err) {
      alert("Failed to submit inspection: " + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="inspections-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Road Quality & Construction Inspections</h1>
            <p>Pre-construction, material quality, progress, routine, and post-maintenance quality inspection logs</p>
          </div>
          <button className="btn-create-asset" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Record Inspection
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Inspection Records...</p>
          </div>
        ) : inspections.length === 0 ? (
          <div className="no-assets-empty">
            <ShieldCheck size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Inspection Logs Found</h3>
            <p>Record a quality inspection report.</p>
          </div>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Inspection ID</th>
                  <th>Type</th>
                  <th>Road Asset / Target</th>
                  <th>Inspector</th>
                  <th>Date</th>
                  <th>Remarks</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((i) => (
                  <tr key={i._id}>
                    <td>
                      <strong style={{ color: "#60A5FA" }}>{i.inspectionId}</strong>
                    </td>
                    <td>
                      <span className="pill-btn" style={{ fontSize: "0.78rem" }}>{i.inspectionType}</span>
                    </td>
                    <td>{i.roadId?.roadCode || i.roadProjectId?.proposalId || "General Check"} - {i.roadId?.name || ""}</td>
                    <td>{i.officerId?.name || "Inspector"}</td>
                    <td>{new Date(i.inspectionDate).toLocaleDateString()}</td>
                    <td style={{ maxWidth: "250px" }}>{i.remarks}</td>
                    <td>
                      <span className={`status-badge status-${i.result}`}>{i.result}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal: Record Inspection */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Record Quality Inspection</h3>
              <form onSubmit={handleCreateInspection}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Select Road Asset</label>
                  <select value={roadId} onChange={(e) => setRoadId(e.target.value)}>
                    <option value="">-- Choose Road --</option>
                    {roads.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.roadCode} - {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Inspection Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="Pre-construction inspection">Pre-construction inspection</option>
                    <option value="Material inspection">Material inspection</option>
                    <option value="Construction progress inspection">Construction progress inspection</option>
                    <option value="Quality inspection">Quality inspection</option>
                    <option value="Final construction inspection">Final construction inspection</option>
                    <option value="Routine road inspection">Routine road inspection</option>
                    <option value="Maintenance inspection">Maintenance inspection</option>
                    <option value="Post-maintenance inspection">Post-maintenance inspection</option>
                    <option value="Emergency inspection">Emergency inspection</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Result</label>
                  <select value={result} onChange={(e) => setResult(e.target.value)}>
                    <option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="REQUIRES_CORRECTION">REQUIRES_CORRECTION</option>
                    <option value="REINSPECTION_REQUIRED">REINSPECTION_REQUIRED</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Inspection Remarks *</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Surface smoothness, road thickness, drainage condition..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={creating}>
                    {creating ? "Submitting..." : "Save Inspection Report"}
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
