# 🚀 Quick Start Commands

## ⚡ TL;DR - Run in 3 Steps

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```
You'll see: `Server running on 5000`

### Terminal 2 - Frontend
```bash
cd frontend
python -m http.server 8000
# or: npx http-server -p 8000
```
You'll see: `Serving HTTP on port 8000`

### Browser
Open: **http://localhost:8000**

---

## 📝 Before First Run

### 1. Configure MongoDB
Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/civicsense
```
(OR get free MongoDB Atlas URI from mongo.com/cloud/atlas)

### 2. Add Firebase Admin Key
- Get from: https://console.firebase.google.com/
- Project: civic-b1f7c
- Settings → Service Accounts → Generate Private Key
- Save as: `backend/serviceAccountKey.json`

---

## 🔗 Access Points

| URL | Purpose |
|-----|---------|
| http://localhost:8000 | Citizen app (raise complaints) |
| http://localhost:8000/admin.html | Admin panel (review complaints) |
| http://localhost:8000/officer.html | Officer dashboard |
| http://localhost:8000/popular.html | Popular complaints |
| http://localhost:5000/api/complaints | API endpoint |

---

## 🧪 Quick Test

1. Go to http://localhost:8000
2. Select category, enter description, enter phone
3. Click "📍 Get GPS Location" (allow permission)
4. Click "Submit Complaint"
5. Go to http://localhost:8000/admin.html
6. See complaint appear instantly ✓

---

## 🆘 Common Issues

**Can't connect to MongoDB?**
```bash
# Local MongoDB - make sure it's running
mongod

# MongoDB Atlas - check .env MONGO_URI
```

**Firebase errors?**
- Check `backend/serviceAccountKey.json` exists
- Verify Firebase config in `frontend/script.js`

**Frontend won't load?**
- Make sure frontend server is running (port 8000)
- Open http://localhost:8000 (not file://)

**Complaints not showing in admin?**
- Check browser console (F12) for errors
- Check server console for API issues

---

## 📚 Detailed Guide

See **SETUP_AND_RUN.md** for complete setup instructions with all options and troubleshooting.

---

## 🎯 What's Running

- **Backend**: Express.js on port 5000
- **Frontend**: HTTP server on port 8000  
- **Database**: MongoDB (local or Atlas)
- **Firestore**: Optional real-time sync
- **PWA**: Installable on mobile

Everything works offline or online! 🎉
