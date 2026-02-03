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