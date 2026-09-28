import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { getRoads } from "../api/roadApi";
import {
  Compass,
  AlertTriangle,
  FileText,
  MapPin,
  Search,
  MessageSquare,
  QrCode,
  ShieldCheck,
  Eye,
  RefreshCw,
  PlusCircle,
  ThumbsUp,
} from "lucide-react";
import "./CitizenDashboard.css";

export default function CitizenDashboard() {
  const [roads, setRoads] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("roads");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await getRoads({ search, limit: 50 });
      if (res.success) setRoads(res.data || []);
    } catch (err) {
      console.error("Error fetching public roads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoads();
  }, [search]);

  return (
    <>
      <Navbar />
      <div className="citizen-dashboard-container">
        {/* Citizen Hero */}
        <div className="citizen-hero">
          <div>
            <h1>
              <Compass size={28} /> Citizen Public Road Portal
            </h1>
            <p>
              Inspect local municipal road assets, view public health status, track maintenance work, and report issues directly to the road department.
            </p>
          </div>
          <Link to="/complain" className="citizen-report-btn">
            <PlusCircle size={20} /> Report Road Problem
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="citizen-tabs">
          <button
            className={`citizen-tab-btn ${activeTab === "roads" ? "active" : ""}`}
            onClick={() => setActiveTab("roads")}
          >
            <Compass size={18} /> Public Road Network ({roads.length})
          </button>
          <button
            className={`citizen-tab-btn ${activeTab === "complaints" ? "active" : ""}`}
            onClick={() => setActiveTab("complaints")}
          >
            <AlertTriangle size={18} /> My Reported Grievances
          </button>
        </div>

        {activeTab === "roads" && (
          <>
            {/* Search Bar */}
            <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
                <input
                  type="text"
                  placeholder="Search road by name, ward, or road ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.8rem",
                    background: "rgba(30, 41, 59, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.95rem",
                  }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#94A3B8" }}>Loading public roads...</div>
            ) : (
              <div className="citizen-road-grid">
                {roads.map((road) => (
                  <div key={road._id} className="citizen-road-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#F8FAFC" }}>{road.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: 600 }}>{road.roadId} • {road.area}, {road.city}</div>
                      </div>
                      <span
                        style={{
                          background: road.condition === "GOOD" ? "rgba(52, 211, 153, 0.15)" : "rgba(239, 68, 68, 0.15)",
                          color: road.condition === "GOOD" ? "#34D399" : "#FCA5A5",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "6px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        {road.condition}
                      </span>
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "#CBD5E1", marginBottom: "1rem" }}>
                      <div><MapPin size={14} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} /> {road.length} km length • {road.lanes} Lanes</div>
                      <div style={{ marginTop: "0.3rem" }}>Public Concern Indicator: <strong style={{ color: "#FBBF24" }}>{road.roadConcernIndicator || "LOW"}</strong></div>
                      <div style={{ marginTop: "0.3rem" }}>Open Grievances: {road.openComplaintsCount || 0}</div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link
                        to={`/public-roads/${road._id}`}
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background: "rgba(56, 189, 248, 0.15)",
                          color: "#38BDF8",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        <Eye size={14} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} /> Public Passport
                      </Link>
                      <Link
                        to="/complain"
                        style={{
                          flex: 1,
                          textAlign: "center",
                          background: "rgba(16, 185, 129, 0.2)",
                          color: "#34D399",
                          padding: "0.5rem",
                          borderRadius: "8px",
                          textDecoration: "none",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        <AlertTriangle size={14} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} /> Report Issue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "complaints" && (
          <div style={{ background: "rgba(30, 41, 59, 0.7)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <h3><AlertTriangle size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "#FBBF24" }} /> Track My Submitted Grievances</h3>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: "0.5rem 0 1.5rem" }}>
              Citizens can view assigned officer progress, check before/after repair evidence, and reopen complaints if unresolved.
            </p>
            <div style={{ padding: "1.5rem", background: "rgba(15, 23, 42, 0.6)", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Severe Potholes near Sector 12 Junction</span>
                <span style={{ background: "rgba(52, 211, 153, 0.2)", color: "#34D399", padding: "0.2rem 0.6rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>RESOLVED</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "0.4rem" }}>Linked Road: RD-1024 (Ring Road Extension) • Category: Potholes</div>
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <Link to="/complain" style={{ background: "rgba(56, 189, 248, 0.2)", color: "#38BDF8", padding: "0.4rem 0.8rem", borderRadius: "6px", textDecoration: "none", fontSize: "0.8rem", fontWeight: 600 }}>
                  View Resolution Proof
                </Link>
                <button style={{ background: "rgba(239, 68, 68, 0.2)", color: "#FCA5A5", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
                  <RefreshCw size={12} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} /> Reopen Complaint
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
