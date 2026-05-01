/* ============================================================
   RYAN'S 90-DAY TRANSFORMATION — client-side logic
   ============================================================ */

/* ---------- CONSTANTS ---------- */
const STORAGE_KEY = 'r90d.v1';
const MACRO_TARGETS = { cal: 2150, prot: 170, carbs: 200, fat: 65 };
const MACRO_TARGETS_P3 = { cal: 2000, prot: 170, carbs: 180, fat: 60 };

const EX_PUSH = [
  { id: 'bench', name: 'Barbell Bench Press', sets: 3, reps: '8-10', start: '135-145 LB', note: 'Warm up shoulders first. Cable face pulls 1×15 before.' },
  { id: 'incline_db', name: 'Incline DB Press', sets: 3, reps: '10-12', start: '35-45 LB EACH' },
  { id: 'fly_low', name: 'Cable Fly Low→High', sets: 3, reps: '12-15', start: '35-40 LB' },
  { id: 'fly_high', name: 'Cable Fly High→Low', sets: 3, reps: '12-15', start: '45-50 LB' },
  { id: 'lat_raise', name: 'DB Lateral Raise', sets: 3, reps: '12-15', start: '15-20 LB' },
  { id: 'landmine', name: 'Landmine Press', sets: 3, reps: '10-12', start: '+25-40 LB', note: 'Shoulder-friendly. Control the eccentric.' },
  { id: 'pushdown', name: 'Tricep Rope Pushdown', sets: 3, reps: '12-15', start: 'MODERATE' },
  { id: 'dips', name: 'Weighted Dips', sets: 3, reps: '8-10', start: 'BW + 10-25 LB' },
];

const EX_PULL = [
  { id: 'lat_pd', name: 'Lat Pulldown — Wide Grip', sets: 4, reps: '10-12', start: 'BUILD UP' },
  { id: 'seated_row', name: 'Seated Cable Row', sets: 3, reps: '10-12', start: 'MODERATE' },
  { id: 'db_row', name: 'DB Single Arm Row', sets: 3, reps: '10-12', start: '45-55 LB' },
  { id: 'face_pull', name: 'Cable Face Pull', sets: 3, reps: '15', start: 'LIGHT-MOD', note: 'Also use as shoulder warm-up on push days.' },
  { id: 'ez_curl', name: 'EZ Bar Curl', sets: 3, reps: '10-12', start: 'MODERATE' },
  { id: 'hammer', name: 'Hammer Curl', sets: 3, reps: '10-12', start: '35-40 LB' },
  { id: 'cable_curl', name: 'Cable Curl — Supinated', sets: 2, reps: '12-15', start: 'LIGHT' },
];

const EX_LEGS = [
  { id: 'squat', name: 'Barbell Squat', sets: 4, reps: '8-10', start: '65-95 LB', note: 'Starting conservative — form over weight.' },
  { id: 'rdl', name: 'Romanian Deadlift', sets: 3, reps: '10-12', start: '75-115 LB' },
  { id: 'lunges', name: 'DB Walking Lunges', sets: 3, reps: '12 EACH', start: '20-30 LB EACH' },
  { id: 'leg_curl', name: 'Leg Curl (Cable + Ankle Cuff)', sets: 3, reps: '12-15', start: 'LIGHT BUILD' },
  { id: 'goblet', name: 'Goblet Squat', sets: 2, reps: '15-20', start: '35-45 LB DB' },
  { id: 'calf', name: 'Calf Raises — Weighted', sets: 4, reps: '15-20', start: 'MODERATE' },
];

const MEALS = [
  {
    id: 1,
    time: '7:00–8:00 AM',
    name: 'High-Protein Breakfast',
    options: '4–5 whole eggs scrambled or fried + 1–2 strips turkey or regular bacon. Optional: 1 cup oatmeal with honey if training in the morning.',
    p: 40, c: 25, f: 22, cal: 450,
  },
  {
    id: 2,
    time: '12:00 PM',
    name: 'Lunch',
    options: '6–8 oz of one: grilled chicken breast, ground turkey, or 93/7 ground beef. + 1 cup white rice or 1 medium potato. + steamed broccoli or green beans (unlimited).',
    p: 55, c: 60, f: 10, cal: 550,
  },
  {
    id: 3,
    time: '3:30 PM',
    name: 'Pre/Post Workout Snack',
    options: 'Whey isolate shake (~25g protein) + 1 banana or rice cake. OR 4–6 oz deli turkey slices.',
    p: 30, c: 25, f: 2, cal: 240,
  },
  {
    id: 4,
    time: '7:00 PM',
    name: 'Dinner',
    options: '8 oz of one: steak, salmon, ground beef, pork, or chicken thighs. + asparagus, broccoli, or green beans. Lower carb at dinner — no rice or potato.',
    p: 55, c: 10, f: 22, cal: 460,
  },
  {
    id: 5,
    time: '9:30 PM',
    name: 'Optional Late Snack',
    options: 'Casein protein shake. OR 4–6 oz shrimp or tuna.',
    p: 28, c: 5, f: 2, cal: 150,
    optional: true,
  },
];

const EX_CORE = [
  { id: 'plank', name: 'Plank', sets: 3, reps: '45-60s', start: 'BW' },
  { id: 'woodchop', name: 'Cable Woodchop High→Low', sets: 3, reps: '12 EACH', start: 'LIGHT-MOD' },
  { id: 'hkr', name: 'Hanging Knee Raises', sets: 3, reps: '15-20', start: 'BW' },
  { id: 'dead_bug', name: 'Dead Bug', sets: 3, reps: '10 EACH', start: 'BW' },
];

// Day-of-week → split key. 0=Sun, 1=Mon, ...
const SPLIT_BY_DOW = {
  0: { key: 'rest', label: 'REST DAY', color: 'c-rest', ex: [], restSub: 'Full recovery day.' },
  1: { key: 'push', label: 'PUSH', color: 'c-push', ex: EX_PUSH },
  2: { key: 'pull', label: 'PULL', color: 'c-pull', ex: EX_PULL },
  3: { key: 'active', label: 'ACTIVE REST', color: 'c-rest', ex: [], restSub: 'Walk 20-30 minutes. Light mobility.' },
  4: { key: 'legs', label: 'LEGS', color: 'c-legs', ex: EX_LEGS },
  5: { key: 'push', label: 'PUSH', color: 'c-push', ex: EX_PUSH },
  6: { key: 'pull+core', label: 'PULL + CORE', color: 'c-pull', ex: [...EX_PULL, ...EX_CORE] },
};

