# CivicSense System Verification Checklist

## Pre-Requisites ✓

- [ ] Node.js installed (`node --version` shows v16+)
- [ ] MongoDB installed or Atlas account created
- [ ] Git installed (optional)
- [ ] Text editor or IDE (VS Code, etc.)

## Setup Phase ✓

### Backend Setup
- [ ] Navigated to `backend/` directory
- [ ] Ran `npm install` successfully
- [ ] Created/edited `.env` with MongoDB URI
- [ ] Added `serviceAccountKey.json` to backend/
- [ ] Started backend with `npm start`
- [ ] See "Server running on 5000" in console

### Frontend Setup
- [ ] Verified Firebase config in `frontend/script.js`
- [ ] Verified Firebase config in `frontend/admin.html`
- [ ] Verified Firebase config in `frontend/officer.html`
- [ ] Verified Firebase config in `frontend/popular.html`
- [ ] Started frontend server (port 8000)
- [ ] Verified `http://localhost:8000` loads

## Functionality Testing ✓

### Citizen Portal (http://localhost:8000)
- [ ] Page loads without errors
- [ ] All form fields visible
- [ ] **Select Category** dropdown works
- [ ] **Description** textarea accepts input
- [ ] **Mobile** input field visible
- [ ] **Speak** button starts voice recognition
- [ ] **Upload Photo** file picker works
- [ ] **Get GPS Location** button shows location (✓ Location: XX.XXXX, YY.YYYY)
- [ ] Location permission popup appears
- [ ] Submit button enabled after location obtained
- [ ] **Submit** button works
- [ ] Success alert shows with complaint ID
- [ ] Complaint card appears in "My Complaints"
- [ ] Form clears after submission
- [ ] **Track Complaint** works when ID entered
- [ ] **Verify Issue** button increments counter (requires tracking ID)
- [ ] **Popular** link accessible

### Admin Firewall (http://localhost:8000/admin.html)
- [ ] Page loads
- [ ] Firebase initializes (check console)
- [ ] Yellow alert banner at top
- [ ] Complaint list shows submitted complaints
- [ ] Shows: ID, Category, Status, Phone, Location
- [ ] Location is clickable link to Google Maps
- [ ] **Approve** button works
- [ ] **Reject** button works  
- [ ] **Assign Officer** button works
- [ ] **Verify** button increments verifyCount
- [ ] **+** button increments verifications
- [ ] Admin panel updates in real-time when new complaint submitted
- [ ] Dark notifications appear for new complaints

### Officer Dashboard (http://localhost:8000/officer.html)
- [ ] Page loads
- [ ] Shows only "Approved" complaints
- [ ] Displays complaint ID and category
- [ ] **Resolve** button works
- [ ] Status updates to "Resolved"
- [ ] Complaint disappears from list after resolve

### Popular Complaints (http://localhost:8000/popular.html)
- [ ] Page loads
- [ ] Shows submitted complaints
- [ ] Displays: ID, Category, Description, Phone, Location, Likes
- [ ] **Like** button increments likes counter
- [ ] List re-sorts by likes (most liked first)
- [ ] Real-time updates work

## Database Verification ✓

### MongoDB
- [ ] MongoDB running (check with `mongod` or Atlas connection)
- [ ] `civicsense` database created
- [ ] `complaints` collection has documents
- [ ] Can view data in MongoDB Compass or Atlas UI

### Firestore (Optional but recommended)
- [ ] Firebase console shows "civic-b1f7c" project
- [ ] `complaints` collection exists in Firestore
- [ ] Documents appear with correct structure
- [ ] Real-time updates visible

## API Testing ✓

### Test with cURL or Postman
- [ ] `GET http://localhost:5000/api/complaints` returns list
- [ ] Response status 200 OK
- [ ] Can see all submitted complaints in response
- [ ] `GET http://localhost:5000/api/complaints/CS-XXXX` returns single complaint

## PWA Features ✓

### On Mobile (Android/Chrome or iOS)
- [ ] Can open app and use normally
- [ ] Install prompt appears
- [ ] Can add to home screen
- [ ] App icon appears on home screen
- [ ] App opens in standalone mode (no browser UI)
- [ ] Works offline (previous submissions cached)

### On Desktop
- [ ] Chrome/Edge shows install icon in address bar
- [ ] Can install as app
- [ ] App opens in separate window

## UI/UX Checks ✓

- [ ] Dark/Light mode toggle works
- [ ] Language selector works (English/हिंदी)
- [ ] Responsive design on mobile (375px width)
- [ ] Responsive design on tablet (768px width)
- [ ] Responsive design on desktop (1920px width)
- [ ] All buttons clickable and responsive
- [ ] Form validation shows errors
- [ ] Success/error messages display clearly
- [ ] Navigation between pages works
- [ ] Links to other pages work

## Performance Checks ✓

- [ ] Page load time < 3 seconds
- [ ] No console errors or warnings
- [ ] No missing images/assets
- [ ] Service worker registers (console shows "SW registered")
- [ ] Caching works (load page twice, second is faster)

## Security Assessment ✓

- [ ] `.env` file not exposed in frontend
- [ ] `serviceAccountKey.json` not exposed in frontend
- [ ] Firebase rules validate requests
- [ ] CORS is properly configured
- [ ] No sensitive data in browser console
- [ ] API endpoints require no authentication (or have proper auth)

## Final Sign-Off ✓

- [ ] All systems operational
- [ ] No critical bugs
- [ ] Ready for demonstration
- [ ] Documentation complete

---

## 🎯 Summary

✅ System is **READY FOR PRODUCTION** if all items are checked!

### Test Coverage
- Frontend: ✓ Citizen, Admin, Officer, Popular
- Backend: ✓ API, Database, Firebase
- Database: ✓ MongoDB, Firestore
- Features: ✓ Submit, Track, Verify, Like, PWA
- PWA: ✓ Offline, Install, Caching, SW

---

**Date Tested:** _____________  
**Tested By:** _____________  
**Notes:** _________________________________

---

*Print this checklist and complete it during testing!*
