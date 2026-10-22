/* Museu dos Smartphones — interações (carrossel, linha do tempo, painel, comparação, componentes, IA). */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const srcLink = k => SOURCES[k] ? `<a href="${SOURCES[k].u}" target="_blank" rel="noopener">${esc(SOURCES[k].t)}</a>` : "";
  const has3D = Museum3D.init();
  let active = 0;

  /* ---------- cards ---------- */
  const track = $("#track"), stage = $("#stage");
  DEVICES.forEach((d, i) => {
    const c = document.createElement("article");
    c.className = "card"; c.dataset.i = i;
    c.setAttribute("aria-label", `${d.name}, ${d.year}`);
    c.innerHTML = `
      <div class="visual">
        <span class="badge ${d.concept ? "concept" : ""}">${d.concept ? "Conceito" : "Ilustração 3D"}</span>
        <span class="year ${d.concept ? "small" : ""}">${d.year}</span>
        <img alt="${esc(d.name)} — ${d.concept ? "representação conceitual" : "representação 3D ilustrativa"}" hidden>
      </div>
      <h3><span aria-hidden="true">${d.emoji}</span>${esc(d.name)}</h3>
      <p class="maker">${esc(d.maker)}</p>
      <p class="phrase">${esc(d.phrase)}</p>
      <button class="btn" type="button">Explorar aparelho</button>`;
    c.querySelector(".btn").addEventListener("click", e => { e.stopPropagation(); if (i !== active) setActive(i); openPanel(i); });
    c.querySelector(".btn").addEventListener("focus", () => { if (i !== active) setActive(i); });
    c.addEventListener("click", () => { if (moved) return; if (i !== active) setActive(i); else openPanel(i); });
    track.appendChild(c);
  });
  const cards = [...track.children];

  /* imagens dos cards: render 3D estático; sem WebGL usa foto ou emoji */
  function fillVisual(i) {
    const d = DEVICES[i], img = cards[i].querySelector("img");
    let url = has3D ? Museum3D.snapshot(d.id, 560, 600, -0.45) : null;
    if (!url && d.photo) { url = d.photo; img.classList.add("photo"); img.alt = `Foto de referência: ${d.name}`; cards[i].querySelector(".badge").textContent = "Foto"; }
    if (url) { img.src = url; img.hidden = false; }
    else { const v = cards[i].querySelector(".visual"); const f = document.createElement("div"); f.style.cssText = "display:grid;place-items:center;height:100%;font-size:5rem"; f.textContent = d.emoji; v.appendChild(f); }
  }
  // gera um por vez para não travar a página
  let q = 0; (function next() { if (q < DEVICES.length) { fillVisual(q++); setTimeout(next, 30); } else lineup(); })();

  /* ---------- linha do tempo ---------- */
  const tl = $("#linha");
  DEVICES.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "tl-btn"; b.type = "button"; b.setAttribute("role", "tab");
    b.innerHTML = `<span class="dot" aria-hidden="true">${d.emoji}</span><b>${d.year}</b><span class="nm">${esc(d.short)}</span>`;
    b.setAttribute("aria-label", `${d.year}: ${d.name}`);
    b.addEventListener("click", () => { setActive(i); stage.scrollIntoView({ behavior: "smooth", block: "center" }); });
    tl.appendChild(b);
  });

  function setActive(i) {
    active = Math.max(0, Math.min(DEVICES.length - 1, i));
    cards.forEach((c, k) => {
      const d = k - active, ad = Math.abs(d);
      c.style.setProperty("--d", d); c.style.setProperty("--ad", ad);
      c.classList.toggle("is-active", d === 0); c.classList.toggle("far", ad > 3);
      c.setAttribute("aria-hidden", ad > 3 ? "true" : "false");
      c.querySelector(".btn").tabIndex = d === 0 ? 0 : -1;
    });
    [...tl.children].forEach((b, k) => b.setAttribute("aria-selected", k === active ? "true" : "false"));
    $("#prev").disabled = active === 0; $("#next").disabled = active === DEVICES.length - 1;
    const d = DEVICES[active]; $("#live").textContent = `${d.year}: ${d.name}. ${d.milestone}.`;
  }
  $("#prev").addEventListener("click", () => setActive(active - 1));
  $("#next").addEventListener("click", () => setActive(active + 1));
  stage.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") { setActive(active - 1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { setActive(active + 1); e.preventDefault(); }
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(DEVICES.length - 1);
    else if (e.key === "Enter" && e.target === stage) openPanel(active);
  });

  /* deslizar com dedo / arrastar com mouse */
  let start = null, moved = false;
  stage.addEventListener("pointerdown", e => { if (e.target.closest(".nav-btn")) return; start = [e.clientX, e.clientY, e.pointerId]; moved = false; });
  stage.addEventListener("pointermove", e => {
    if (!start || e.pointerId !== start[2]) return;
    const dx = e.clientX - start[0], dy = e.clientY - start[1];
    if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { moved = true; stage.classList.add("dragging"); stage.setPointerCapture(e.pointerId); }
    if (moved) cards.forEach(c => c.style.setProperty("--drag", dx * 0.8 + "px"));
  });
  const end = e => {
    if (!start) return; const dx = e.clientX - start[0]; start = null;
    stage.classList.remove("dragging"); cards.forEach(c => c.style.setProperty("--drag", "0px"));
    if (moved) { const steps = Math.round(-dx / 180) || (dx < -40 ? 1 : dx > 40 ? -1 : 0); setActive(active + steps); setTimeout(() => moved = false, 50); }
  };
  stage.addEventListener("pointerup", end); stage.addEventListener("pointercancel", end);

  /* ---------- painel do aparelho ---------- */
  const dlg = $("#dlg"), viewer = $("#viewer"), photo = $("#viewerPhoto"), photoBtn = $("#photoBtn");
  function openPanel(i) {
    const d = DEVICES[i];
    $("#dlgMeta").textContent = `${d.year} · ${d.maker}`;
    $("#dlgTitle").textContent = `${d.emoji} ${d.name}`;
    const ms = $("#dlgMilestone"); ms.textContent = d.milestone; ms.classList.toggle("concept", !!d.concept);
    const spec = SPEC_ROWS.map(([k, l]) => `<dt>${l}</dt><dd>${d.spec[k] ? esc(d.spec[k]) : "<i>Dado não confirmado em fonte confiável</i>"}</dd>`).join("");
    $("#dlgBody").innerHTML = `
      <section class="info-sec"><h3>📜 História</h3><p>${esc(d.history)}</p></section>
      <section class="info-sec"><h3>⚙️ Tecnologia</h3><dl class="spec">${spec}</dl></section>
      <section class="info-sec"><h3>💡 Grande inovação</h3><p>${esc(d.innovation)}</p></section>
      <section class="info-sec"><h3>⚠️ Limitações</h3><p>${esc(d.limits)}</p></section>
      <section class="info-sec"><h3>🔎 Curiosidade</h3><p>${esc(d.curiosity)}</p></section>
      <section class="info-sec"><h3>📚 Fontes</h3><ul class="src-links">${d.sources.map(s => `<li>${srcLink(s)}</li>`).join("")}</ul></section>`;
    photo.hidden = true; viewer.hidden = false; photoBtn.hidden = !d.photo; photoBtn.setAttribute("aria-pressed", "false");
    if (d.photo) { photo.src = d.photo; photo.alt = `Foto de referência do ${d.name}`; }
    $("#tag3d").textContent = d.concept ? "Representação conceitual — não é produto anunciado" : "Representação 3D ilustrativa (não é réplica exata) — arraste para girar";
    dlg.showModal();
    viewer.innerHTML = "";
    const on3D = has3D && Museum3D.viewer.attach(viewer, d.id);
    $("#viewerTools").querySelectorAll("button:not(#photoBtn)").forEach(b => b.hidden = !on3D);
    $('[data-act="spin"]').setAttribute("aria-pressed", String(Museum3D.viewer.auto && on3D));
    if (!on3D) { if (d.photo) { photo.hidden = false; viewer.hidden = true; photoBtn.hidden = true; } else viewer.innerHTML = `<div style="display:grid;place-items:center;height:100%;font-size:6rem">${d.emoji}</div>`; }
    $("#dlgClose").focus();
  }
  dlg.addEventListener("close", () => { Museum3D.viewer.detach(); cards[active].querySelector(".btn").focus({ preventScroll: true }); });
  $("#dlgClose").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  $("#viewerTools").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return; const v = Museum3D.viewer;
    switch (b.dataset.act) {
      case "front": v.front(); $('[data-act="spin"]').setAttribute("aria-pressed", "false"); break;
      case "back": v.back(); $('[data-act="spin"]').setAttribute("aria-pressed", "false"); break;
      case "spin": b.setAttribute("aria-pressed", String(v.toggleAuto())); break;
      case "in": v.zoomBy(1.15); break;
      case "out": v.zoomBy(0.87); break;
      case "photo": { const showPhoto = photo.hidden; photo.hidden = !showPhoto; viewer.hidden = showPhoto; b.setAttribute("aria-pressed", String(showPhoto));
        $("#tag3d").textContent = showPhoto ? "Foto de referência do aparelho real" : "Representação 3D ilustrativa (não é réplica exata) — arraste para girar";
        if (!showPhoto) Museum3D.viewer.resize(); break; }
    }
  });

  /* ---------- comparação ---------- */
  const A = $("#cmpA"), B = $("#cmpB");
  DEVICES.forEach((d, i) => { [A, B].forEach(s => s.add(new Option(`${d.year} — ${d.name}`, i))); });
  A.value = 0; B.value = 5;
  function renderCmp() {
    const a = DEVICES[A.value], b = DEVICES[B.value];
    const cell = v => (!v || /^Não se aplica/.test(v)) ? `<td class="nc">${v ? esc(v) : "Dado não confirmado em fonte confiável"}</td>` : `<td>${esc(v)}</td>`;
    $("#cmpTable").innerHTML = `<thead><tr><th scope="col">Característica</th><th scope="col">${a.emoji} ${esc(a.name)} (${a.year})</th><th scope="col">${b.emoji} ${esc(b.name)} (${b.year})</th></tr></thead>
      <tbody>${SPEC_ROWS.map(([k, l]) => `<tr><th scope="row">${l}</th>${cell(a.spec[k])}${cell(b.spec[k])}</tr>`).join("")}</tbody>`;
  }
  A.addEventListener("change", renderCmp); B.addEventListener("change", renderCmp); renderCmp();

  /* gráfico de RAM (escala logarítmica, 1 MB a 100 GB) */
  const fmt = mb => mb >= 1024 ? `${(mb / 1024).toLocaleString("pt-BR")} GB` : `${mb} MB`;
  $("#ramBars").innerHTML = DEVICES.filter(d => d.ramMB).map(d => {
    const pct = Math.max(0, Math.log10(d.ramMB) / 5 * 100);
    return `<div class="bar-row"><span class="nm">${d.year} · ${esc(d.short)}</span><div class="bar-track" style="background-image:repeating-linear-gradient(90deg,transparent 0 calc(20% - 1px),var(--linha) calc(20% - 1px) 20%)"><div class="bar" style="width:${pct}%">${fmt(d.ramMB)}</div></div></div>`;
  }).join("") + `<div class="axis"><span></span><div><span>1 MB</span><span>10 MB</span><span>100 MB</span><span>1 GB</span><span>10 GB</span><span>100 GB</span></div></div>`;

  function lineup() {
    if (!has3D) return;
    const url = Museum3D.lineup(DEVICES.map(d => d.id), 1400, 620);
    if (url) { const im = $("#lineupImg"); im.src = url; im.hidden = false; }
  }

  /* ---------- por dentro ---------- */
  const board = $("#board");
  function showPart(k) {
    const p = PARTS[k];
    board.querySelectorAll(".part").forEach(b => { const on = b.dataset.part === k; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
    $("#partInfo").innerHTML = `<h3><span aria-hidden="true">${p.icon}</span> ${esc(p.title)}</h3><p>${esc(p.text)}</p>
      <div class="ex"><b>Exemplo real:</b> ${esc(p.example)}</div><p><b>Fontes:</b></p><ul class="src-links">${p.src.map(s => `<li>${srcLink(s)}</li>`).join("")}</ul>`;
  }
  board.addEventListener("click", e => { const b = e.target.closest(".part"); if (b) showPart(b.dataset.part); });
  showPart("soc");

  /* ---------- IA ---------- */
  const tabs = $("#aiTabs");
  AI_MODES.forEach((m, i) => {
    const b = document.createElement("button"); b.className = "ai-tab"; b.type = "button"; b.setAttribute("role", "tab");
    b.textContent = `${m.icon} ${m.title}`; b.addEventListener("click", () => showAI(i)); tabs.appendChild(b);
  });
  function showAI(i) {
    const m = AI_MODES[i];
    [...tabs.children].forEach((b, k) => b.setAttribute("aria-selected", String(k === i)));
    $("#aiPanel").innerHTML = `<h3>${m.icon} ${esc(m.title)}</h3><p class="how">${esc(m.how)}</p>
      <ul class="ex">${m.examples.map(([t, s]) => `<li>${esc(t)} <a href="${SOURCES[s].u}" target="_blank" rel="noopener">[fonte]</a></li>`).join("")}</ul>
      <div class="pc"><div class="pro"><b>Vantagens</b>${esc(m.pros)}</div><div class="con"><b>Limitações</b>${esc(m.cons)}</div></div>`;
  }
  showAI(0);

  /* ---------- fontes ---------- */
  $("#sourceList").innerHTML = Object.values(SOURCES).map(s => `<li><a href="${s.u}" target="_blank" rel="noopener">${esc(s.t)}</a></li>`).join("");

  setActive(0);
})();