/* ---------- STATE ---------- */
let state = {
  startDate: null,        // ISO yyyy-mm-dd
  startWeight: null,      // lb
  workouts: {},           // { "1": { "bench": { sets: [{w,r},...] } } }
  nutrition: {},          // { "1": [ {id, name, brand, grams, cal, p, c, f, ts} ] }
  weights: [],            // [ { day, date, lb } ]
  habits: {},             // { "1": { walk: bool, steps: num, water: bool, supps: bool } }
  meals: {},              // { "1": { 1: true, 2: false, ... } }
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch (e) { console.warn('load failed', e); }
}
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ---------- DATE / DAY MATH ---------- */
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function currentDayNum() {
  if (!state.startDate) return 0;
  const start = new Date(state.startDate + 'T00:00:00');
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((today - start) / 86400000);
  return diff + 1;
}
function dowForDay(dayNum) {
  if (!state.startDate || dayNum < 1) return new Date().getDay();
  const start = new Date(state.startDate + 'T00:00:00');
  const d = new Date(start.getTime() + (dayNum - 1) * 86400000);
  return d.getDay();
}
function phaseForDay(dayNum) {
  if (dayNum <= 28) return 1;
  if (dayNum <= 56) return 2;
  return 3;
}
function weekForDay(dayNum) {
  return Math.max(1, Math.ceil(dayNum / 7));
}
function formatDate(d) {
  const opts = { weekday: 'short', month: 'short', day: 'numeric' };
  return new Date(d).toLocaleDateString('en-US', opts).toUpperCase();
}

/* ---------- DOM HELPERS ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 1800);
}

/* ---------- ONBOARDING ---------- */
function initOnboarding() {
  const today = todayISO();
  $('#startDate').value = today;
  $('#onboardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sd = $('#startDate').value;
    const sw = parseFloat($('#startWeight').value);
    if (!sd || !sw) return;
    state.startDate = sd;
    state.startWeight = sw;
    // seed first weight entry on day 1
    state.weights = [{ day: 1, date: sd, lb: sw }];
    save();
    showApp();
  });
}

function showApp() {
  $('#onboarding').classList.add('hidden');
  $('#app').classList.remove('hidden');
  renderAll();
}

/* ---------- VIEW SWITCHING ---------- */
function switchView(view) {
  $$('.view').forEach(v => v.classList.remove('active'));
  $(`#view-${view}`).classList.add('active');
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  window.scrollTo(0, 0);
  if (view === 'progress') renderProgress();
  if (view === 'dash') renderDashboard();
  if (view === 'meals') renderMeals();
}

/* ---------- HEADER ---------- */
function renderHeader() {
  const day = currentDayNum();
  const phase = phaseForDay(day);
  $('#dayPill').textContent = day >= 1 && day <= 90 ? `DAY ${day}` : (day < 1 ? 'PRE' : 'DONE');
  $('#phasePill').textContent = `PHASE ${phase}`;
  $('#dateLabel').textContent = formatDate(new Date());
}

/* ---------- TODAY VIEW ---------- */
function renderToday() {
  const day = currentDayNum();
  const dow = dowForDay(day);
  const split = SPLIT_BY_DOW[dow];

  // hero
  $('#todaySplit').textContent = split.label;
  $('#todaySplit').className = `today-split ${split.color}`;

  // progress ring
  const clamped = Math.max(0, Math.min(90, day));
  const pct = clamped / 90;
  const circumference = 2 * Math.PI * 52;
  $('#dayRing').style.strokeDashoffset = String(circumference * (1 - pct));
  $('#dayRingNum').textContent = clamped;

  // workout list
  const listEl = $('#workoutList');
  const emptyEl = $('#workoutEmpty');
  const completeEl = $('#workoutComplete');
  listEl.innerHTML = '';
  emptyEl.classList.add('hidden');
  completeEl.classList.add('hidden');

  if (!split.ex.length) {
    emptyEl.classList.remove('hidden');
    $('#restSub').textContent = split.restSub || 'Rest.';
    return;
  }

  const dayKey = String(day);
  const log = state.workouts[dayKey] || {};

  let allDone = true;
  split.ex.forEach(ex => {
    const exLog = log[ex.id] || { sets: [] };
    const completeSets = exLog.sets.filter(Boolean).length;
    const isDone = completeSets >= ex.sets;
    if (!isDone) allDone = false;

    const card = document.createElement('div');
    card.className = 'ex-card' + (isDone ? ' done' : '');
    card.innerHTML = `
      <div class="ex-head">
        <div>
          <div class="ex-name">${ex.name}</div>
          <div class="ex-target">${ex.sets} × ${ex.reps}</div>
          <div class="ex-start">START: ${ex.start}</div>
        </div>
      </div>
      ${ex.note ? `<div class="ex-note">${ex.note}</div>` : ''}
      <div class="ex-sets"></div>
    `;
    const setsWrap = card.querySelector('.ex-sets');
    for (let i = 0; i < ex.sets; i++) {
      const s = exLog.sets[i];
      const setEl = document.createElement('button');
      setEl.className = 'ex-set' + (s ? ' done' : '');
      setEl.innerHTML = s
        ? `<div class="set-idx">SET ${i+1}</div><div class="set-val">${s.w} LB</div><div class="set-reps">× ${s.r}</div>`
        : `<div class="set-idx">SET ${i+1}</div><div class="set-val">LOG</div><div class="set-reps">—</div>`;
      setEl.addEventListener('click', () => openSetModal(ex, i));
      setsWrap.appendChild(setEl);
    }
    listEl.appendChild(card);
  });

  if (allDone) completeEl.classList.remove('hidden');
}

