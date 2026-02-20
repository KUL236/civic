let lat = null, lon = null, active = 0, id = 1001;

function toggleTheme() { document.body.classList.toggle("dark"); }

function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = lang.value === "hi" ? "hi-IN" : "en-US";
    rec.start();
    rec.onresult = e => desc.value = e.results[0][0].transcript;
}

function previewImage() {
    const f = image.files[0];
    if (f) preview.src = URL.createObjectURL(f);
}

function getLocation() {
    navigator.geolocation.getCurrentPosition(p => {
        lat = p.coords.latitude; lon = p.coords.longitude;
        locationText.innerText = `Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
    });
}

function submitComplaint() {
    if (!desc.value || !lat) return alert("Fill all!");
    active++; activeCount.innerText = active;
    id++; cid.innerText = "#CS-" + id;

    const div = document.createElement("div");
    div.className = "complaint-card";
    div.innerHTML = `<b>${category.value}</b><br>
ID: #CS-${id}<br>${desc.value}<br>
Status: Submitted`;
    complaintList.appendChild(div);
    desc.value = ""; preview.src = "";
}
let complaintsDB = {}; // frontend demo DB

function submitComplaint() {
    if (!desc.value || !lat) return alert("Fill all!");
    active++;
    activeCount.innerText = active;
    id++;
    const cidVal = "CS-" + id;

    complaintsDB[cidVal] = {
        category: category.value,
        desc: desc.value,
        status: "Submitted"
    };

    cid.innerText = "#" + cidVal;

    const div = document.createElement("div");
    div.className = "complaint-card";
    div.innerHTML = `<b>${category.value}</b><br>
  ID: #${cidVal}<br>${desc.value}<br>Status: Submitted`;
    complaintList.appendChild(div);
    desc.value = "";
}

function trackComplaint() {
    const val = trackId.value.trim();
    if (complaintsDB[val]) {
        trackResult.innerHTML = `
      <b>Status:</b> ${complaintsDB[val].status}<br>
      <b>Category:</b> ${complaintsDB[val].category}`;
    } else {
        trackResult.innerText = "❌ Complaint not found";
    }
}
function share(platform) {
    const text = encodeURIComponent("I reported a civic issue via CivicSense. Let's improve our city!");
    let url = "";
    if (platform == "whatsapp") url = `https://wa.me/?text=${text}`;
    if (platform == "x") url = `https://twitter.com/intent/tweet?text=${text}`;
    if (platform == "instagram") alert("Instagram sharing opens camera inside app.");
    if (platform == "threads") window.open("https://www.threads.net");
    if (platform == "youtube") window.open("https://youtube.com");
    window.open(url, "_blank");
}
function toggleDisaster() {
    document.body.classList.toggle("disaster");
    alert("Emergency services activated!");
}
let score = 0;
function addScore() {
    score += 10;
    scoreEl.innerText = score;
}
function startSLA(card) {
    let time = 48 * 60 * 60;
    const t = setInterval(() => {
        time--;
        card.querySelector(".sla").innerText = "SLA: " + Math.floor(time / 3600) + "h";
        if (time <= 0) { card.style.border = "2px solid red"; clearInterval(t); }
    }, 1000);
}
const ctx = document.getElementById('zoneChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Complaints',
            data: [12, 19, 10, 14, 20, 18, 25],
            borderColor: '#00ffd5',
            backgroundColor: 'rgba(0,255,213,0.2)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#00ffd5' } }
        },
        scales: {
            x: { ticks: { color: '#00ffd5' } },
            y: { ticks: { color: '#00ffd5' } }
        }
    }
});

function updateZone() {
    const zone = zoneSelect.value;
    const data = {
        "Zone A": [12, 19, 10, 14, 20, 18, 25],
        "Zone B": [5, 8, 6, 9, 12, 10, 15],
        "Zone C": [3, 4, 5, 6, 8, 7, 9]
    };
    chart.data.datasets[0].data = data[zone];
    chart.update();
}
/* ===============================
   🤖 CHATBOT (GEMINI READY)
   =============================== */
