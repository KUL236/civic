# CivicSense - System Architecture & Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CivicSense System                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐                ┌──────────────────────┐
│   CITIZEN PORTAL     │                │    ADMIN FIREWALL    │
│  (index.html)        │                │  (admin.html)        │
├──────────────────────┤                ├──────────────────────┤
│ • Submit Complaint   │                │ • View pending       │
│ • Track Complaint    │                │ • Approve/Reject     │
│ • Verify Issue       │                │ • Verify complaints  │
│ • View Popular       │                │ • Real-time updates  │
│ • Voice input        │                │ • Assign officers    │
│ • GPS Location       │                │ • View statistics    │
│ • Mobile responsive  │                │ • Dark mode          │
└──────────┬───────────┘                └──────┬───────────────┘
           │                                    │
           │                                    │
      ┌────┴─────────────┬──────────────────────┴────┐
      │                  │                           │
      ▼                  ▼                           ▼
  [Firebase SDK]    [Firebase SDK]            [Firebase SDK]
  (Firestore)       (Firestore)               (Firestore)
      │                  │                           │
      └──────────────────┴──────────────────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │   FIREBASE / FIRESTORE       │
          │  (Real-time Database)        │
          │  Project: civic-b1f7c        │
          │                              │
          │  Collections:                │
          │  • complaints (live sync)    │
          │  • users (reserved)          │
          │  • officers (future)         │
          └──────────────┬───────────────┘
                         │
                         │ (Sync via Firebase-Admin)
                         │
      ┌──────────────────┴──────────────────┐
      │                                     │
      ▼                                     ▼
  ┌─────────────────────────┐    ┌──────────────────────────┐
  │   NODEEXPRESS BACKEND   │    │   MONGODB / ATLAS        │
  │   (server.js)           │    │   (Primary Database)     │
  │                         │    │                          │
  │  Port: 5000             │    │  Database: civicsense    │
  │  Routes: /api/complaints│    │  Collection: complaints  │
  │                         │    │                          │
  │  Handlers:              │    │  Schema:                 │
  │  • POST (create)        │    │  • cid, category, desc   │
  │  • GET (retrieve)       │    │  • mobile, lat, lon      │
  │  • PUT (update)         │    │  • status, timestamp     │
  │  • DELETE (remove)      │    │  • verifyCount, likes    │
  │                         │    │                          │
  │  Middleware:            │    └──────────────────────────┘
  │  • CORS enabled         │
  │  • JSON parser          │
  │  • Firebase-Admin SDK   │
  │  • Firestore sync       │
  └─────────────────────────┘
      │
      │ (REST API)
      │
      ▼
  [Citizen Portal]  [Admin Panel]  [Officer Dashboard]  [Popular Page]
  (via HTTP)        (via HTTP)     (via HTTP)           (via HTTP)


┌──────────────────────┐
│  OFFICER DASHBOARD   │
│  (officer.html)      │
├──────────────────────┤
│ • View assigned      │
│ • Resolve complaints │
│ • Add updates        │
│ • Monitor progress   │
└──────────────────────┘
          │
          ▼
   [Firebase SDK]
   (Firestore Query)
          │
          ▼
   [MongoDB / Firestore]

┌──────────────────────┐
│   POPULAR PAGE       │
│  (popular.html)      │
├──────────────────────┤
│ • Browse all         │
│ • Sort by likes      │
│ • Like complaints    │
│ • See community view │
│ • PWA installed      │
└──────────────────────┘
          │
          ▼
   [Firebase SDK]
   (Firestore Query)
          │
          ▼
   [Firestore DB]
```

---

## 🔄 Data Flow

### Complaint Submission Flow

```
User fills form
    ↓
Category selected
    ↓
Description entered
    ↓
Mobile number entered
    ↓
User clicks "Get GPS Location"
    ↓
Browser requests location permission
    ↓
GPS coordinates obtained (lat, lon)
    ↓
User clicks "Submit"
    ↓
VALUES CAPTURED to local variables
    ↓
Form cleared (UI feedback)
    ↓
Firestore write initiated (async)
    │
    └─► Firebase SDK sends document to Firestore
        ├─► Document ID auto-generated
        ├─► Timestamp auto-added (serverTimestamp)
        ├─► All fields stored: cid, category, desc, mobile, lat, lon, status=Pending
        └─► verifyCount=0, likes=0
            ↓
    (Meanwhile, backend syncs if enabled)
    ├─► Express /api/complaints route
    ├─► MongoDB write
    └─► Firestore mirror (via Firebase-Admin)
            ↓
Success alert shown
    ↓