/* ---------- SET LOG MODAL ---------- */
let setModalCtx = null;
function openSetModal(ex, setIdx) {
  setModalCtx = { ex, setIdx };
  $('#setModalTitle').textContent = ex.name.toUpperCase();
  $('#setModalSub').textContent = `SET ${setIdx + 1} OF ${ex.sets} · TARGET ${ex.reps}`;
  const day = String(currentDayNum());
  const existing = state.workouts[day]?.[ex.id]?.sets[setIdx];
  // default: existing value, else previous set of this exercise today, else empty
  const prev = state.workouts[day]?.[ex.id]?.sets.filter(Boolean).slice(-1)[0];
  $('#setWeight').value = existing?.w ?? prev?.w ?? '';
  $('#setReps').value = existing?.r ?? '';
  $('#setModal').classList.remove('hidden');
  setTimeout(() => $('#setWeight').focus(), 100);
}
function confirmSet() {
  if (!setModalCtx) return;
  const w = parseFloat($('#setWeight').value);
  const r = parseInt($('#setReps').value, 10);
  if (isNaN(w) || isNaN(r) || w < 0 || r < 0) { toast('ENTER VALID NUMBERS'); return; }
  const day = String(currentDayNum());
  if (!state.workouts[day]) state.workouts[day] = {};
  if (!state.workouts[day][setModalCtx.ex.id]) state.workouts[day][setModalCtx.ex.id] = { sets: [] };
  state.workouts[day][setModalCtx.ex.id].sets[setModalCtx.setIdx] = { w, r };
  save();
  $('#setModal').classList.add('hidden');
  renderToday();
  toast('SET LOGGED');
}

/* ---------- NUTRITION ---------- */
function currentMacroTargets() {
  const day = currentDayNum();
  return phaseForDay(day) === 3 ? MACRO_TARGETS_P3 : MACRO_TARGETS;
}
function renderNutrition() {
  const day = String(currentDayNum());
  const log = state.nutrition[day] || [];
  const totals = log.reduce((a, f) => ({
    cal: a.cal + (f.cal || 0),
    p: a.p + (f.p || 0),
    c: a.c + (f.c || 0),
    f: a.f + (f.f || 0),
  }), { cal: 0, p: 0, c: 0, f: 0 });

  const t = currentMacroTargets();
  $('#calVal').textContent = Math.round(totals.cal);
  $('#protVal').textContent = Math.round(totals.p);
  $('#carbVal').textContent = Math.round(totals.c);
  $('#fatVal').textContent = Math.round(totals.f);
  $('.macro-card.macro-cal .macro-target').textContent = `/ ${t.cal}`;
  $('#calBar').style.width = Math.min(100, (totals.cal / t.cal) * 100) + '%';
  $('#protBar').style.width = Math.min(100, (totals.p / t.prot) * 100) + '%';
  $('#carbBar').style.width = Math.min(100, (totals.c / t.carbs) * 100) + '%';
  $('#fatBar').style.width = Math.min(100, (totals.f / t.fat) * 100) + '%';

  const logEl = $('#foodLog');
  const emptyEl = $('#foodLogEmpty');
  logEl.innerHTML = '';
  if (!log.length) {
    emptyEl.classList.remove('hidden');
  } else {
    emptyEl.classList.add('hidden');
    [...log].reverse().forEach((f, idx) => {
      const realIdx = log.length - 1 - idx;
      const el = document.createElement('div');
      el.className = 'food-item';
      const qtyLabel = f.servings != null
        ? `${formatQty(f.servings)} × ${escapeHtml(f.servingLabel || (Math.round(f.grams) + ' G'))}`
        : `${Math.round(f.grams)} G`;
      el.innerHTML = `
        <div class="fi-info">
          <div class="fi-name">${escapeHtml(f.name)}</div>
          <div class="fi-meta">${qtyLabel} · P ${Math.round(f.p)} · C ${Math.round(f.c)} · F ${Math.round(f.f)}</div>
        </div>
        <div class="fi-cal">${Math.round(f.cal)}</div>
        <button class="fi-delete" aria-label="Delete">×</button>
      `;
      el.querySelector('.fi-delete').addEventListener('click', () => {
        state.nutrition[day].splice(realIdx, 1);
        if (!state.nutrition[day].length) delete state.nutrition[day];
        save();
        renderNutrition();
        toast('REMOVED');
      });
      logEl.appendChild(el);
    });
  }
}
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function formatQty(n) {
  // Render servings count without trailing .0 — "1", "0.5", "1.5", "2".
  if (n == null || isNaN(n)) return '';
  return Math.abs(n - Math.round(n)) < 0.001 ? String(Math.round(n)) : String(parseFloat(n.toFixed(2)));
}

/* ---------- FOOD SEARCH (Open Food Facts) ---------- */
let searchAbort = null;
let searchDebounce = null;
function openSearch() {
  $('#foodModal').classList.remove('hidden');
  $('#foodSearch').value = '';
  $('#searchResults').innerHTML = '<div class="search-status">Type to search…</div>';
  setTimeout(() => $('#foodSearch').focus(), 100);
}
function closeSearch() { $('#foodModal').classList.add('hidden'); }

function wait(ms, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    if (signal) signal.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('aborted', 'AbortError')); });
  });
}

// USDA FoodData Central. Public client-side key, rate-limited per key.
const USDA_API_KEY = 'PCFmUIp9gVct8TiFTEbkX4kDUgb8L4jNav7xSPQN';
// USDA reports nutrient values per 100 g across all dataTypes (Foundation,
// SR Legacy, Survey/FNDDS, Branded). nutrientId mapping:
//   1008 Energy (KCAL)  ·  1003 Protein (G)  ·  1005 Carbohydrate, by difference (G)  ·  1004 Total lipid/fat (G)
const USDA_NUTRIENT_MAP = { 1008: 'cal', 1003: 'p', 1005: 'c', 1004: 'f' };

function extractUSDAMacrosPer100g(food) {
  const out = { cal: 0, p: 0, c: 0, f: 0 };
  for (const n of (food && food.foodNutrients) || []) {
    const k = USDA_NUTRIENT_MAP[n.nutrientId];
    if (k && typeof n.value === 'number' && !isNaN(n.value)) out[k] = n.value;
  }
  return out;
}

