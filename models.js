/* Museu dos Smartphones — modelos 3D ilustrativos (Three.js r128).
   Cada aparelho é uma representação simplificada criada para este projeto,
   com proporções aproximadas baseadas nas dimensões publicadas.
   NÃO são réplicas exatas. Telas e versos são desenhados em canvas (sem logotipos de marcas). */

const Museum3D = (() => {
  let renderer = null, scene, camera, ok = false;
  const cache = {};
  const S = 0.01; // 1 mm = 0.01 unidade

  function init() {
    try {
      if (!window.THREE) return false;
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      if (!gl) return false;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      scene.add(new THREE.HemisphereLight(0xfff6ea, 0x8aa7b0, 0.75));
      const key = new THREE.DirectionalLight(0xffffff, 0.85); key.position.set(2.5, 3, 4); scene.add(key);
      const rim = new THREE.DirectionalLight(0xffd2b0, 0.45); rim.position.set(-3, 1, -3); scene.add(rim);
      const fill = new THREE.DirectionalLight(0xdfefff, 0.3); fill.position.set(-3, -1, 3); scene.add(fill);
      ok = true;
    } catch (e) { ok = false; }
    return ok;
  }

  /* ---------- helpers ---------- */
  function rrShape(w, h, r) {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  }
  function faceGeo(w, h, r) {
    const g = new THREE.ShapeGeometry(rrShape(w, h, r), 16);
    const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
    uv.needsUpdate = true;
    return g;
  }
  function canvasTex(wmm, hmm, draw) {
    const W = 512, H = Math.round(512 * hmm / wmm);
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    draw(g, W, H);
    const t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }
  function rr(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  function label(g, W, H, text, color) {
    g.save(); g.fillStyle = color || "rgba(255,255,255,.55)"; g.font = `600 ${Math.round(W * 0.045)}px Nunito, Arial, sans-serif`;
    g.textAlign = "center"; g.fillText(text, W / 2, H * 0.93); g.restore();
  }
  function icon(g, x, y, s, color, glyph) {
    rr(g, x, y, s, s, s * 0.22); g.fillStyle = color; g.fill();
    if (glyph) { g.fillStyle = "rgba(255,255,255,.92)"; g.font = `700 ${Math.round(s * 0.5)}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(glyph, x + s / 2, y + s / 2 + 1); }
  }
  function body(group, w, h, d, r, mat) {
    const b = Math.min(d * 0.18, r * 0.6, 0.02);
    const geo = new THREE.ExtrudeGeometry(rrShape(w, h, r), { depth: Math.max(d - 2 * b, 0.001), bevelEnabled: true, bevelThickness: b, bevelSize: b * 0.7, bevelSegments: 3, curveSegments: 14 });
    geo.translate(0, 0, -(d - 2 * b) / 2);
    const m = new THREE.Mesh(geo, mat); group.add(m); return m;
  }
  function face(group, w, h, r, d, tex, back, rough) {
    const m = new THREE.Mesh(faceGeo(w, h, r), new THREE.MeshStandardMaterial({ map: tex, roughness: Math.max(rough ?? 0.32, back ? 0 : 0.42), metalness: 0.02 }));
    if (back) { m.rotation.y = Math.PI; m.position.z = -d / 2 - 0.0015; } else m.position.z = d / 2 + 0.0015;
    group.add(m); return m;
  }
  function std(color, rough, metal) { return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal }); }
  function backTex(wmm, hmm, bg, text, extra) {
    return canvasTex(wmm, hmm, (g, W, H) => {
      g.fillStyle = bg; g.fillRect(0, 0, W, H);
      const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "rgba(255,255,255,.10)"); gr.addColorStop(1, "rgba(0,0,0,.10)");
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (extra) extra(g, W, H);
      label(g, W, H, text, "rgba(255,255,255,.6)");
    });
  }
  function shadow(group, w, y) {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"); const gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    gr.addColorStop(0, "rgba(0,40,60,.35)"); gr.addColorStop(1, "rgba(0,40,60,0)"); g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 2.2, w * 0.9), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2; m.position.y = y; group.add(m);
  }

  /* ---------- aparelhos ---------- */
  const builders = {
    simon() {
      const [wm, hm, dm] = [64, 203, 38], w = wm * S, h = hm * S, d = dm * S, r = 0.05, G = new THREE.Group();
      body(G, w, h, d, r, std(0x2b2e31, 0.7, 0.05));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        g.fillStyle = "#2c2f33"; g.fillRect(0, 0, W, H);
        // alto-falante elevado
        rr(g, W * .12, H * .04, W * .76, H * .17, 30); g.fillStyle = "#24272a"; g.fill();
        g.fillStyle = "#151719"; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { g.beginPath(); g.arc(W * .42 + i * 22, H * .09 + j * 22, 5, 0, 7); g.fill(); }
        // tela LCD monocromática
        rr(g, W * .1, H * .26, W * .8, H * .56, 14); g.fillStyle = "#111"; g.fill();
        const sx = W * .14, sy = H * .28, sw = W * .72, sh = H * .52;
        g.fillStyle = "#b9c4a6"; g.fillRect(sx, sy, sw, sh);
        g.fillStyle = "#2f3a2a"; g.font = "700 30px monospace"; g.textAlign = "center"; g.fillText("SIMON", W / 2, sy + 44);
        const names = ["TEL", "AGENDA", "NOTAS", "CALC", "HORA", "FAX", "E-PAD", "CONTATOS"];
        names.forEach((n, i) => { const cx = sx + sw * (i % 2 ? .72 : .28), cy = sy + 90 + Math.floor(i / 2) * (sh - 120) / 4;
          g.strokeStyle = "#2f3a2a"; g.lineWidth = 4; g.strokeRect(cx - 40, cy, 80, 56); g.font = "700 20px monospace"; g.fillText(n, cx, cy + 82); });
        // botões laterais da base
        g.fillStyle = "#1d1f22"; [0.3, 0.5, 0.7].forEach(x => { g.beginPath(); g.arc(W * x, H * .9, 18, 0, 7); g.fill(); });
        label(g, W, H, "ilustração", "rgba(255,255,255,.35)");
      }), false, 0.5);
      face(G, w, h, r, d, backTex(wm, hm, "#2a2c2f", "IBM Simon · ilustração"), true, 0.8);
      const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.42, 12), std(0x1b1c1e, 0.6, 0.1));
      ant.position.set(w * 0.33, h / 2 + 0.2, -d * 0.15); G.add(ant);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 12), std(0x1b1c1e, 0.6, 0.1)); tip.position.set(w * 0.33, h / 2 + 0.42, -d * 0.15); G.add(tip);
      return { G, w, h: h + 0.44, d, yOff: -0.22 };
    },
    bb6210() {
      const [wm, hm, dm] = [75, 113, 20], w = wm * S, h = hm * S, d = dm * S, r = 0.14, G = new THREE.Group();
      body(G, w, h, d, r, std(0x3a4552, 0.55, 0.25));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        g.fillStyle = "#3b4654"; g.fillRect(0, 0, W, H);
        const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "rgba(255,255,255,.12)"); gr.addColorStop(1, "rgba(0,0,0,.18)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        rr(g, W * .16, H * .07, W * .68, H * .36, 12); g.fillStyle = "#121a22"; g.fill();
        const sx = W * .19, sy = H * .095, sw = W * .62, sh = H * .31;
        g.fillStyle = "#9fc3cf"; g.fillRect(sx, sy, sw, sh);
        g.fillStyle = "#1c2b33"; g.font = "700 22px Arial"; g.textAlign = "left"; g.fillText("Caixa de entrada", sx + 12, sy + 30);
        g.fillRect(sx + 8, sy + 40, sw - 16, 3);
        ["Reunião 14h", "Relatório Q2", "Re: Proposta", "Agenda amanhã"].forEach((t, i) => { g.font = "600 19px Arial"; g.fillText("✉ " + t, sx + 12, sy + 70 + i * 32); });
        // teclado QWERTY
        const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"]; const kw = W * .074, top = H * .5;
        rows.forEach((row, ri) => { const off = (W - row.length * kw * 1.12) / 2;
          [...row].forEach((k, ki) => { const x = off + ki * kw * 1.12, y = top + ri * kw * 1.25;
            rr(g, x, y, kw, kw * 1.05, 8); g.fillStyle = "#dfe5ea"; g.fill(); g.fillStyle = "#26323d"; g.font = `700 ${Math.round(kw * .5)}px Arial`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(k, x + kw / 2, y + kw * .55); g.textBaseline = "alphabetic"; }); });
        rr(g, W * .3, top + 3 * kw * 1.25, W * .4, kw * .9, 10); g.fillStyle = "#dfe5ea"; g.fill();
        label(g, W, H, "ilustração", "rgba(255,255,255,.45)");
      }), false, 0.45);
      face(G, w, h, r, d, backTex(wm, hm, "#38424e", "BlackBerry 6210 · ilustração"), true, 0.7);
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.05, 20), std(0x9aa5b1, 0.4, 0.5));
      wheel.rotation.z = Math.PI / 2; wheel.position.set(w / 2 + 0.005, h * 0.18, 0); G.add(wheel);
      return { G, w, h, d, yOff: 0 };
    },
    iphone() {
      const [wm, hm, dm] = [61, 115, 11.6], w = wm * S, h = hm * S, d = dm * S, r = 0.09, G = new THREE.Group();
      body(G, w, h, d, r, std(0xc9cdd2, 0.3, 0.75));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        g.fillStyle = "#0b0b0d"; g.fillRect(0, 0, W, H);
        rr(g, W * .4, H * .045, W * .2, 10, 5); g.fillStyle = "#333"; g.fill();
        const sx = W * .08, sy = H * .13, sw = W * .84, sh = H * .72;
        const bg = g.createLinearGradient(0, sy, 0, sy + sh); bg.addColorStop(0, "#1d2733"); bg.addColorStop(1, "#0f141b"); g.fillStyle = bg; g.fillRect(sx, sy, sw, sh);
        g.fillStyle = "#fff"; g.font = "600 18px Arial"; g.textAlign = "center"; g.fillText("9:41", W / 2, sy + 20);
        const cols = ["#3bb54a", "#f2f2f2", "#f5a623", "#4a4a4a", "#5b6170", "#3478f6", "#d0021b", "#36a3f7", "#f8e71c", "#9b9b9b", "#7ed321", "#50e3c2"];
        const s = sw / 5.2, gap = (sw - 4 * s) / 5;
        cols.forEach((c, i) => icon(g, sx + gap + (i % 4) * (s + gap), sy + 38 + Math.floor(i / 4) * (s + gap * 1.6), s, c));
        g.fillStyle = "rgba(255,255,255,.12)"; g.fillRect(sx, sy + sh - s - 26, sw, s + 26);
        ["#4cd964", "#3478f6", "#5ac8fa", "#ff9500"].forEach((c, i) => icon(g, sx + gap + i * (s + gap), sy + sh - s - 13, s, c));
        g.beginPath(); g.arc(W / 2, H * .925, W * .075, 0, 7); g.strokeStyle = "#555"; g.lineWidth = 5; g.stroke();
        rr(g, W / 2 - 12, H * .925 - 12, 24, 24, 5); g.strokeStyle = "#666"; g.lineWidth = 3; g.stroke();
      }), false, 0.18);
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        const gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "#b8bcc1"); gr.addColorStop(.5, "#e3e6e9"); gr.addColorStop(1, "#b8bcc1");
        g.fillStyle = gr; g.fillRect(0, 0, W, H); g.fillStyle = "#16181a"; g.fillRect(0, H * .82, W, H * .18);
        g.beginPath(); g.arc(W * .16, H * .07, 16, 0, 7); g.fillStyle = "#222"; g.fill();
        label(g, W, H * 0.8, "ilustração", "rgba(40,40,40,.45)");
      }), true, 0.35);
      return { G, w, h, d, yOff: 0 };
    },
    g1() {
      const [wm, hm, dm] = [55.7, 117.7, 17.1], w = wm * S, h = hm * S, d = dm * S, r = 0.07, G = new THREE.Group();
      body(G, w, h, d, r, std(0x2a2724, 0.45, 0.3));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        g.fillStyle = "#24211f"; g.fillRect(0, 0, W, H);
        const sx = W * .07, sy = H * .07, sw = W * .86, sh = H * .66;
        const bg = g.createLinearGradient(0, sy, W, sy + sh); bg.addColorStop(0, "#2f6b4f"); bg.addColorStop(1, "#13324a"); g.fillStyle = bg; g.fillRect(sx, sy, sw, sh);
        g.fillStyle = "#000"; g.fillRect(sx, sy, sw, 26); g.fillStyle = "#9f9"; g.font = "600 16px Arial"; g.textAlign = "right"; g.fillText("3G ▮ 12:00", sx + sw - 8, sy + 19);
        g.fillStyle = "rgba(255,255,255,.9)"; g.font = "700 46px Arial"; g.textAlign = "center"; g.fillText("12:00", W / 2, sy + 100);
        const s = sw / 5.5, gap = (sw - 4 * s) / 5;
        ["#a4c639", "#e94235", "#4285f4", "#fbbc05", "#7e57c2", "#26a69a", "#ef6c00", "#8d6e63"].forEach((c, i) => icon(g, sx + gap + (i % 4) * (s + gap), sy + sh - 2.3 * s + Math.floor(i / 4) * (s + gap) - 10, s, c));
        // queixo com botões e trackball
        const cy = H * .86;
        ["#3c9a3c", "#555", "#555", "#555", "#b33"].forEach((c, i) => { const x = W * (.12 + i * .19); rr(g, x - 26, cy - 14, 52, 28, 10); g.fillStyle = c; g.fill(); });
        g.beginPath(); g.arc(W / 2, cy + 52, 22, 0, 7); g.fillStyle = "#cfcfcf"; g.fill();
        label(g, W, H * 0.79, "ilustração", "rgba(255,255,255,.4)");
      }), false, 0.3);
      face(G, w, h, r, d, backTex(wm, hm, "#2b2825", "T-Mobile G1 · ilustração", (g, W, H) => {
        g.beginPath(); g.arc(W / 2, H * .15, 26, 0, 7); g.fillStyle = "#111"; g.fill(); g.strokeStyle = "#777"; g.lineWidth = 5; g.stroke();
      }), true, 0.6);
      return { G, w, h, d, yOff: 0 };
    },
    s3() {
      const [wm, hm, dm] = [70.6, 136.6, 8.6], w = wm * S, h = hm * S, d = dm * S, r = 0.12, G = new THREE.Group();
      body(G, w, h, d, r, std(0x2f4f72, 0.3, 0.35));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        g.fillStyle = "#24405f"; g.fillRect(0, 0, W, H);
        const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "rgba(255,255,255,.18)"); gr.addColorStop(1, "rgba(0,0,0,.1)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
        rr(g, W * .4, H * .04, W * .2, 8, 4); g.fillStyle = "#13253a"; g.fill();
        const sx = W * .06, sy = H * .1, sw = W * .88, sh = H * .78;
        const bg = g.createLinearGradient(0, sy, 0, sy + sh); bg.addColorStop(0, "#5aa5d6"); bg.addColorStop(1, "#1f4f7a"); g.fillStyle = bg; g.fillRect(sx, sy, sw, sh);
        g.fillStyle = "#fff"; g.font = "300 64px Arial"; g.textAlign = "center"; g.fillText("10:24", W / 2, sy + 90);
        g.font = "600 18px Arial"; g.fillText("Ensolarado · 26°", W / 2, sy + 118);
        const s = sw / 5.4, gap = (sw - 4 * s) / 5;
        ["#f39c12", "#27ae60", "#e74c3c", "#8e44ad", "#16a085", "#2980b9", "#d35400", "#c0392b", "#2ecc71", "#34495e", "#e67e22", "#1abc9c"].forEach((c, i) => icon(g, sx + gap + (i % 4) * (s + gap), sy + 160 + Math.floor(i / 4) * (s + gap * 1.5), s, c));
        rr(g, W * .38, H * .915, W * .24, H * .045, 18); g.fillStyle = "#1a3350"; g.fill(); g.strokeStyle = "#7fa3c6"; g.lineWidth = 2; g.stroke();
        label(g, W, H * 0.99, "ilustração", "rgba(255,255,255,.45)");
      }), false, 0.2);
      face(G, w, h, r, d, backTex(wm, hm, "#2d4d70", "Galaxy S III · ilustração", (g, W, H) => {
        rr(g, W * .4, H * .06, W * .2, H * .09, 26); g.fillStyle = "#132538"; g.fill();
        g.beginPath(); g.arc(W / 2, H * .105, 22, 0, 7); g.fillStyle = "#050a10"; g.fill(); g.strokeStyle = "#8aa"; g.lineWidth = 3; g.stroke();
      }), true, 0.3);
      return { G, w, h, d, yOff: 0 };
    },
    s24() {
      const [wm, hm, dm] = [79, 162.3, 8.6], w = wm * S, h = hm * S, d = dm * S, r = 0.035, G = new THREE.Group();
      body(G, w, h, d, r, std(0x8d8a84, 0.32, 0.7));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        g.fillStyle = "#08090b"; g.fillRect(0, 0, W, H);
        const sx = W * .025, sy = H * .012, sw = W * .95, sh = H * .976;
        const bg = g.createLinearGradient(0, sy, W, sy + sh); bg.addColorStop(0, "#fff4e6"); bg.addColorStop(1, "#e6f2ef"); g.fillStyle = bg; g.fillRect(sx, sy, sw, sh);
        g.beginPath(); g.arc(W / 2, H * .03, 11, 0, 7); g.fillStyle = "#111"; g.fill();
        g.fillStyle = "#005582"; g.font = "800 28px Nunito, Arial"; g.textAlign = "left"; g.fillText("Tradução ao vivo", W * .08, H * .1);
        g.fillStyle = "#4a6470"; g.font = "600 18px Nunito, Arial"; g.fillText("Português ⇄ English", W * .08, H * .13);
        const bub = (y, t1, t2, right, col) => { const bw = W * .72, x = right ? W * .92 - bw : W * .08;
          rr(g, x, y, bw, 92, 20); g.fillStyle = col; g.fill(); g.fillStyle = right ? "#fff" : "#123"; g.font = "700 22px Nunito, Arial"; g.fillText(t1, x + 18, y + 38); g.font = "500 19px Nunito, Arial"; g.globalAlpha = .75; g.fillText(t2, x + 18, y + 70); g.globalAlpha = 1; };
        bub(H * .18, "Olá! Tudo bem?", "Hello! How are you?", false, "#ffffff");
        bub(H * .18 + 120, "I'm fine, thanks!", "Estou bem, obrigado!", true, "#006F74");
        bub(H * .18 + 240, "Onde fica o museu?", "Where is the museum?", false, "#ffffff");
        // círculo de busca
        g.strokeStyle = "#FFB279"; g.lineWidth = 7; g.beginPath(); g.ellipse(W * .5, H * .7, W * .3, H * .07, -.1, 0, 7); g.stroke();
        g.fillStyle = "#1F896E"; g.font = "800 22px Nunito, Arial"; g.textAlign = "center"; g.fillText("○ Circule para pesquisar", W * .5, H * .7 + 8);
        rr(g, W * .08, H * .84, W * .84, 64, 32); g.fillStyle = "#fff"; g.fill(); g.fillStyle = "#6b7f88"; g.font = "600 20px Nunito, Arial"; g.fillText("Pergunte ou resuma…", W * .5, H * .84 + 40);
        label(g, W, H * 0.99, "ilustração", "rgba(0,60,80,.35)");
      }), false, 0.15);
      face(G, w, h, r, d, backTex(wm, hm, "#8c8983", "Galaxy S24 Ultra · ilustração"), true, 0.35);
      const ring = std(0x5b5955, 0.3, 0.8), lens = std(0x050608, 0.1, 0.2);
      for (let i = 0; i < 3; i++) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.02, 32), ring); m.rotation.x = Math.PI / 2; m.position.set(w / 2 - 0.17, h / 2 - 0.2 - i * 0.2, -d / 2 - 0.01); G.add(m);
        const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.022, 32), lens); l.rotation.x = Math.PI / 2; l.position.copy(m.position); l.position.z -= 0.003; G.add(l);
      }
      const m4 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 32), ring); m4.rotation.x = Math.PI / 2; m4.position.set(w / 2 - 0.38, h / 2 - 0.3, -d / 2 - 0.01); G.add(m4);
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.012, 1.1, 14), std(0x8d8a84, 0.35, 0.6));
      pen.position.set(w / 2 + 0.16, -0.05, 0.05); pen.rotation.z = -0.12; G.add(pen);
      return { G, w: w + 0.4, h, d, yOff: 0 };
    },
    future() {
      const [wm, hm, dm] = [72, 150, 7.5], w = wm * S, h = hm * S, d = dm * S, r = 0.1, G = new THREE.Group();
      body(G, w, h, d, r, std(0xffb279, 0.35, 0.25));
      face(G, w, h, r, d, canvasTex(wm, hm, (g, W, H) => {
        const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, "#fff9f0"); bg.addColorStop(.55, "#d7efe8"); bg.addColorStop(1, "#cfe3ef"); g.fillStyle = bg; g.fillRect(0, 0, W, H);
        const orb = g.createRadialGradient(W / 2, H * .34, 10, W / 2, H * .34, W * .3);
        orb.addColorStop(0, "#ffffff"); orb.addColorStop(.35, "#FFB279"); orb.addColorStop(.7, "#1F896E"); orb.addColorStop(1, "rgba(0,85,130,0)");
        g.fillStyle = orb; g.beginPath(); g.arc(W / 2, H * .34, W * .3, 0, 7); g.fill();
        g.fillStyle = "#005582"; g.font = "800 30px Poppins, Arial"; g.textAlign = "center"; g.fillText("Como posso ajudar?", W / 2, H * .56);
        [["🎙 voz", .22], ["🖼 imagem", .5], ["⌨ texto", .78]].forEach(([t, x]) => { rr(g, W * x - 66, H * .61, 132, 46, 23); g.fillStyle = "#fff"; g.fill(); g.fillStyle = "#006F74"; g.font = "700 19px Nunito, Arial"; g.fillText(t, W * x, H * .61 + 30); });
        rr(g, W * .08, H * .72, W * .84, H * .12, 22); g.fillStyle = "rgba(255,255,255,.85)"; g.fill();
        g.fillStyle = "#17323F"; g.font = "600 19px Nunito, Arial"; g.fillText("Resumi a aula e marquei a revisão", W / 2, H * .77); g.fillText("na sua agenda para amanhã.", W / 2, H * .80);
        g.fillStyle = "#A0A06F"; g.font = "800 20px Nunito, Arial"; g.fillText("CONCEITO · NÃO É PRODUTO REAL", W / 2, H * .93);
      }), false, 0.15);
      face(G, w, h, r, d, backTex(wm, hm, "#f2a670", "Visão de futuro · conceito", (g, W, H) => {
        g.strokeStyle = "rgba(255,255,255,.7)"; g.lineWidth = 6; g.beginPath(); g.arc(W / 2, H * .4, W * .22, 0, 7); g.stroke();
        g.beginPath(); g.arc(W / 2, H * .4, W * .12, 0, 7); g.stroke();
      }), true, 0.4);
      return { G, w, h, d, yOff: 0 };
    }
  };

  function get(id) {
    if (cache[id]) return cache[id];
    const b = builders[id](); const root = new THREE.Group(); b.G.position.y = b.yOff || 0; root.add(b.G);
    shadow(root, Math.max(b.w, 0.6), -b.h / 2 - 0.05 + (b.yOff || 0) * 0);
    b.root = root; cache[id] = b; return b;
  }

  function frame(b, aspect, pad) {
    const fov = camera.fov * Math.PI / 180;
    const hNeed = Math.max(b.h, b.w / aspect) * (pad || 1.25);
    return hNeed / 2 / Math.tan(fov / 2);
  }

  /* Renderiza uma imagem estática do aparelho (usada nos cards do carrossel). */
  function snapshot(id, wPx, hPx, rotY) {
    if (!ok) return null;
    const b = get(id);
    scene.add(b.root); b.root.rotation.set(0.06, rotY ?? -0.5, 0);
    renderer.setSize(wPx, hPx, false);
    camera.aspect = wPx / hPx; camera.updateProjectionMatrix();
    camera.position.set(0, 0.1, frame(b, camera.aspect, 1.22)); camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
    const url = renderer.domElement.toDataURL("image/png");
    scene.remove(b.root);
    return url;
  }

  /* Imagem com todos os aparelhos lado a lado, na mesma escala. */
  function lineup(ids, wPx, hPx) {
    if (!ok) return null;
    const grp = new THREE.Group(); let x = 0; const items = [];
    ids.forEach(id => { const b = get(id); items.push(b); });
    const gapU = 0.22, total = items.reduce((a, b) => a + b.w, 0) + gapU * (items.length - 1);
    items.forEach(b => { const c = b.root.clone(); c.rotation.set(0, -0.25, 0); c.position.x = -total / 2 + x + b.w / 2; c.position.y = b.h / 2 - 1.1; x += b.w + gapU; grp.add(c); });
    scene.add(grp);
    renderer.setSize(wPx, hPx, false); camera.aspect = wPx / hPx; camera.updateProjectionMatrix();
    const fov = camera.fov * Math.PI / 180, dist = Math.max(2.6 / 2 / Math.tan(fov / 2), (total * 1.08) / camera.aspect / 2 / Math.tan(fov / 2));
    camera.position.set(0, 0.25, dist); camera.lookAt(0, 0, 0);
    renderer.render(scene, camera); const url = renderer.domElement.toDataURL("image/png");
    scene.remove(grp); return url;
  }

  /* Visualizador interativo: girar, frente/verso, zoom. Usa o mesmo renderer. */
  const viewer = {
    el: null, b: null, rotY: -0.5, rotX: 0.05, tY: -0.5, tX: 0.05, zoom: 1, tZoom: 1, auto: true, raf: 0, drag: null,
    attach(container, id) {
      if (!ok) return false;
      this.detach(); this.el = container; container.appendChild(renderer.domElement);
      renderer.domElement.className = "viewer-canvas"; renderer.domElement.setAttribute("aria-label", "Modelo 3D ilustrativo. Arraste para girar.");
      this.b = get(id); scene.add(this.b.root);
      this.rotY = this.tY = -0.5; this.rotX = this.tX = 0.05; this.zoom = this.tZoom = 1;
      this.auto = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.bind(); this.resize(); this.loop(); return true;
    },
    detach() {
      cancelAnimationFrame(this.raf); this.raf = 0;
      if (this.b) scene.remove(this.b.root); this.b = null;
      if (this.el && renderer.domElement.parentNode === this.el) this.el.removeChild(renderer.domElement);
      this.el = null;
    },
    resize() {
      if (!this.el) return; const r = this.el.getBoundingClientRect();
      const w = Math.max(50, r.width), h = Math.max(50, r.height);
      renderer.setSize(w, h, false); renderer.domElement.style.width = "100%"; renderer.domElement.style.height = "100%";
      camera.aspect = w / h; camera.updateProjectionMatrix();
    },
    bind() {
      if (this.bound) return; this.bound = true; const cv = renderer.domElement;
      const pts = new Map();
      cv.addEventListener("pointerdown", e => { cv.setPointerCapture(e.pointerId); pts.set(e.pointerId, [e.clientX, e.clientY]); this.auto = false; this.drag = [e.clientX, e.clientY, this.tY, this.tX]; this.pinch = null; });
      cv.addEventListener("pointermove", e => {
        if (!pts.has(e.pointerId)) return; pts.set(e.pointerId, [e.clientX, e.clientY]);
        if (pts.size === 2) { const [a, b] = [...pts.values()]; const dist = Math.hypot(a[0] - b[0], a[1] - b[1]);
          if (!this.pinch) this.pinch = [dist, this.tZoom]; else this.tZoom = Math.min(1.8, Math.max(0.7, this.pinch[1] * dist / this.pinch[0])); return; }
        if (this.drag) { this.tY = this.drag[2] + (e.clientX - this.drag[0]) * 0.012; this.tX = Math.max(-0.6, Math.min(0.6, this.drag[3] + (e.clientY - this.drag[1]) * 0.006)); }
      });
      const up = e => { pts.delete(e.pointerId); if (pts.size < 2) this.pinch = null; if (!pts.size) this.drag = null; };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      cv.addEventListener("wheel", e => { e.preventDefault(); this.tZoom = Math.min(1.8, Math.max(0.7, this.tZoom * (e.deltaY < 0 ? 1.08 : 0.92))); }, { passive: false });
      window.addEventListener("resize", () => this.resize());
    },
    front() { this.auto = false; this.tY = Math.round(this.tY / (2 * Math.PI)) * 2 * Math.PI; this.tX = 0.03; },
    back() { this.auto = false; this.tY = Math.round((this.tY - Math.PI) / (2 * Math.PI)) * 2 * Math.PI + Math.PI; this.tX = 0.03; },
    toggleAuto() { this.auto = !this.auto; return this.auto; },
    zoomBy(f) { this.tZoom = Math.min(1.8, Math.max(0.7, this.tZoom * f)); },
    loop() {
      const step = () => {
        if (!this.b) return;
        if (this.auto) this.tY += 0.006;
        this.rotY += (this.tY - this.rotY) * 0.12; this.rotX += (this.tX - this.rotX) * 0.12; this.zoom += (this.tZoom - this.zoom) * 0.15;
        this.b.root.rotation.set(this.rotX, this.rotY, 0);
        camera.position.set(0, 0.05, frame(this.b, camera.aspect, 1.15) / this.zoom); camera.lookAt(0, 0, 0);
        renderer.render(scene, camera); this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    }
  };

  return { init, snapshot, lineup, viewer, get ok() { return ok; } };
})();
