import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { createAsset, getAssetById, updateAsset, getAssetTypes } from "../api/assetApi";
import { MapPin, Info, Layers, Wrench, Shield, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import "./AssetForm.css";

export default function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    assetType: "Street Light",
    description: "",
    address: "",
    city: "Surat",
    state: "Gujarat",
    area: "",
    longitude: 72.8311,
    latitude: 21.1702,
    status: "ACTIVE",
    health: "HEALTHY",
    criticality: "MEDIUM",
    vendor: "",
    purchaseCost: 0,
    currentValue: 0,
    purchaseDate: "",
    installationDate: "",
    warrantyEndDate: "",
    tags: "",
  });

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getAssetTypes();
        if (res.success) setAssetTypes(res.data || []);
      } catch (err) {
        console.error("Error fetching asset types:", err);
      }
    };
    fetchTypes();

    if (isEdit) {
      const fetchAsset = async () => {
        setLoading(true);
        try {
          const res = await getAssetById(id);
          if (res.success && res.data) {
            const data = res.data;
            setFormData({
              name: data.name || "",
              assetType: data.assetType || "Street Light",
              description: data.description || "",
              address: data.address || "",
              city: data.city || "Surat",
              state: data.state || "Gujarat",
              area: data.area || "",
              longitude: data.location?.coordinates?.[0] || 72.8311,
              latitude: data.location?.coordinates?.[1] || 21.1702,
              status: data.status || "ACTIVE",
              health: data.health || "HEALTHY",
              criticality: data.criticality || "MEDIUM",
              vendor: data.vendor || "",
              purchaseCost: data.purchaseCost || 0,
              currentValue: data.currentValue || 0,
              purchaseDate: data.purchaseDate ? data.purchaseDate.split("T")[0] : "",
              installationDate: data.installationDate ? data.installationDate.split("T")[0] : "",
              warrantyEndDate: data.warrantyEndDate ? data.warrantyEndDate.split("T")[0] : "",
              tags: data.tags ? data.tags.join(", ") : "",
            });
          }
        } catch (err) {
          setError("Failed to load asset details.");
        } finally {
          setLoading(false);
        }
      };
      fetchAsset();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        assetType: formData.assetType,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        area: formData.area,
        location: {
          type: "Point",
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
        },
        status: formData.status,
        health: formData.health,
        criticality: formData.criticality,
        vendor: formData.vendor,
        purchaseCost: parseFloat(formData.purchaseCost) || 0,
        currentValue: parseFloat(formData.currentValue) || 0,
        purchaseDate: formData.purchaseDate || undefined,
        installationDate: formData.installationDate || undefined,
        warrantyEndDate: formData.warrantyEndDate || undefined,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      };

      if (isEdit) {
        await updateAsset(id, payload);
      } else {
        await createAsset(payload);
      }
      navigate("/assets");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save infrastructure asset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="asset-form-container">
        <div style={{ maxWidth: "900px", margin: "0 auto 1rem" }}>
          <Link to="/assets" style={{ color: "#60A5FA", display: "inline-flex", alignItems: "center", gap: "0.4rem", textDecoration: "none" }}>
            <ArrowLeft size={16} /> Back to Asset Inventory
          </Link>
        </div>

        <div className="asset-form-card">
          <div className="asset-form-header">
            <h2>{isEdit ? "Edit Infrastructure Asset" : "Register Infrastructure Asset"}</h2>
            <p>Enter exact asset metadata, geospatial coordinates, and operational state</p>
          </div>

          {error && (
            <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid #EF4444", color: "#F87171", padding: "0.75rem 1rem", borderRadius: "10px", marginBottom: "1.5rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section 1: Basic Information */}
            <div className="form-section-title">
              <Info size={18} /> Basic Information
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Asset Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Vesu Main Street Light Pole 1024"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Asset Type *</label>
                <select name="assetType" value={formData.assetType} onChange={handleChange}>
                  {assetTypes.map((t) => (
                    <option key={t._id || t.name} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  <option value="Street Light">Street Light</option>
                  <option value="Road">Road</option>
                  <option value="Water Pipeline">Water Pipeline</option>
                  <option value="Traffic Signal">Traffic Signal</option>
                  <option value="Drainage System">Drainage System</option>
                  <option value="CCTV Camera">CCTV Camera</option>
                  <option value="Government Building">Government Building</option>
                  <option value="Electric Pole">Electric Pole</option>
                  <option value="Public Facility">Public Facility</option>
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label>Description</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Technical specifications, capacity, or identification details..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            {/* Section 2: Location & Geospatial */}
            <div className="form-section-title">
              <MapPin size={18} /> Location & Geospatial Coordinates
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Longitude (X) *</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  required
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Latitude (Y) *</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  required
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Address / Street</label>
                <input
                  type="text"
                  name="address"
                  placeholder="e.g. Near University Circle, Vesu"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Area / Sector</label>
                <input
                  type="text"
                  name="area"
                  placeholder="e.g. Zone 4 - Vesu"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 3: Status & Health */}
            <div className="form-section-title">
              <Shield size={18} /> Status, Health & Criticality
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Lifecycle Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="PLANNED">PLANNED</option>
                  <option value="ACQUIRED">ACQUIRED</option>
                  <option value="REGISTERED">REGISTERED</option>
                  <option value="DEPLOYED">DEPLOYED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="DAMAGED">DAMAGED</option>
                  <option value="TRANSFERRED">TRANSFERRED</option>
                  <option value="RETIRED">RETIRED</option>
                  <option value="DISPOSED">DISPOSED</option>
                </select>
              </div>

              <div className="form-group">
                <label>Health Condition</label>
                <select name="health" value={formData.health} onChange={handleChange}>
                  <option value="HEALTHY">HEALTHY</option>
                  <option value="WARNING">WARNING</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="UNKNOWN">UNKNOWN</option>
                </select>
              </div>

              <div className="form-group">
                <label>Criticality Level</label>
                <select name="criticality" value={formData.criticality} onChange={handleChange}>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="form-group">
                <label>Vendor / Manufacturer</label>
                <input
                  type="text"
                  name="vendor"
                  placeholder="e.g. Philips Lighting / Siemens"
                  value={formData.vendor}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Section 4: Valuation & Warranty Dates */}
            <div className="form-section-title">
              <Calendar size={18} /> Financials & Warranty
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label>Purchase Cost (₹)</label>
                <input
                  type="number"
                  name="purchaseCost"
                  value={formData.purchaseCost}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Warranty End Date</label>
                <input
                  type="date"
                  name="warrantyEndDate"
                  value={formData.warrantyEndDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <Link to="/assets" className="btn-cancel">
                Cancel
              </Link>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Saving..." : isEdit ? "Update Asset" : "Save Infrastructure Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