async function fetchWithRetry(url, signal, attempts = 3) {
  // No custom headers — keep it a CORS simple request, no preflight.
  let lastErr = null;
  for (let i = 0; i < attempts; i++) {
    try {
      const resp = await fetch(url, { signal });
      if (resp.status >= 500 || resp.status === 429) {
        lastErr = new Error(`HTTP ${resp.status}`);
        await wait(250 * (i + 1), signal);
        continue;
      }
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (e) {
      if (e.name === 'AbortError') throw e;
      lastErr = e;
      if (i < attempts - 1) await wait(250 * (i + 1), signal);
    }
  }
  throw lastErr || new Error('request failed');
}

async function doSearch(q) {
  if (!q || q.trim().length < 2) {
    $('#searchResults').innerHTML = '<div class="search-status">Keep typing…</div>';
    return;
  }
  if (searchAbort) searchAbort.abort();
  searchAbort = new AbortController();
  const signal = searchAbort.signal;
  $('#searchResults').innerHTML = '<div class="search-status">Searching…</div>';

  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(q)}&api_key=${USDA_API_KEY}&pageSize=20`;
  try {
    const data = await fetchWithRetry(url, signal, 3);
    renderResults(data.foods || []);
  } catch (e) {
    if (e.name === 'AbortError') return;
    console.error('[search] USDA request failed:', e);
    $('#searchResults').innerHTML = `<div class="search-status">USDA FoodData Central is unavailable right now.<br/>Try again in a minute. (${escapeHtml(e?.message || 'network error')})</div>`;
  }
}

function renderResults(foods) {
  const resEl = $('#searchResults');
  resEl.innerHTML = '';
  const enriched = (foods || [])
    .map(f => ({ ...f, _macros: extractUSDAMacrosPer100g(f) }))
    .filter(f => f.description && f._macros.cal > 0);

  if (!enriched.length) {
    resEl.innerHTML = '<div class="search-status">No results with nutrition data.<br/>Try a more specific term.</div>';
    return;
  }
  enriched.forEach(f => {
    const kcal = Math.round(f._macros.cal);
    // Show brand for Branded foods, else dataType (e.g. "Foundation", "FNDDS")
    const subline = f.dataType === 'Branded'
      ? (f.brandName || f.brandOwner || 'BRANDED')
      : (f.dataType === 'Survey (FNDDS)' ? 'GENERIC' : (f.dataType || 'GENERIC').toUpperCase());
    const btn = document.createElement('button');
    btn.className = 'result-item';
    btn.innerHTML = `
      <div class="ri-info">
        <div class="ri-name">${escapeHtml(f.description)}</div>
        <div class="ri-brand">${escapeHtml(subline)} · /100G</div>
      </div>
      <div class="ri-cal">${kcal}</div>
    `;
    btn.addEventListener('click', () => openServing(f));
    resEl.appendChild(btn);
  });
}

/* ---------- SERVING MODAL ---------- */
let servingProduct = null;
let servingInfo = null; // { gramsPerServing, label }

// Determine what "1 serving" is for a USDA food.
// Returns { gramsPerServing, label } where label is what to show the user.
//   - Branded foods usually have servingSize (g) + householdServingFullText
//     ("1 LARGE", "2 TBSP"). Combine them.
//   - FNDDS / Foundation / SR Legacy entries often lack servingSize on the
//     search response; fall back to "100 G" since that's USDA's nutrient basis.
function getServingInfo(food) {
  const num = v => (typeof v === 'number' && !isNaN(v)) ? v : (v != null && !isNaN(parseFloat(v)) ? parseFloat(v) : null);
  const ssRaw = num(food.servingSize);
  const unit = String(food.servingSizeUnit || '').toLowerCase();
  const isGramUnit = ['g', 'grm', 'gram', 'grams'].includes(unit);
  const hh = (food.householdServingFullText || '').trim();

  if (ssRaw && isGramUnit) {
    const g = ssRaw;
    const gStr = (g % 1 === 0 ? g : g.toFixed(1)) + ' G';
    const label = hh ? `${hh.toUpperCase()} (${gStr})` : gStr;
    return { gramsPerServing: g, label };
  }

  // No usable serving size — default to USDA's per-100g reporting basis.
  const label = hh ? `${hh.toUpperCase()} · 100 G` : '100 G (USDA REFERENCE)';
  return { gramsPerServing: 100, label };
}

function openServing(food) {
  servingProduct = food;
  servingInfo = getServingInfo(food);

  $('#servingTitle').textContent = (food.description || 'FOOD').toUpperCase().slice(0, 28);
  const brandLine = food.dataType === 'Branded'
    ? (food.brandName || food.brandOwner || 'BRANDED')
    : (food.dataType === 'Survey (FNDDS)' ? 'GENERIC' : (food.dataType || 'GENERIC').toUpperCase());
  $('#servingPreview').innerHTML = `
    <div class="sp-name">${escapeHtml(food.description)}</div>
    <div class="sp-meta">${escapeHtml(brandLine)}</div>
  `;
  $('#servingRef').textContent = servingInfo.label;

  // Per-serving macros (one serving = gramsPerServing × per-100g)
  const per = computeMacrosForGrams(food, servingInfo.gramsPerServing);
  $('#perServing').innerHTML = `
    <span class="per-serving-label">PER SERVING:</span>
    <span class="per-serving-vals">
      <strong>${Math.round(per.cal)}</strong> CAL ·
      <strong>${Math.round(per.p)}</strong> P ·
      <strong>${Math.round(per.c)}</strong> C ·
      <strong>${Math.round(per.f)}</strong> F
    </span>
  `;

  $('#servingQty').value = '1';
  updateServingMacros();
  $('#foodModal').classList.add('hidden');
  $('#servingModal').classList.remove('hidden');
}

function computeMacrosForGrams(food, grams) {
  const per100 = extractUSDAMacrosPer100g(food);
  const scale = grams / 100;
  return {
    cal: per100.cal * scale,
    p: per100.p * scale,
    c: per100.c * scale,
    f: per100.f * scale,
  };
}

function currentServingQty() {
  const v = parseFloat($('#servingQty').value);
  return (isFinite(v) && v > 0) ? v : 0;
}

function updateServingMacros() {
  if (!servingProduct || !servingInfo) return;
  const qty = currentServingQty();
  const totalGrams = qty * servingInfo.gramsPerServing;
  const m = computeMacrosForGrams(servingProduct, totalGrams);
  $('#servingMacros').innerHTML = `
    <div class="sm-item"><div class="sm-val">${Math.round(m.cal)}</div><div class="sm-lbl">CAL</div></div>
    <div class="sm-item"><div class="sm-val">${Math.round(m.p)}</div><div class="sm-lbl">PROT</div></div>
    <div class="sm-item"><div class="sm-val">${Math.round(m.c)}</div><div class="sm-lbl">CARB</div></div>
    <div class="sm-item"><div class="sm-val">${Math.round(m.f)}</div><div class="sm-lbl">FAT</div></div>
  `;
}

function confirmServing() {
  if (!servingProduct || !servingInfo) return;
  const qty = currentServingQty();
  if (!qty) { toast('ENTER A QUANTITY'); return; }
  const totalGrams = qty * servingInfo.gramsPerServing;
  const m = computeMacrosForGrams(servingProduct, totalGrams);
  const day = String(currentDayNum());
  if (!state.nutrition[day]) state.nutrition[day] = [];
  const brand = servingProduct.dataType === 'Branded'
    ? (servingProduct.brandName || servingProduct.brandOwner || '')
    : '';
  state.nutrition[day].push({
    id: servingProduct.fdcId || Date.now(),
    name: servingProduct.description,
    brand,
    grams: totalGrams,
    servings: qty,
    servingLabel: servingInfo.label,
    cal: m.cal, p: m.p, c: m.c, f: m.f,
    ts: Date.now(),
  });
  save();
  $('#servingModal').classList.add('hidden');
  servingProduct = null;
  servingInfo = null;
  renderNutrition();
  toast('FOOD LOGGED');
}

/* ---------- PROGRESS VIEW ---------- */
function renderProgress() {
  const weights = state.weights.slice().sort((a, b) => a.day - b.day);
  const baseline = weights[0]?.lb ?? state.startWeight;
  const current = weights[weights.length - 1]?.lb ?? baseline;
  const change = current - baseline;
  const recent = weights.slice(-7);
  const avg = recent.length ? recent.reduce((s, w) => s + w.lb, 0) / recent.length : 0;

  $('#baselineWeight').textContent = baseline?.toFixed(1) ?? '—';
  $('#currentWeight').textContent = current?.toFixed(1) ?? '—';
  const changeEl = $('#weightChange');
  changeEl.textContent = (change >= 0 ? '+' : '') + change.toFixed(1);
  changeEl.classList.toggle('neg', change < 0);
  changeEl.classList.toggle('pos', change > 0);
  $('#weightAvg').textContent = avg ? avg.toFixed(1) : '—';
  $('#chartSub').textContent = `${weights.length} ENTR${weights.length === 1 ? 'Y' : 'IES'}`;

  renderChart(weights);

  const listEl = $('#weightList');
  listEl.innerHTML = '';
  [...weights].reverse().forEach(w => {
    const row = document.createElement('div');
    row.className = 'weight-row';
    row.innerHTML = `
      <div><div class="wr-day">DAY ${w.day}</div></div>
      <div class="wr-val">${w.lb.toFixed(1)}<span class="sc-sub">LB</span></div>
    `;
    listEl.appendChild(row);
  });
}
function renderChart(weights) {
  const wrap = $('#chartWrap');
  wrap.innerHTML = '';
  if (weights.length < 2) {
    wrap.innerHTML = '<div class="chart-empty">Log 2+ weights to see a trend.</div>';
    return;
  }
  const W = wrap.clientWidth || 300;
  const H = 180;
  const pad = { t: 14, r: 14, b: 24, l: 34 };
  const days = weights.map(w => w.day);
  const lbs = weights.map(w => w.lb);
  const minD = Math.min(...days), maxD = Math.max(1, ...days);
  const minL = Math.min(...lbs) - 1, maxL = Math.max(...lbs) + 1;
  const xFor = d => pad.l + ((d - minD) / Math.max(1, (maxD - minD))) * (W - pad.l - pad.r);
  const yFor = v => pad.t + (1 - (v - minL) / Math.max(0.01, (maxL - minL))) * (H - pad.t - pad.b);

  const pts = weights.map(w => `${xFor(w.day)},${yFor(w.lb)}`).join(' ');
  const areaPts = `${xFor(weights[0].day)},${H - pad.b} ${pts} ${xFor(weights[weights.length-1].day)},${H - pad.b}`;

  const yTicks = 4;
  let grid = '';
  for (let i = 0; i <= yTicks; i++) {
    const y = pad.t + (i / yTicks) * (H - pad.t - pad.b);
    const v = maxL - (i / yTicks) * (maxL - minL);
    grid += `<line x1="${pad.l}" y1="${y}" x2="${W - pad.r}" y2="${y}" stroke="#222" stroke-width="1"/>`;
    grid += `<text x="${pad.l - 6}" y="${y + 3}" fill="#555" font-size="9" font-family="DM Mono,monospace" text-anchor="end">${v.toFixed(1)}</text>`;
  }

  let circles = '';
  weights.forEach(w => {
    circles += `<circle cx="${xFor(w.day)}" cy="${yFor(w.lb)}" r="3" fill="#d4ff00" />`;
  });
  // x labels: start and end
  const xLabels = `
    <text x="${xFor(minD)}" y="${H - 6}" fill="#555" font-size="9" font-family="DM Mono,monospace" text-anchor="start">D${minD}</text>
    <text x="${xFor(maxD)}" y="${H - 6}" fill="#555" font-size="9" font-family="DM Mono,monospace" text-anchor="end">D${maxD}</text>
  `;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      ${grid}
      <polygon points="${areaPts}" fill="url(#chartFill)" opacity="0.25" />
      <polyline points="${pts}" fill="none" stroke="#d4ff00" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${circles}
      ${xLabels}
      <defs>
        <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#d4ff00" stop-opacity="0.5"/>
          <stop offset="100%" stop-color="#d4ff00" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  `;
}

