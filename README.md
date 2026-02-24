---

🏙 CivicSense – Smart City Complaint Management System

> CivicSense is an AI-powered, voice-enabled, multilingual smart city platform that allows citizens to report, track, and analyze civic issues in real time.




---

🚀 Features

👤 Citizen Side

🎙 Voice complaint (Hindi & English)

📷 Upload photo with live preview

� Mobile contact number field added to complaint form
�📍 GPS auto location

🤖 AI image classification

🔄 Track complaint by ID

🗺 Google heatmap of issues

🏙 Ward/Zone analytics (live graphs)

🚨 Disaster mode
👍 Likes/popup page (popular.html) shows most liked complaints

🏆 Citizen reputation score

⏱ SLA timer & escalation

📱 QR-based complaint

📣 Social media sharing (WhatsApp, X, Instagram, Threads, YouTube)

🌗 Dark/Light mode


🏛 Government / Admin Side

Complaint status workflow

Smart priority engine

Heatmap analytics

Open data dashboard

SMS & WhatsApp alerts

Officer/department routing



---

🧱 Tech Stack

Layer	Technology

Frontend	HTML, CSS, JavaScript
Backend	Node.js, Express
Database	MongoDB Atlas (primary)
	Firebase Firestore (optional realtime frontend sync; backend can mirror data)
AI	Python, Flask, PyTorch
Maps	Google Maps API
Alerts	Twilio (SMS + WhatsApp)
Hosting	Vercel / Netlify



---

📂 Project Structure

civicsense-smart-city/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   └── ai/
│
└── .gitignore


---

⚙️ How to Run Locally

Frontend

cd frontend
# update the firebaseConfig object in script.js, admin.html and officer.html with your project's values
# the front-end uses the modular Firebase 12.x SDK; index.html loads script.js with `type="module"` and admin/officer pages have module scripts
# a `popular.html` page lists complaints ordered by likes, you can open it directly or via links on other pages
open index.html

Backend

cd backend
npm install
# if you want Firestore sync, also install:
# npm install firebase-admin
# and place serviceAccountKey.json (from Firebase console) alongside server.js
node server.js

AI Service

cd backend/ai
python app.py


---

🎯 Hackathon Vision

> CivicSense bridges the gap between citizens and government using AI, automation, and real-time data to create transparent, responsive, and smarter cities.




---

👨‍💻 Author

Kuldeep Singh Rathore


---
