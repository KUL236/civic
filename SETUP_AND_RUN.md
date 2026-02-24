# 🚀 CivicSense - Complete Setup & Run Guide

## 📋 Prerequisites

Before you start, make sure you have installed:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` and `npm --version`

2. **MongoDB** (locally or Atlas cloud)
   - Local: https://www.mongodb.com/try/download/community
   - Cloud: https://www.mongodb.com/cloud/atlas (free tier available)

3. **Git** (for cloning, optional)
   - Download: https://git-scm.com/

---

## 📁 Project Structure

```
SCCMS = CIVIC SENSE/
├── backend/
│   ├── server.js          # Main Express server
│   ├── package.json       # Dependencies
│   ├── .env              # Environment variables
│   ├── serviceAccountKey.json  # Firebase credentials
│   ├── routes/
│   │   └── complaints.js  # Complaint API routes
│   ├── models/
│   │   └── complaints.js  # MongoDB schema
│   └── ai/
│       └── app.py        # Python AI service (optional)
├── frontend/
│   ├── index.html        # Main citizen page
│   ├── admin.html        # Admin firewall
│   ├── officer.html      # Officer dashboard
│   ├── popular.html      # Popular complaints
│   ├── login.html        # Login page
│   ├── style.css         # Styles
│   ├── script.js         # Main logic
│   ├── sw.js             # Service worker (PWA)
│   └── manifest.json     # PWA manifest
└── README.md
```

---

## ⚙️ Step 1: Backend Setup

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

This installs all required packages:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `firebase-admin` - Firebase integration
- `nodemon` - Auto-restart on changes (dev)

### 1.2 Configure Environment Variables

Edit `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/civicsense
# OR for MongoDB Atlas:
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/civicsense

GEMINI_API_KEY=AIzaSyCMb5QviYS19TNVULQKg7eQ45b8Xy1ewHE
```

### 1.3 Firebase Service Account Key

You need `serviceAccountKey.json` for Firebase Admin:

1. Go to https://console.firebase.google.com/
2. Select project "civic-b1f7c"
3. Settings → Service Accounts → Generate New Private Key
4. Save as `backend/serviceAccountKey.json`

⚠️ **IMPORTANT**: Keep this file SECRET! Never commit it to Git.

### 1.4 MongoDB Connection

**Option A: Local MongoDB**
```
Default: mongodb://localhost:27017/civicsense
```

**Option B: MongoDB Atlas (Cloud, Free)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Replace `username:password@cluster` in `.env`

---

## 🎨 Step 2: Frontend Setup

No installation needed! Frontend is pure HTML/CSS/JavaScript.

### 2.1 Verify Firebase Config

Check that Firebase config is correct in these files:
- `frontend/script.js` (line ~26)
- `frontend/admin.html` (line ~77)
- `frontend/officer.html` (line ~15)
- `frontend/popular.html` (line ~28)

Should match your Firebase project:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDutz15Pqpkg4f6u2jEgJsE4kfX789VoqI",
    authDomain: "civic-b1f7c.firebaseapp.com",
    projectId: "civic-b1f7c",
    storageBucket: "civic-b1f7c.firebasestorage.app",
    messagingSenderId: "349255365682",
    appId: "1:349255365682:web:d3a2bf0a3192ff8d70b82b",
    measurementId: "G-ZPDE3ZRBPX"
};
```

---

## ▶️ Step 3: Run the System

### 3.1 Start Backend Server

```bash
cd backend
npm start
```

You should see:
```
Server running on 5000
```

(For development with auto-restart: `npm run dev`)

### 3.2 Start Frontend

**Option A: Using Python's built-in server**
```bash
cd frontend
python -m http.server 8000
```

**Option B: Using Node's http-server**
```bash
cd frontend
npx http-server -p 8000
```

**Option C: VSCode Live Server extension**
- Right-click `index.html` → "Open with Live Server"
- Usually opens on `http://localhost:5500`

**Option D: Direct file (not recommended for PWA)**
- Just double-click `index.html` (limited functionality)

---

## 🌐 Access the Application

Once both servers are running:

| Service | URL | Purpose |
|---------|-----|---------|
| **Citizen App** | `http://localhost:8000` | Raise complaints |
| **Admin Panel** | `http://localhost:8000/admin.html` | Review complaints |
| **Officer Dashboard** | `http://localhost:8000/officer.html` | Resolve complaints |
| **Popular Complaints** | `http://localhost:8000/popular.html` | View by likes |
| **Backend API** | `http://localhost:5000/api/complaints` | REST endpoints |

