import React from "react";
import "./Footer.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Road Inventory', href: '/roads' },
        { name: 'Government Portal', href: '/government-dashboard' },
        { name: 'Contractor Portal', href: '/contractor-dashboard' },
        { name: 'Citizen Portal', href: '/citizen-dashboard' },
        { name: 'Budget Tracking', href: '/budget' }
    ];

    const legalLinks = [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Data Protection', href: '/data-protection' },
        { name: 'Accessibility', href: '/accessibility' }
    ];

    const roadServices = [
        { name: 'Road Maintenance Helpline', phone: '1800-ROADS-01', icon: '🛣️' },
        { name: 'Pothole & Surface Repair', phone: '1800-REPAIR-99', icon: '🚧' },
        { name: 'Traffic & Diversion Info', phone: '1800-DIVERSION', icon: '🚦' },
        { name: 'Highway Quality Cell', phone: '1800-INSPECT', icon: '📋' }
    ];

    return (
        <footer className="footer-container">
            {/* Road Infrastructure Banner */}
            <div className="emergency-banner" style={{ background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))", borderColor: "rgba(56, 189, 248, 0.3)" }}>
                <div className="emergency-content">
                    <div className="emergency-icon" style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38BDF8" }}>
                        <svg className="pulse-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                    </div>
                    <div className="emergency-text">
                        <h3 style={{ color: "#38BDF8" }}>Government Road Infrastructure Management</h3>
                        <p style={{ color: "#94A3B8" }}>Digitally managing road assets from planning, budgeting, & construction through inspection, maintenance, and rehabilitation.</p>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section brand-section">
                        <svg className="footer-logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span className="footer-logo-text">RoadInfra</span>
                        <p className="brand-description">
                            Unified government platform for municipal road lifecycle tracking, quality inspections, contractor maintenance, and citizen grievance resolution.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Quick Access</h3>
                        <ul className="footer-links">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="footer-link">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Road Services */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Road Helplines</h3>
                        <div className="emergency-services">
                            {roadServices.map((service, index) => (
                                <div key={index} className="emergency-service">
                                    <span className="service-icon">{service.icon}</span>
                                    <div className="service-info">
                                        <span className="service-name">{service.name}</span>
                                        <span className="service-phone">{service.phone}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legal */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Legal & Compliance</h3>
                        <ul className="footer-links">
                            {legalLinks.map((link, index) => (
                                <li key={index}>
                                    <a href={link.href} className="footer-link">
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <div className="copyright">
                        <p>&copy; {currentYear} RoadInfra Infrastructure Platform. All rights reserved.</p>
                        <p className="disclaimer">
                            Official Road Infrastructure Asset Inventory & Lifecycle Management Platform.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}