/* ---------- WEIGHT LOG ---------- */
function openWeightLog() {
  const last = state.weights[state.weights.length - 1];
  $('#weightInput').value = last ? last.lb : state.startWeight ?? '';
  $('#weightModal').classList.remove('hidden');
  setTimeout(() => $('#weightInput').focus(), 100);
}
function confirmWeight() {
  const lb = parseFloat($('#weightInput').value);
  if (!lb || lb < 60 || lb > 600) { toast('ENTER VALID WEIGHT'); return; }
  const day = currentDayNum();
  const date = todayISO();
  // one entry per day — replace today's if exists
  const existingIdx = state.weights.findIndex(w => w.day === day);
  if (existingIdx >= 0) state.weights[existingIdx] = { day, date, lb };
  else state.weights.push({ day, date, lb });
  save();
  $('#weightModal').classList.add('hidden');
  renderProgress();
  toast('WEIGHT LOGGED');
}

/* ---------- DASHBOARD ---------- */
function renderDashboard() {
  const day = currentDayNum();
  const phase = phaseForDay(day);
  const week = Math.min(13, weekForDay(day));
  const phaseCard = $('#phaseCard');
  phaseCard.classList.remove('p1', 'p2', 'p3');
  phaseCard.classList.add(`p${phase}`);

  const phaseMeta = {
    1: { name: 'FOUNDATION', desc: 'Establish form, moderate weight, build habit. Focus on consistency — every workout, every macro target.', range: [1, 28], weeks: [1, 4] },
    2: { name: 'ACCELERATE', desc: 'Progressive overload. Slight volume increase. Add one HIIT session this week. Push the weights up.', range: [29, 56], weeks: [5, 8] },
    3: { name: 'PEAK', desc: 'Drop sets and supersets on select lifts. Peak cardio. Calories tighten to ~2000. Finish strong.', range: [57, 90], weeks: [9, 13] },
  };
  const pm = phaseMeta[phase];
  $('#phaseTag').textContent = `PHASE ${phase}`;
  $('#phaseName').textContent = pm.name;
  $('#phaseDesc').textContent = pm.desc;
  const phasePct = Math.min(100, Math.max(0, ((day - pm.range[0]) / (pm.range[1] - pm.range[0])) * 100));
  $('#phaseFill').style.width = phasePct + '%';
  $('#phaseProgLbl').textContent = `WEEK ${Math.min(week, pm.weeks[1])} OF ${pm.weeks[1]} · DAY ${day}`;

  renderSuggestions(day, phase, week);
  renderWeeklySummary(day);
}

