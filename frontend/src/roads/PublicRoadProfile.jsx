import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getPublicRoadById } from "../api/roadApi";
import { MapPin, Compass, AlertTriangle, ShieldCheck, QrCode, Activity } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./PublicRoadProfile.css";

export default function PublicRoadProfile() {
  const { id } = useParams();
  const [road, setRoad] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      setLoading(true);
      try {
        const res = await getPublicRoadById(id);
        if (res.success && res.data) {
          setRoad(res.data);
        }
      } catch (err) {
        console.error("Error loading public road profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <Activity className="animate-spin" size={36} style={{ marginBottom: "1rem" }} />
          <p>Scanning Digital Road Passport...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!road) {
    return (
      <>
        <Navbar />
        <div style={{ textAlign: "center", padding: "6rem 2rem", color: "#9CA3AF" }}>
          <h2>Public Road Passport Not Found</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="public-road-container">
        <div className="public-road-card">
          <div className="public-qr-header">
            <span className="asset-code-tag">{road.roadCode}</span>
            <h1>{road.name}</h1>
            <p style={{ color: "#9CA3AF", margin: "0.25rem 0 0 0" }}>
              Public Infrastructure Digital Passport • {road.city}
            </p>
          </div>

          <div className="key-val-grid" style={{ marginBottom: "2rem" }}>
            <div className="kv-item">
              <label>Road ID</label>
              <span>{road.roadId}</span>
            </div>
            <div className="kv-item">
              <label>Length & Width</label>
              <span>{road.length} km • {road.width} m</span>
            </div>
            <div className="kv-item">
              <label>Status</label>
              <span className={`status-badge status-${road.status}`}>{road.status}</span>
            </div>
            <div className="kv-item">
              <label>Physical Condition</label>
              <span>{road.condition}</span>
            </div>
            <div className="kv-item">
              <label>Concern Indicator</label>
              <span className={`concern-badge concern-${road.roadConcernIndicator}`}>
                {road.roadConcernIndicator}
              </span>
            </div>
            <div className="kv-item">
              <label>Public Views</label>
              <span>{road.viewsCount} Scans</span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link to={`/complain?roadId=${road.roadId}`} className="btn-create-asset" style={{ width: "100%", justifyContent: "center", padding: "1rem" }}>
              <AlertTriangle size={18} /> Report Issue / Pothole On This Road
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
