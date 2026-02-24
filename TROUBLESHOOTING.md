# CivicSense - Troubleshooting Guide

## Common Issues & Solutions

---

## 🔴 Backend Issues

### Issue: "Cannot find module 'express'"
**Error Message:** `Error: Cannot find module 'express'`

**Cause:** Dependencies not installed

**Solution:**
```powershell
cd backend
npm install
```

**Verification:**
```powershell
npm list express
```

---

### Issue: "MongoDB connection failed"
**Error Message:** `MongooseError: connect ECONNREFUSED 127.0.0.1:27017`

**Cause:** 
- MongoDB service not running
- MongoDB URI in `.env` is incorrect

**Solution - Local MongoDB:**
```powershell
# Windows - Start MongoDB service
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Solution - MongoDB Atlas:**
1. Edit `backend/.env`
2. Update MONGO_URI with your Atlas connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/civicsense?retryWrites=true&w=majority
   ```
3. Replace `username` and `password` with your Atlas credentials

**Test Connection:**
```powershell
cd backend
npm start
```
Look for: `Connected to MongoDB successfully!`

---

### Issue: "Firebase credentials not found"
**Error Message:** `Error: ENOENT: no such file or directory, open 'serviceAccountKey.json'`

**Cause:** `serviceAccountKey.json` missing in `backend/` folder

**Solution:**
1. Go to Firebase Console: https://console.firebase.google.com
2. Select "civic-b1f7c" project
3. Click ⚙️ Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save as `backend/serviceAccountKey.json`

**Verification:**
```powershell
ls backend/serviceAccountKey.json
```

---

### Issue: Port 5000 already in use
**Error Message:** `EADDRINUSE: address already in use :::5000`

**Cause:** Another process using port 5000

**Solution - Windows:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Solution - macOS/Linux:**
```bash
lsof -i :5000
kill -9 <PID>
```

**Alternative:** Change port in `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3000; // Changed from 5000
```

---

### Issue: ".env file not found"
**Error Message:** `Error: .env file not found`

**Cause:** `.env` was not created

**Solution:**
1. Copy `.env.example` to `.env`
   ```powershell
   copy backend\.env.example backend\.env
   ```
2. Edit `backend/.env`
3. Add MONGO_URI and GEMINI_API_KEY

---

### Issue: "npm start not working"
**Error Message:** `command not found: npm` or similar

**Cause:**
- Node.js not installed
- Node not in PATH

**Solution:**
1. Download from https://nodejs.org (LTS version)
2. Install Node.js (includes npm)
3. Restart terminal
4. Verify:
   ```powershell
   node --version
   npm --version
   ```

---

## 🔴 Frontend Issues

### Issue: "Cannot GET /"
**Error Message:** Page shows "Cannot GET /"

**Cause:** Frontend server not running

**Solution:**
```powershell
cd frontend
python -m http.server 8000

# If Python not found, try Python 3
python3 -m http.server 8000

# Alternative: Use Node if Python not installed
npx http-server -p 8000
```

**Verification:**
- Visit http://localhost:8000
- Should see complaint form

---

### Issue: "Firebase config undefined"
**Console Error:** `Uncaught TypeError: Cannot read property 'apiKey' of undefined`

**Cause:** Firebase config not in HTML file

**Solution:**
1. Open `frontend/script.js`
2. Verify Firebase import:
   ```javascript
   import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
   ```
3. Verify config object exists (lines 1-20)
4. Config should have: apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId

**If config missing:**
1. Copy from Firebase Console → Project Settings
2. Paste into `frontend/script.js` lines 1-16

---

### Issue: "Location permission denied"
**Error Message:** "Location permission denied. Please enable location services."

**Cause:** Browser permission not granted or GPS unavailable

**Solution:**
1. **Browser Permission:**
   - Chrome shows popup when you click "Get GPS Location"
   - Click "Allow"
   - If blocked, go to Settings → Privacy → Location

2. **Desktop Testing:**
   - Use Chrome DevTools (F12)
   - Sensors tab → Location
   - Override location to test

3. **Mobile Testing:**
   - Enable location services in phone settings
   - Grant permission in app

---

### Issue: "Service Worker not registering"
**Console Warning:** `Failed to register service worker`

**Cause:**
- Service Worker file not found
- HTTPS required (for production)
- Service Worker error in code

**Solution - Development:**
1. Verify `frontend/sw.js` exists
2. Check browser console for errors
3. Hard refresh (Ctrl+Shift+R)
4. Clear service workers:
   - DevTools → Application → Service Workers → Unregister

**Solution - Inspect:**
```javascript
// In browser console
navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log("Registrations:", registrations);
});
```

---

### Issue: "Form not submitting"
**Behavior:** Click submit button, nothing happens

**Cause:**
- Validation failing
- JavaScript error
- Firebase not connected

