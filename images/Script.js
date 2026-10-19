const API_URL = "https://anurella.github.io/json/planet.json";

const PLANET_API_DATA = [
  { name: "Mercury", type: "Terrestrial", distanceFromSun: 57.9, image: "https://anurella.github.io/images/planets/mercury.webp", mass: 0.000174, diameter: 4879, period: 88, temperature: 440, gravity: 3.7, moons: 0, description: "The smallest planet and closest to the Sun, with extreme temperature swings." },
  { name: "Venus", type: "Terrestrial", distanceFromSun: 108.2, image: "https://anurella.github.io/images/planets/venus.webp", mass: 0.00256, diameter: 12104, period: 225, temperature: 737, gravity: 8.9, moons: 0, description: "The hottest planet, covered in thick clouds of sulfuric acid." },
  { name: "Earth", type: "Terrestrial", distanceFromSun: 149.6, image: "https://anurella.github.io/images/planets/earth.jpg", mass: 0.00315, diameter: 12756, period: 365, temperature: 288, gravity: 9.8, moons: 1, description: "The only known planet to support life, with liquid water on its surface." },
  { name: "Mars", type: "Terrestrial", distanceFromSun: 227.9, image: "https://anurella.github.io/images/planets/mars.webp", mass: 0.000338, diameter: 6792, period: 687, temperature: 208, gravity: 3.7, moons: 2, description: "The Red Planet, home to the largest volcano and canyon in the solar system." },
  { name: "Jupiter", type: "Gas Giant", distanceFromSun: 778.6, image: "https://anurella.github.io/images/planets/jupiter.webp", mass: 1.0, diameter: 142984, period: 4333, temperature: 163, gravity: 23.1, moons: 95, description: "The largest planet in the solar system, known for its Great Red Spot storm." },
  { name: "Saturn", type: "Gas Giant", distanceFromSun: 1433.5, image: "https://anurella.github.io/images/planets/saturn.webp", mass: 0.299, diameter: 120536, period: 10759, temperature: 133, gravity: 9.0, moons: 146, description: "Distinguished by its stunning ring system made of ice and rock." },
  { name: "Uranus", type: "Ice Giant", distanceFromSun: 2872.5, image: "https://anurella.github.io/images/planets/uranus.webp", mass: 0.0457, diameter: 51118, period: 30687, temperature: 78, gravity: 8.7, moons: 28, description: "An ice giant that rotates on its side, giving it extreme seasonal cycles." },
  { name: "Neptune", type: "Ice Giant", distanceFromSun: 4495.1, image: "https://anurella.github.io/images/planets/neptune.webp", mass: 0.0539, diameter: 49528, period: 60190, temperature: 73, gravity: 11.0, moons: 16, description: "The windiest planet, with storms reaching speeds of 2,100 km/h." },
  { name: "Pluto", type: "Dwarf Planet", distanceFromSun: 5906.4, image: "https://anurella.github.io/images/planets/pluto.webp", mass: 0.0000069, diameter: 2376, period: 90560, temperature: 48, gravity: 0.7, moons: 5, description: "A dwarf planet in the Kuiper Belt, reclassified from planet status in 2006." },
];


const BACKUP_LOOK = {
  Mercury: { colors: ["#b9b2a8", "#8c8279", "#4e4741"] },
  Venus:   { colors: ["#f3d9a4", "#d9a65c", "#8a5a24"] },
  Earth:   { colors: ["#5aa0e6", "#1d5aa8", "#0a1d3d"], earth: true },
  Mars:    { colors: ["#e8916a", "#b9512c", "#5a1f0e"] },
  Jupiter: { colors: ["#f0d9b5", "#c99a6b", "#6b4a2f"], bands: true },
  Saturn:  { colors: ["#f5e3b8", "#d6b47a", "#7d6238"], bands: true },
  Uranus:  { colors: ["#c9f1f3", "#79c9d1", "#2d6f7a"] },
  Neptune: { colors: ["#7fa8ff", "#3456d1", "#111f63"] },
  Pluto:   { colors: ["#eadbcc", "#b79c84", "#5c4637"] },
};
const GROUP_OF = { "Terrestrial": "terrestrial", "Gas Giant": "gas", "Ice Giant": "ice", "Dwarf Planet": "dwarf" };

let PLANETS = [];