function renderSuggestions(day, phase, week) {
  const sEl = $('#suggestions');
  sEl.innerHTML = '';
  const items = [];

  // Phase transition alert
  if (day === 28 || day === 29) items.push({ type: 'info', tag: 'PHASE SHIFT', text: `You're entering Phase 2 — Accelerate. Intensity increases. Push the weights.` });
  if (day === 56 || day === 57) items.push({ type: 'info', tag: 'PHASE SHIFT', text: `You're entering Phase 3 — Peak. Drop sets, supersets, tighter calories.` });
  if (day >= 85 && day <= 90) items.push({ type: '', tag: 'HOME STRETCH', text: `Day ${day} of 90. Lock in. Finish exactly how you started — disciplined.` });

  // Plateau detection: same weight on an exercise across 2+ weeks
  const plateauExercises = detectPlateaus(day);
  plateauExercises.slice(0, 2).forEach(ex => {
    items.push({ type: '', tag: 'PROGRESS', text: `Time to add weight on ${ex.name} — you've been steady for 2+ weeks.` });
  });

  // Weekly protein average
  const weekMacros = weekMacroAverages(day);
  if (weekMacros.days >= 3 && weekMacros.avgProtein < 150) {
    items.push({ type: 'warn', tag: 'MACRO', text: `You're averaging ${Math.round(weekMacros.avgProtein)}g protein this week. Target is 170g — eat more.` });
  }

  // No weight logged in 8+ days
  const lastWeight = state.weights[state.weights.length - 1];
  if (lastWeight && (day - lastWeight.day) >= 8) {
    items.push({ type: 'warn', tag: 'CHECK-IN', text: `No weight log in ${day - lastWeight.day} days. Log a weight on the Progress tab.` });
  }

  // Missed workout yesterday
  const yesterday = day - 1;
  if (yesterday >= 1) {
    const ydow = dowForDay(yesterday);
    const ysplit = SPLIT_BY_DOW[ydow];
    if (ysplit.ex.length) {
      const ylog = state.workouts[String(yesterday)] || {};
      const loggedCount = Object.values(ylog).reduce((n, ex) => n + (ex.sets.filter(Boolean).length > 0 ? 1 : 0), 0);
      if (loggedCount === 0) {
        items.push({ type: 'warn', tag: 'MISSED', text: `Yesterday's ${ysplit.label} session wasn't logged. Get back on it today.` });
      }
    }
  }

  if (!items.length) {
    items.push({ type: '', tag: 'ON TRACK', text: `You're on track. Stay consistent — the discipline compounds.` });
  }

  items.forEach(it => {
    const el = document.createElement('div');
    el.className = 'suggestion' + (it.type ? ' ' + it.type : '');
    el.innerHTML = `<div class="sugg-tag">${it.tag}</div><div class="sugg-text">${escapeHtml(it.text)}</div>`;
    sEl.appendChild(el);
  });
}

