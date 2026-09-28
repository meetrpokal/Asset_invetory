import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import "./Navbar.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logout } from "./auth/redux/authSlice";
import CloudImage from "./utils/CloudImage";
import { 
    MdHome, MdReport, MdMap, MdAccountBalance, MdEngineering, 
    MdPerson, MdAttachMoney, MdDashboard, MdGroup, MdAnalytics, MdReportProblem 
} from 'react-icons/md';

// Navigation links component using React Router Link
const NavLinks = ({ links, currentPath }) => {
    return (
        <>
            {links.map((link, index) => {
                const Icon = link.icon;
                return (
                <Link
                    key={link.name}
                    to={link.href}
                    className={`navbar-link ${currentPath === link.href ? 'navbar-link-active' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <Icon className="navbar-link-icon" />
                    <span className="navbar-link-text">{link.name}</span>
                    <div className="navbar-link-hover-effect"></div>
                </Link>
                );
            })}
        </>
    );
};

NavLinks.displayName = 'NavLinks';

// Memoized auth buttons component
const AuthButtons = React.memo(({ isAuthenticated, handleLogin, handleSignup, handleSignOut, handleProfileClick, userProfileImage, userName }) => {
    return (
        <div className="navbar-auth">
            {!isAuthenticated ? (
                <>
                    <button 
                        className="auth-btn login-btn"
                        onClick={handleLogin}
                    >
                        <svg className="auth-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login
                    </button>
                    <button 
                        className="auth-btn signup-btn"
                        onClick={handleSignup}
                    >
                        <svg className="auth-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Sign Up
                    </button>
                </>
            ) : (
                <>
                    <button 
                        className="auth-btn signout-btn"
                        onClick={handleSignOut}
                        title="Sign Out"
                    >
                        <svg className="auth-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                    <button 
                        className="profile-btn"
                        onClick={handleProfileClick}
                        title={`${userName || 'Unknown'}'s Profile`}
                    >
                        <CloudImage
                            src={userProfileImage || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"}
                            alt={userName || "Unknown"}
                            className="profile-avatar"
                        />
                        <div className="profile-status-indicator"></div>
                    </button>
                </>
            )}
        </div>
    );
});

AuthButtons.displayName = 'AuthButtons';

const Navbar = () => {
    // Use more specific selectors to prevent unnecessary re-renders
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userProfileImage = useSelector((state) => state.auth.user?.profileImage);
    const userName = useSelector((state) => state.auth.user?.name);
    const userRole = useSelector((state) => state.auth.user?.role || 'citizen');
    
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    const handleSignup = useCallback(() => {
        navigate('/signup');
        // console.log('Signup clicked');
    }, [navigate]);

    const handleSignOut = useCallback(() => {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        dispatch(logout());
        // console.log('Sign out clicked');
    }, [dispatch]);

    const handleProfileClick = useCallback(() => {
        navigate("/user");
        // console.log('Profile clicked');
    }, [navigate]);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    const handleLogoClick = useCallback(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const commonNavLinks = useMemo(() => [
        { name: 'Home', href: '/home', icon: MdHome },
        { name: 'Road Assets', href: '/roads', icon: MdMap },
        { name: 'Government', href: '/government-dashboard', icon: MdAccountBalance },
        { name: 'Contractor', href: '/contractor-dashboard', icon: MdEngineering },
        { name: 'Citizen', href: '/citizen-dashboard', icon: MdPerson },
        { name: 'Budget', href: '/budget', icon: MdAttachMoney },
    ], []);

    // Citizen-specific navigation links
    const citizenSpecificLinks = useMemo(() => [
    ], []);

    // Officer-specific navigation links
    const officerSpecificLinks = useMemo(() => [
        { name: 'Complaints', href: '/complain', icon: MdReport },
        { name: 'Department', href: '/officer/department', icon: MdAccountBalance },
        { name: 'Teams', href: '/officer/teams', icon: MdGroup },
    ], []);

    // Build navigation links based on user role
    const displayNavLinks = useMemo(() => {
        if (userRole === 'officer') {
            // Officer gets: Home + officer-specific links (Complaints, Queue, Escalations, Analytics, Teams)
            return [commonNavLinks[0], ...officerSpecificLinks]; // commonNavLinks[0] is Home
        }
        
        // Citizen gets: Common links + Complaint (if authenticated) + citizen-specific links
        let links = [...commonNavLinks];
        
        if (isAuthenticated) {
            links.splice(1, 0, { 
                name: 'Complaint', 
                href: '/complain', 
                icon: MdReport 
            });
        }
        
        links = [...links, ...citizenSpecificLinks];
        
        return links;
    }, [isAuthenticated, userRole, commonNavLinks, citizenSpecificLinks, officerSpecificLinks]);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <div className="navbar-brand">
                    <Link to="/home" className="lodge-logo" onClick={handleLogoClick}>
                        <svg className="lodge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="lodge-text">RoadInfra</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <div className="navbar-menu ml-3">
                    <NavLinks links={displayNavLinks} currentPath={location.pathname} />
                </div>

                {/* Authentication & Profile Section */}
                <AuthButtons
                    isAuthenticated={isAuthenticated}
                    handleLogin={handleLogin}
                    handleSignup={handleSignup}
                    handleSignOut={handleSignOut}
                    handleProfileClick={handleProfileClick}
                    userProfileImage={userProfileImage}
                    userName={userName}
                />

                {/* Mobile Menu Button */}
                <div className="mobile-menu-button" onClick={toggleMobileMenu}>
                    <div className={`hamburger ${isMobileMenuOpen ? 'hamburger-active' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Sidebar */}
            <div className={`mobile-nav-sidebar ${isMobileMenuOpen ? 'mobile-nav-sidebar-open' : ''}`}>
                <div className="mobile-nav-sidebar-content">
                    {displayNavLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                        <Link
                            key={link.name}
                            to={link.href}
                            className={`mobile-nav-link ${location.pathname === link.href ? 'mobile-nav-link-active' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                            onClick={closeMobileMenu}
                        >
                            <Icon className="mobile-nav-link-icon" />
                            <span className="mobile-nav-link-text">{link.name}</span>
                        </Link>
                        );
                    })}

                    {/* Mobile Auth Section */}
                    <div className="mobile-nav-auth-section">
                        {!isAuthenticated ? (
                            <>
                                <button 
                                    className="mobile-nav-auth-btn mobile-nav-login-btn"
                                    onClick={() => { handleLogin(); closeMobileMenu(); }}
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Login
                                </button>
                                <button 
                                    className="mobile-nav-auth-btn mobile-nav-signup-btn"
                                    onClick={() => { handleSignup(); closeMobileMenu(); }}
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                <div 
                                    className="mobile-nav-profile-card"
                                    onClick={() => { handleProfileClick(); closeMobileMenu(); }}
                                >
                                    <CloudImage
                                        src={userProfileImage || "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png"}
                                        alt={userName || "Unknown"}
                                        className="mobile-nav-profile-avatar"
                                    />
                                    <div className="mobile-nav-profile-info">
                                        <div className="mobile-nav-profile-name">{userName || 'User'}</div>
                                        <div className="mobile-nav-profile-role">{userRole === 'officer' ? 'Officer' : 'Citizen'}</div>
                                    </div>
                                </div>
                                <button 
                                    className="mobile-nav-auth-btn mobile-nav-signout-btn"
                                    onClick={() => { handleSignOut(); closeMobileMenu(); }}
                                >
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

Navbar.displayName = 'Navbar';

export default Navbar;
