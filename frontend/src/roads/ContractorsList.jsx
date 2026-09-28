import React, { useState, useEffect } from "react";
import { getContractors, createContractor } from "../api/roadApi";
import { Award, Plus, Activity, Mail, Phone, FileText } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./ContractorsList.css";

export default function ContractorsList() {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchContractors = async () => {
    setLoading(true);
    try {
      const res = await getContractors();
      if (res.success) setContractors(res.data || []);
    } catch (err) {
      console.error("Error loading contractors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  const handleCreateContractor = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await createContractor({
        companyName,
        registrationNumber: regNo,
        contactPerson,
        email,
        phone,
      });
      setShowModal(false);
      fetchContractors();
    } catch (err) {
      alert("Failed to create contractor: " + (err.response?.data?.message || err.message));
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contractors-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Contractor Factual Performance Profiles</h1>
            <p>Factual, auditable history of completed projects, delays, inspection failures, and defects</p>
          </div>
          <button className="btn-create-asset" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Register Contractor
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Contractor Profiles...</p>
          </div>
        ) : contractors.length === 0 ? (
          <div className="no-assets-empty">
            <Award size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Contractors Registered</h3>
            <p>Register a contractor profile to allow tender awards.</p>
          </div>
        ) : (
          <div className="assets-grid">
            {contractors.map((c) => (
              <div key={c._id} className="asset-card" style={{ padding: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <span className="asset-code-tag">{c.contractorId}</span>
                  <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Reg: {c.registrationNumber}</span>
                </div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", color: "#F9FAFB", margin: "0 0 0.5rem 0" }}>
                  {c.companyName}
                </h3>

                <div style={{ fontSize: "0.85rem", color: "#9CA3AF", display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" }}>
                  <span><Mail size={14} style={{ display: "inline", marginRight: "0.3rem" }} /> {c.email}</span>
                  <span><Phone size={14} style={{ display: "inline", marginRight: "0.3rem" }} /> {c.phone}</span>
                </div>

                <div className="key-val-grid" style={{ background: "rgba(17,24,39,0.5)", padding: "0.85rem", borderRadius: "10px", fontSize: "0.8rem" }}>
                  <div className="kv-item"><label>Total Projects</label><span>{c.totalProjects || 0}</span></div>
                  <div className="kv-item"><label>Completed</label><span style={{ color: "#34D399" }}>{c.completedProjects || 0}</span></div>
                  <div className="kv-item"><label>Delayed</label><span style={{ color: "#FBBF24" }}>{c.delayedProjects || 0}</span></div>
                  <div className="kv-item"><label>Inspection Failures</label><span style={{ color: "#F87171" }}>{c.inspectionFailures || 0}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: New Contractor */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Register Contractor Profile</h3>
              <form onSubmit={handleCreateContractor}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Company / Contractor Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ABC Infra Projects Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Government Registration Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. REG-SURAT-2026-901"
                    value={regNo}
                    onChange={(e) => setRegNo(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Kumar"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                  />
                </div>

                <div className="form-grid-2" style={{ marginBottom: "1.5rem" }}>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={creating}>
                    {creating ? "Creating..." : "Save Contractor Profile"}
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
