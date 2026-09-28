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
  Eye,
  RefreshCw,
  PlusCircle,
  Clock,
  Navigation,
  ShieldCheck,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  X,
} from "lucide-react";
import "./CitizenDashboard.css";

// Helper: Calculate Days Closed dynamically from Current Date - Closure Start Date
const calculateDaysClosed = (startDateStr) => {
  if (!startDateStr) return "—";
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return "—";
  const now = new Date();
  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return `${diffDays} ${diffDays === 1 ? "Day" : "Days"}`;
};

// Format Date nicely e.g. 25 Sep 2026
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

// Helper: Color & Status badge mappings
const getStatusBadge = (status) => {
  switch (status) {
    case "OPEN":
    case "ACTIVE":
      return { label: "🟢 OPEN", bg: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "rgba(52, 211, 153, 0.3)" };
    case "PARTIALLY_CLOSED":
      return { label: "🟡 PARTIALLY CLOSED", bg: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", border: "rgba(251, 191, 36, 0.3)" };
    case "CLOSED":
    case "TEMPORARILY_CLOSED":
      return { label: "🔴 CLOSED", bg: "rgba(239, 68, 68, 0.15)", color: "#FCA5A5", border: "rgba(239, 68, 68, 0.3)" };
    case "UNDER_CONSTRUCTION":
      return { label: "🔵 UNDER CONSTRUCTION", bg: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", border: "rgba(96, 165, 250, 0.3)" };
    case "UNDER_MAINTENANCE":
      return { label: "🟠 UNDER MAINTENANCE", bg: "rgba(249, 115, 22, 0.15)", color: "#FB923C", border: "rgba(251, 146, 60, 0.3)" };
    default:
      return { label: "🟢 OPEN", bg: "rgba(16, 185, 129, 0.15)", color: "#34D399", border: "rgba(52, 211, 153, 0.3)" };
  }
};

export default function CitizenDashboard() {
  const [roads, setRoads] = useState([]);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("area-status");
  const [selectedRoadDetails, setSelectedRoadDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await getRoads({ search, limit: 100 });
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

  // Extract unique areas
  const areasList = ["All Areas", ...Array.from(new Set(roads.map((r) => r.area).filter(Boolean)))];

  // Filter roads by selected area
  const filteredRoads = selectedArea === "All Areas"
    ? roads
    : roads.filter((r) => r.area?.toLowerCase() === selectedArea.toLowerCase());

  // Dashboard Stats calculation for selected area
  const countOpen = filteredRoads.filter((r) => r.status === "OPEN" || r.status === "ACTIVE").length;
  const countClosed = filteredRoads.filter((r) => r.status === "CLOSED" || r.status === "TEMPORARILY_CLOSED").length;
  const countPartial = filteredRoads.filter((r) => r.status === "PARTIALLY_CLOSED").length;
  const countMaintenance = filteredRoads.filter((r) => r.status === "UNDER_MAINTENANCE").length;
  const countConstruction = filteredRoads.filter((r) => r.status === "UNDER_CONSTRUCTION").length;

  // Closed roads alert list
  const closedRoadsList = filteredRoads.filter(
    (r) => r.status === "CLOSED" || r.status === "TEMPORARILY_CLOSED" || r.closureDetails?.isClosed
  );

  return (
    <>
      <Navbar />
      <div className="citizen-dashboard-container">
        {/* Citizen Hero Header */}
        <div className="citizen-hero">
          <div>
            <h1>
              <Compass size={28} /> Citizen Public Road Portal
            </h1>
            <p>
              Check area-wise road status, closed routes, dynamic closure timelines, alternative diversion routes, and report issues.
            </p>
          </div>
          <Link to="/complain" className="citizen-report-btn">
            <PlusCircle size={20} /> Report Road Problem
          </Link>
        </div>

        {/* ================= SUMMARY CARDS (USER REQUIREMENT) ================= */}
        <div className="citizen-stats-grid">
          {/* Card 1: Roads in My Area */}
          <div className="citizen-summary-card">
            <div className="summary-card-header">
              <MapPin size={20} className="icon-emerald" />
              <h3>Roads in My Area ({selectedArea})</h3>
            </div>
            <div className="summary-metrics-row">
              <div className="metric-pill">
                <span className="metric-val">{filteredRoads.length}</span>
                <span className="metric-lbl">Total Roads</span>
              </div>
              <div className="metric-pill open">
                <span className="metric-val">{countOpen}</span>
                <span className="metric-lbl">🟢 Open</span>
              </div>
              <div className="metric-pill closed">
                <span className="metric-val">{countClosed}</span>
                <span className="metric-lbl">🔴 Closed</span>
              </div>
              <div className="metric-pill partial">
                <span className="metric-val">{countPartial}</span>
                <span className="metric-lbl">🟡 Partial</span>
              </div>
              <div className="metric-pill maintenance">
                <span className="metric-val">{countMaintenance}</span>
                <span className="metric-lbl">🟠 Maintenance</span>
              </div>
            </div>
          </div>

          {/* Card 2: Currently Closed Roads */}
          <div className="citizen-summary-card alert-border">
            <div className="summary-card-header">
              <AlertCircle size={20} className="icon-rose" />
              <h3>Currently Closed Roads ({closedRoadsList.length})</h3>
            </div>
            {closedRoadsList.length === 0 ? (
              <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: "0.5rem 0 0" }}>
                No roads currently closed in {selectedArea}.
              </p>
            ) : (
              <div className="closed-alerts-list">
                {closedRoadsList.slice(0, 3).map((r) => (
                  <div key={r._id} className="closed-alert-item" onClick={() => setSelectedRoadDetails(r)}>
                    <div className="alert-title">
                      🔴 {r.name} <span className="area-tag">{r.area}</span>
                    </div>
                    <div className="alert-sub">
                      Closed for <strong>{calculateDaysClosed(r.closureDetails?.closureStartDate)}</strong> • Expected reopening:{" "}
                      <strong>{formatDate(r.closureDetails?.expectedReopeningDate)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs & Area Selector */}
        <div className="citizen-controls-bar">
          <div className="citizen-tabs">
            <button
              className={`citizen-tab-btn ${activeTab === "area-status" ? "active" : ""}`}
              onClick={() => setActiveTab("area-status")}
            >
              <Compass size={18} /> Road Status in My Area
            </button>
            <button
              className={`citizen-tab-btn ${activeTab === "complaints" ? "active" : ""}`}
              onClick={() => setActiveTab("complaints")}
            >
              <AlertTriangle size={18} /> My Reported Grievances
            </button>
          </div>

          {/* Area Selector Filter */}
          <div className="area-select-wrapper">
            <label style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 600 }}>Select Area:</label>
            <select
              className="area-dropdown"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {areasList.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {activeTab === "area-status" && (
          <>
            {/* Search Input */}
            <div className="citizen-search-row">
              <div style={{ position: "relative", flex: 1 }}>
                <Search size={18} className="search-icon-pos" />
                <input
                  type="text"
                  placeholder="Search road by name, area, or road ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="citizen-search-input"
                />
              </div>
            </div>

            {/* ================= AREA-WISE ROAD STATUS TABLE ================= */}
            <div className="section-title-wrapper">
              <h2>Road Status in My Area ({selectedArea})</h2>
              <p>Real-time status, reason for closure, dynamic days closed, progress %, and alternative routes.</p>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "4rem", color: "#94A3B8" }}>Loading area road status...</div>
            ) : filteredRoads.length === 0 ? (
              <div className="citizen-empty-box">
                <Compass size={40} color="#34D399" />
                <h3>No Roads Found for {selectedArea}</h3>
                <p>Try searching another area or clear your search filter.</p>
              </div>
            ) : (
              <div className="table-responsive-wrapper">
                <table className="area-road-table">
                  <thead>
                    <tr>
                      <th>Road Name</th>
                      <th>Status</th>
                      <th>Reason for Closure / Work</th>
                      <th>Closed Since</th>
                      <th>Days Closed</th>
                      <th>Expected Open</th>
                      <th>Progress</th>
                      <th>Diversion / Alternative</th>
                      <th>Traffic Impact</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRoads.map((road) => {
                      const badge = getStatusBadge(road.status);
                      const daysClosed = calculateDaysClosed(road.closureDetails?.closureStartDate);
                      const isClosedOrPartial =
                        road.status === "CLOSED" ||
                        road.status === "PARTIALLY_CLOSED" ||
                        road.status === "TEMPORARILY_CLOSED" ||
                        road.status === "UNDER_CONSTRUCTION" ||
                        road.status === "UNDER_MAINTENANCE";

                      return (
                        <tr key={road._id} onClick={() => setSelectedRoadDetails(road)} className="road-table-row">
                          <td className="road-name-cell">
                            <strong>{road.name}</strong>
                            <div className="road-sub-code">{road.roadId} • {road.area}</div>
                          </td>
                          <td>
                            <span
                              className="status-pill-badge"
                              style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="text-secondary">
                            {road.closureDetails?.reason || (isClosedOrPartial ? "Maintenance Work" : "—")}
                          </td>
                          <td className="text-secondary">
                            {isClosedOrPartial ? formatDate(road.closureDetails?.closureStartDate) : "—"}
                          </td>
                          <td className="days-highlight">
                            {isClosedOrPartial ? daysClosed : "—"}
                          </td>
                          <td className="text-emerald">
                            {isClosedOrPartial ? formatDate(road.closureDetails?.expectedReopeningDate) : "—"}
                          </td>
                          <td>
                            {isClosedOrPartial ? (
                              <div className="table-progress-wrap">
                                <div className="table-progress-bar">
                                  <div
                                    className="table-progress-fill"
                                    style={{ width: `${road.closureDetails?.constructionProgress || 50}%` }}
                                  ></div>
                                </div>
                                <span>{road.closureDetails?.constructionProgress || 50}%</span>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="text-secondary">
                            {road.closureDetails?.diversionRouteDescription || "—"}
                          </td>
                          <td>
                            {road.closureDetails?.trafficImpact ? (
                              <span className={`impact-badge impact-${road.closureDetails.trafficImpact.toLowerCase()}`}>
                                {road.closureDetails.trafficImpact}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            <button className="btn-table-details" onClick={() => setSelectedRoadDetails(road)}>
                              Details
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "complaints" && (
          <div className="citizen-grievances-card">
            <h3>
              <AlertTriangle size={20} style={{ verticalAlign: "middle", marginRight: "0.5rem", color: "#FBBF24" }} /> Track My Submitted Grievances
            </h3>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: "0.5rem 0 1.5rem" }}>
              Citizens can view assigned officer progress, check before/after repair evidence, and reopen complaints if unresolved.
            </p>
            <div className="grievance-item-box">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: "#F8FAFC" }}>Severe Potholes near Sector 12 Junction</span>
                <span className="grievance-resolved-badge">RESOLVED</span>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "0.4rem" }}>
                Linked Road: RD-1024 (Ring Road Extension) • Category: Potholes
              </div>
              <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <Link to="/complain" className="btn-view-proof">
                  View Resolution Proof
                </Link>
                <button className="btn-reopen-complaint">
                  <RefreshCw size={12} style={{ marginRight: "0.3rem", verticalAlign: "middle" }} /> Reopen Complaint
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= ROAD DETAILS MODAL (USER REQUIREMENT) ================= */}
        {selectedRoadDetails && (
          <div className="modal-backdrop-overlay" onClick={() => setSelectedRoadDetails(null)}>
            <div className="citizen-road-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-modal-header">
                <div>
                  <h2>{selectedRoadDetails.name}</h2>
                  <div style={{ fontSize: "0.85rem", color: "#94A3B8", marginTop: "0.2rem" }}>
                    Road ID: {selectedRoadDetails.roadId} • Area: {selectedRoadDetails.area}
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedRoadDetails(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="modal-modal-body">
                {/* Status Badge */}
                <div style={{ marginBottom: "1.25rem" }}>
                  <span
                    className="status-pill-badge"
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.9rem",
                      ...getStatusBadge(selectedRoadDetails.status),
                    }}
                  >
                    {getStatusBadge(selectedRoadDetails.status).label}
                  </span>
                </div>

                <div className="road-detail-specs-grid">
                  <div className="spec-box">
                    <span className="spec-label">Reason:</span>
                    <span className="spec-value">
                      {selectedRoadDetails.closureDetails?.reason || "Scheduled Road Maintenance & Transit Quality Check"}
                    </span>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Closed Since:</span>
                    <span className="spec-value">
                      {formatDate(selectedRoadDetails.closureDetails?.closureStartDate)}
                    </span>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Days Closed:</span>
                    <span className="spec-value highlight-amber">
                      {calculateDaysClosed(selectedRoadDetails.closureDetails?.closureStartDate)}
                    </span>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Expected Reopening:</span>
                    <span className="spec-value highlight-emerald">
                      {formatDate(selectedRoadDetails.closureDetails?.expectedReopeningDate)}
                    </span>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Progress:</span>
                    <span className="spec-value">
                      {selectedRoadDetails.closureDetails?.constructionProgress || 65}%
                    </span>
                    <div className="table-progress-bar" style={{ marginTop: "0.4rem", height: "8px" }}>
                      <div
                        className="table-progress-fill"
                        style={{ width: `${selectedRoadDetails.closureDetails?.constructionProgress || 65}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Alternative Route:</span>
                    <span className="spec-value" style={{ color: "#38BDF8" }}>
                      {selectedRoadDetails.closureDetails?.diversionRouteDescription || "Service Lane / Parallel Feeder Road"}
                    </span>
                  </div>

                  <div className="spec-box">
                    <span className="spec-label">Traffic Impact:</span>
                    <span className="spec-value">
                      <span className={`impact-badge impact-${(selectedRoadDetails.closureDetails?.trafficImpact || "MEDIUM").toLowerCase()}`}>
                        {selectedRoadDetails.closureDetails?.trafficImpact || "MEDIUM"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Modal Action Buttons */}
                <div className="modal-action-buttons-row">
                  <Link to={`/public-roads/${selectedRoadDetails._id}`} className="modal-btn btn-map">
                    <MapPin size={16} /> View on Map & Passport
                  </Link>
                  <button
                    className="modal-btn btn-diversion"
                    onClick={() =>
                      alert(`Diversion Instructions for ${selectedRoadDetails.name}:\n${selectedRoadDetails.closureDetails?.diversionRouteDescription || "Follow detour signs."}`)
                    }
                  >
                    <Navigation size={16} /> View Diversion
                  </button>
                  <Link to="/complain" className="modal-btn btn-report">
                    <AlertTriangle size={16} /> Report Problem
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
