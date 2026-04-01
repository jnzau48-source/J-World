// Loader
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  const tools = document.getElementById('tools');
  setTimeout(()=>{ loader.style.display='none'; tools.style.display='grid'; },1200);
});

// Toggle panel
function togglePanel(id){
  const panel=document.getElementById(id);
  panel.style.display=(panel.style.display==='none')?'block':'none';
}

// Update top-bar heartbeat
function setUpdateStatus(status){
  const el=document.getElementById('update-status');
  el.innerText=status;
}

// NumInfo
async function lookupNumber(){
  const number=document.getElementById("phoneInput").value;
  const resultBox=document.getElementById("resultBox");
  const historyBox=document.getElementById("numinfo-history");
  if(!number){ resultBox.innerHTML="⚠️ Enter a number first!"; return; }
  resultBox.innerHTML="Scanning... 🔍"; setUpdateStatus("⚡ NumInfo Scanning");
  try{
    const res = await fetch(`https://api.apilayer.com/number_verification/validate?number=${number}`, { method:"GET", headers:{"apikey":"YOUR_API_KEY"} });
    const data = await res.json();
    if(!data.valid){ resultBox.innerHTML="❌ Invalid number"; setUpdateStatus("✅ Idle"); return; }
    const output=`
      <p>🌍 <strong>Country:</strong> ${data.country_name}</p>
      <p>📡 <strong>Carrier:</strong> ${data.carrier||"N/A"}</p>
      <p>📱 <strong>Line Type:</strong> ${data.line_type}</p>
      <p>📍 <strong>Location:</strong> ${data.location||"Unknown"}</p>
      <p>🌐 <strong>Country Code:</strong> +${data.country_code}</p>`;
    resultBox.innerHTML=output;
    historyBox.innerHTML+=`<p>[${new Date().toLocaleTimeString()}] ${number} scanned</p>`;
    setUpdateStatus("✅ Idle");
  }catch(err){ resultBox.innerHTML="❌ Error fetching data"; console.error(err); setUpdateStatus("❌ Error"); }
}

// WiFi
async function refreshWiFi(){
  const historyBox=document.getElementById("wifi-history");
  setUpdateStatus("⚡ WiFi Refreshing");
  try{
    const res=await fetch('tools/wifi_scan.json');
    const networks=await res.json();
    networks.sort((a,b)=>b.rssi-a.rssi);
    let out='';
    networks.forEach(net=>{
      let name=net.ssid||'Hidden Network';
      let sec=net.capabilities.includes('WPA')||net.capabilities.includes('WEP')?'🔒':'⚠️';
      let bars=Math.min(5, Math.max(1, Math.floor((net.rssi+100)/10)));
      let barDisplay='▂▄▆█'.repeat(bars);
      out+=`<div class="panel">📶 ${name} | ${barDisplay} | ${sec}</div>`;
    });
    document.getElementById('wifi-radar').innerHTML=out;
    historyBox.innerHTML+=`<p>[${new Date().toLocaleTimeString()}] WiFi refreshed</p>`;
    setUpdateStatus("✅ Idle");
  }catch(err){ document.getElementById('wifi-radar').innerHTML='❌ Error reading WiFi data'; console.error(err); setUpdateStatus("❌ Error"); }
}
setInterval(refreshWiFi,15000);

// Top bar updates
function updateSystemTime(){ document.getElementById('sys-time').innerText=`⏰ ${new Date().toLocaleTimeString()}`; }
setInterval(updateSystemTime,1000);
updateSystemTime();

function updateActiveTools(){
  const tools=document.querySelectorAll('.tool-body');
  let count=0;
  tools.forEach(tool=>{ if(tool.style.display!=='none') count++; });
  document.getElementById('active-tools').innerText=`🛠️ Active Tools: ${count}`;
}
setInterval(updateActiveTools,500);

function updateWiFiCount(){
  const wifiPanel=document.getElementById('wifi-radar');
  const count=wifiPanel.querySelectorAll('.panel').length;
  document.getElementById('wifi-count').innerText=`📡 WiFi Networks: ${count}`;
}
setInterval(updateWiFiCount,2000);

// Matrix Background
const canvas=document.getElementById('bg-canvas'); const ctx=canvas.getContext('2d');
let W=canvas.width=window.innerWidth, H=canvas.height=window.innerHeight;
const cols=Math.floor(W/20)+1; const ypos=new Array(cols).fill(0);
function matrix(){ ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,W,H); ctx.fillStyle='#00ffcc'; ctx.font='15px monospace';
for(let i=0;i<ypos.length;i++){ const text=String.fromCharCode(33+Math.random()*94); ctx.fillText(text,i*20,ypos[i]*20); if(ypos[i]*20>H && Math.random()>0.975) ypos[i]=0; ypos[i]++; } }
setInterval(matrix,50);
window.addEventListener('resize',()=>{W=canvas.width=window.innerWidth; H=canvas.height=window.innerHeight;});
