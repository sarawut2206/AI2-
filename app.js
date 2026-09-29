/* English Quest 30 — game engine */
(() => {
  "use strict";

  /* ---------- state ---------- */
  const KEY = "eng30-v1";
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const DEF = { lv: {}, xp: 0, streak: 0, last: null, mistakes: [], journal: [], chain: {}, drafts: {}, daily: null, set: { sound: true, rate: 0.9, unlockAll: false, theme: "auto" } };
  let S;
  try { S = Object.assign(clone(DEF), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = clone(DEF); }
  S.set = Object.assign({}, DEF.set, S.set);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const dayStr = (d = new Date()) => d.toLocaleDateString("sv");
  const LV = (id) => LEVELS.find((l) => l.id === id);
  const WD = (id) => WORLDS.find((w) => w.id === id);
  const allQ = {}; LEVELS.forEach((l) => l.qs.forEach((q) => (allQ[q.id] = q)));
  const isDone = (id) => !!(S.lv[id] && S.lv[id].done);
  const unlocked = (id) => S.set.unlockAll || id === 1 || isDone(id - 1);
  const currentLevel = () => (LEVELS.find((l) => !isDone(l.id)) || LEVELS[LEVELS.length - 1]).id;
  const totalStars = () => Object.values(S.lv).reduce((a, v) => a + (v.stars || 0), 0);

  function applyTheme() {
    const r = document.documentElement;
    if (S.set.theme === "auto") r.removeAttribute("data-theme"); else r.setAttribute("data-theme", S.set.theme);
  }
  applyTheme();

  /* ---------- audio / speech ---------- */
  let actx;
  function beep(ok) {
    if (!S.set.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = ok ? [660, 880] : [220, 180];
      notes.forEach((f, i) => {
        const o = actx.createOscillator(), g = actx.createGain();
        o.type = ok ? "sine" : "square"; o.frequency.value = f;
        g.gain.setValueAtTime(0.12, actx.currentTime + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + i * 0.1 + 0.18);
        o.connect(g).connect(actx.destination); o.start(actx.currentTime + i * 0.1); o.stop(actx.currentTime + i * 0.1 + 0.2);
      });
    } catch {}
  }
  let voices = [];
  const loadVoices = () => { try { voices = speechSynthesis.getVoices().filter((v) => /^en/i.test(v.lang)); } catch {} };
  if ("speechSynthesis" in window) { loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
  function say(text) {
    if (!("speechSynthesis" in window) || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/[🔗“”]/g, ""));
    u.lang = "en-US"; u.rate = S.set.rate;
    const v = voices.find((v) => v.lang === "en-US") || voices[0];
    if (v) u.voice = v;
    speechSynthesis.speak(u);
  }
  window.__say = say;
  const sayBtn = (t) => `<button class="say" aria-label="ฟังเสียง" onclick="__say(${esc(JSON.stringify(t))})">🔊</button>`;

  function toast(msg) {
    const t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 2200);
  }
  function confetti() {
    const fx = $("#fx"), colors = ["#f59e0b", "#4f46e5", "#16a34a", "#ec4899", "#06b6d4"];
    for (let i = 0; i < 70; i++) {
      const d = document.createElement("div"); d.className = "conf";
      d.style.left = Math.random() * 100 + "vw"; d.style.background = colors[i % colors.length];
      d.style.animationDuration = 1.6 + Math.random() * 1.6 + "s"; d.style.animationDelay = Math.random() * 0.4 + "s";
      fx.appendChild(d); setTimeout(() => d.remove(), 3800);
    }
  }
  function bumpStreak() {
    const today = dayStr(), y = new Date(); y.setDate(y.getDate() - 1);
    if (S.last === today) return;
    S.streak = S.last === dayStr(y) ? S.streak + 1 : 1;
    S.last = today;
  }

  /* ---------- answer checking ---------- */
  function norm(s) {
    return String(s).toLowerCase().replace(/[’‘`]/g, "'")
      .replace(/\bwon't\b/g, "will not").replace(/\bcan't\b/g, "can not").replace(/\bcannot\b/g, "can not")
      .replace(/n't\b/g, " not").replace(/'re\b/g, " are").replace(/'m\b/g, " am").replace(/'ll\b/g, " will")
      .replace(/'ve\b/g, " have").replace(/'d\b/g, " would")
      .replace(/\bpractice\b/g, "practise")
      .replace(/[.,!?;:"“”]/g, " ").replace(/\s+/g, " ").trim();
  }
  const answerOf = (q) => (q.t === "mc" ? q.o[q.a] : q.t === "ord" ? q.s : q.a[0]);

  /* ---------- main tabs ---------- */
  let tab = "map";
  function renderStats() {
    $("#stats").innerHTML = `<span title="สตรีค">🔥 ${S.last === dayStr() || isYesterday(S.last) ? S.streak : 0}</span><span title="ดาว">⭐ ${totalStars()}</span><span title="XP">💎 ${S.xp}</span>`;
  }
  function isYesterday(d) { const y = new Date(); y.setDate(y.getDate() - 1); return d === dayStr(y); }

  function render() {
    renderStats();
    document.querySelectorAll("#tabs button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tab));
    const v = $("#view");
    v.innerHTML = { map: viewMap, chain: viewChain, book: viewBook, set: viewSet }[tab]();
    if (tab === "map") {
      const cur = v.querySelector(".node.current");
      if (cur && !render.scrolled) { render.scrolled = true; setTimeout(() => cur.scrollIntoView({ block: "center", behavior: "smooth" }), 150); }
    }
  }
  $("#tabs").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    tab = b.dataset.tab; window.scrollTo(0, 0); render();
  });

  const X = ["0px", "60px", "90px", "60px", "0px", "-60px", "-90px", "-60px"];
  function viewMap() {
    const done = LEVELS.filter((l) => isDone(l.id)).length, cur = currentLevel(), cl = LV(cur);
    const dailyDone = S.daily === dayStr();
    let h = `<div class="card hero">
      <div class="muted">ความคืบหน้า 30 วัน</div>
      <h2 style="margin:2px 0">${done === 30 ? "🏆 จบครบ 30 ด่านแล้ว!" : `ด่าน ${cur}: ${esc(cl.title)}`}</h2>
      <div class="bar"><div style="width:${(done / 30) * 100}%"></div></div>
      <div class="row"><div class="grow muted">ผ่านแล้ว ${done}/30 ด่าน · แนะนำวันละ 1 ด่าน (~50 นาที)</div>
      <button class="btn sm" data-open="${cur}">${done ? "เล่นต่อ ▶" : "เริ่มเลย ▶"}</button></div></div>
      <div class="card row">
        <div style="font-size:34px">🎙️</div>
        <div class="grow"><b>ภารกิจพูดประจำวัน</b><div class="muted">${dailyDone ? "✅ ทำแล้ววันนี้ — กลับมาพรุ่งนี้" : "ตอบ 5 คำถาม · +30 XP · รักษาสตรีค"}</div></div>
        <button class="btn sm ${dailyDone ? "ghost" : ""}" data-daily>${dailyDone ? "ฝึกอีก" : "เริ่ม"}</button>
      </div>`;
    WORLDS.forEach((w) => {
      const lv = LEVELS.filter((l) => l.world === w.id), wd = lv.filter((l) => isDone(l.id)).length;
      h += `<section class="world"><div class="world-head" style="background:${w.color}">
        <small>โลกที่ ${w.id} · สัปดาห์ที่ ${w.id} · ${esc(w.en)}</small>
        <h2>${w.emoji} ${esc(w.name)}</h2><small>${esc(w.desc)} · ผ่าน ${wd}/${lv.length}</small></div><div class="path">`;
      lv.forEach((l, i) => {
        const un = unlocked(l.id), d = isDone(l.id), st = (S.lv[l.id] || {}).stars || 0, isCur = l.id === cur && un && !d;
        const icon = !un ? "🔒" : l.boss ? (d ? "👑" : "🐉") : d ? "✓" : l.id;
        h += `<div class="node-wrap" style="--x:${X[i % 8]};--wc:${w.color}">
          ${isCur ? `<div class="bubble">START</div>` : ""}
          <button class="node ${l.boss ? "boss" : ""} ${un ? "" : "locked"} ${isCur ? "current" : ""}" data-open="${l.id}" aria-label="ด่าน ${l.id}">${icon}</button>
          <div class="node-stars">${d ? "⭐".repeat(st) + "☆".repeat(3 - st) : ""}</div>
          <div class="node-label">วันที่ ${l.id} · ${esc(l.topic)}</div></div>`;
      });
      h += `</div></section>`;
    });
    return h;
  }

  function viewChain() {
    const items = LEVELS.filter((l) => l.qs.some((q) => q.chain));
    const got = items.filter((l) => S.chain[l.id]).length;
    let h = `<div class="card"><span class="tag">🔗 ประโยคเชื่อมด่าน</span>
      <h2 style="margin-top:8px">ประโยคเดียว เปลี่ยนได้ ${items.length} รูป</h2>
      <p class="muted">ทุกด่านจะแปลงประโยคตั้งต้นนี้ด้วยไวยากรณ์ใหม่ เพื่อให้เห็นว่า 15 หัวข้อเชื่อมโยงกันจริง</p>
      <div class="row formula"><span class="grow">${BASE_SENTENCE}</span>${sayBtn(BASE_SENTENCE)}</div>
      <div class="pbar"><div style="width:${(got / items.length) * 100}%"></div></div>
      <div class="muted" style="margin-top:4px">สะสมแล้ว ${got}/${items.length}</div></div><div class="card">`;
    items.forEach((l) => {
      const s = S.chain[l.id], w = WD(l.world);
      h += `<div class="chain-item"><div class="chain-no" style="background:${s ? w.color : "var(--lock)"}">${l.id}</div>
        <div class="grow"><div class="muted">${esc(l.topic)}</div>
        <div class="chain-s ${s ? "" : "lock"}">${s ? esc(s) : "🔒 ผ่านด่าน " + l.id + " เพื่อปลดล็อก"}</div></div>${s ? sayBtn(s) : ""}</div>`;
    });
    return h + `</div>`;
  }

  function viewBook() {
    const done = LEVELS.filter((l) => isDone(l.id)).length;
    const mis = S.mistakes.filter((id) => allQ[id]);
    let h = `<div class="card"><h2>📊 สถิติของฉัน</h2><div class="kpi">
      <div><b>${done}/30</b><span class="muted">ด่านที่ผ่าน</span></div>
      <div><b>⭐ ${totalStars()}/90</b><span class="muted">ดาว</span></div>
      <div><b>🔥 ${S.streak}</b><span class="muted">สตรีคล่าสุด</span></div>
      <div><b>💎 ${S.xp}</b><span class="muted">XP</span></div></div></div>
      <div class="card"><h2>🎯 คลังข้อที่เคยผิด</h2>
      <p class="muted">${mis.length ? `มี ${mis.length} ข้อ — ตอบถูกแล้วจะหายจากคลัง และจะถูกสุ่มมาทบทวนตอนเริ่มด่านใหม่` : "ยังไม่มีข้อผิด เก่งมาก!"}</p>
      ${mis.length ? `<button class="btn block" data-practice>ฝึกข้อที่เคยผิด (${Math.min(mis.length, 10)} ข้อ)</button>` : ""}</div>
      <div class="card"><h2>✍️ สมุดงานเขียน</h2>`;
    if (!S.journal.length) h += `<p class="muted">งานเขียนจากแต่ละด่านจะถูกเก็บไว้ที่นี่ ใช้ตรวจข้อผิดพลาดในด่าน 29</p>`;
    S.journal.slice().reverse().forEach((j) => {
      h += `<div class="journal-entry"><div class="muted">วันที่ ${j.lvl} · ${esc(j.title)} · ${esc(j.date)}</div>${esc(j.text)}</div>`;
    });
    return h + `</div>`;
  }

  let deferredInstall = null;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  window.addEventListener("beforeinstallprompt", (e) => { e.preventDefault(); deferredInstall = e; if (tab === "set") render(); });

  function viewSet() {
    return `<div class="card"><h2>📱 ติดตั้งเป็นแอปบนมือถือ</h2>
      ${standalone ? `<p>✅ คุณกำลังใช้งานแบบแอปอยู่แล้ว</p>` : deferredInstall ? `<button class="btn block" data-install>ติดตั้งแอปตอนนี้</button>` : ""}
      <p><b>Android (Chrome):</b> แตะเมนู ⋮ มุมขวาบน → <b>ติดตั้งแอป</b> หรือ <b>เพิ่มลงในหน้าจอหลัก</b></p>
      <p><b>iPhone / iPad (Safari):</b> แตะปุ่มแชร์ <b>⬆️</b> → <b>เพิ่มไปยังหน้าจอโฮม</b></p>
      <p class="muted">ติดตั้งแล้วเปิดได้เหมือนแอปทั่วไป ใช้งานออฟไลน์ได้ และความคืบหน้าจะถูกเก็บในเครื่องนี้</p></div>
      <div class="card"><h2>⚙️ การตั้งค่า</h2>
      <label class="switch"><span>🔈 เสียงเอฟเฟกต์</span><input type="checkbox" data-set="sound" ${S.set.sound ? "checked" : ""}></label>
      <label class="switch"><span>🗣️ ความเร็วเสียงอ่าน (${S.set.rate})</span><input type="range" min="0.6" max="1.2" step="0.1" value="${S.set.rate}" data-set="rate"></label>
      <label class="switch"><span>🌗 ธีม</span><select class="inp" style="width:auto;padding:6px 10px" data-set="theme">
        ${["auto", "light", "dark"].map((t) => `<option value="${t}" ${S.set.theme === t ? "selected" : ""}>${{ auto: "ตามระบบ", light: "สว่าง", dark: "มืด" }[t]}</option>`).join("")}</select></label>
      <label class="switch"><span>🔓 เปิดทุกด่าน (โหมดครู/ทบทวน)</span><input type="checkbox" data-set="unlockAll" ${S.set.unlockAll ? "checked" : ""}></label>
      <div class="switch"><span>🔊 ทดสอบเสียงอ่าน</span><button class="btn sm ghost" onclick="__say('Hello! Welcome to English Quest.')">ฟัง</button></div></div>
      <div class="card"><h2>💾 สำรองข้อมูล</h2>
      <p class="muted">ย้ายความคืบหน้าไปเครื่องอื่นด้วยไฟล์สำรอง</p>
      <div class="row wrap"><button class="btn sm ghost" data-export>⬇️ ส่งออก</button>
      <label class="btn sm ghost">⬆️ นำเข้า<input type="file" accept="application/json" data-import hidden></label>
      <button class="btn sm bad" data-reset>🗑️ เริ่มใหม่ทั้งหมด</button></div></div>
      <p class="muted center">English Quest 30 · แผนเรียน 30 วัน 15 หัวข้อไวยากรณ์</p>`;
  }

  $("#view").addEventListener("click", async (e) => {
    const t = e.target.closest("[data-open],[data-daily],[data-practice],[data-install],[data-export],[data-reset]");
    if (!t) return;
    if (t.dataset.open) return openSheet(+t.dataset.open);
    if ("daily" in t.dataset) return startDaily();
    if ("practice" in t.dataset) return startPractice();
    if ("install" in t.dataset && deferredInstall) { deferredInstall.prompt(); await deferredInstall.userChoice; deferredInstall = null; return render(); }
    if ("export" in t.dataset) {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 1)], { type: "application/json" }));
      a.download = `english-quest-backup-${dayStr()}.json`; a.click(); return;
    }
    if ("reset" in t.dataset && confirm("ลบความคืบหน้าทั้งหมดและเริ่มใหม่?")) { S = clone(DEF); save(); applyTheme(); render(); }
  });
  $("#view").addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.import !== undefined && t.files[0]) {
      t.files[0].text().then((txt) => {
        try { const d = JSON.parse(txt); if (!d.lv) throw 0; S = Object.assign(clone(DEF), d); save(); applyTheme(); toast("นำเข้าข้อมูลแล้ว"); render(); }
        catch { toast("ไฟล์ไม่ถูกต้อง"); }
      });
      return;
    }
    const k = t.dataset.set; if (!k) return;
    S.set[k] = t.type === "checkbox" ? t.checked : k === "rate" ? +t.value : t.value;
    save(); if (k === "theme") applyTheme(); render();
  });

  /* ---------- level sheet ---------- */
  function openSheet(id) {
    const l = LV(id), w = WD(l.world), sh = $("#sheet");
    if (!unlocked(id)) { toast(`🔒 ผ่านด่าน ${id - 1} ก่อน เพื่อปลดล็อกด่านนี้`); return; }
    const r = S.lv[id];
    sh.innerHTML = `<div class="sheet">
      <div class="row"><span class="tag" style="background:${w.color};color:#fff">${w.emoji} วันที่ ${id}${l.boss ? " · บอส" : ""}</span><div class="grow"></div>
      <button class="x" style="font-size:24px" data-close>✕</button></div>
      <h2 style="margin-top:10px">${esc(l.title)}</h2><div class="muted">${esc(l.topic)}</div>
      <div class="bridge">🔗 ${esc(l.bridge)}</div>
      <div><b>🎯 ภารกิจวันนี้:</b> ${esc(l.goal)}</div>
      <div class="steps">
        ${id > 1 ? `<div>🔁 ทบทวน · 5′</div>` : ""}<div>📘 เข้าใจกฎ · 10′</div>
        ${l.read ? `<div>📰 อ่านบทความ</div>` : ""}<div>🧩 ภารกิจ ${l.qs.length + (l.poolCount || 0)} ข้อ · 20′</div>
        <div>🎙️ พูดออกเสียง · 10′</div><div>✍️ เขียน · 5′</div></div>
      <p class="muted">หลัก 10–5–3–1: อธิบายกฎใน 10 วินาที · แต่ง 5 ประโยค · เปลี่ยน 3 รูป · พูด 1 นาที</p>
      ${r && r.done ? `<p>ผลดีที่สุด: ${"⭐".repeat(r.stars)}${"☆".repeat(3 - r.stars)} (${r.best}%)</p>` : ""}
      <button class="btn block" data-go>${r && r.done ? "เล่นอีกครั้ง" : "เริ่มด่าน"} ▶</button></div>`;
    sh.hidden = false;
    sh.onclick = (e) => {
      if (e.target === sh || e.target.closest("[data-close]")) sh.hidden = true;
      if (e.target.closest("[data-go]")) { sh.hidden = true; startLevel(id); }
    };
  }

  /* ---------- player ---------- */
  let P = null;
  const pl = $("#player");

  let ignorePop = false;
  function openPlayer(cfg, keepHistory) {
    P = Object.assign({ i: 0, xp: 0, first: 0, total: 0 }, cfg);
    pl.hidden = false; document.body.style.overflow = "hidden";
    if (!keepHistory) history.pushState({ player: 1 }, "");
    runStep();
  }
  function closePlayer(fromPop) {
    stopMedia();
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    pl.hidden = true; document.body.style.overflow = ""; P = null;
    if (!fromPop && history.state && history.state.player) { ignorePop = true; history.back(); }
    render();
  }
  window.addEventListener("popstate", () => {
    if (ignorePop) { ignorePop = false; return; }
    if (!P) return;
    if (P.finished || confirm("ออกจากด่าน? ความคืบหน้าในด่านนี้จะหายไป")) closePlayer(true);
    else history.pushState({ player: 1 }, "");
  });

  function frame(kind, body, foot) {
    const pct = P.steps.length ? (P.i / P.steps.length) * 100 : 0;
    pl.innerHTML = `<div class="p-top"><button class="x" data-quit aria-label="ออก">✕</button>
      <div class="pbar grow"><div style="width:${pct}%"></div></div></div>
      <div class="p-body"><div class="step-kind">${kind}</div>${body}</div>
      <div class="p-foot" id="foot">${foot || ""}</div>`;
    $("[data-quit]", pl).onclick = () => { if (P.finished || confirm("ออกจากด่าน? ความคืบหน้าในด่านนี้จะหายไป")) closePlayer(); };
    $(".p-body", pl).scrollTop = 0;
  }
  const next = () => { P.i++; runStep(); };

  function runStep() {
    const st = P.steps[P.i];
    if (!st) return P.onFinish();
    ({ review: stepQuiz, quiz: stepQuiz, rule: stepRule, read: stepRead, speak: stepSpeak, write: stepWrite }[st.type])(st);
  }

  function reviewPool(uptoId) {
    const mis = shuffle(S.mistakes.filter((id) => allQ[id] && allQ[id].lvl < uptoId));
    const prev = shuffle(LEVELS.filter((l) => l.id < uptoId && (isDone(l.id) || S.set.unlockAll)).flatMap((l) => l.qs.filter((q) => !q.chain)));
    const out = [];
    [...mis.map((id) => allQ[id]), ...prev].forEach((q) => { if (out.length < 3 && !out.includes(q)) out.push(q); });
    return out;
  }

  function startLevel(id, keepHistory) {
    const l = LV(id);
    let qs = l.qs.slice();
    if (l.pool) {
      const [a, b] = l.pool;
      const pool = shuffle(LEVELS.filter((x) => x.id >= a && x.id <= b && x.id !== id).flatMap((x) => x.qs.filter((q) => !q.chain)));
      const chainQ = qs.filter((q) => q.chain);
      qs = [...shuffle([...qs.filter((q) => !q.chain), ...pool.slice(0, l.poolCount)]), ...chainQ];
    }
    const rev = id > 1 ? reviewPool(id) : [];
    const steps = [];
    if (rev.length) steps.push({ type: "review", qs: rev });
    steps.push({ type: "rule" });
    if (l.read) steps.push({ type: "read" });
    steps.push({ type: "quiz", qs });
    steps.push({ type: "speak", sp: l.speak });
    steps.push({ type: "write", wr: l.write });
    openPlayer({ lvl: l, steps, onFinish: finishLevel }, keepHistory);
  }

  function startDaily() {
    openPlayer({
      lvl: null, daily: true,
      steps: [{ type: "speak", sp: { prompt: "ตอบคำถาม 5 ข้อเป็นภาษาอังกฤษ บันทึกเสียงแล้วฟังย้อนกลับ จดข้อผิดเพียง 3 จุด", qs: DAILY_QUESTIONS, model: "Every day I teach English. Yesterday I checked homework and cooked dinner. Tomorrow I will visit my friend. I like reading, but I don't like traffic. If I had more time, I would learn to swim.", secs: 120 } }],
      onFinish() {
        const first = S.daily !== dayStr();
        if (first) { S.daily = dayStr(); S.xp += 30; bumpStreak(); save(); }
        P.finished = true;
        frame("ภารกิจพูดประจำวัน", `<div class="center" style="padding-top:30px"><div style="font-size:64px">🎙️</div>
          <h2>${first ? "สำเร็จ! +30 XP" : "ฝึกเพิ่มเยี่ยมมาก!"}</h2><p class="muted">🔥 สตรีค ${S.streak} วัน</p></div>`,
          `<button class="btn block" data-done>กลับแผนที่</button>`);
        if (first) confetti();
        $("[data-done]", pl).onclick = () => closePlayer();
      }
    });
  }

  function startPractice() {
    const qs = shuffle(S.mistakes.filter((id) => allQ[id])).slice(0, 10).map((id) => allQ[id]);
    openPlayer({
      lvl: null, practice: true, steps: [{ type: "review", qs, practice: true }],
      onFinish() {
        S.xp += P.xp; save(); P.finished = true;
        frame("ฝึกข้อที่เคยผิด", `<div class="center" style="padding-top:30px"><div style="font-size:64px">🎯</div>
          <h2>ถูก ${P.first}/${P.total} ข้อ</h2><p class="muted">+${P.xp} XP · เหลือในคลัง ${S.mistakes.length} ข้อ</p></div>`,
          `<button class="btn block" data-done>กลับ</button>`);
        $("[data-done]", pl).onclick = () => closePlayer();
      }
    });
  }

  /* ----- rule ----- */
  function stepRule() {
    const l = P.lvl;
    frame("📘 เข้าใจกฎ", `<h2>${esc(l.topic)}</h2><div class="card rule">${l.rule}</div>
      ${l.ex.length ? `<div class="card"><b>ตัวอย่าง (แตะ 🔊 เพื่อฟัง)</b>${l.ex.map((x) => `<div class="ex">${sayBtn(x)}<span>${esc(x)}</span></div>`).join("")}</div>` : ""}
      <details><summary>🧠 ทดสอบตัวเอง 10 วินาที</summary><p>ปิดหน้าจอแล้วอธิบายหัวข้อนี้ด้วยคำพูดของตัวเองภายใน 10 วินาที</p></details>`,
      `<button class="btn block" data-next>เข้าใจแล้ว ไปต่อ ▶</button>`);
    $("[data-next]", pl).onclick = next;
  }

  /* ----- read ----- */
  function stepRead() {
    const r = P.lvl.read;
    frame("📰 อ่านบทความ", `<h2>${esc(r.title)}</h2>
      <div class="row" style="margin-bottom:10px">${sayBtn(r.text)}<span class="muted">ฟังบทความ · ${r.text.split(/\s+/).length} คำ</span></div>
      <div class="card article">${esc(r.text)}</div>
      <p class="muted">อ่านรอบแรกเพื่อจับใจความ รอบสองมองหา ประธาน กริยา เวลา Passive และ If-Clause — คำถามถัดไปจะให้ย้อนกลับมาดูบทความได้</p>`,
      `<button class="btn block" data-next>อ่านแล้ว ไปตอบคำถาม ▶</button>`);
    $("[data-next]", pl).onclick = next;
  }

  /* ----- quiz / review ----- */
  function stepQuiz(st) {
    const scored = st.type === "quiz";
    if (!st.queue) { st.queue = st.qs.map((q) => ({ q, retry: false })); st.k = 0; st.firstRight = 0; }
    const item = st.queue[st.k];
    if (!item) return quizDone(st);
    const q = item.q, kind = st.practice ? "🎯 ฝึกข้อที่เคยผิด" : scored ? `🧩 ภารกิจ ${Math.min(st.k + 1, st.qs.length)}/${st.qs.length}${item.retry ? " · ลองอีกครั้ง" : ""}` : `🔁 ทบทวนจากด่านก่อน (ด่าน ${q.lvl})`;
    let body = `<div class="q">${esc(q.q)}</div>`, userAns = null;
    const readBack = P.lvl && P.lvl.read && scored ? `<details><summary>📰 ดูบทความอีกครั้ง</summary><div class="article">${esc(P.lvl.read.text)}</div></details>` : "";

    if (q.t === "mc") {
      const order = shuffle(q.o.map((_, i) => i));
      body += `<div class="opts">${order.map((i) => `<button class="opt" data-i="${i}">${esc(q.o[i])}</button>`).join("")}</div>`;
      frame(kind, body + readBack, `<button class="btn block" data-check disabled>ตรวจคำตอบ</button>`);
      pl.querySelectorAll(".opt").forEach((b) => (b.onclick = () => {
        if (st.locked) return;
        pl.querySelectorAll(".opt").forEach((x) => x.classList.remove("sel")); b.classList.add("sel");
        userAns = +b.dataset.i; $("[data-check]", pl).disabled = false;
      }));
    } else if (q.t === "ord") {
      const words = q.s.split(" "), bank = shuffle(words.map((w, i) => ({ w, i })));
      const picked = [];
      body += `<div class="answer-line" id="ans"></div><div class="bank" id="bank">${bank.map((b, j) => `<button class="tile" data-j="${j}">${esc(b.w)}</button>`).join("")}</div>`;
      frame(kind, body + readBack, `<button class="btn block" data-check disabled>ตรวจคำตอบ</button>`);
      const draw = () => {
        $("#ans", pl).innerHTML = picked.map((j, n) => `<button class="tile" data-n="${n}">${esc(bank[j].w)}</button>`).join("");
        pl.querySelectorAll("#bank .tile").forEach((t) => t.classList.toggle("used", picked.includes(+t.dataset.j)));
        $("[data-check]", pl).disabled = picked.length !== words.length;
        userAns = picked.map((j) => bank[j].w).join(" ");
      };
      $("#bank", pl).onclick = (e) => { const t = e.target.closest(".tile"); if (!t || st.locked || picked.includes(+t.dataset.j)) return; picked.push(+t.dataset.j); draw(); };
      $("#ans", pl).onclick = (e) => { const t = e.target.closest(".tile"); if (!t || st.locked) return; picked.splice(+t.dataset.n, 1); draw(); };
    } else {
      body += `<input class="inp" id="tyin" autocomplete="off" autocapitalize="sentences" spellcheck="false" placeholder="พิมพ์ประโยคภาษาอังกฤษ">`;
      frame(kind, body + readBack, `<button class="btn block" data-check disabled>ตรวจคำตอบ</button>`);
      const inp = $("#tyin", pl);
      inp.oninput = () => { userAns = inp.value; $("[data-check]", pl).disabled = !inp.value.trim(); };
      inp.onkeydown = (e) => { if (e.key === "Enter" && inp.value.trim()) $("[data-check]", pl).click(); };
      setTimeout(() => inp.focus(), 50);
    }
    st.locked = false;

    $("[data-check]", pl).onclick = () => {
      st.locked = true;
      let ok;
      if (q.t === "mc") {
        ok = userAns === q.a;
        pl.querySelectorAll(".opt").forEach((b) => { if (+b.dataset.i === q.a) b.classList.add("right"); else if (+b.dataset.i === userAns) b.classList.add("wrong"); });
      } else if (q.t === "ord") ok = norm(userAns) === norm(q.s);
      else { ok = q.a.some((a) => norm(a) === norm(userAns)); $("#tyin", pl).disabled = true; }

      if (!item.retry) {
        if (scored || st.practice) P.total++;
        if (ok) { st.firstRight++; if (scored || st.practice) P.first++; P.xp += scored || st.practice ? 10 : 5; }
      }
      if (ok) { S.mistakes = S.mistakes.filter((id) => id !== q.id); if (q.chain && P.lvl) P.chainGot = answerOf(q); }
      else {
        if (!S.mistakes.includes(q.id)) S.mistakes.push(q.id);
        if (!item.retry && scored) st.queue.push({ q, retry: true });
        $(".p-body", pl).classList.add("shake");
      }
      save(); beep(ok);
      const ans = answerOf(q), eng = /^[A-Za-z]/.test(ans);
      const foot = $("#foot", pl);
      foot.className = "p-foot " + (ok ? "ok" : "bad");
      foot.innerHTML = `<div class="inner"><div class="row"><div class="fb-title grow">${ok ? ["เยี่ยม! 🎉", "ถูกต้อง! ✨", "สุดยอด! 💪"][Math.floor(Math.random() * 3)] : "ยังไม่ถูก 😅"}</div>${eng ? sayBtn(ans) : ""}</div>
        ${ok ? "" : `<div><b>คำตอบ:</b> ${esc(ans)}</div>`}
        ${q.e ? `<div class="muted" style="margin:4px 0 10px">💡 ${esc(q.e)}</div>` : ""}
        <button class="btn block ${ok ? "ok" : "bad"}" data-cont>ต่อไป</button></div>`;
      if (ok && eng && (q.t !== "mc")) say(ans);
      $("[data-cont]", pl).onclick = () => { st.k++; stepQuiz(st); };
    };
  }

  function quizDone(st) {
    if (st.type !== "quiz") return next();
    const pct = Math.round((st.firstRight / st.qs.length) * 100);
    P.pct = pct;
    if (pct >= 60) return next();
    frame("🧩 ผลภารกิจ", `<div class="center" style="padding-top:30px"><div style="font-size:64px">💥</div>
      <h2>ยังไม่ผ่าน — ได้ ${pct}%</h2><p class="muted">ต้องได้อย่างน้อย 60% เพื่อผ่านด่าน<br>ข้อที่ผิดถูกเก็บไว้ใน “คลังข้อที่เคยผิด” แล้ว</p></div>`,
      `<button class="btn block" data-retry>ลองภารกิจอีกครั้ง 🔄</button><div style="height:10px"></div><button class="btn block ghost" data-rule>กลับไปอ่านกฎ</button>`);
    const reset = () => { P.total -= st.qs.length; P.first -= st.firstRight; P.xp = Math.max(0, P.xp - st.firstRight * 10); delete st.queue; };
    $("[data-retry]", pl).onclick = () => { reset(); stepQuiz(st); };
    $("[data-rule]", pl).onclick = () => { reset(); P.i = P.steps.findIndex((s) => s.type === "rule"); runStep(); };
  }

  /* ----- speak ----- */
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  let media = {};
  function stopMedia() {
    try { media.sr && (media.srOn = false, media.sr.stop()); } catch {}
    try { media.mr && media.mr.state !== "inactive" && media.mr.stop(); } catch {}
    try { media.stream && media.stream.getTracks().forEach((t) => t.stop()); } catch {}
    clearInterval(media.tick);
    media = {};
  }

  function stepSpeak(st) {
    const sp = st.sp, l = P.lvl;
    const target = sp.readAloud && l && l.read ? l.read.text : "";
    let spoken = 0, finalText = "", sess = "", used = false;
    const body = `<h2>🎙️ ${esc(sp.prompt)}</h2>
      ${sp.listen ? `<div class="card row"><button class="btn sm" data-listen>▶ ฟัง Tom พูด</button><span class="muted">ฟังได้หลายรอบ</span></div>` : ""}
      ${target ? `<div class="card article">${esc(target)}</div>` : ""}
      ${sp.qs.length ? `<div class="card">${sp.qs.map((q, i) => `<div class="ex">${sayBtn(q)}<span>${i + 1}. ${esc(q)}</span></div>`).join("")}</div>` : ""}
      <div class="timer" id="tm">0:00 <span class="muted" style="font-size:16px">/ เป้า ${Math.floor(sp.secs / 60)}:${String(sp.secs % 60).padStart(2, "0")}</span></div>
      <div class="row" style="justify-content:center;gap:24px">
        ${SR ? `<div class="center"><button class="mic" id="srBtn">🎙️</button><div class="muted">พูด + ถอดเสียง</div></div>` : ""}
        ${window.MediaRecorder ? `<div class="center"><button class="mic" id="mrBtn" style="background:#0891b2">⏺️</button><div class="muted">อัดเสียงฟังย้อน</div></div>` : ""}
      </div>
      ${SR ? `<div class="transcript" id="tr"><em>ข้อความที่ถอดได้จะแสดงที่นี่…</em></div><div id="score" class="muted" style="margin-top:6px"></div>` : `<p class="muted">อุปกรณ์นี้ไม่รองรับการถอดเสียง — ใช้ปุ่มอัดเสียงแล้วฟังย้อนกลับแทน</p>`}
      <div id="play" style="margin-top:10px"></div>
      ${sp.model ? `<details><summary>💬 ดูตัวอย่างคำตอบ${sp.hideModel ? " (ลองพูดเองก่อน!)" : ""}</summary><div class="row" style="margin-top:6px">${sayBtn(sp.model)}<span>${esc(sp.model)}</span></div></details>` : ""}
      <p class="muted">💡 ฟังเสียงตัวเองแล้วจดข้อผิดพลาด <b>เพียง 3 จุด</b> — อย่าพยายามแก้ทุกอย่างพร้อมกัน</p>`;
    frame("🎙️ พูดออกเสียง", body, `<button class="btn block" data-next>พูดครบแล้ว ไปต่อ ▶</button>`);

    const tm = $("#tm", pl);
    const showTime = () => { tm.firstChild.nodeValue = `${Math.floor(spoken / 60)}:${String(spoken % 60).padStart(2, "0")} `; if (spoken >= sp.secs) tm.style.color = "var(--ok)"; };
    const startTick = () => { clearInterval(media.tick); media.tick = setInterval(() => { spoken++; showTime(); }, 1000); };
    const showTr = () => {
      const tr = $("#tr", pl); if (!tr) return;
      const full = (finalText + " " + sess).trim();
      tr.innerHTML = full ? esc(full) : "<em>กำลังฟัง… เริ่มพูดได้เลย</em>";
      const words = full.split(/\s+/).filter(Boolean);
      let msg = `พูดไปแล้ว ${words.length} คำ`;
      if (target && words.length) {
        const bag = {}; words.forEach((w) => { w = norm(w); bag[w] = (bag[w] || 0) + 1; });
        const tw = norm(target).split(" "); let hit = 0;
        tw.forEach((w) => { if (bag[w]) { bag[w]--; hit++; } });
        msg += ` · อ่านตรงกับบทความ ${Math.round((hit / tw.length) * 100)}%`;
      }
      $("#score", pl).textContent = msg;
    };
    const lb = $("[data-listen]", pl); if (lb) lb.onclick = () => say(sp.listen);

    const srBtn = $("#srBtn", pl);
    if (srBtn) srBtn.onclick = () => {
      if (media.srOn) { stopMedia(); srBtn.classList.remove("rec"); srBtn.textContent = "🎙️"; finalText = (finalText + " " + sess).trim(); sess = ""; return; }
      stopMedia(); const mr = $("#mrBtn", pl); if (mr) { mr.classList.remove("rec"); mr.textContent = "⏺️"; }
      const r = new SR(); r.lang = "en-US"; r.continuous = true; r.interimResults = true;
      r.onresult = (e) => { let s = ""; for (let i = 0; i < e.results.length; i++) s += e.results[i][0].transcript + " "; sess = s.trim(); showTr(); };
      r.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { toast("กรุณาอนุญาตการใช้ไมโครโฟน"); media.srOn = false; } };
      r.onend = () => { finalText = (finalText + " " + sess).trim(); sess = ""; if (media.srOn) { try { r.start(); } catch {} } else { srBtn.classList.remove("rec"); srBtn.textContent = "🎙️"; clearInterval(media.tick); } };
      media.sr = r; media.srOn = true; used = true;
      try { r.start(); srBtn.classList.add("rec"); srBtn.textContent = "⏹️"; startTick(); showTr(); } catch { toast("เริ่มถอดเสียงไม่ได้"); }
    };

    const mrBtn = $("#mrBtn", pl);
    if (mrBtn) mrBtn.onclick = async () => {
      if (media.mr && media.mr.state === "recording") { media.mr.stop(); return; }
      stopMedia(); if (srBtn) { srBtn.classList.remove("rec"); srBtn.textContent = "🎙️"; }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mr = new MediaRecorder(stream), chunks = [];
        mr.ondataavailable = (e) => chunks.push(e.data);
        mr.onstop = () => {
          stream.getTracks().forEach((t) => t.stop()); clearInterval(media.tick);
          mrBtn.classList.remove("rec"); mrBtn.textContent = "⏺️";
          const url = URL.createObjectURL(new Blob(chunks, { type: mr.mimeType || "audio/webm" }));
          $("#play", pl).innerHTML = `<div class="muted">ฟังเสียงตัวเอง:</div><audio controls src="${url}" style="width:100%"></audio>`;
        };
        media.mr = mr; media.stream = stream; used = true;
        mr.start(); mrBtn.classList.add("rec"); mrBtn.textContent = "⏹️"; startTick();
      } catch { toast("ไม่สามารถใช้ไมโครโฟนได้ — กรุณาอนุญาตในเบราว์เซอร์"); }
    };

    $("[data-next]", pl).onclick = () => {
      stopMedia();
      if (!P.daily) P.xp += used ? 20 : 5;
      next();
    };
  }

  /* ----- write ----- */
  function stepWrite(st) {
    const wr = st.wr, l = P.lvl, key = l ? l.id : "x";
    const prevJ = l && l.showJournal && S.journal.length
      ? `<details><summary>📓 งานเขียนเก่าของคุณ (${S.journal.length})</summary>${S.journal.map((j) => `<div class="journal-entry"><div class="muted">วันที่ ${j.lvl}</div>${esc(j.text)}</div>`).join("")}</details>` : "";
    frame("✍️ เขียน", `<h2>✍️ ${esc(wr.prompt)}</h2>${prevJ}
      <textarea class="inp" id="wt" placeholder="${wr.lang === "th" ? "เขียนสรุปภาษาไทย…" : "Write your sentences here…"}">${esc(S.drafts[key] || "")}</textarea>
      <div class="card" style="margin-top:12px" id="checks"></div>`,
      `<button class="btn block" data-next disabled>บันทึกและไปต่อ ▶</button>`);
    const ta = $("#wt", pl), btn = $("[data-next]", pl);
    const manual = ["ประธาน–กริยาสอดคล้องกัน", "ใช้ tense ตรงกับเวลา", "สะกดคำถูกต้อง"];
    const mstate = {};
    const check = () => {
      const t = ta.value; S.drafts[key] = t; save();
      const sents = t.replace(/([.!?])\s+/g, "$1\n").split(/\n+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= (wr.lang === "th" ? 1 : 2));
      const n = sents.length, okN = n >= wr.min;
      const rows = [[okN, `จำนวนประโยค ${n}/${wr.min}`]];
      if (wr.lang !== "th") {
        const cap = sents.filter((s) => /^[A-Z"“]/.test(s)).length, end = sents.filter((s) => /[.!?]["”]?$/.test(s)).length;
        rows.push([n && cap === n, `ขึ้นต้นด้วยตัวพิมพ์ใหญ่ (${cap}/${n})`], [n && end === n, `ลงท้ายด้วย . ? ! (${end}/${n})`]);
        if (wr.kw) rows.push([new RegExp(wr.kw, "i").test(t), wr.kwLabel]);
      }
      $("#checks", pl).innerHTML = `<b>ตรวจอัตโนมัติ</b>` + rows.map(([ok, s]) => `<div class="chk ${ok ? "ok" : "no"}">${ok ? "✅" : "⬜"} ${esc(s)}</div>`).join("")
        + (wr.lang !== "th" ? `<b style="display:block;margin-top:8px">ตรวจเอง</b>` + manual.map((m, i) => `<label class="chk"><input type="checkbox" data-m="${i}" ${mstate[i] ? "checked" : ""}> ${m}</label>`).join("") : "");
      btn.disabled = !okN;
    };
    ta.oninput = check; check();
    $("#checks", pl).onchange = (e) => { if (e.target.dataset.m) mstate[e.target.dataset.m] = e.target.checked; };
    btn.onclick = () => {
      const text = ta.value.trim();
      if (l) { S.journal.push({ lvl: l.id, title: l.topic, date: dayStr(), text }); delete S.drafts[key]; }
      P.xp += 20; save(); next();
    };
  }

  /* ----- finish ----- */
  function finishLevel() {
    const l = P.lvl, pct = P.pct == null ? 100 : P.pct;
    const stars = pct >= 90 ? 3 : pct >= 75 ? 2 : 1;
    const prev = S.lv[l.id] || {}, firstClear = !prev.done;
    if (l.boss && firstClear) P.xp += 50;
    S.lv[l.id] = { done: true, stars: Math.max(stars, prev.stars || 0), best: Math.max(pct, prev.best || 0), date: dayStr() };
    if (P.chainGot) S.chain[l.id] = P.chainGot;
    S.xp += P.xp; bumpStreak(); save();
    P.finished = true;
    const nx = LV(l.id + 1), w = WD(l.world), nextWorld = nx && nx.world !== l.world;
    frame(l.boss ? "🐉 ปราบบอสสำเร็จ" : "🏁 ผ่านด่าน",
      `<div class="center" style="padding-top:10px">
        <div class="big-stars">${[1, 2, 3].map((i) => `<span class="${i <= stars ? "" : "off"}">⭐</span>`).join("")}</div>
        <h2>${l.final ? "🏆 จบหลักสูตร 30 วัน!" : l.boss ? `พิชิต${esc(w.name)}!` : `ผ่านวันที่ ${l.id}!`}</h2>
        <p class="muted">ความแม่นยำ ${pct}% · +${P.xp} XP · 🔥 สตรีค ${S.streak} วัน</p></div>
        ${P.chainGot ? `<div class="card"><span class="tag">🔗 ได้ประโยคเชื่อมใหม่</span><div class="row" style="margin-top:8px"><b class="grow">${esc(P.chainGot)}</b>${sayBtn(P.chainGot)}</div></div>` : ""}
        ${nx ? `<div class="bridge">🔓 ปลดล็อก${nextWorld ? ` <b>${WD(nx.world).emoji} ${esc(WD(nx.world).name)}</b> —` : ""} วันที่ ${nx.id}: ${esc(nx.title)}<br><span class="muted">${esc(nx.bridge)}</span></div>` : ""}
        ${l.final ? `<div class="card"><b>ก้าวต่อไป</b><p class="muted">เล่นซ้ำด่านที่ได้ดาวน้อย ฝึกภารกิจพูดประจำวันต่อเนื่อง และหาโอกาสคุยกับชาวต่างชาติจริงทุกสัปดาห์</p></div>` : ""}`,
      `${nx ? `<button class="btn block" data-nx>ไปด่านถัดไป ▶</button><div style="height:10px"></div>` : ""}<button class="btn block ghost" data-map>กลับแผนที่</button>`);
    confetti(); beep(true);
    const nb = $("[data-nx]", pl);
    if (nb) nb.onclick = () => { stopMedia(); P = null; render(); startLevel(nx.id, true); };
    $("[data-map]", pl).onclick = () => closePlayer();
  }

  /* ---------- boot ---------- */
  render();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
})();