---

## 📱 Testing the System

### Test Workflow:

1. **Open Citizen App** → `http://localhost:8000`
   - [ ] Select category
   - [ ] Enter description
   - [ ] Enter phone number
   - [ ] Click "📍 Get GPS Location" (allow permission)
   - [ ] Click "Submit Complaint"
   - [ ] See success alert

2. **Check Admin Panel** → `http://localhost:8000/admin.html`
   - [ ] New complaint appears instantly
   - [ ] Yellow top alert shows incoming complaint
   - [ ] Buttons work (Approve, Reject, Assign, Verify)
   - [ ] Verify count increments

3. **Check Popular Page** → `http://localhost:8000/popular.html`
   - [ ] Complaint appears in list
   - [ ] Like button increments counter
   - [ ] List re-sorts by likes

4. **Check Officer Dashboard** → `http://localhost:8000/officer.html`
   - [ ] Shows approved complaints only
   - [ ] Resolve button updates status

5. **Backend API** (optional, use Postman/curl)
   ```bash
   # Get all complaints
   curl http://localhost:5000/api/complaints

   # Get specific complaint
   curl http://localhost:5000/api/complaints/CS-1002
   ```

---

## 🐛 Troubleshooting

### "Cannot find module 'express'"
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### "MongoDB connection refused"
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env`
- For local: `mongod` command starts the server
- For Atlas: Check connection string and IP whitelist

### "Firestore collection not found"
- Firebase Admin SDK requires valid `serviceAccountKey.json`
- Complaints still save to MongoDB if Firestore unavailable
- Check browser console for Firebase errors

### "Location permission denied"
- Browser privacy settings → allow location
- Must be HTTPS for PWA (localhost is exception)
- Some VPNs/proxies block geolocation

### "Frontend won't load"
- Check CORS is enabled (it is in `server.js`)
- Ensure frontend server is running
- Check browser console for errors (F12)

### "Service Worker errors"
- Clear browser cache (DevTools → Application → Clear storage)
- Reload page
- Check SW registered (console logs "SW registered")

---

## 🔐 Security Notes

### For Production:

1. **Environment Variables**
   - Never commit `.env` or `serviceAccountKey.json`
   - Use `.gitignore`:
     ```
     .env
     serviceAccountKey.json
     node_modules/
     ```

2. **HTTPS Required**
   - PWA needs HTTPS (except localhost)
   - Use Let's Encrypt or similar for free SSL

3. **Firebase Rules**
   - Set up Firestore security rules
   - Restrict read/write by user role

4. **Database**
   - Use strong MongoDB password
   - Enable IP whitelist on MongoDB Atlas

5. **CORS**
   - Whitelist specific frontend domains in production

---

## 📦 Deployment

### Deploy Backend to Heroku/Railway/Render:

```bash
# Add Procfile
echo "web: npm start" > Procfile

# Deploy instructions vary by platform
# See platform documentation
```

### Deploy Frontend to Netlify/Vercel/GitHub Pages:

1. Push files to GitHub
2. Connect repository to Netlify/Vercel
3. Set build command: `(none for static)`
4. Set publish directory: `frontend/`

---

## 📞 API Endpoints

### Complaints

```
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/:cid
PUT    /api/complaints/:cid/status
```

### Example POST:
```bash
curl -X POST http://localhost:5000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "cid": "CS-1001",
    "category": "Garbage",
    "desc": "Trash pile on Main Street",
    "mobile": "+919876543210",
    "lat": 28.6139,
    "lon": 77.2090,
    "status": "Pending"
  }'
```

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running/connected
- [ ] Firebase config set up
- [ ] `backend/package.json` installed
- [ ] `.env` configured with `MONGO_URI`
- [ ] `serviceAccountKey.json` in backend
- [ ] Backend server running (`npm start`)
- [ ] Frontend server running (port 8000)
- [ ] Can access `http://localhost:8000`
- [ ] Can submit complaint
- [ ] Complaint appears in admin panel
- [ ] Admin firewall shows in real-time

---

## 🎉 You're Ready!

Once all checklist items are complete, your CivicSense system is live!

**Next Steps:**
- Test all workflows
- Customize styles in `style.css`
- Add user authentication
- Deploy to production
- Set up SSL certificates

For issues, check browser console (F12) for detailed error messages.

Happy coding! 🚀
