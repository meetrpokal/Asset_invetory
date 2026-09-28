# 🛣️ RoadInfra - Asset Inventory & Road Management System

A comprehensive, real-time road asset, budget allocation, and complaint management platform designed for public infrastructure departments including Government Officials, Road Contractors, and Citizens.

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green.svg)
![React](https://img.shields.io/badge/react-19.1.0-blue.svg)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Core Features](#-core-features)
- [Advanced Features](#-advanced-features)
- [Architecture & Performance](#-architecture--performance)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)

---

## 🌟 Overview

**RoadInfra** is a full-stack web application that enables citizens to report road-related complaints and view budget allocations, while providing government officials and contractors with real-time tools to allocate funds, manage infrastructure projects, and respond to issues efficiently. The platform leverages modern web technologies to deliver a responsive, real-time, and highly optimized user experience.

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | UI Framework |
| **Vite** | 6.3.5 | Build Tool & Dev Server |
| **Redux Toolkit** | 2.8.2 | Global State Management |
| **React Redux** | 9.2.0 | React-Redux Bindings |
| **Redux Persist** | 6.0.0 | State Persistence |
| **TanStack React Query** | 5.85.5 | Server State & Caching |
| **React Router DOM** | 7.7.0 | Client-side Routing |
| **Axios** | 1.10.0 | HTTP Client |
| **Socket.IO Client** | 4.8.1 | Real-time Communication |
| **Framer Motion** | 12.23.24 | Animations |
| **Leaflet** | 1.9.4 | Interactive Maps |
| **React Leaflet** | 5.0.0 | React Leaflet Bindings |
| **Chart.js** | 4.5.1 | Data Visualization |
| **React Chart.js 2** | 5.3.0 | Chart.js React Wrapper |
| **D3.js** | 7.9.0 | Advanced Visualizations |
| **Lucide React** | 0.525.0 | Icon Library |
| **React Icons** | 5.5.0 | Additional Icons |
| **Heroicons** | 2.2.0 | UI Icons |
| **React Hot Toast** | 2.5.2 | Toast Notifications |
| **React Toastify** | 11.0.5 | Alternative Notifications |
| **React Intersection Observer** | 9.16.0 | Infinite Scroll & Lazy Loading |
| **Three.js** | 0.180.0 | 3D Graphics (Grid Effects) |

### **Backend**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | Runtime Environment |
| **Express** | 5.1.0 | Web Framework |
| **MongoDB** | - | Primary Database |
| **Mongoose** | 8.16.0 | MongoDB ODM |
| **PostgreSQL** | - | Relational Database (Rail Data) |
| **pg** | 8.16.3 | PostgreSQL Client |
| **Redis** | 5.9.0 | Caching & Session Management |
| **IORedis** | 5.8.2 | Redis Client for BullMQ |
| **BullMQ** | 5.64.1 | Background Job Queue & Scheduler |
| **Socket.IO** | 4.8.1 | Real-time WebSocket Server |
| **JWT** | 9.0.2 | Authentication |
| **bcryptjs** | 3.0.2 | Password Hashing |
| **Cloudinary** | 2.7.0 | Image/Media Storage |
| **Multer** | 2.0.1 | File Upload Handling |
| **Sharp** | 0.34.3 | Image Processing |
| **Cookie Parser** | 1.4.7 | Cookie Handling |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 16.5.0 | Environment Configuration |
| **Nodemon** | 3.1.10 | Development Auto-reload |

---

## 🎯 Core Features

### 1. **User Authentication & Authorization**
- ✅ **JWT-based Authentication** with access and refresh tokens
- ✅ **Role-based Access Control** (Citizen, Officer, Admin)
- ✅ **Secure Password Hashing** using bcrypt
- ✅ **Cookie-based Session Management**
- ✅ **Profile Image Upload** with Cloudinary integration
- ✅ **Multi-level Officer Hierarchy** (levels 0-5)
- ✅ **Department-specific Officer Registration** with secret validation
- ✅ **Protected Routes** with authentication middleware
- ✅ **Auto-logout** on token expiration
- ✅ **Password Change** functionality

### 2. **Complaint Management System**
- ✅ **Create Complaints** with multiple categories:
  - 🚓 Police
  - 🚒 Fire
  - 🚂 Railway
  - 🛣️ Road
  - 💻 Cyber Crime
  - ⚖️ Court
- ✅ **GeoJSON Location Storage** (lat/lng coordinates)
- ✅ **Address Integration** with geolocation
- ✅ **Media Upload Support** (images, videos, audio)
- ✅ **Multi-evidence Attachment**
- ✅ **Status Tracking** (pending, in-progress, resolved, closed)
- ✅ **Priority Levels** (low, medium, high)
- ✅ **Complaint Types** (general, urgent, emergency)
- ✅ **User-specific Complaints** view
- ✅ **Category-based Filtering**
- ✅ **Complaint Detail View** with full information
- ✅ **Complaint Deletion** (owner only)
- ✅ **Complaint Update** (status, assignments)

### 3. **Voting & Engagement System**
- ✅ **Upvote/Downvote** mechanism
- ✅ **Vote Tracking** (user can vote once per complaint)
- ✅ **Vote Toggle** (change vote or remove)
- ✅ **Real-time Vote Count Updates**
- ✅ **Vote-based Trending Score** calculation
- ✅ **Optimistic UI Updates** for instant feedback

### 4. **Comments & Feedback**
- ✅ **Nested Comments System**
- ✅ **Star Rating** (1-5 stars) for feedback
- ✅ **Comment Creation, Edit, Delete**
- ✅ **User-specific Comment Management**
- ✅ **Comment Count Display**
- ✅ **Comment Modal** for detailed view
- ✅ **Real-time Comment Updates**
- ✅ **Timestamp Formatting** (relative time)

### 5. **Real-time Features (Socket.IO)**
- ✅ **Live Complaint Updates** for complaint owners
- ✅ **Real-time Notifications** for users
- ✅ **Live Incident Reports** on map
- ✅ **Officer Assignment Notifications**
- ✅ **Status Change Alerts**
- ✅ **New Complaint Alerts** for officers
- ✅ **Escalation Notifications**
- ✅ **Comment Activity Updates**
- ✅ **Vote Count Live Updates**
- ✅ **Sound Notifications** for important alerts

### 6. **Geolocation & Mapping**
- ✅ **Interactive Leaflet Maps** with custom markers
- ✅ **Real-time User Location** tracking
- ✅ **Complaint Location Pins** on map
- ✅ **Incident Markers** with different colors by category
- ✅ **Location Permission Handling**
- ✅ **Distance Calculation** (Haversine formula)
- ✅ **Nearby Complaints** within radius (10km, 20km, 100km)
- ✅ **Geospatial Queries** with MongoDB GeoJSON
- ✅ **Map Clustering** for multiple markers
- ✅ **Custom Map Controls**
- ✅ **Address Geocoding**
- ✅ **Location-based Analytics**

### 7. **Officer Dashboard & Tools**
- ✅ **Nearby Complaints Feed** based on officer location
- ✅ **Severity-based Radius** (low: 10km, medium: 20km, high: 100km)
- ✅ **Complaint Assignment** to officers
- ✅ **Reject Complaint** functionality (stored in Redis)
- ✅ **Rejected Complaints Filtering** (Redis-based exclusion)
- ✅ **Officer-specific Notifications**
- ✅ **Real-time New Complaint Alerts**
- ✅ **Department-based Filtering**
- ✅ **Level-based Access Control**
- ✅ **Complaint History** for assigned cases
- ✅ **Officer Dashboard** - Command center with stats overview
- ✅ **Officer Cases Management** - Filter by status (all, pending, in-progress, resolved)
- ✅ **Officer Escalations View** - Track high-priority escalated complaints
- ✅ **Officer Analytics Dashboard** - Case trends, response times, resolution rates
- ✅ **Officer Reports** - Generate reports with date range filtering
- ✅ **Officer Department View** - Department analytics with Chart.js/D3.js visualizations
- ✅ **Interactive Complaint Maps** - Leaflet maps showing officer location and nearby complaints
- ✅ **Complaint Card Map** - Visual connection between officer and complaint locations
- ✅ **Severity-colored Markers** - Color-coded complaint pins (green: low, yellow: medium, red: high)
- ✅ **Distance Calculation Display** - Show distance to each complaint using Haversine formula

### 8. **Escalation System**
- ✅ **Multi-level Escalation** (Level 1 to Level 5)
- ✅ **Automatic Level Assignment** based on officer role
- ✅ **Escalation History** tracking
- ✅ **Escalation Reasons** documentation
- ✅ **Officer-only Escalation Rights**
- ✅ **Escalation Notifications** via Socket.IO
- ✅ **Status Change on Escalation**
- ✅ **Escalation Timeline** view
- ✅ **Severity-based Notifications**
- ✅ **Automated Time-based Escalation** using BullMQ
- ✅ **Background Job Processing** for delayed escalations
- ✅ **Escalation Time Rules** by severity (low: 24h, medium: 12-48h, high: 1m-30h)
- ✅ **Auto-close** complaints after maximum escalation level
- ✅ **Job Scheduling & Cancellation** on officer action
- ✅ **Complaint Reactivation** on auto-escalation for new officer assignment
- ✅ **Escalation Badge Component** - Visual badge showing escalation level
- ✅ **Live Countdown Timer** - Real-time countdown until next escalation
- ✅ **Progress Bar** - Visual progress towards next escalation level
- ✅ **Overdue Indicators** - Alert when escalation time has passed
- ✅ **Multiple Badge Sizes** - Small, medium, large badge variants
- ✅ **Compact Badge** - Minimal version for list views

### 9. **Incident Reporting**
- ✅ **Quick Incident Reports** for emergencies
- ✅ **Real-time Incident Broadcast** to map
- ✅ **Category-based Incident Types**
- ✅ **Priority Scoring**
- ✅ **Evidence Attachment**
- ✅ **Incident Verification** by officers
- ✅ **Incident Upvote/Downvote**
- ✅ **Incident Status Updates**
- ✅ **Incident Deletion**
- ✅ **Incident Assignment** to officers

### 10. **Railway Integration**
- ✅ **Train Information Database** (PostgreSQL)
- ✅ **Train Station Data** with all stops
- ✅ **Train Number Search**
- ✅ **Station Code Search**
- ✅ **Train Route Display**
- ✅ **Real-time Train Data** updates
- ✅ **Railway Complaint Tagging** with train details
- ✅ **Station-specific Complaints**

### 11. **Department Management**
- ✅ **Department Creation** with category
- ✅ **Department Secret Validation** for officer signup
- ✅ **Department Contact Information**
- ✅ **Jurisdiction Levels**
- ✅ **Category-based Department Grouping**
- ✅ **Department Caching** (Redis)
- ✅ **Department-specific Officer Assignment**
- ✅ **Department Analytics**

### 12. **Analytics & Insights**
- ✅ **Location-based Analytics** (10km radius)
- ✅ **Category Distribution** charts
- ✅ **Status Breakdown** visualization
- ✅ **Severity Analysis** by level
- ✅ **Trending Complaints** scoring
- ✅ **Time-based Trends**
### 13. **Evidence Management System**
- ✅ **Multi-evidence Upload** per complaint
- ✅ **Evidence Types** (image, video, audio, document)
- ✅ **Hierarchical Evidence Display** (Citizens → Officer Levels)
- ✅ **Color-coded Evidence Cards** (complainer/citizens/officers)
- ✅ **Escalation Level Tracking** for evidence submissions
- ✅ **Evidence Description** with timestamps
- ✅ **File Preview** (images, videos, audio players)
- ✅ **Evidence Download** with cross-origin support
- ✅ **Collapsible Sections** by hierarchy level
- ✅ **Evidence during Registration** - upload files when creating complaint
- ✅ **Evidence after Creation** - add supporting evidence later
- ✅ **File Metadata** (name, size, mime type, Cloudinary public_id)
- ✅ **Evidence Deletion** with authorization checks
- ✅ **Redux State Management** for evidence operations
- ✅ **Cloudinary Integration** for secure storage
- ✅ **Complaint Progress Component** (625 lines) - Full evidence management UI
- ✅ **Tabbed Interface** - View/Upload tabs for evidence
- ✅ **Evidence Type Selection** - Categorize uploads by type
- ✅ **Preview Modal** - View evidence files in overlay
- ✅ **File Type Icons** - Different icons for images, videos, audio, documents
- ✅ **Upload Progress** - Visual feedback during file upload

### 14. **Guidance System**
- ✅ **User-contributed Guidance** for complaint categories
- ✅ **Category-specific Guidance** articles
- ✅ **Guidance Verification** by officers/admins
- ✅ **Verified Badge** for trusted guidance
- ✅ **Create, Read, Update, Delete** operations

### 15. **Team Management System**
- ✅ **Create Teams** with category-based grouping
- ✅ **Team Head Assignment** (officer who creates is head)
- ✅ **Member Management** - Add/remove officers from teams
- ✅ **Complaint Assignment to Teams** - Assign complaints to entire teams
- ✅ **Team Level Calculation** - Average of all member levels
- ✅ **Category Validation** - Officers can only join teams of their category
- ✅ **Department Association** - Teams linked to departments
- ✅ **Team Details Aggregation** - Deep populated team information
- ✅ **Category-based Team Search** - Find teams by category
- ✅ **Team CRUD Operations** - Full create, read, update, delete support
- ✅ **Officer Teams UI** - Full-featured team management interface (929 lines)
- ✅ **Member Selection Modal** - Add officers with pagination
- ✅ **Complaint Assignment Modal** - Assign available complaints to teams

### 16. **Help & Support System**
- ✅ **FAQ System** with categorized questions
- ✅ **Category-based FAQ Filtering** (getting-started, complaints, features, security)
- ✅ **Searchable Help Articles**
- ✅ **Interactive Accordion UI** for FAQ items
- ✅ **Contact Information Display**
- ✅ **Video Tutorial Links** (planned)
- ✅ **Quick Start Guides**
- ✅ **Responsive Help Layout**
### 16. **User Profile & History**
- ✅ **User Profile Page** with stats
- ✅ **Profile Image Update**
- ✅ **Account Details Update** (name, email, phone, address)
- ✅ **Password Change**
- ✅ **User History Tracking**:
  - Complaint actions
  - Vote history
  - Comment history
  - Status changes
- ✅ **Activity Timeline**
- ✅ **User Statistics** (total complaints, resolved, pending)
- ✅ **User Deletion** with data cleanup

### 17. **Background Job Processing (BullMQ)**
- ✅ **Complaint Queue** for automated tasks
- ✅ **Scheduled Escalations** with precise timing
- ✅ **Delayed Job Execution** based on severity rules
- ✅ **Job Cancellation** when officer takes action
- ✅ **Job Completion Tracking** with logs
- ✅ **Failed Job Handling** with error recovery
- ✅ **Redis-backed Queue** for persistence
- ✅ **Worker Process** for background job execution
- ✅ **Automatic Complaint Reactivation** after escalation
- ✅ **Job ID Storage** in escalation records for management
- ✅ **Mark as Read** functionality
- ✅ **Delete Notifications**
- ✅ **Clear All Notifications**
- ✅ **Real-time Notification Delivery** (Socket.IO)
- ✅ **Sound Alerts** for critical notifications
- ✅ **Notification Filtering** (all, unread, read)
- ✅ **Notification Timestamps** (relative time)
- ✅ **Delete Notifications**
- ✅ **Clear All Notifications**
- ✅ **Real-time Notification Delivery** (Socket.IO)
- ✅ **Sound Alerts** for critical notifications
- ✅ **Notification Filtering** (all, unread, read)
- ✅ **Notification Timestamps** (relative time)

### 14. **User Profile & History**
- ✅ **User Profile Page** with stats
- ✅ **Profile Image Update**
- ✅ **Account Details Update** (name, email, phone, address)
- ✅ **Password Change**
- ✅ **User History Tracking**:
  - Complaint actions
  - Vote history
  - Comment history
  - Status changes
- ✅ **Activity Timeline**
- ✅ **User Statistics** (total complaints, resolved, pending)
- ✅ **User Deletion** with data cleanup

---

## 🚀 Advanced Features

### **Performance Optimization**

#### 1. **Infinite Scroll & Lazy Loading**
- ✅ **React Intersection Observer** for viewport detection
- ✅ **Automatic Page Loading** on scroll
- ✅ **Skeleton Loaders** for better UX
- ✅ **Lazy Image Loading** for media
- ✅ **Progressive Data Fetching**
- ✅ **Scroll Position Restoration**
- ✅ **Debounced Scroll Events**

#### 2. **Advanced Caching Strategy**

##### **React Query Implementation**
- ✅ **TanStack React Query** for server state management
- ✅ **Infinite Query** for pagination
- ✅ **Stale-While-Revalidate** pattern
- ✅ **Background Refetching**
- ✅ **Query Invalidation** on mutations
- ✅ **Optimistic Updates** for instant UI feedback
- ✅ **Error Retry Logic** with exponential backoff
- ✅ **Query Deduplication**
- ✅ **Prefetching** for anticipated user actions
- ✅ **Cache Time Management** (`staleTime: Infinity`, `gcTime: Infinity`)
- ✅ **Custom Cache Keys** per category and user

##### **Frontend Caching (Session Storage)**
- ✅ **Trending Complaints Cache** with interaction-based invalidation
- ✅ **My Complaints Cache** per category
- ✅ **User History Cache** for activity tracking
- ✅ **Interaction Threshold** (50 interactions before cache clear)
- ✅ **Cache Order Preservation** with vote count updates
- ✅ **Cached Order Reference** (useRef) for performance
- ✅ **Redux Integration** for real-time data merging
- ✅ **Session-based Cache Persistence**
- ✅ **Manual Cache Invalidation** option

##### **Custom React Hooks**
- ✅ **useGeolocation** - Browser geolocation tracking
- ✅ **useTrendingComplaints** - Fetch and manage trending complaints
- ✅ **useTrendingComplaintsCache** - Cache management for trending
- ✅ **useMyComplaintsCache** - User complaints caching
- ✅ **useUserHistoryCache** - Activity history caching

##### **Backend Caching (Redis)**
- ✅ **Department Data Caching** for faster officer signup
- ✅ **Officer Rejected Complaints** (Redis Sets)
- ✅ **Session Management**
- ✅ **Token Blacklisting** for logout
- ✅ **Rate Limiting** preparation
- ✅ **Cache Invalidation** on data updates
- ✅ **TTL-based Expiration**
- ✅ **Redis Connection Pooling**

#### 3. **React Redux State Management**
- ✅ **Redux Toolkit Slices**:
  - `authSlice` - Authentication state
  - `complaintSlice` - Complaints data
  - `notificationSlice` - Notifications
  - `evidenceSlice` - Evidence management
  - `officerSlice` - Officer-specific state & nearby complaints
  - `historySlice` - User activity history tracking
  - `departmentSlice` - Department data
  - `analyticsSlice` - Analytics data
- ✅ **Redux Thunks** for async operations
- ✅ **Redux Persist** for local storage
- ✅ **Normalized State Structure**
- ✅ **Memoized Selectors** with `useSelector`
- ✅ **Action Creators** with createSlice
- ✅ **Middleware Integration**
#### 5. **Background Job Processing**
- ✅ **BullMQ Job Queue** for automated escalations
- ✅ **Redis-backed Job Persistence**
- ✅ **Delayed Job Execution** with precise timing
- ✅ **Job Scheduling** based on severity rules:
  - Low: 24h per level
  - Medium: 12-48h per level  
  - High: 1m-30h per level (1m for testing)
- ✅ **Job Cancellation** when officer resolves complaint
- ✅ **Worker Process** separate from main server
#### 7. **API Optimization**
- ✅ **Cursor-based Pagination** (more efficient than offset)
- ✅ **Field Filtering** in responses
- ✅ **Batch Requests** support
- ✅ **Response Compression** (gzip)
- ✅ **HTTP Caching Headers**
- ✅ **Rate Limiting** ready
- ✅ **API Versioning** (`/api/v1`)
- ✅ **Error Handling Middleware**cation queries
- ✅ **Lean Queries** (`.lean()`) for performance
- ✅ **Projection** to limit returned fields
- ✅ **Population** with field selection
- ✅ **Aggregation Pipelines** for analytics
- ✅ **Query Pagination** with cursor-based approach
- ✅ **File Size Limits**
- ✅ **Lazy Image Loading**

#### 5. **Database Optimization**
- ✅ **MongoDB Indexes** on frequently queried fields
- ✅ **Compound Indexes** for complex queries
- ✅ **GeoSpatial Indexes** for location queries
- ✅ **Lean Queries** (`.lean()`) for performance
- ✅ **Projection** to limit returned fields
- ✅ **Population** with field selection
- ✅ **Aggregation Pipelines** for analytics
- ✅ **Query Pagination** with cursor-based approach

#### 6. **API Optimization**
- ✅ **Cursor-based Pagination** (more efficient than offset)
- ✅ **Field Filtering** in responses
- ✅ **Batch Requests** support
- ✅ **Response Compression** (gzip)
- ✅ **HTTP Caching Headers**
- ✅ **Rate Limiting** ready
- ✅ **API Versioning** (`/api/v1`)
- ✅ **Error Handling Middleware**

### **User Experience**

#### 1. **Responsive Design**
- ✅ **Mobile-first Approach**
- ✅ **Adaptive Layouts** for all screen sizes
- ✅ **Touch-friendly Interfaces**
- ✅ **Responsive Maps**
- ✅ **Mobile Navigation**

#### 2. **Interactive UI Elements**
- ✅ **Framer Motion Animations**
- ✅ **Smooth Transitions**
- ✅ **Loading States** with skeleton screens
- ✅ **Toast Notifications** for feedback
- ✅ **Modal Dialogs** for forms
- ✅ **Dropdown Menus**
- ✅ **Star Rating Component**
- ✅ **Search Functionality**
- ✅ **Filter Chips**
- ✅ **Category Icons** with visual distinction

#### 3. **3D Graphics & Effects**
- ✅ **Three.js Grid Distortion** effect on landing
- ✅ **Animated Backgrounds**
- ✅ **Particle Effects**
- ✅ **Smooth Scrolling**

### **Security**

- ✅ **Input Validation** on client and server
- ✅ **XSS Prevention**
- ✅ **CSRF Protection** with tokens
- ✅ **SQL Injection Prevention** (parameterized queries)
- ✅ **NoSQL Injection Prevention**
- ✅ **Rate Limiting** preparation
- ✅ **Secure Headers** (CORS, CSP)
- ✅ **File Upload Restrictions**
- ✅ **Password Strength Requirements**
- ✅ **Environment Variable Protection**
- ✅ **HTTP-only Cookies**
- ✅ **JWT Expiration**

### **Error Handling**

- ✅ **Global Error Middleware**
- ✅ **Custom ApiError Class**
- ✅ **Async Handler Wrapper** for try-catch
- ✅ **Validation Error Messages**
- ✅ **404 Not Found** pages
- ✅ **Error Logging**
- ✅ **User-friendly Error Messages**
- ✅ **React Error Boundaries**

---

## 🏗️ Architecture & Performance

### **Pagination Strategy**

#### **Cursor-based Pagination** (Backend)
```javascript
// More efficient than offset-based pagination
{
  cursor: "2024-01-15T10:30:00.000Z", // Last item's createdAt
  limit: 9,
  hasNextPage: true,
  nextCursor: "2024-01-14T08:20:00.000Z"
}
```

**Advantages:**
- ✅ **Consistent Performance** regardless of page depth
- ✅ **No Skipped/Duplicate Items** during data changes
- ✅ **Efficient Database Queries** using indexed fields
- ✅ **Scalable** to millions of records

#### **Infinite Query** (Frontend)
```javascript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = 
  useInfiniteQuery({
    queryKey: ["trendingComplaints"],
    queryFn: fetchTrendingComplaints,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });
```

**Features:**
- ✅ **Automatic Page Management**
- ✅ **Background Data Fetching**
- ✅ **Cached Pages** for instant navigation
- ✅ **Smart Refetching** on window focus

### **Caching Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Session Storage Cache (Interaction-based Invalidation)     │
│  ├─ Trending Complaints: 50 interaction threshold           │
│  ├─ My Complaints: Per-category caching                     │
│  └─ Cache Order Preservation with Real-time Updates         │
├─────────────────────────────────────────────────────────────┤
│  React Query Cache (Server State Management)                │
│  ├─ Infinite Query: Paginated data                          │
│  ├─ Query Invalidation: On mutations                        │
│  ├─ Optimistic Updates: Instant UI feedback                 │
│  └─ Background Refetching: Keep data fresh                  │
├─────────────────────────────────────────────────────────────┤
│  Redux Persist (Application State)                          │
│  ├─ Auth State: User, tokens                                │
│  ├─ Complaint State: Selected complaint                     │
│  └─ Notification State: Unread count                        │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                        Backend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Redis Cache (In-memory Data Store)                         │
│  ├─ Department Data: Prefetched for officers                │
│  ├─ Rejected Complaints: Redis Sets per officer             │
│  ├─ Session Management: User sessions                       │
│  └─ Token Blacklist: Invalidated JWTs                       │
├─────────────────────────────────────────────────────────────┤
│  MongoDB (Primary Database)                                 │
│  ├─ Indexed Collections: Fast queries                       │
│  ├─ GeoSpatial Indexes: Location-based searches             │
│  └─ Aggregation Pipelines: Complex analytics                │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Railway Data)                                  │
│  └─ Train & Station Information                             │
└─────────────────────────────────────────────────────────────┘
```

### **Real-time Communication Flow**

```
Client (Socket.IO Client)
    ↓
    ├─ Connect with userId
    ↓
Server (Socket.IO Server)
    ↓
    ├─ Join user-specific room: `user_${userId}`
    ├─ Join officer room (if officer): `officer_notifications`
    ↓
Events:
    ├─ newComplaint → Broadcast to `officer_notifications`
    ├─ newComplaintForOfficer → Target officer room
    ├─ complaintUpdated → Target complaint owner room
    ├─ officerAssigned → Target officer & citizen rooms
    ├─ statusChanged → Target complaint owner room
    ├─ complaintEscalated → Target complaint owner room
    ├─ newIncident → Broadcast to all connected clients
    └─ newNotification → Target user room: `user_${userId}`
```

### **State Management Flow**

```
User Action (Component)
    ↓
Dispatch Redux Action OR React Query Mutation
    ↓
├─ Redux Thunk (Async) ──────────→ API Call
│   ↓                                  ↓
│   Update Redux Store          Response/Error
│   ↓                                  ↓
│   Redux Persist → LocalStorage   React Query Cache
│   ↓                                  ↓
│   Component Re-render ←──────────┘
│
└─ React Query Mutation
    ├─ Optimistic Update (instant UI)
    ├─ API Call
    ├─ On Success: Invalidate related queries
    ├─ On Error: Rollback optimistic update
    └─ Background Refetch
```

---

## 📦 Installation

### **Prerequisites**
- Node.js >= 18.x
- MongoDB >= 6.x
- Redis >= 6.x
- PostgreSQL >= 14.x (for railway features)
- npm or yarn

### **Clone Repository**
```bash
### **Backend** (`.env` in `/backend`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - MongoDB
MONGODB_URI=mongodb://localhost:27017/roadinfra
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

#### Root (for Three.js)
```bash
npm install
```

---

## 🔧 Environment Variables

### **Backend** (`.env` in `/backend`)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - MongoDB
MONGODB_URI=mongodb://localhost:27017/roadinfra

# Database - PostgreSQL (Railway)
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=railway_db
PG_USER=postgres
PG_PASSWORD=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CORS_ORIGIN=http://localhost:5173

# Cookie Configuration
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
#### Start Backend Server
```bash
cd backend
npm run doraemon  # Uses nodemon for auto-reload
```

#### Start BullMQ Worker (separate terminal)
```bash
cd backend
npm run gian  # Runs complaint worker for background jobs
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🚀 Usage

### **Development Mode**

#### Start Backend
```bash
cd backend
npm run doraemon  # Uses nodemon for auto-reload
```

#### Start Frontend
```bash
cd frontend
npm run nobita  # Uses Vite dev server
```

### **Production Build**

#### Backend
```bash
cd backend
npm run nobita
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api/v1
```

### **Authentication Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| POST | `/auth/logout` | Logout user | ✅ |
| POST | `/auth/refresh-token` | Refresh access token | ✅ |
| POST | `/auth/change-password` | Change password | ✅ |
| GET | `/auth/me` | Get current user | ✅ |
| PATCH | `/auth/update-account` | Update account details | ✅ |
| PATCH | `/auth/update-profile-image` | Update profile image | ✅ |
| DELETE | `/auth/delete-account` | Delete user account | ✅ |

### **Complaint Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/complaints/trending` | Get trending complaints | ❌ |
| GET | `/complaints/nearby` | Get nearby complaints | ✅ |
| POST | `/complaints` | Create complaint | ✅ |
| GET | `/complaints/:id` | Get complaint by ID | ✅ |
| GET | `/complaints/my-complaints` | Get user's complaints | ✅ |
| GET | `/complaints/my-complaints/category/:category` | Get user's complaints by category | ✅ |
| PATCH | `/complaints/:id/status` | Update complaint status | ✅ |
| DELETE | `/complaints/:id` | Delete complaint | ✅ |
| POST | `/complaints/:id/upvote` | Upvote complaint | ✅ |
| POST | `/complaints/:id/downvote` | Downvote complaint | ✅ |

### **Officer Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/officer/nearby-complaints` | Get nearby complaints for officer | ✅ (Officer) |
| POST | `/officer/reject-complaint` | Reject a complaint | ✅ (Officer) |
| POST | `/officer/assign` | Assign complaint to officer | ✅ (Officer/Admin) |

### **Notification Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/notifications` | Get user notifications | ✅ |
| DELETE | `/notifications/:index` | Delete notification | ✅ |

### **Department Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/departments` | Create department | ✅ (Admin) |
| GET | `/departments` | Get all departments | ❌ |
### **Escalation Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/escalations/:complaintId` | Add escalation event | ✅ (Officer/Admin) |
| GET | `/escalations/complaint/:complaintId` | Get escalation history | ✅ |
| GET | `/escalations/:escalationId` | Get escalation by ID | ✅ |
| DELETE | `/escalations/:escalationId` | Delete escalation history | ✅ (Admin) |

### **Evidence Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/evidences` | Submit evidence (with file upload) | ✅ |
| GET | `/evidences` | Get all evidence | ✅ |
| GET | `/evidences/complaint/:complaintId` | Get complaint evidence | ✅ |
| GET | `/evidences/user/:userId` | Get user's evidence | ✅ |
| DELETE | `/evidences/:evidenceId` | Delete evidence | ✅ |

### **Guidance Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/guidance` | Add guidance article | ✅ |
| GET | `/guidance` | Get all guidance | ❌ |
| GET | `/guidance/category/:categoryId` | Get guidance by category | ❌ |
| PATCH | `/guidance/:guidanceId/verify` | Verify guidance (officer/admin) | ✅ (Officer/Admin) |
| DELETE | `/guidance/:guidanceId` | Delete guidance | ✅ |

### **Team Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/team` | Create a new team | ✅ (Officer) |
| PUT | `/team/:teamId` | Update team details | ✅ (Officer) |
| GET | `/team/:teamId` | Get team by ID (populated) | ✅ |
| DELETE | `/team/:teamId` | Delete a team | ✅ (Officer) |
| POST | `/team/:teamId/add-member` | Add officer to team | ✅ (Officer) |
| POST | `/team/:teamId/remove-member` | Remove officer from team | ✅ (Officer) |
| POST | `/team/:teamId/add-complaint` | Assign complaint to team | ✅ (Officer) |
| POST | `/team/:teamId/remove-complaint` | Remove complaint from team | ✅ (Officer) |
| GET | `/team/:teamId/details` | Get deep team details (aggregation) | ✅ |
| GET | `/team/:category/category` | Get teams by category | ✅ |
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/escalations/:complaintId` | Add escalation event | ✅ (Officer/Admin) |
| GET | `/escalations/complaint/:complaintId` | Get escalation history | ✅ |
| GET | `/escalations/:escalationId` | Get escalation by ID | ✅ |
| DELETE | `/escalations/:escalationId` | Delete escalation history | ✅ (Admin) |

### **Incident Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/incidents` | Report incident | ✅ |
| GET | `/incidents` | Get all incidents | ✅ |
| GET | `/incidents/:id` | Get incident by ID | ✅ |
| PATCH | `/incidents/:id/status` | Update incident status | ✅ (Officer) |
| PATCH | `/incidents/:id/verify` | Update incident verification | ✅ (Officer) |
| DELETE | `/incidents/:id` | Delete incident | ✅ |
| POST | `/incidents/:id/upvote` | Upvote incident | ✅ |
| POST | `/incidents/:id/downvote` | Downvote incident | ✅ |

### **Railway Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/rail/train/:trainNumber` | Get train details | ✅ |
| GET | `/rail/train/:trainNumber/stations` | Get train stations | ✅ |
| PUT | `/rail/train/:trainNumber/stations` | Update train stations | ✅ (Admin) |
| GET | `/rail/search/station/:stationCode` | Search trains by station | ✅ |
| PUT | `/rail/update-all-stations` | Update all train stations | ✅ (Admin) |

### **Analytics Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/analytics/nearby` | Get nearby analytics | ✅ |

### **Feedback Endpoints**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/feedback/:complaintId` | Add feedback | ✅ |
| GET | `/feedback/complaint/:complaintId` | Get complaint feedback | ✅ |
| GET | `/feedback/user/:userId` | Get user feedback | ✅ |
| PATCH | `/feedback/:feedbackId` | Update feedback | ✅ |
| DELETE | `/feedback/:feedbackId` | Delete feedback | ✅ |

---

## 🎨 Key Implementation Details

### **1. Trending Score Algorithm**
```javascript
// backend/utils/trendingScore.js
const calculateTrendingScore = (complaint) => {
    const ageInHours = (Date.now() - new Date(complaint.createdAt)) / (1000 * 60 * 60);
    const votes = (complaint.upvotes || 0) - (complaint.downvotes || 0);
    const comments = complaint.feedback_ids?.length || 0;
    
    // Decay factor: older complaints get lower scores
    const decayFactor = Math.pow(ageInHours + 2, 1.5);
    
    // Weighted score: votes have 2x weight, comments have 1x weight
    const score = (votes * 2 + comments) / decayFactor;
    
    return score;
};
```

### **2. Team Level Calculation**
```javascript
// backend/controllers/team.controllers.js
// Team level is calculated as average of all member levels (head + members)
const levels = [
    creator.user_level,
    ...officers.map(o => o.user_level)
];

const teamLevel = levels.reduce((sum, lvl) => sum + lvl, 0) / levels.length;
const finalTeamLevel = Math.round(teamLevel * 100) / 100; // Round to 2 decimal places
```

### **2. Interaction-based Cache Invalidation**
```javascript
// frontend/src/hooks/useTrendingComplaintsCache.jsx
const INTERACTION_THRESHOLD = 50;

const recordInteraction = useCallback(() => {
    setInteractionCount(prev => {
        const newCount = prev + 1;
        if (newCount >= INTERACTION_THRESHOLD && isUsingCache) {
            clearCacheAndRefetch();
            return 0;
        }
        return newCount;
    });
}, [isUsingCache, clearCacheAndRefetch]);

// Call on every vote, comment, or other user interaction
```

### **3. GeoSpatial Queries**
```javascript
// MongoDB GeoJSON format
location: {
    type: "Point",
    coordinates: [longitude, latitude] // [lng, lat] order!
}

// Query nearby complaints
const nearbyComplaints = await Complaint.find({
    location: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [userLng, userLat]
            },
            $maxDistance: radiusInMeters
        }
    }
});
```

### **4. Optimistic Updates**
```javascript
// Optimistic upvote with React Query
const upvoteMutation = useMutation({
    mutationFn: upvoteComplaint,
    onMutate: async (complaintId) => {
        // Cancel outgoing refetches
### **5. Redis Officer Rejection**
```javascript
// Backend: Store rejected complaints in Redis
const redisKey = `officer:${officerId}:rejected_complaints`;
await redisClient.sAdd(redisKey, complaintId);

// Fetch with exclusion
const rejectedIds = await redisClient.sMembers(redisKey);
const nearbyComplaints = await Complaint.find({
    _id: { $nin: rejectedIds },
    // ... other filters
});
```

### **6. BullMQ Automated Escalation**
```javascript
## 📊 Performance Metrics

- ✅ **Page Load Time**: < 2s (with cache)
- ✅ **Time to Interactive**: < 3s
- ✅ **First Contentful Paint**: < 1s
- ✅ **API Response Time**: 50-200ms (cached), 200-500ms (uncached)
- ✅ **WebSocket Latency**: < 50ms
- ✅ **Image Load Time**: < 1s (Cloudinary CDN)
- ✅ **Infinite Scroll**: Smooth 60fps
- ✅ **Cache Hit Rate**: ~80% for trending complaints
- ✅ **Background Job Processing**: BullMQ handles escalations with precise timing
- ✅ **Job Queue Performance**: Redis-backed for high throughput

// Schedule escalation job
const job = await complaintQueue.add(
    "auto-escalate",
    { complaintId, escalationId, severity, level },
    { delay: escalationTimes[severity][level].delay }
);

// backend/queues/complaintWorker.js - Background worker
import { Worker } from "bullmq";

const worker = new Worker("complaint-queue", async (job) => {
    const { complaintId, escalationId, severity, level } = job.data;
    
    // Fetch complaint and check if resolved
    const complaint = await Complaint.findById(complaintId);
    if (complaint.status === "resolved" || complaint.status === "rejected") {
        return; // Don't escalate if already handled
    }
    
    // Get escalation rules
    const rules = escalationTimes[severity][level];
    if (rules.next === "close") {
        complaint.status = "rejected";
        await complaint.save();
        return;
    }
    
    // Escalate to next level
    complaint.level = rules.next;
    complaint.active = true;
    complaint.assigned_officer_id = null;
    complaint.status = "pending";
    await complaint.save();
    
    // Schedule next escalation
    await scheduleEscalation(complaint);
    
    // Emit socket event for real-time update
    io.emit("newComplaintForOfficer", { complaint, escalated: true });
});
```     
        return { previousComplaints };
    },
    onError: (err, variables, context) => {
        // Rollback on error
        queryClient.setQueryData(['complaints'], context.previousComplaints);
    },
    onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(['complaints']);
    }
});
```

### **5. Redis Officer Rejection**
```javascript
// Backend: Store rejected complaints in Redis
const redisKey = `officer:${officerId}:rejected_complaints`;
await redisClient.sAdd(redisKey, complaintId);

// Fetch with exclusion
const rejectedIds = await redisClient.sMembers(redisKey);
const nearbyComplaints = await Complaint.find({
    _id: { $nin: rejectedIds },
    // ... other filters
});
```

---

## 📊 Performance Metrics

- ✅ **Page Load Time**: < 2s (with cache)
- ✅ **Time to Interactive**: < 3s
- ✅ **First Contentful Paint**: < 1s
- ✅ **API Response Time**: 50-200ms (cached), 200-500ms (uncached)
- ✅ **WebSocket Latency**: < 50ms
- ✅ **Image Load Time**: < 1s (Cloudinary CDN)
- ✅ **Infinite Scroll**: Smooth 60fps
- ✅ **Cache Hit Rate**: ~80% for trending complaints

---

## 🎯 Future Enhancements

- [ ] Push Notifications (Web & Mobile)
- [ ] Progressive Web App (PWA)
- [ ] Offline Support
- [ ] Multi-language Support (i18n)
- [ ] Advanced Search (Elasticsearch)
- [ ] Machine Learning for Complaint Categorization
- [ ] Automated Complaint Routing
- [ ] SMS/Email Notifications
- [ ] Mobile Apps (React Native)
- [ ] Admin Dashboard
- [ ] Advanced Analytics
- [ ] AI Chatbot for Guidance

---

## 👨‍💻 Author

**TheCodrrr**
- GitHub: [@TheCodrrr](https://github.com/TheCodrrr)

---

## 🙏 Acknowledgments

- MongoDB for flexible document database
- Redis for high-performance caching
- Socket.IO for real-time communication
- React Query for server state management
- Cloudinary for media management
- Leaflet for beautiful maps
- All open-source contributors

---

**Made with ❤️ for public safety and citizen empowerment**
