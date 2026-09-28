import React, { useState, useEffect } from "react";
import { getAnnualBudget, allocateBudget, getRoadProjects } from "../api/roadApi";
import { DollarSign, PieChart, Plus, CheckCircle, Activity, AlertTriangle } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./BudgetDashboard.css";

export default function BudgetDashboard() {
  const [budgetData, setBudgetData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Allocate Modal
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [type, setType] = useState("NEW_CONSTRUCTION");
  const [roadProjectId, setRoadProjectId] = useState("");
  const [amount, setAmount] = useState(10000000); // ₹1 Cr
  const [allocating, setAllocating] = useState(false);

  const fetchBudgetData = async () => {
    setLoading(true);
    try {
      const [bRes, pRes] = await Promise.all([getAnnualBudget(), getRoadProjects()]);
      if (bRes.success) setBudgetData(bRes.data);
      if (pRes.success) setProjects(pRes.data || []);
    } catch (err) {
      console.error("Error loading budget data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const handleAllocateSubmit = async (e) => {
    e.preventDefault();
    setAllocating(true);
    try {
      await allocateBudget({
        financialYear: "2026-2027",
        type,
        roadProjectId: roadProjectId || undefined,
        approvedAmount: parseFloat(amount),
      });
      setShowAllocateModal(false);
      fetchBudgetData();
    } catch (err) {
      alert("Allocation failed: " + (err.response?.data?.message || err.message));
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <Activity className="animate-spin" size={36} style={{ marginBottom: "1rem" }} />
          <p>Loading Annual Road Budget Financials...</p>
        </div>
        <Footer />
      </>
    );
  }

  const metrics = budgetData?.metrics || {};

  return (
    <>
      <Navbar />
      <div className="budget-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Annual Road Infrastructure Budget ({budgetData?.financialYear || "2026-2027"})</h1>
            <p>Annual budget breakdown: New Construction, Maintenance, and Emergency Reserve</p>
          </div>
          <button className="btn-create-asset" onClick={() => setShowAllocateModal(true)}>
            <Plus size={18} /> Allocate Project Budget
          </button>
        </div>

        {/* Financial Stat Cards */}
        <div className="asset-stats-grid">
          <div className="asset-stat-card">
            <div className="stat-icon-wrapper blue">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">₹{(budgetData?.totalAllocatedBudget / 10000000)?.toFixed(1)} Cr</div>
              <div className="stat-label">Total Allocated Budget</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">₹{(budgetData?.newConstructionBudget / 10000000)?.toFixed(1)} Cr</div>
              <div className="stat-label">New Construction Budget</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper amber">
              <PieChart size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">₹{(budgetData?.maintenanceBudget / 10000000)?.toFixed(1)} Cr</div>
              <div className="stat-label">Maintenance Budget</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper red">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">₹{(metrics.totalRemaining / 10000000)?.toFixed(1)} Cr</div>
              <div className="stat-label">Total Remaining Funds</div>
            </div>
          </div>
        </div>

        {/* Allocations Table */}
        <div className="road-content-card">
          <h3 className="section-heading"><DollarSign size={18} /> Approved Budget Allocations Log</h3>

          {!budgetData?.allocations || budgetData.allocations.length === 0 ? (
            <p style={{ color: "#9CA3AF" }}>No allocations recorded yet for this financial year.</p>
          ) : (
            <div className="assets-table-wrapper">
              <table className="assets-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Target Project / Road</th>
                    <th>Approved Amount</th>
                    <th>Approval Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetData.allocations.map((a) => (
                    <tr key={a._id}>
                      <td>
                        <span className="pill-btn" style={{ fontSize: "0.78rem" }}>{a.type}</span>
                      </td>
                      <td>
                        {a.roadProjectId?.proposalId || "General Fund Allocation"} - {a.roadProjectId?.name || ""}
                      </td>
                      <td style={{ fontWeight: "700", color: "#34D399" }}>
                        ₹{a.approvedAmount?.toLocaleString()}
                      </td>
                      <td>{new Date(a.approvalDate).toLocaleDateString()}</td>
                      <td>
                        <span className="status-badge status-ACTIVE">{a.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Allocate */}
        {showAllocateModal && (
          <div className="modal-overlay">
            <div className="modal-content-box">
              <h3 style={{ margin: "0 0 1rem 0" }}>Allocate Budget to Road Project</h3>
              <form onSubmit={handleAllocateSubmit}>
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Allocation Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="NEW_CONSTRUCTION">NEW_CONSTRUCTION</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="EMERGENCY">EMERGENCY</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label>Select Target Road Proposal</label>
                  <select value={roadProjectId} onChange={(e) => setRoadProjectId(e.target.value)}>
                    <option value="">-- General / Department Allocation --</option>
                    {projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.proposalId} - {p.name} (Est: ₹{p.estimatedConstructionCost?.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label>Approved Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                  <button type="button" className="btn-cancel" onClick={() => setShowAllocateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit" disabled={allocating}>
                    {allocating ? "Allocating..." : "Approve Allocation"}
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