async function loadPlanets() {
  let raw = PLANET_API_DATA;
  if (API_URL) {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("HTTP " + res.status);
      raw = await res.json();
    } catch (err) {
      console.warn("Planet API unavailable, using embedded data:", err);
    }
  }
  return raw.map((p) => ({
    ...p,
    group: GROUP_OF[p.type] || "terrestrial",
    colors: (BACKUP_LOOK[p.name] || { colors: ["#9fb3d9", "#5a6f99", "#1e2a47"] }).colors,
    bands: BACKUP_LOOK[p.name]?.bands,
    earth: BACKUP_LOOK[p.name]?.earth,
  }));
}

const $ = (sel) => document.querySelector(sel);
const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 6, useGrouping: false });

/* ---------------- Theme ---------------- */
const root = document.documentElement;
const toggle = $("#themeToggle");
const toggleLabel = $("#themeLabel");
const sunIcon = $("#iconSun");
const moonIcon = $("#iconMoon");

function currentTheme() {
  const set = root.getAttribute("data-theme");
  if (set === "dark" || set === "light") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function paintToggle() {
  const dark = currentTheme() === "dark";
  // The button names the theme you switch TO, as in the mockup.
  toggleLabel.textContent = dark ? "Light" : "Dark";
  sunIcon.hidden = !dark;
  moonIcon.hidden = dark;
  toggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
}
function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  try { localStorage.setItem("planet-theme", theme); } catch (e) {}
  paintToggle();
}
try {
  const saved = localStorage.getItem("planet-theme");
  if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
} catch (e) {}
toggle.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", paintToggle);
new MutationObserver(paintToggle).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
paintToggle();