function detectPlateaus(currentDay) {
  // For each exercise, collect heaviest weight used per week for recent 2+ weeks
  const byExercise = {};
  for (let d = Math.max(1, currentDay - 21); d <= currentDay; d++) {
    const log = state.workouts[String(d)];
    if (!log) continue;
    const week = weekForDay(d);
    Object.entries(log).forEach(([exId, exLog]) => {
      const heaviest = Math.max(0, ...exLog.sets.filter(Boolean).map(s => s.w));
      if (!heaviest) return;
      if (!byExercise[exId]) byExercise[exId] = {};
      byExercise[exId][week] = Math.max(byExercise[exId][week] || 0, heaviest);
    });
  }
  const plateaus = [];
  const allEx = [...EX_PUSH, ...EX_PULL, ...EX_LEGS];
  Object.entries(byExercise).forEach(([exId, weekMap]) => {
    const weeks = Object.keys(weekMap).map(Number).sort((a, b) => a - b);
    if (weeks.length < 2) return;
    const last = weekMap[weeks[weeks.length - 1]];
    const prev = weekMap[weeks[weeks.length - 2]];
    if (last === prev && last > 0) {
      const ex = allEx.find(e => e.id === exId);
      if (ex) plateaus.push(ex);
    }
  });
  return plateaus;
}

function weekMacroAverages(currentDay) {
  const weekStart = Math.max(1, currentDay - 6);
  let totals = { cal: 0, p: 0 };
  let daysWithLog = 0;
  for (let d = weekStart; d <= currentDay; d++) {
    const log = state.nutrition[String(d)];
    if (log && log.length) {
      daysWithLog++;
      log.forEach(f => { totals.cal += f.cal || 0; totals.p += f.p || 0; });
    }
  }
  return {
    days: daysWithLog,
    avgCal: daysWithLog ? totals.cal / daysWithLog : 0,
    avgProtein: daysWithLog ? totals.p / daysWithLog : 0,
  };
}

function renderWeeklySummary(currentDay) {
  const weekStart = Math.max(1, currentDay - 6);
  let workoutsDone = 0;
  for (let d = weekStart; d <= currentDay; d++) {
    const log = state.workouts[String(d)] || {};
    // consider a workout "done" if any exercise has at least one logged set
    const hasAny = Object.values(log).some(ex => ex.sets.filter(Boolean).length > 0);
    if (hasAny) workoutsDone++;
  }
  const wm = weekMacroAverages(currentDay);

  // weight change this week
  const weekWeights = state.weights.filter(w => w.day >= weekStart && w.day <= currentDay);
  let deltaTxt = '—';
  if (weekWeights.length >= 2) {
    const d = weekWeights[weekWeights.length - 1].lb - weekWeights[0].lb;
    deltaTxt = (d >= 0 ? '+' : '') + d.toFixed(1);
  } else if (weekWeights.length === 1 && state.weights.length >= 2) {
    const prior = state.weights.filter(w => w.day < weekStart).slice(-1)[0];
    if (prior) {
      const d = weekWeights[0].lb - prior.lb;
      deltaTxt = (d >= 0 ? '+' : '') + d.toFixed(1);
    }
  }

  // habits completion for the week
  let habitCompleted = 0, habitDays = 0, stepsSum = 0, stepsDays = 0;
  for (let d = weekStart; d <= currentDay; d++) {
    const h = state.habits[String(d)];
    if (h) {
      habitCompleted += habitDayComplete(h);
      habitDays++;
      if ((h.steps || 0) > 0) { stepsSum += h.steps; stepsDays++; }
    }
  }
  const habitPossible = habitDays * 4;
  const habitPct = habitPossible ? Math.round((habitCompleted / habitPossible) * 100) : null;
  const avgSteps = stepsDays ? Math.round(stepsSum / stepsDays) : null;

  $('#sumWorkouts').innerHTML = `${workoutsDone}<span class="sc-sub">/5</span>`;
  $('#sumProtein').innerHTML = wm.days ? `${Math.round(wm.avgProtein)}<span class="sc-sub">G</span>` : `—<span class="sc-sub">G</span>`;
  $('#sumCal').textContent = wm.days ? Math.round(wm.avgCal) : '—';
  $('#sumWeight').innerHTML = `${deltaTxt}<span class="sc-sub">LB</span>`;
  $('#sumHabits').innerHTML = habitPct === null ? `—<span class="sc-sub">%</span>` : `${habitPct}<span class="sc-sub">%</span>`;
  $('#sumSteps').textContent = avgSteps === null ? '—' : avgSteps.toLocaleString();
}

/* ---------- MEAL PLAN ---------- */
function getMealsForDay(dayNum) {
  return state.meals[String(dayNum)] || {};
}
function toggleMeal(id) {
  const dayKey = String(currentDayNum());
  if (!state.meals[dayKey]) state.meals[dayKey] = {};
  state.meals[dayKey][id] = !state.meals[dayKey][id];
  save();
  renderMeals();
}
function goToNutritionAndSearch() {
  switchView('today');
  $$('.tab').forEach(x => x.classList.toggle('active', x.dataset.tab === 'nutrition'));
  $$('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === 'nutrition'));
  setTimeout(openSearch, 160);
}
function renderMeals() {
  const listEl = $('#mealsList');
  const done = getMealsForDay(currentDayNum());
  listEl.innerHTML = '';
  let doneCount = 0;
  MEALS.forEach(m => {
    const isDone = !!done[m.id];
    if (isDone) doneCount++;
    const card = document.createElement('div');
    card.className = 'meal-card' + (isDone ? ' done' : '') + (m.optional ? ' optional' : '');
    card.innerHTML = `
      <div class="meal-top">
        <div class="meal-tag">MEAL ${m.id}</div>
        <div class="meal-time">${m.time}</div>
        <button class="meal-check" data-meal-check="${m.id}" aria-label="Mark meal done">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>
        </button>
      </div>
      <div class="meal-name">${escapeHtml(m.name).toUpperCase()}</div>
      <div class="meal-options">${escapeHtml(m.options)}</div>
      <div class="meal-macros">
        <div class="mm-chip"><strong>${m.p}</strong>P</div>
        <div class="mm-chip"><strong>${m.c}</strong>C</div>
        <div class="mm-chip"><strong>${m.f}</strong>F</div>
        <div class="mm-chip mm-cal"><strong>${m.cal}</strong>CAL</div>
      </div>
      <button class="meal-log-btn" data-meal-log="${m.id}">LOG THIS MEAL <span class="arrow">→</span></button>
    `;
    listEl.appendChild(card);
  });

  listEl.querySelectorAll('[data-meal-check]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMeal(parseInt(btn.dataset.mealCheck, 10));
    });
  });
  listEl.querySelectorAll('[data-meal-log]').forEach(btn => {
    btn.addEventListener('click', () => goToNutritionAndSearch());
  });

  $('#mealsDoneCount').textContent = doneCount;
  $('#mealsHeroFill').style.width = (doneCount / MEALS.length * 100) + '%';
}

