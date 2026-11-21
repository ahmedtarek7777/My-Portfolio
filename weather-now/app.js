const $ = s => document.querySelector(s);
const statusEl = $("#status"), suggest = $("#suggest");

const ICONS = [
  [c=>c===0,"☀️","Clear sky"],[c=>c===1,"🌤️","Mostly clear"],[c=>c===2,"⛅","Partly cloudy"],
  [c=>c===3,"☁️","Overcast"],[c=>c===45||c===48,"🌫️","Fog"],
  [c=>c>=51&&c<=57,"🌦️","Drizzle"],[c=>c>=61&&c<=67,"🌧️","Rain"],
  [c=>c>=71&&c<=77,"🌨️","Snow"],[c=>c>=80&&c<=82,"🌧️","Showers"],
  [c=>c>=95,"⛈️","Thunderstorm"],
];
function decode(code){
  for(const [test,icon,label] of ICONS) if(test(code)) return {icon,label};
  return {icon:"🌡️",label:"Unknown"};
}
const dayName = iso => new Date(iso+"T12:00:00").toLocaleDateString("en-US",{weekday:"short"});

async function geo(q){
  const r = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`);
  if(!r.ok) throw new Error("geocoding failed");
  return (await r.json()).results || [];
}

async function forecast(lat, lon){
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=6&timezone=auto`;
  const r = await fetch(url);
  if(!r.ok) throw new Error("forecast failed");
  return r.json();
}

let debounce;
$("#city").oninput = e=>{
  clearTimeout(debounce);
  const q = e.target.value.trim();
  if(q.length < 2){ suggest.hidden = true; return; }
  debounce = setTimeout(async ()=>{
    try{
      const places = await geo(q);
      suggest.innerHTML = "";
      if(!places.length){ suggest.hidden = true; return; }
      places.forEach(p=>{
        const b = document.createElement("button");
        b.innerHTML = `${p.name}<small>${[p.admin1,p.country].filter(Boolean).join(", ")}</small>`;
        b.onclick = ()=>{ suggest.hidden = true; $("#city").value = p.name; load(p); };
        suggest.appendChild(b);
      });
      suggest.hidden = false;
    }catch{ suggest.hidden = true; }
  }, 300);
};

$("#searchForm").onsubmit = async e=>{
  e.preventDefault();
  suggest.hidden = true;
  const q = $("#city").value.trim();
  if(!q) return;
  statusEl.textContent = "Searching...";
  try{
    const places = await geo(q);
    if(!places.length){ statusEl.textContent = `No place found for "${q}". Try another spelling.`; return; }
    load(places[0]);
  }catch{
    statusEl.textContent = "Couldn't reach the weather service. Check your connection and try again.";
  }
};

async function load(p){
  statusEl.textContent = `Loading weather for ${p.name}...`;
  try{
    const d = await forecast(p.latitude, p.longitude);
    const c = d.current, daily = d.daily;
    const {icon, label} = decode(c.weather_code);
    $("#place").textContent = `${p.name}${p.country ? ", "+p.country : ""}`;
    $("#cond").textContent = `${icon} ${label}`;
    $("#temp").textContent = Math.round(c.temperature_2m);
    $("#feels").textContent = `Feels like ${Math.round(c.apparent_temperature)}°C`;
    $("#wind").textContent = Math.round(c.wind_speed_10m);
    $("#hum").textContent = c.relative_humidity_2m + "%";
    $("#hi").textContent = Math.round(daily.temperature_2m_max[0]) + "°";
    $("#lo").textContent = Math.round(daily.temperature_2m_min[0]) + "°";
    $("#current").hidden = false;

    const fc = $("#forecast");
    fc.innerHTML = "";
    for(let i=1;i<=5;i++){
      const dd = decode(daily.weather_code[i]);
      const el = document.createElement("div");
      el.className = "day";
      el.innerHTML = `<div class="d">${dayName(daily.time[i])}</div>
        <div class="i">${dd.icon}</div>
        <div class="t"><b>${Math.round(daily.temperature_2m_max[i])}°</b> / ${Math.round(daily.temperature_2m_min[i])}°</div>`;
      fc.appendChild(el);
    }
    $("#forecastWrap").hidden = false;
    statusEl.textContent = "";
  }catch{
    statusEl.textContent = "Weather data failed to load. Please try again.";
  }
}

// Default view
load({name:"Cairo", country:"Egypt", latitude:30.0444, longitude:31.2357});