function paintPlanet(canvas, p) {
  const size = 240;
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const c = size / 2;
  const [light, mid, dark] = p.colors;


  ctx.fillStyle = "#050914";
  ctx.fillRect(0, 0, size, size);
  let seed = p.name.length * 9301;
  const rand = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.2 + rand() * 0.7})`;
    ctx.fillRect(rand() * size, rand() * size, rand() * 1.6, rand() * 1.6);
  }

  ctx.save();
  ctx.beginPath();
  ctx.arc(c, c, c * 0.86, 0, Math.PI * 2);
  ctx.clip();
  const g = ctx.createRadialGradient(c * 0.7, c * 0.65, 4, c, c, c * 0.9);
  g.addColorStop(0, light);
  g.addColorStop(0.55, mid);
  g.addColorStop(1, dark);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  if (p.bands) {
    for (let y = 30; y < size; y += 14 + rand() * 10) {
      ctx.fillStyle = `rgba(${rand() > 0.5 ? "255,255,255" : "80,40,10"},${0.08 + rand() * 0.12})`;
      ctx.fillRect(0, y, size, 4 + rand() * 8);
    }
  }
  if (p.earth) {
    ctx.fillStyle = "rgba(70,140,70,0.75)";
    [[90, 95, 38, 26], [150, 140, 30, 40], [110, 170, 22, 14], [70, 150, 16, 20]].forEach(([x, y, rx, ry]) => {
      ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let i = 0; i < 14; i++) {
      ctx.beginPath(); ctx.ellipse(rand() * size, rand() * size, 14 + rand() * 20, 4 + rand() * 4, rand(), 0, Math.PI * 2); ctx.fill();
    }
  }
  // night-side shading
  const shade = ctx.createLinearGradient(c * 0.4, c * 0.4, size, size);
  shade.addColorStop(0, "rgba(0,0,0,0)");
  shade.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  // atmosphere rim
  ctx.strokeStyle = "rgba(160,200,255,0.35)";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(c, c, c * 0.86, 0, Math.PI * 2); ctx.stroke();

  if (p.name === "Saturn") {
    ctx.strokeStyle = "rgba(230,210,160,0.85)";
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.ellipse(c, c, c * 0.98, c * 0.24, -0.35, 0.15, Math.PI - 0.15); ctx.stroke();
  }
}

/* ---------------- Render the card ---------------- */
const card = $("#planetCard");
const errorEl = $("#searchError");

function renderPlanet(p) {
  card.classList.remove("is-empty");
  card.innerHTML = `
    <div class="planet-art"><img src="${p.image}" alt="${p.name}" width="117" height="117"></div>
    <div class="card-head">
      <h2>${p.name}</h2>
      <p class="planet-type">${p.type}</p>
    </div>
    <p class="planet-desc">${p.description}</p>
    <dl class="stats">
      <div><dt>Gravity</dt><dd title="m/s²">${fmt(p.gravity)}</dd></div>
      <div><dt>Mass</dt><dd title="Jupiter masses">${fmt(p.mass)}</dd></div>
      <div><dt>Period</dt><dd title="Earth days">${fmt(p.period)}</dd></div>
    </dl>
    <ul class="facts">
      <li title="Mean temperature (K)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2a3.5 3.5 0 0 0-3.5 3.5v8.3a5.5 5.5 0 1 0 7 0V5.5A3.5 3.5 0 0 0 8 2Zm0 18.5a3.5 3.5 0 0 1-2-6.37l.5-.35V5.5a1.5 1.5 0 0 1 3 0v8.28l.5.35A3.5 3.5 0 0 1 8 20.5ZM9 15.17V9H7v6.17a2 2 0 1 0 2 0ZM18.5 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 4.4a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8Z"/></svg><span>${fmt(p.temperature)}</span></li>
      <li title="Number of moons"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.5 2.04A10 10 0 1 0 21.96 11.5a7.5 7.5 0 0 1-9.46-9.46Z"/></svg><span>${fmt(p.moons)}</span></li>
      <li title="Diameter (km)"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg><span>${fmt(p.diameter)}</span></li>
      <li title="Distance from the Sun (million km)"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 1 2.6 3.2 4.1-.6.6 4.1L23 9.5l-2.2 3.5L22.4 17l-4 1.1-1.1 4-3.9-1.6L12 23l-1.4-2.5-3.9 1.6-1.1-4-4-1.1 1.6-3.9L1 9.5l3.7-1.8.6-4.1 4.1.6L12 1Zm0 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" fill-rule="evenodd"/></svg><span>${fmt(p.distanceFromSun)}</span></li>
    </ul>`;
  const img = card.querySelector(".planet-art img");
  img.addEventListener("error", () => {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", p.name);
    img.replaceWith(canvas);
    paintPlanet(canvas, p);
  }, { once: true });
  errorEl.hidden = true;
  document.querySelectorAll(".planet-table tbody tr").forEach((tr) =>
    tr.classList.toggle("is-current", tr.dataset.planet === p.name));
}

function renderNoResults() {
  card.classList.add("is-empty");
  card.innerHTML = `
    <h2>No results found!</h2>
    <p>We couldn’t find any planet matching your search. Please double-check the name and try again.</p>`;
  errorEl.hidden = false;
}

/* ---------------- Search ---------------- */
const form = $("#searchForm");
const input = $("#searchInput");

function findPlanet(query) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  return PLANETS.find((p) => p.name.toLowerCase() === q)
      || PLANETS.find((p) => p.name.toLowerCase().startsWith(q));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!input.value.trim()) { input.focus(); return; }
  const p = findPlanet(input.value);
  p ? renderPlanet(p) : renderNoResults();
});
input.addEventListener("input", () => { errorEl.hidden = true; });

/* ---------------- Tables ---------------- */
const groups = [
  { key: "terrestrial", html: '<th scope="rowgroup" colspan="2" rowspan="4">Terrestrial<br>Planets</th>' },
  { key: "gas", html: '<th scope="rowgroup" rowspan="4">Jovian<br>Planets</th><th class="cat" rowspan="2">Gas Giants</th>' },
  { key: "ice", html: '<th class="cat" rowspan="2">Ice Giants</th>' },
  { key: "dwarf", html: '<th scope="rowgroup" colspan="2">Dwarf Planets</th>' },
];
async function init() {
  PLANETS = await loadPlanets();
  const tbody = $("#planetRows");
  tbody.innerHTML = PLANETS.map((p) => {
    const first = PLANETS.find((x) => x.group === p.group) === p;
    const lead = first ? groups.find((g) => g.key === p.group).html : "";
    return `<tr data-planet="${p.name}">${lead}
      <td class="name"><button type="button">${p.name}</button></td>
      <td class="col-mass">0.330</td>
      <td>4,878</td></tr>`;
  }).join("");
  tbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const p = PLANETS.find((x) => x.name === btn.textContent);
    input.value = p.name;
    renderPlanet(p);
    $("#top").scrollIntoView({ behavior: "smooth" });
  });

  renderPlanet(PLANETS.find((p) => p.name === "Earth") || PLANETS[0]);
}

init();
