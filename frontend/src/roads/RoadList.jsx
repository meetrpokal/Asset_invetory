import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRoads } from "../api/roadApi";
import { Compass, Search, MapPin, Activity, Plus, ChevronRight, AlertTriangle, Layers } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./RoadList.css";

export default function RoadList() {
  const [roads, setRoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

  const fetchRoads = async () => {
    setLoading(true);
    try {
      const res = await getRoads({
        search,
        status: selectedStatus,
        condition: selectedCondition,
        limit: 20,
      });
      if (res.success) setRoads(res.data || []);
    } catch (err) {
      console.error("Error fetching roads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRoads();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedStatus, selectedCondition]);

  return (
    <>
      <Navbar />
      <div className="road-list-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Municipal Road Network Inventory</h1>
            <p>Monitor active roads, physical condition, warranty status, and citizen grievances</p>
          </div>
          <Link to="/road-projects" className="btn-create-asset">
            <Plus size={18} /> Propose New Road
          </Link>
        </div>

        {/* Filter bar */}
        <div className="asset-filter-bar">
          <div className="filter-row-top">
            <div className="search-input-wrapper">
              <Search className="search-icon-inside" size={18} />
              <input
                type="text"
                placeholder="Search Road ID, Code, Name, Area, or Ward..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="filter-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="UNDER_CONSTRUCTION">UNDER_CONSTRUCTION</option>
              <option value="UNDER_INSPECTION">UNDER_INSPECTION</option>
              <option value="UNDER_MAINTENANCE">UNDER_MAINTENANCE</option>
              <option value="DAMAGED">DAMAGED</option>
              <option value="REHABILITATION">REHABILITATION</option>
              <option value="RECONSTRUCTION">RECONSTRUCTION</option>
              <option value="RETIRED">RETIRED</option>
            </select>

            <select
              className="filter-select"
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
            >
              <option value="">All Physical Conditions</option>
              <option value="EXCELLENT">EXCELLENT</option>
              <option value="GOOD">GOOD</option>
              <option value="FAIR">FAIR</option>
              <option value="POOR">POOR</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Road Network Assets...</p>
          </div>
        ) : roads.length === 0 ? (
          <div className="no-assets-empty">
            <Compass size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Roads Match Your Filters</h3>
            <p>Try adjusting search keywords or status filters.</p>
          </div>
        ) : (
          <div className="assets-grid">
            {roads.map((road) => (
              <div key={road._id} className="asset-card">
                <div className="asset-card-header">
                  <div>
                    <span className="asset-code-tag">{road.roadCode}</span>
                    <h3 className="asset-card-title">{road.name}</h3>
                    <div className="asset-type-badge">
                      <Compass size={14} /> {road.length} km • {road.lanes} Lanes
                    </div>
                  </div>
                  <span className={`status-badge status-${road.status}`}>{road.status}</span>
                </div>

                <div className="asset-card-body">
                  <div className="asset-detail-row">
                    <span className="detail-label">Condition:</span>
                    <span className="detail-value" style={{ fontWeight: "700" }}>{road.condition}</span>
                  </div>

                  <div className="asset-detail-row">
                    <span className="detail-label">Concern Indicator:</span>
                    <span className={`concern-badge concern-${road.roadConcernIndicator || "LOW"}`}>
                      {road.roadConcernIndicator || "LOW"}
                    </span>
                  </div>

                  <div className="asset-detail-row">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <MapPin size={14} color="#60A5FA" />
                      {road.area ? `${road.area}, ` : ""}{road.city}
                    </span>
                  </div>

                  {/* Closure & Diversion Alert Banner */}
                  {road.status === "TEMPORARILY_CLOSED" && road.closureDetails?.isClosed && (
                    <div style={{ marginTop: "0.75rem", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "0.6rem", fontSize: "0.8rem", color: "#FCA5A5" }}>
                      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <AlertTriangle size={14} color="#EF4444" /> ROAD CLOSED: {road.closureDetails.reason || "Under Maintenance"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#CBD5E1", marginTop: "0.25rem" }}>
                        <strong>Diversion:</strong> {road.closureDetails.diversionRouteDescription || "Follow posted detour signs."}
                      </div>
                    </div>
                  )}
                </div>

                <div className="asset-card-footer">
                  <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>ID: {road.roadId}</span>
                  <Link to={`/roads/${road._id}`} className="btn-view-details">
                    Digital Profile & Tabs <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
