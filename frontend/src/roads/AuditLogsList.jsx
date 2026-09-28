import React, { useState, useEffect } from "react";
import { getAuditLogs } from "../api/roadApi";
import { Clock, Shield, Activity, User, FileText } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./AuditLogsList.css";

export default function AuditLogsList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getAuditLogs();
        if (res.success) setLogs(res.data || []);
      } catch (err) {
        console.error("Error fetching audit logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="audit-logs-container">
        {/* Header */}
        <div className="asset-header-section">
          <div className="asset-title-area">
            <h1>Government Actions & Audit Trail</h1>
            <p>Auditable, non-deletable log of administrative budget approvals, tender awards, and lifecycle updates</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#9CA3AF" }}>
            <Activity className="animate-spin" size={32} style={{ marginBottom: "1rem" }} />
            <p>Loading Government Audit Trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="no-assets-empty">
            <Shield size={48} style={{ color: "#3B82F6", marginBottom: "1rem" }} />
            <h3>No Audit Logs Recorded</h3>
            <p>Administrative actions will automatically be recorded here.</p>
          </div>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>Entity</th>
                  <th>Entity ID</th>
                  <th>Authorized Officer</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l._id}>
                    <td>{new Date(l.timestamp).toLocaleString()}</td>
                    <td>
                      <span className="pill-btn" style={{ fontSize: "0.78rem" }}>{l.action}</span>
                    </td>
                    <td style={{ fontWeight: "600" }}>{l.entity}</td>
                    <td>{l.entityId}</td>
                    <td>{l.user?.name || "System Admin"} ({l.user?.role || "Admin"})</td>
                    <td style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>{l.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
