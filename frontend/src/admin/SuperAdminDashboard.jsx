import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRoads, getAnnualBudget, getRoadProjects, getContractors, getInspections, seedDemoData } from "../api/roadApi";
import {
  Compass,
  DollarSign,
  AlertTriangle,
  Layers,
  Award,
  ShieldCheck,
  Activity,
  ArrowRight,
  TrendingUp,
  Wrench,
  CheckCircle,
  Database,
} from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./SuperAdminDashboard.css";

export default function SuperAdminDashboard() {
  const [roads, setRoads] = useState([]);
  const [budgetData, setBudgetData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState("");

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [rRes, bRes, pRes, cRes] = await Promise.all([
        getRoads({ limit: 100 }),
        getAnnualBudget(),
        getRoadProjects(),
        getContractors(),
      ]);

      if (rRes.success) setRoads(rRes.data || []);
      if (bRes.success) setBudgetData(bRes.data || null);
      if (pRes.success) setProjects(pRes.data || []);
      if (cRes.success) setContractors(cRes.data || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSeedDemo = async () => {
    setSeeding(true);
    setSeedMsg("");
    try {
      const res = await seedDemoData();
      if (res.success) {
        setSeedMsg("Seed successful! Hackathon RD-1024 Lifecycle loaded.");
        await fetchAllData();
      }
    } catch (err) {
      setSeedMsg(err.response?.data?.message || "Failed to seed demo data");
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <Activity className="animate-spin" size={36} style={{ marginBottom: "1rem" }} />
          <p>Aggregating Executive Dashboard Metrics...</p>
        </div>
        <Footer />
      </>
    );
  }

  // Calculate Metrics
  const activeRoads = roads.filter((r) => r.status === "ACTIVE").length;
  const underConst = roads.filter((r) => r.status === "UNDER_CONSTRUCTION").length;
  const underMnt = roads.filter((r) => r.status === "UNDER_MAINTENANCE").length;
  const damaged = roads.filter((r) => r.status === "DAMAGED" || r.healthStatus === "CRITICAL").length;

  const totalBudget = budgetData?.totalAllocatedBudget || 1000000000;
  const spentNew = budgetData?.spentNewConstruction || 0;
  const spentMnt = budgetData?.spentMaintenance || 0;
  const remainingTotal = totalBudget - (spentNew + spentMnt);

  // Smart Maintenance Recommendations (Hackathon Feature 31.A)
  const maintenanceRecommendations = roads.filter(
    (r) => r.healthStatus === "WARNING" || r.healthStatus === "CRITICAL" || r.roadConcernIndicator === "HIGH" || r.roadConcernIndicator === "CRITICAL"
  );

  return (
    <>
      <Navbar />
      <div className="admin-dashboard-container">
        <div className="dashboard-hero-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1>Super Admin Executive Dashboard</h1>
            <p>Real-time oversight of Municipal Road Assets, Budgets, Tenders, Contractors, and Grievance SLA</p>
          </div>
          <div>
            <button
              onClick={handleSeedDemo}
              disabled={seeding}
              style={{
                background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
                color: "#FFFFFF",
                border: "none",
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: seeding ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              <Database size={18} />
              {seeding ? "Seeding RD-1024..." : "Seed Hackathon Demo Data"}
            </button>
            {seedMsg && <div style={{ fontSize: "0.85rem", color: "#34D399", marginTop: "0.4rem" }}>{seedMsg}</div>}
          </div>
        </div>

        {/* Section 1: Road Assets Overview */}
        <h2 style={{ fontSize: "1.3rem", color: "#60A5FA", marginBottom: "1rem" }}>Road Assets Network Overview</h2>
        <div className="asset-stats-grid">
          <div className="asset-stat-card">
            <div className="stat-icon-wrapper blue"><Compass size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{roads.length}</div>
              <div className="stat-label">Total Road Assets</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper green"><CheckCircle size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{activeRoads}</div>
              <div className="stat-label">Active Operational Roads</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper amber"><Wrench size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{underMnt + underConst}</div>
              <div className="stat-label">Construction & Maintenance</div>
            </div>
          </div>

          <div className="asset-stat-card">
            <div className="stat-icon-wrapper red"><AlertTriangle size={24} /></div>
            <div className="stat-info">
              <div className="stat-value">{damaged}</div>
              <div className="stat-label">Damaged / High Concern</div>
            </div>
          </div>
        </div>

        {/* Section 2: Budget Breakdown & Projects */}
        <div className="dashboard-section-grid">
          {/* Budget Summary Card */}
          <div className="dashboard-card-box">
            <div className="card-box-header">
              <h3><DollarSign size={20} color="#34D399" /> Road Budget Financials</h3>
              <Link to="/budget" style={{ fontSize: "0.85rem", color: "#60A5FA", textDecoration: "none" }}>
                Details →
              </Link>
            </div>
            <div className="key-val-grid">
              <div className="kv-item"><label>Total Annual Budget</label><span>₹{(totalBudget / 10000000).toFixed(1)} Cr</span></div>
              <div className="kv-item"><label>Spent New Road</label><span>₹{(spentNew / 10000000).toFixed(1)} Cr</span></div>
              <div className="kv-item"><label>Spent Maintenance</label><span>₹{(spentMnt / 10000000).toFixed(1)} Cr</span></div>
              <div className="kv-item"><label>Remaining Total</label><span style={{ color: "#34D399" }}>₹{(remainingTotal / 10000000).toFixed(1)} Cr</span></div>
            </div>
          </div>

          {/* Construction & Contractors Card */}
          <div className="dashboard-card-box">
            <div className="card-box-header">
              <h3><Award size={20} color="#FBBF24" /> Contractor & Project Metrics</h3>
              <Link to="/contractors" style={{ fontSize: "0.85rem", color: "#60A5FA", textDecoration: "none" }}>
                Profiles →
              </Link>
            </div>
            <div className="key-val-grid">
              <div className="kv-item"><label>Registered Contractors</label><span>{contractors.length}</span></div>
              <div className="kv-item"><label>Active Proposals</label><span>{projects.length}</span></div>
              <div className="kv-item"><label>Ongoing Construction</label><span>{projects.filter((p) => p.status === "CONSTRUCTION").length}</span></div>
              <div className="kv-item"><label>Completed Projects</label><span>{projects.filter((p) => p.status === "COMPLETED").length}</span></div>
            </div>
          </div>
        </div>

        {/* Section 3: Smart Maintenance Priority Recommendations */}
        <div className="dashboard-card-box" style={{ marginBottom: "2rem" }}>
          <div className="card-box-header">
            <h3><Wrench size={20} color="#F59E0B" /> Smart Maintenance Priority Recommendations</h3>
            <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Automated priority based on grievances, age & condition</span>
          </div>

          {maintenanceRecommendations.length === 0 ? (
            <p style={{ color: "#34D399", fontStyle: "italic" }}>All roads currently in healthy condition. No immediate repairs flagged.</p>
          ) : (
            <div>
              {maintenanceRecommendations.map((r) => (
                <div key={r._id} className="recommendation-item">
                  <div>
                    <div style={{ fontWeight: "700", color: "#F9FAFB" }}>{r.roadCode} - {r.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "#9CA3AF", marginTop: "0.2rem" }}>
                      Condition: {r.condition} • Health: {r.healthStatus} • Grievances: {r.complaintsCount || 0}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span className={`concern-badge concern-${r.roadConcernIndicator || "HIGH"}`}>
                      {r.roadConcernIndicator || "HIGH"} CONCERN
                    </span>
                    <Link to={`/roads/${r._id}`} className="btn-submit" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem", textDecoration: "none" }}>
                      Inspect & Repair →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
