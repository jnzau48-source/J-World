// LOADER
window.onload = () => {
  setTimeout(() => {
    document.getElementById("loader").style.display = "none";
    document.getElementById("tools").style.display = "block";
  }, 2000);
};

// ================= NUMINFO =================
async function lookupNumber() {
    const number = document.getElementById("numberInput").value;
    const box = document.getElementById("result");

    if (!number) {
        box.innerHTML = "❌ Enter a number";
        return;
    }

    try {
        box.innerHTML = "⏳ Checking...";

        const res = await fetch(
            "http://127.0.0.1:3000/api/numinfo?number=" + number
        );

        const data = await res.json();

        box.innerHTML = `
            ✅ Valid: ${data.valid}<br>
            🌍 Country: ${data.country_name}<br>
            📡 Carrier: ${data.carrier || "N/A"}<br>
            📱 Type: ${data.line_type}
        `;

    } catch (err) {
        console.log(err);
        box.innerHTML = "❌ API Error";
    }
}
// ================= MINI TERMUX =================
const output = document.getElementById("console-output");
const input = document.getElementById("console-input");

const cmdResponses = {
  ls: "Documents Downloads Music",
  pwd: "/home/jworld",
  whoami: "user",
  date: new Date().toString()
};

function runCmd(cmd) {
  if (cmd === "clear") {
    output.textContent = "";
    return;
  }
  output.textContent += `\n$ ${cmd}\n${cmdResponses[cmd] || ""}`;
}

if (input) {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = input.value.trim();
      runCmd(cmd);
      input.value = "";
    }
  });
}

// ================= JUICE MESSAGES =================
const quotes = [
  "Legends never die.",
  "I still see your shadows in my room.",
  "Pain makes the music real.",
  "We’re perfectly imperfect.",
  "Lost but alive.",
  "Dreams feel real at night.",
  "Broken but breathing.",
  "Music heals everything.",
  "Love fades, scars stay.",
  "Vibes over everything."
];

const list = document.getElementById("quote-list");
quotes.forEach(q => {
  const li = document.createElement("li");
  li.textContent = q;
  list.appendChild(li);
});

// MUSIC TOGGLE
let audio;
const btn = document.getElementById("play-music");
btn.onclick = () => {
  if (!audio) {
    audio = new Audio("juiceworld_wishingwell.mp3");
    audio.loop = true;
    audio.play();
    btn.textContent = "Pause Song";
  } else {
    audio.pause();
    audio = null;
    btn.textContent = "Play Song";
  }
};

// ================= WIFI SCANNER LOGIC =================
async function refreshWiFi() {
  const wifiBox = document.getElementById('wifi-radar');

  wifiBox.innerHTML = "🔍 Scanning WiFi...";

  try {
    const response = await fetch('tools/wifi_scan.json');
    const networks = await response.json();

    networks.sort((a, b) => b.rssi - a.rssi);

    let output = '';
    networks.forEach(net => {
      let name = net.ssid || 'Hidden Network';
      let security = net.capabilities.includes('WPA') || net.capabilities.includes('WEP') ? '🔒' : '⚠️';
      let bars = Math.min(5, Math.max(1, Math.floor((net.rssi + 100) / 10)));
      let barDisplay = '▂▄▆█'.repeat(bars);
      output += `<div class="panel"><div>📶 ${name}</div><div>${barDisplay} ${security}</div></div>`;
    });

    wifiBox.innerHTML = output;
  } catch (err) {
    wifiBox.innerHTML = '❌ Error reading WiFi data';
    console.error(err);
  }
}

// Auto-refresh every 15 seconds
setInterval(refreshWiFi, 15000);