**Debugging:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Check if location shows as obtained

**Common validation failures:**
- Category not selected
- Description empty
- Location not obtained

---

### Issue: "Popular page shows no data"
**Behavior:** Popular.html loads but no complaints shown

**Cause:**
- No complaints in Firestore
- Query not working
- Firebase not initialized

**Solution:**
1. Submit a complaint first on index.html
2. Wait 2-3 seconds for Firestore write
3. Refresh popular.html
4. Check admin.html - is complaint there?

**Debug:**
```javascript
// In browser console on popular.html
db.collection("complaints").get().then(snap => {
    console.log("Complaints:", snap.size);
    snap.docs.forEach(doc => console.log(doc.data()));
});
```

---

## 🔴 Database Issues

### Issue: "No data in MongoDB"
**Cause:** Database empty or collection not created

**Solution:**
1. Submit a complaint via frontend
2. Database auto-creates on first write
3. Verify in MongoDB Compass:
   - Connect to `mongodb://localhost:27017`
   - Find `civicsense` database
   - Find `complaints` collection

**If still empty:**
1. Check backend console for errors
2. Verify MongoDB is running
3. API might not be writing to DB (check backend logs)

---

### Issue: "Data not syncing between MongoDB and Firestore"
**Cause:**
- Both databases operating independently (as designed)
- Firebase credentials issue
- Network connectivity

**Explanation:**
This system can work with:
- MongoDB only (if firebaseKey missing)
- Firestore only (if MongoDB unavailable)
- Both (recommended - real-time + persistence)

**Solution:**
- Ensure `serviceAccountKey.json` in backend/
- Restart backend server
- Check Firebase console for new documents

---

## 🔴 API Issues

### Issue: "GET /api/complaints returns 500"
**Error:** `Internal Server Error`

**Cause:**
- Database connection error
- Mongoose schema issue
- Server error

**Solution:**
1. Check backend console for error message
2. Verify MongoDB connection
3. Look for "cast error" or "validation error"
4. Restart backend with `npm start`

---

### Issue: "POST /api/complaints creates empty document"
**Cause:**
- Old code version (form cleared before write)
- Should be fixed in current version

**Solution:**
1. Update `frontend/script.js` from repo
2. Verify `submitComplaint()` function captures values before clearing
3. Restart frontend

---

## 🟡 Performance Issues

### Issue: "Admin panel updates slowly"
**Cause:** Network latency or Firestore delay

**Solution:**
- Firestore real-time updates have 2-3 second latency
- This is normal
- Try refreshing page

---

### Issue: "App loading very slowly"
**Cause:**
- Large Firestore query
- Network slow
- Service Worker cache stale

**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear service worker cache:
   - DevTools → Application → Cache Storage → Delete cache
3. Check network speed (F12 → Network tab)
4. Verify backend is running

---

### Issue: "Offline mode not working"
**Cause:** Service Worker not registered

**Solution:**
1. Must run on http://localhost OR https (development exception)
2. DevTools → Network → Offline checkbox
3. Refresh page
4. Previously cached pages should load

---

## 🟡 UI/UX Issues

### Issue: "Page looks broken on mobile"
**Cause:** CSS not loading or viewport not set

**Solution:**
1. Check `frontend/index.html` has:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
2. Hard refresh (Ctrl+Shift+R)
3. Clear browser cache

---

### Issue: "Dark mode not working"
**Cause:** localStorage not supported or CSS missing

**Solution:**
1. Verify `frontend/style.css` has dark mode styles
2. Enable Dark mode: Settings → Dark/Light toggle
3. Refresh page
4. Inspect localStorage (DevTools → Application → LocalStorage)

---

## 🟢 Success Indicators

✅ Terminal shows: `Server running on 5000`
✅ Browser shows complaint form
✅ Submit button doesn't throw errors
✅ Admin panel updates in real-time
✅ Likes/verify buttons increment
✅ Officer dashboard shows only approved
✅ Service Worker registers (DevTools → Application)
✅ Works offline (disconnect network, reload)

---

## 📞 Still Stuck?

### Check These Files
1. `backend/.env` - verify MONGO_URI is set
2. `backend/serviceAccountKey.json` - verify exists
3. `frontend/script.js` - Firebase config present
4. `backend/server.js` - MongoDB connection line
5. `backend/package.json` - all dependencies listed

### Debug Steps
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy full error text
5. Search this guide or GitHub issues

### Get Help
1. Read SETUP_AND_RUN.md for detailed steps
2. Check QUICKSTART.md for quick commands
3. Verify VERIFICATION_CHECKLIST.md completion
4. Review error messages carefully

---

**Version:** 1.0  
**Last Updated:** Jan 2025  
**Compatible With:** Node.js 16+, Python 3.6+, MongoDB 4.4+
