/* ===============================
GLOBAL VARIABLES
=============================== */
let lat = null, lon = null, active = 0, id = 1001, score = 0, verifyCount = 0;
let complaintsDB = {};

/* ===============================
INIT DOM AFTER LOAD (VERY IMPORTANT)
=============================== */
let category, desc, locationText, activeCount, cid,
    complaintList, trackId, trackResult, scoreEl,
    zoneSelect, lang, image, preview;

document.addEventListener("DOMContentLoaded", () => {

    category = document.getElementById("category");
    desc = document.getElementById("desc");
    locationText = document.getElementById("locationText");
    activeCount = document.getElementById("activeCount");
    cid = document.getElementById("cid");
    complaintList = document.getElementById("complaintList");
    trackId = document.getElementById("trackId");
    trackResult = document.getElementById("trackResult");
    scoreEl = document.getElementById("score");
    zoneSelect = document.getElementById("zoneSelect");
    lang = document.getElementById("lang");
    image = document.getElementById("image");
    preview = document.getElementById("preview");

    initChart();
});

/* ===============================
LOCATION (FIXED)
=============================== */
function getLocation() {

    if (!navigator.geolocation) {
        alert("GPS not supported");
        return;
    }

    navigator.geolocation.getCurrentPosition(p => {
        lat = p.coords.latitude;
        lon = p.coords.longitude;

        locationText.innerText =
            `Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    }, () => {
        alert("Allow location permission");
    });
}

/* ===============================
SUBMIT COMPLAINT (ONLY ONE FUNCTION)
=============================== */
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
 ID:#${cidVal}<br>${desc.value}<br>Status:Submitted`;

    complaintList.appendChild(div);

    desc.value = "";
}

/* ===============================
TRACK
=============================== */
function trackComplaint() {

    const val = trackId.value.trim();

    if (complaintsDB[val]) {
        trackResult.innerHTML = `
   <b>Status:</b>${complaintsDB[val].status}<br>
   <b>Category:</b>${complaintsDB[val].category}`;
    } else {
        trackResult.innerText = "❌ Complaint not found";
    }
}

/* ===============================
VOICE
=============================== */
function startVoice() {

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");

    const rec = new SR();
    rec.lang = lang.value === "hi" ? "hi-IN" : "en-US";
    rec.start();

    rec.onresult = e => {
        desc.value = e.results[0][0].transcript;
    };
}

/* ===============================
IMAGE PREVIEW
=============================== */
function previewImage() {
    const f = image.files[0];
    if (f) preview.src = URL.createObjectURL(f);
}

/* ===============================
CHART INIT (SAFE)
=============================== */
let chart;

function initChart() {

    const el = document.getElementById("zoneChart");
    if (!el) return;

    const ctx = el.getContext("2d");

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Complaints',
                data: [12, 19, 10, 14, 20, 18, 25],
                borderColor: '#00ffd5',
                tension: 0.4
            }]
        }
    });
}

function updateZone() {

    if (!chart) return;

    const data = {
        "Zone A": [12, 19, 10, 14, 20, 18, 25],
        "Zone B": [5, 8, 6, 9, 12, 10, 15],
        "Zone C": [3, 4, 5, 6, 8, 7, 9]
    };

    chart.data.datasets[0].data = data[zoneSelect.value];
    chart.update();
}