/* ---------- HABITS ---------- */
const HABIT_KEYS = ['walk', 'water', 'supps'];
function emptyHabits() { return { walk: false, steps: 0, water: false, supps: false }; }
function getHabits(dayNum) {
  return state.habits[String(dayNum)] || emptyHabits();
}
function ensureHabits(dayKey) {
  if (!state.habits[dayKey]) state.habits[dayKey] = emptyHabits();
  return state.habits[dayKey];
}
function toggleHabit(key) {
  const dayKey = String(currentDayNum());
  const h = ensureHabits(dayKey);
  h[key] = !h[key];
  save();
  renderHabits();
  renderToday(); // updates nothing workout-side, but cheap
}
function setSteps(n) {
  const dayKey = String(currentDayNum());
  const h = ensureHabits(dayKey);
  h.steps = Math.max(0, Math.floor(n || 0));
  save();
  renderHabits();
}
function habitDayComplete(h) {
  let c = 0;
  if (h.walk) c++;
  if ((h.steps || 0) >= 8000) c++;
  if (h.water) c++;
  if (h.supps) c++;
  return c;
}
function stepsLevel(n) {
  if (n >= 8000) return 'green';
  if (n >= 5000) return 'yellow';
  if (n > 0) return 'red';
  return '';
}
function renderHabits() {
  const h = getHabits(currentDayNum());
  HABIT_KEYS.forEach(k => {
    const el = document.getElementById('habit' + k[0].toUpperCase() + k.slice(1));
    if (el) el.classList.toggle('done', !!h[k]);
  });
  const card = $('#habitStepsCard');
  card.classList.toggle('done', (h.steps || 0) >= 8000);
  const dot = $('#stepsDot');
  dot.classList.remove('lvl-red', 'lvl-yellow', 'lvl-green');
  const lvl = stepsLevel(h.steps || 0);
  if (lvl) dot.classList.add('lvl-' + lvl);
  const input = $('#stepsInput');
  if (document.activeElement !== input) {
    input.value = h.steps ? h.steps : '';
  }
  const sub = $('#stepsSub');
  if (h.steps >= 10000) sub.textContent = `${h.steps.toLocaleString()} — crushed it`;
  else if (h.steps >= 8000) sub.textContent = `${h.steps.toLocaleString()} — target hit`;
  else if (h.steps >= 5000) sub.textContent = `${h.steps.toLocaleString()} — keep going`;
  else if (h.steps > 0) sub.textContent = `${h.steps.toLocaleString()} — under target`;
  else sub.textContent = 'Target 8,000–10,000';

  const completed = habitDayComplete(h);
  $('#habitCompleted').textContent = completed;
  $('#habitHeroFill').style.width = (completed / 4 * 100) + '%';
}

/* ---------- RESET ---------- */
async function resetAll() {
  const msg = 'WIPE ALL DATA?\n\nThis will clear workouts, nutrition, weights, habits, and onboarding.\n\nThis CANNOT be undone.';
  if (!confirm(msg)) return;
  if (!confirm('Really reset? Last chance.')) return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    // Unregister all service workers so the reset is total
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    // Clear all caches the service worker wrote
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
    }
  } catch (e) {
    console.warn('reset error', e);
  }
  location.reload();
}

/* ---------- RENDER ALL ---------- */
function renderAll() {
  renderHeader();
  renderToday();
  renderNutrition();
  renderHabits();
}

/* ---------- EVENT WIRING ---------- */
function wireEvents() {
  $$('.tab').forEach(t => t.addEventListener('click', () => {
    $$('.tab').forEach(x => x.classList.toggle('active', x === t));
    $$('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === t.dataset.tab));
  }));
  $$('.nav-btn').forEach(b => b.addEventListener('click', () => switchView(b.dataset.view)));

  $('#openSearchBtn').addEventListener('click', openSearch);
  $('#closeSearchBtn').addEventListener('click', closeSearch);
  $('#foodSearch').addEventListener('input', (e) => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => doSearch(e.target.value), 400);
  });

  $('#closeServingBtn').addEventListener('click', () => $('#servingModal').classList.add('hidden'));
  $('#servingQty').addEventListener('input', updateServingMacros);
  $('#confirmServingBtn').addEventListener('click', confirmServing);

  $('#logWeightBtn').addEventListener('click', openWeightLog);
  $('#closeWeightBtn').addEventListener('click', () => $('#weightModal').classList.add('hidden'));
  $('#confirmWeightBtn').addEventListener('click', confirmWeight);

  $('#closeSetBtn').addEventListener('click', () => $('#setModal').classList.add('hidden'));
  $('#confirmSetBtn').addEventListener('click', confirmSet);

  $('#resetBtn').addEventListener('click', resetAll);

  // habits
  $('#habitWalk').addEventListener('click', () => toggleHabit('walk'));
  $('#habitWater').addEventListener('click', () => toggleHabit('water'));
  $('#habitSupps').addEventListener('click', () => toggleHabit('supps'));
  const stepsInput = $('#stepsInput');
  stepsInput.addEventListener('input', (e) => {
    const v = parseInt(e.target.value, 10);
    setSteps(isNaN(v) ? 0 : v);
  });
  stepsInput.addEventListener('blur', () => renderHabits());

  // close modals on backdrop click
  $$('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.add('hidden');
    });
  });

  // handle day rollover while app is open
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.startDate) renderAll();
  });
}

/* ---------- INIT ---------- */
function init() {
  load();
  initOnboarding();
  wireEvents();
  if (state.startDate) {
    showApp();
  } else {
    $('#onboarding').classList.remove('hidden');
  }
}
init();