Complaint ID displayed
    ↓
Admin panel updates in real-time (onSnapshot)
```

### Admin Verification Flow

```
New complaint arrives in Firestore
    ↓
Admin panel onSnapshot listener triggered
    ↓
Complaint card appears in admin feed
    ↓
Top-banner shows new complaint alert
    ↓
Admin clicks "Verify" button
    ↓
verifyCount incremented (+1)
    ├─► MongoDB: verifyCount field +1
    └─► Firestore: verifyCount field +1 (atomic increment)
            ↓
Admin can see updated verify count
    ↓
Other admins see update in real-time
    ↓
Citizen sees verifyCount in tracking page
```

### Like/Popular Flow

```
Complaint submitted (appears in all)
    ↓
Popular page queries Firestore
    ├─► ORDER BY likes DESC
    └─► Shows most liked first
            ↓
User clicks "Like" on popular page
    ↓
Firestore increment(1) executed
    ├─► mongoose: likes +1
    └─► Firestore: likes +1 (atomic)
            ↓
Popular page re-sorts automatically (onSnapshot)
    ↓
Admin panel likes count updates
    ↓
Other users see new like count
```

---

## 🗂️ Folder Structure

```
SCCMS = CIVIC SENSE/
├── backend/                          # Node.js/Express Server
│   ├── server.js                     # Main app entry (port 5000)
│   ├── package.json                  # Dependencies & scripts
│   ├── .env                          # Environment variables (MONGO_URI, API keys)
│   ├── .env.example                  # Template for .env
│   ├── serviceAccountKey.json        # Firebase Admin credentials
│   ├── models/
│   │   └── complaints.js             # Mongoose schema (cid, category, desc, etc)
│   ├── routes/
│   │   └── complaints.js             # API endpoints (POST/GET/PUT)
│   └── ai/
│       └── app.py                    # Python AI (future: auto-classification)
│
├── frontend/                         # HTML/CSS/JavaScript Frontend
│   ├── index.html                    # Citizen portal (complaint form)
│   ├── admin.html                    # Admin firewall (real-time pending list)
│   ├── officer.html                  # Officer dashboard (approved complaints)
│   ├── popular.html                  # Popular/trending complaints page
│   ├── login.html                    # Login page (Firebase Auth ready)
│   ├── script.js                     # Main JS logic (392 lines, modular)
│   ├── style.css                     # UI styling (dark mode, responsive)
│   ├── manifest.json                 # PWA metadata & icons
│   ├── sw.js                         # Service Worker (offline support)
│   └── assets/                       # Images, icons (optional)
│
├── SETUP_AND_RUN.md                  # Detailed setup guide (400+ lines)
├── QUICKSTART.md                     # TL;DR quick start
├── TROUBLESHOOTING.md                # Common issues & fixes
├── VERIFICATION_CHECKLIST.md         # Testing checklist
├── FRONTEND_GUIDE.md                 # Frontend documentation
├── README.md                         # Project overview
├── START.bat                         # Windows setup automation
└── START.sh                          # Unix/macOS setup automation
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/complaints
```

### Endpoints

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| `POST` | `/api/complaints` | Create new complaint | `{ _id, cid, message: "Created" }` |
| `GET` | `/api/complaints` | Get all complaints | `[{ _id, cid, category, desc, status, ... }]` |
| `GET` | `/api/complaints/:id` | Get single complaint | `{ _id, cid, category, ... }` |
| `PUT` | `/api/complaints/:id` | Update complaint | `{ success: true, message: "Updated" }` |
| `DELETE` | `/api/complaints/:id` | Delete complaint | `{ success: true, message: "Deleted" }` |

### Example: Create Complaint
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "CS-001",
    "category": "Road Damage",
    "description": "Pothole on Main Street",
    "mobile": "+919876543210",
    "lat": 28.6139,
    "lon": 77.2090
  }'
```

---

## 🔐 Security

### Current Implementation
- ✅ CORS enabled for localhost
- ✅ Firebase Firestore security rules (basic)
- ✅ Mobile numbers stored (for contact)
- ✅ No sensitive data in localStorage
- ✅ Environment variables for secrets

### Missing (Future)
- ⚠️ User Authentication (Firebase Auth UI not connected)
- ⚠️ API Rate Limiting
- ⚠️ Input Validation (server-side)
- ⚠️ HTTPS (needed for production)
- ⚠️ Image Upload Security

---

## 📊 Database Schema

### MongoDB / Firestore Document