function toggleChat() {
    const bot = document.getElementById("chatbot");
    bot.style.display = bot.style.display === "flex" ? "none" : "flex";
}

function addMsg(text, type) {
    const div = document.createElement("div");
    div.className = `chat-msg ${type}`;
    div.innerText = text;
    document.getElementById("chat-body").appendChild(div);
    document.getElementById("chat-body").scrollTop = document.getElementById("chat-body").scrollHeight;
}

async function sendChat() {
    const input = document.getElementById("chatText");
    const msg = input.value.trim();
    if (!msg) return;

    addMsg(msg, "user");
    input.value = "";
    addMsg("Thinking…", "bot");

    try {
        const res = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: msg })
        });

        const data = await res.json();
        chat - body.lastChild.remove();
        addMsg(data.reply, "bot");
    } catch {
        chat - body.lastChild.remove();
        addMsg("AI backend not connected.", "bot");
    }
}
/* ===============================
   🌐 LANGUAGE SWITCH (EN / HI)
   =============================== */

const translations = {
    en: {
        raise: "Raise Complaint",
        category: "Category",
        description: "Description",
        submit: "Submit Complaint",
        track: "Track Complaint",
        disaster: "Disaster Mode",
        active: "Active",
        resolved: "Resolved",
        complaints: "Complaints",
        citizen: "Citizen Score"
    },
    hi: {
        raise: "शिकायत दर्ज करें",
        category: "श्रेणी",
        description: "विवरण",
        submit: "शिकायत भेजें",
        track: "शिकायत ट्रैक करें",
        disaster: "आपदा मोड",
        active: "सक्रिय",
        resolved: "निस्तारित",
        complaints: "शिकायतें",
        citizen: "नागरिक स्कोर"
    }
};

function changeLang() {
    const lang = document.getElementById("lang").value;

    // Section titles
    document.getElementById("tRaise").innerText = translations[lang].raise;

    // Dashboard cards
    document.querySelectorAll(".card h3")[0].innerText = translations[lang].active;
    document.querySelectorAll(".card h3")[1].innerText = translations[lang].resolved;
    document.querySelectorAll(".card h3")[2].innerText = translations[lang].complaints;
    document.querySelectorAll(".card h3")[3].innerText = translations[lang].citizen;

    // Buttons
    document.querySelector(".submit").innerText = translations[lang].submit;
    document.querySelector(".disaster-btn").innerText =
        "🚨 " + translations[lang].disaster;
}
/* ===============================
   🤖 AI SEVERITY LOGIC (DEMO)
   =============================== */

function analyzeSeverity() {
    const text = document.getElementById("desc").value.toLowerCase();
    let level = 20;
    let label = "Low";

    if (text.includes("accident") || text.includes("fire")) {
        level = 90; label = "Critical";
    } else if (text.includes("garbage") || text.includes("water")) {
        level = 60; label = "Medium";
    }

    document.getElementById("severityFill").style.width = level + "%";
    document.getElementById("severityText").innerText =
        "Severity: " + label;
}

document.getElementById("desc")
    .addEventListener("input", analyzeSeverity);
/* ===============================
👥 CROWD VERIFY LOGIC
=============================== */

let verifyCount = 0;
/* ===============================
   SHOW USER EMAIL ON TOP
================================ */

const emailTop = document.getElementById("userEmailTop");

if (emailTop) {
    const email = localStorage.getItem("userEmail");

    if (email) {
        emailTop.innerText = email;
    }
    else {
        emailTop.innerText = "Guest";
    }
}
/* ===============================
   🔐 LOGIN PANEL TOGGLE
================================ */

function openLogin() {
    const panel = document.getElementById("loginPanel");

    if (panel) {
        panel.style.display = "flex";
    }
}

function closeLogin() {
    const panel = document.getElementById("loginPanel");

    if (panel) {
        panel.style.display = "none";
    }
}
function openLogin() {
    document.getElementById("loginPanel").style.display = "flex";
}

function closeLogin() {
    document.getElementById("loginPanel").style.display = "none";
}