```javascript
{
  _id: ObjectId,                          // MongoDB ID
  cid: "CS-20250115-001",                // Unique complaint ID
  category: "Road Damage",                // Issue category
  desc: "Large pothole...",              // Description
  mobile: "+919876543210",               // Contact number
  lat: 28.6139,                          // Latitude
  lon: 77.2090,                          // Longitude
  status: "Pending",                     // Pending, Approved, Rejected, Resolved
  verifyCount: 3,                        // Number of verifications
  likes: 7,                              // Number of likes
  createdAt: 2025-01-15T10:30:00Z,      // Timestamp
  updatedAt: 2025-01-15T11:45:00Z       // Last update
}
```

---

## 🚀 Deployment Targets

| Environment | Backend | Frontend | Database |
|-------------|---------|----------|----------|
| **Local Dev** | `node backend/server.js` (port 5000) | `python -m http.server 8000` (port 8000) | MongoDB local (27017) |
| **Cloud Dev** | Heroku / Railway / Render | Netlify / Vercel | MongoDB Atlas |
| **Production** | AWS / GCP / Docker | CloudFront / CDN | MongoDB Atlas |

---

## 🔧 Environment Variables

### Required (.env)
```
MONGO_URI=mongodb://localhost:27017/civicsense
GEMINI_API_KEY=your_api_key_here
```

### Generated Automatically
```
NODE_ENV=development
PORT=5000
```

### Firebase (in code, not .env)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDutz15Pqpkg4f6u2jEgJsE4kfX789VoqI",
  authDomain: "civic-b1f7c.firebaseapp.com",
  projectId: "civic-b1f7c",
  storageBucket: "civic-b1f7c.appspot.com",
  messagingSenderId: "XXXXXXXXX",
  appId: "1:XXXXXXXXX:web:XXXXXXXXX"
};
```

---

## 📱 Progressive Web App (PWA)

### Features
- ✅ Installable on mobile & desktop
- ✅ Offline mode (cached pages)
- ✅ Home screen icon
- ✅ Standalone app mode
- ✅ Service Worker caching
- ✅ Network-first for API calls

### Installation
- **Android:** Chrome → Menu → "Install app"
- **iOS:** Safari → Share → "Add to Home Screen"
- **Desktop:** Chrome → Address bar icon → "Install"

---

## 🎯 User Roles

### 1. Citizen
- Submit complaints with category, description, mobile, location
- Track complaints by ID
- Verify existing complaints
- View popular complaints and like them
- Voice input for description (via browser API)

### 2. Admin
- View all pending complaints in real-time
- Approve or reject complaints
- Assign to officers
- Verify complaints
- See statistics and trends
- Dark mode interface

### 3. Officer
- View assigned/approved complaints
- Mark as resolved
- Update status
- Track resolution progress

---

## 🔔 Real-Time Features

### Implemented
- ✅ Admin panel updates live (Firestore onSnapshot)
- ✅ Like count increments in real-time
- ✅ Verify count updates instantly
- ✅ Status changes reflect immediately
- ✅ Popular page re-sorts on new likes

### Not Implemented (Future)
- ⚠️ Push notifications
- ⚠️ Email alerts
- ⚠️ SMS notifications
- ⚠️ Desktop notifications

---

## 📈 Features Map

| Feature | Status | Location |
|---------|--------|----------|
| Complaint submission | ✅ Done | index.html + script.js |
| Real-time admin view | ✅ Done | admin.html |
| Officer dashboard | ✅ Done | officer.html |
| Popular/likes | ✅ Done | popular.html |
| Verification system | ✅ Done | script.js + admin.html |
| GPS location | ✅ Done | script.js |
| Voice input | ✅ Done | script.js |
| PWA offline | ✅ Done | sw.js + manifest.json |
| MongoDB sync | ✅ Done | backend/routes |
| Firestore sync | ✅ Done | backend/server.js |
| Dark mode | ✅ Done | style.css |
| Mobile responsive | ✅ Done | style.css + HTML |
| User auth | 🟡 Partial | login.html (not wired) |
| Image upload | 🟡 Partial | form field (no backend) |
| AI classification | 🟡 Planned | backend/ai/app.py |
| Notifications | 🔴 Not done | Future feature |
| Analytics | 🔴 Not done | Future dashboard |

---

## 🎓 Learning Resources

- **Firebase Modular SDK:** https://firebase.google.com/docs/firestore/quickstart
- **Express.js:** https://expressjs.com/
- **MongoDB Mongoose:** https://mongoosejs.com/
- **Service Workers:** https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **PWA:** https://web.dev/progressive-web-apps/

---

**Last Updated:** January 2025  
**Version:** 1.0  
**Status:** Ready for Local Testing ✅
