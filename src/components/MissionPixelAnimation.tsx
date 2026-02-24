import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ─── pixel color palette (8-bit space theme) ─── */
const C = {
  bg: "#0b0e17",
  stars: "#ffffff",
  starDim: "#555577",
  ship: "#c0c0c0",
  shipLight: "#e0e0e0",
  shipDark: "#808090",
  flame: "#ff6622",
  flameYellow: "#ffcc00",
  explosion: "#ff4400",
  explosionYellow: "#ffaa00",
  mars: "#cc4422",
  marsDark: "#993311",
  marsLight: "#dd6644",
  moon: "#ccccaa",
  moonDark: "#999977",
  earth: "#4488cc",
  earthGreen: "#44aa66",
  earthDark: "#336699",
  ice: "#aaddff",
  iceDark: "#77aacc",
  solar: "#ffdd44",
  solarDark: "#cc9900",
  panel: "#3366aa",
  panelDark: "#224488",
  antenna: "#aaaaaa",
  warning: "#ff3333",
  success: "#44dd66",
  parachute: "#ff6644",
  desert: "#ddaa66",
  desertDark: "#bb8844",
  text: "#ffffff",
  captionBg: "rgba(11,14,23,0.85)",
};

type RenderResult = { caption: string };
type Renderer = (ctx: CanvasRenderingContext2D, w: number, h: number, frame: number) => RenderResult;

const px = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x) * size, Math.floor(y) * size, size, size);
};

const drawStars = (ctx: CanvasRenderingContext2D, w: number, h: number, s: number, frame: number, seed: number = 42) => {
  let rng = seed;
  const next = () => { rng = (rng * 16807 + 0) % 2147483647; return rng / 2147483647; };
  for (let i = 0; i < 50; i++) {
    const sx = Math.floor(next() * (w / s));
    const sy = Math.floor(next() * (h / s));
    const twinkle = (frame + i * 7) % 40 < 30;
    px(ctx, sx, sy, s, twinkle ? C.stars : C.starDim);
  }
};

const drawPixelShip = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, variant: "default" | "lander" | "capsule" = "default") => {
  if (variant === "lander") {
    const shape = [
      [0,0,1,1,1,0,0],
      [0,1,1,1,1,1,0],
      [0,1,1,1,1,1,0],
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,0,0,0,0,1],
    ];
    shape.forEach((row, ry) => {
      row.forEach((val, rx) => { if (val) px(ctx, x + rx, y + ry, s, ry < 2 ? C.shipLight : C.ship); });
    });
    // Legs
    px(ctx, x, y + 6, s, C.shipDark);
    px(ctx, x + 6, y + 6, s, C.shipDark);
    px(ctx, x + 3, y - 1, s, C.antenna);
    px(ctx, x + 3, y - 2, s, C.antenna);
    return;
  }
  if (variant === "capsule") {
    px(ctx, x, y, s, C.ship); px(ctx, x + 1, y, s, C.shipLight); px(ctx, x + 2, y, s, C.ship);
    px(ctx, x, y + 1, s, C.shipDark); px(ctx, x + 1, y + 1, s, C.ship); px(ctx, x + 2, y + 1, s, C.shipDark);
    px(ctx, x, y + 2, s, C.shipDark); px(ctx, x + 1, y + 2, s, C.shipDark); px(ctx, x + 2, y + 2, s, C.shipDark);
    return;
  }
  const shape = [
    [0,0,0,1,0,0,0],
    [0,0,1,1,1,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [0,1,1,1,1,1,0],
    [1,1,0,1,0,1,1],
    [1,0,0,1,0,0,1],
    [0,0,0,1,0,0,0],
  ];
  shape.forEach((row, ry) => {
    row.forEach((val, rx) => { if (val) px(ctx, x + rx, y + ry, s, ry < 3 ? C.shipLight : C.ship); });
  });
};

const drawExplosion = (ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number, radius: number = 4) => {
  const r = Math.min(radius, Math.floor(frame / 2) + 1);
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const isOuter = dx * dx + dy * dy > (r - 1) * (r - 1);
        const flicker = (frame + dx + dy) % 3 !== 0;
        if (flicker) px(ctx, x + dx, y + dy, s, isOuter ? C.explosionYellow : C.explosion);
      }
    }
  }
};

const drawPlanet = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, s: number, c1: string, c2: string, seed: number) => {
  for (let dy = -r; dy <= r; dy++) {
    for (let dx = -r; dx <= r; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const pattern = (dx * 5 + dy * 3 + seed) % 7 < 2;
        px(ctx, cx + dx, cy + dy, s, pattern ? c2 : c1);
      }
    }
  }
};

const drawGround = (ctx: CanvasRenderingContext2D, cols: number, rows: number, s: number, c1: string, c2: string, freq = 0.4, baseH = 8) => {
  for (let x = 0; x < cols; x++) {
    const height = baseH + Math.floor(Math.sin(x * freq) * 2.5);
    for (let y = 0; y < height; y++) {
      px(ctx, x, rows - y, s, y < 2 ? c2 : c1);
    }
  }
};

/* ══════════════════════════════════════════════════════════
   MISSION RENDERERS — each returns a caption string
   ══════════════════════════════════════════════════════════ */

const renderApollo13: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 13);

  // Earth
  drawPlanet(ctx, 10, rows / 2, 8, s, C.earth, C.earthGreen, 20);
  // Moon
  drawPlanet(ctx, cols - 14, rows / 2, 6, s, C.moon, C.moonDark, 50);

  const total = 240;
  const phase = frame % total;

  if (phase < 70) {
    const shipX = 22 + phase * 0.8;
    const shipY = rows / 2 - 4;
    drawPixelShip(ctx, shipX, shipY, s);
    if (frame % 4 < 2) { px(ctx, shipX + 3, shipY + 8, s, C.flame); px(ctx, shipX + 3, shipY + 9, s, C.flameYellow); }
    return { caption: "April 11, 1970 — Apollo 13 launches toward the Moon" };
  } else if (phase < 90) {
    // Stirring fans
    const shipX = 78; const shipY = rows / 2 - 4;
    drawPixelShip(ctx, shipX, shipY, s);
    if (phase % 4 < 2) {
      px(ctx, shipX + 8, shipY + 1, s, C.flameYellow);
      px(ctx, shipX + 9, shipY + 2, s, C.flameYellow);
    }
    return { caption: '"Houston, stir the cryo tanks" — routine procedure triggers disaster' };
  } else if (phase < 130) {
    const shipX = 78; const shipY = rows / 2 - 4;
    drawPixelShip(ctx, shipX, shipY, s);
    drawExplosion(ctx, shipX + 9, shipY + 2, s, phase - 90, 7);
    // Debris particles
    for (let i = 0; i < (phase - 90) / 3; i++) {
      const dx = Math.cos(i * 1.3) * (phase - 90) * 0.3;
      const dy = Math.sin(i * 2.1) * (phase - 90) * 0.2;
      px(ctx, shipX + 9 + dx, shipY + 2 + dy, s, C.shipDark);
    }
    return { caption: "O₂ Tank 2 explodes — \"Houston, we've had a problem\"" };
  } else if (phase < 170) {
    // Crew transfers to LM
    const shipX = 78; const shipY = rows / 2 - 4;
    drawPixelShip(ctx, shipX, shipY, s);
    // LM glow
    const lmGlow = (phase - 130) % 10 < 5;
    px(ctx, shipX - 2, shipY + 2, s, lmGlow ? C.success : C.panel);
    px(ctx, shipX - 2, shipY + 3, s, C.panel);
    px(ctx, shipX - 3, shipY + 3, s, C.panelDark);
    // Command module going dark
    px(ctx, shipX + 5, shipY + 1, s, C.shipDark);
    return { caption: "Crew uses Lunar Module as lifeboat — Command Module powered down" };
  } else {
    // Slingshot return
    const t = (phase - 170) / (total - 170);
    const shipX = 78 - t * 60;
    const shipY = rows / 2 - 4 - Math.sin(t * Math.PI) * 12;
    drawPixelShip(ctx, shipX, shipY, s);
    if (frame % 4 < 2) px(ctx, shipX + 3, shipY + 8, s, C.flame);
    // Trajectory arc
    for (let i = 0; i < Math.floor(t * 15); i++) {
      const at = i / 15;
      const ax = 78 - at * 60;
      const ay = rows / 2 - 4 - Math.sin(at * Math.PI) * 12 + 4;
      px(ctx, ax, ay, s, C.starDim);
    }
    return { caption: t > 0.8 ? "Crew splashes down safely — a \"successful failure\"" : "Free-return trajectory — slingshotting around the Moon" };
  }
};

const renderMarsClimate: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 99);

  const mx = cols * 0.6, my = rows / 2;
  drawPlanet(ctx, mx, my, 12, s, C.mars, C.marsLight, 30);
  // Atmosphere ring
  for (let dy = -14; dy <= 14; dy++) {
    for (let dx = -14; dx <= 14; dx++) {
      const d = dx * dx + dy * dy;
      if (d > 144 && d <= 196 && (dx + dy + frame) % 7 === 0) px(ctx, mx + dx, my + dy, s, C.marsDark);
    }
  }

  const total = 180;
  const phase = frame % total;

  if (phase < 50) {
    // Approaching Mars
    const angle = -Math.PI * 0.8 + (phase / 50) * Math.PI * 0.3;
    const radius = 28 - phase * 0.12;
    const sx = mx + Math.cos(angle) * radius;
    const sy = my + Math.sin(angle) * radius;
    drawPixelShip(ctx, sx - 3, sy - 4, s);

    // Navigation data
    ctx.fillStyle = C.success;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText("NAV: OK", s * 2, s * 5);
    return { caption: "Sept 1999 — Mars Climate Orbiter approaches Mars orbit insertion" };
  } else if (phase < 100) {
    // Wrong trajectory revealed
    const angle = -Math.PI * 0.5 + ((phase - 50) / 50) * Math.PI * 0.4;
    const radius = 22 - (phase - 50) * 0.2;
    const sx = mx + Math.cos(angle) * radius;
    const sy = my + Math.sin(angle) * radius;
    drawPixelShip(ctx, sx - 3, sy - 4, s);

    // Unit mismatch warning
    ctx.fillStyle = C.warning;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText("LOCKHEED: lb·s", s * 2, s * 5);
    ctx.fillText("NASA JPL: N·s", s * 2, s * 8);

    if (phase % 8 < 4) {
      ctx.fillText("≠", s * 18, s * 6.5);
    }
    return { caption: "Software uses pound-force·seconds — NASA expected newton·seconds" };
  } else if (phase < 140) {
    // Too close — entering atmosphere
    const t = (phase - 100) / 40;
    const angle = -Math.PI * 0.1 + t * Math.PI * 0.3;
    const radius = 14 - t * 3;
    const sx = mx + Math.cos(angle) * radius;
    const sy = my + Math.sin(angle) * radius;

    if (t < 0.7) {
      drawPixelShip(ctx, sx - 3, sy - 4, s);
      // Heating glow
      for (let i = 0; i < Math.floor(t * 8); i++) {
        px(ctx, sx - 2 + i, sy + 5, s, C.flame);
      }
    } else {
      drawExplosion(ctx, sx, sy, s, Math.floor((t - 0.7) * 60), 6);
    }
    return { caption: "Probe enters atmosphere at 57km instead of 226km — burns up" };
  } else {
    // Aftermath — $327M lesson
    drawPlanet(ctx, mx, my, 12, s, C.mars, C.marsLight, 30);
    // Debris sparkles
    for (let i = 0; i < 5; i++) {
      const dx = Math.sin(frame * 0.1 + i * 1.3) * 15;
      const dy = Math.cos(frame * 0.08 + i * 2) * 10;
      if ((frame + i) % 4 < 2) px(ctx, mx + dx, my - 14 + dy, s, C.explosionYellow);
    }
    return { caption: "$327 million lost — the most famous unit conversion error in history" };
  }
};

const renderSchiaparelli: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 16);
  drawGround(ctx, cols, rows, s, C.mars, C.marsLight, 0.5, 8);

  const total = 210;
  const phase = frame % total;
  const cx = cols / 2;

  if (phase < 50) {
    // Entry with heat shield
    const t = phase / 50;
    const ly = 4 + t * 12;
    drawPixelShip(ctx, cx - 3, ly, s, "lander");
    // Heat glow
    for (let dx = -4; dx <= 4; dx++) {
      if ((frame + dx) % 3 < 2) px(ctx, cx - 1 + dx, ly + 7, s, C.flame);
    }
    return { caption: "Oct 19, 2016 — Schiaparelli enters Mars atmosphere at 21,000 km/h" };
  } else if (phase < 90) {
    // Parachute deployed
    const t = (phase - 50) / 40;
    const ly = 16 + t * 10;
    // Parachute (bigger)
    for (let dx = -5; dx <= 5; dx++) {
      px(ctx, cx + dx, ly - 5, s, C.parachute);
      if (Math.abs(dx) < 5) px(ctx, cx + dx, ly - 6, s, C.parachute);
      if (Math.abs(dx) < 3) px(ctx, cx + dx, ly - 7, s, C.parachute);
    }
    // Strings
    px(ctx, cx - 3, ly - 4, s, C.antenna); px(ctx, cx + 3, ly - 4, s, C.antenna);
    px(ctx, cx - 2, ly - 3, s, C.antenna); px(ctx, cx + 2, ly - 3, s, C.antenna);
    drawPixelShip(ctx, cx - 3, ly, s, "lander");

    ctx.fillStyle = C.success;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText(`ALT: ${(3.7 - t * 1.5).toFixed(1)}km`, s * 2, s * 5);
    return { caption: "Parachute deployed — descending normally toward the surface" };
  } else if (phase < 130) {
    // IMU saturates — glitch
    const ly = 26;
    drawPixelShip(ctx, cx - 3, ly, s, "lander");

    // Glitch scanlines
    for (let i = 0; i < 3; i++) {
      const gy = ((phase * 13 + i * 37) % (rows * s));
      ctx.fillStyle = `rgba(255,50,50,0.15)`;
      ctx.fillRect(0, gy, w, s * 2);
    }

    // Computer readout going wrong
    const negAlt = -((phase - 90) * 42);
    ctx.fillStyle = C.warning;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText(`ALT: ${negAlt}m`, s * 2, s * 5);
    if (phase > 110) {
      ctx.fillText("STATUS: LANDED ✓", s * 2, s * 8);
    }
    // IMU indicator
    ctx.fillStyle = C.warning;
    ctx.font = `${s * 2.5}px monospace`;
    ctx.fillText("IMU SATURATED", s * 2, rows * s - s * 3);
    return { caption: "IMU sensor saturates → computer calculates NEGATIVE altitude" };
  } else if (phase < 170) {
    // Thrusters cut, free fall
    const t = (phase - 130) / 40;
    const ly = 26 + t * (rows - 38);
    // Lander tumbling
    const tilt = Math.sin(phase * 0.3) * 2;

    if (t < 0.85) {
      drawPixelShip(ctx, cx - 3 + tilt, ly, s, "lander");
      ctx.fillStyle = C.warning;
      ctx.font = `bold ${s * 3}px monospace`;
      ctx.fillText(`${Math.floor(t * 311)} km/h`, s * 2, s * 5);
    } else {
      drawExplosion(ctx, cx, rows - 10, s, Math.floor((t - 0.85) * 120), 8);
    }
    return { caption: "Computer shuts off thrusters — lander free-falls 3.7km to the surface" };
  } else {
    // Crash aftermath
    drawExplosion(ctx, cx, rows - 10, s, 20, 6);
    // Crater
    for (let dx = -4; dx <= 4; dx++) {
      px(ctx, cx + dx, rows - 8, s, C.marsDark);
    }
    return { caption: "Schiaparelli crashes — but data helps ESA improve for future missions" };
  }
};

const renderBeagle2: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  drawGround(ctx, cols, rows, s, C.mars, C.marsLight, 0.3, 10);
  // Mars sky
  ctx.fillStyle = "#1a0800";
  ctx.fillRect(0, 0, w, h * 0.4);

  const total = 220;
  const phase = frame % total;
  const cx = cols / 2, groundY = rows - 14;

  if (phase < 50) {
    const t = phase / 50;
    const ly = 4 + t * (groundY - 8);
    drawPixelShip(ctx, cx - 3, ly, s, "lander");
    // Parachute
    if (t < 0.7) {
      for (let dx = -4; dx <= 4; dx++) px(ctx, cx + dx, ly - 4, s, C.parachute);
    }
    // Retro rockets in final stage
    if (t > 0.6) {
      for (let i = 0; i < 3; i++) { if ((frame + i) % 3 < 2) px(ctx, cx - 1 + i, ly + 7, s, C.flame); }
    }
    return { caption: "Dec 25, 2003 — Beagle 2 enters Mars atmosphere on Christmas Day" };
  } else if (phase < 80) {
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    ctx.fillStyle = C.success;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText("TOUCHDOWN ✓", s * 3, s * 5);
    // Dust settling
    for (let i = 0; i < (phase - 50) / 2; i++) {
      px(ctx, cx - 8 + i * 2, groundY + 5, s, C.marsLight);
    }
    return { caption: "Successful landing! — first British craft on another planet" };
  } else if (phase < 140) {
    // Panels deploying (with struggle)
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    const deployT = (phase - 80) / 60;

    // Left panels (deploy OK)
    const leftLen = Math.min(5, Math.floor(deployT * 6));
    for (let i = 0; i < leftLen; i++) {
      px(ctx, cx - 4 - i, groundY + 1, s, C.panel);
      px(ctx, cx - 4 - i, groundY + 2, s, C.panelDark);
      // Solar cell detail
      if (i % 2 === 0) px(ctx, cx - 4 - i, groundY, s, C.panel);
    }
    // Right panels (stuck after 2)
    const rightLen = Math.min(2, Math.floor(deployT * 6));
    for (let i = 0; i < rightLen; i++) {
      px(ctx, cx + 4 + i, groundY + 1, s, C.panel);
      px(ctx, cx + 4 + i, groundY + 2, s, C.panelDark);
    }

    // Struggle indication on right side
    if (deployT > 0.4 && phase % 6 < 3) {
      px(ctx, cx + 6, groundY + 1, s, C.warning);
    }

    return { caption: deployT > 0.5 ? "Right solar panels STUCK — won't fully open" : "Solar panels beginning to deploy..." };
  } else if (phase < 180) {
    // Antenna blocked
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    // Panels (final state)
    for (let i = 0; i < 5; i++) { px(ctx, cx - 4 - i, groundY + 1, s, C.panel); px(ctx, cx - 4 - i, groundY + 2, s, C.panelDark); }
    for (let i = 0; i < 2; i++) { px(ctx, cx + 4 + i, groundY + 1, s, C.panel); px(ctx, cx + 4 + i, groundY + 2, s, C.panelDark); }

    // Antenna with X
    px(ctx, cx, groundY - 3, s, C.antenna);
    px(ctx, cx, groundY - 4, s, C.antenna);
    px(ctx, cx, groundY - 5, s, C.antenna);

    // Radio waves (blocked)
    if (phase % 8 < 4) {
      ctx.strokeStyle = C.warning;
      ctx.lineWidth = 2;
      const ax = cx * s, ay = (groundY - 5) * s;
      ctx.beginPath();
      ctx.moveTo(ax - 6, ay - 6); ctx.lineTo(ax + s + 6, ay + s + 6);
      ctx.moveTo(ax + s + 6, ay - 6); ctx.lineTo(ax - 6, ay + s + 6);
      ctx.stroke();
    }

    ctx.fillStyle = C.warning;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText("NO SIGNAL", s * 3, s * 5);
    return { caption: "Blocked antenna — panels cover the radio, no communication possible" };
  } else {
    // Found by MRO years later
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    for (let i = 0; i < 5; i++) { px(ctx, cx - 4 - i, groundY + 1, s, C.panelDark); }
    for (let i = 0; i < 2; i++) { px(ctx, cx + 4 + i, groundY + 1, s, C.panelDark); }

    // MRO satellite overhead
    const satX = cx - 10 + ((phase - 180) % 40) * 0.8;
    px(ctx, satX, 6, s, C.shipLight); px(ctx, satX + 1, 6, s, C.ship);
    px(ctx, satX - 1, 6, s, C.panel); px(ctx, satX + 2, 6, s, C.panel);

    // Scan beam
    if (phase % 4 < 2) {
      ctx.strokeStyle = `rgba(68,221,102,0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo((satX + 0.5) * s, 7 * s);
      ctx.lineTo(cx * s, groundY * s);
      ctx.stroke();
    }

    ctx.fillStyle = C.success;
    ctx.font = `${s * 2.5}px monospace`;
    ctx.fillText("FOUND BY MRO — 2015", s * 2, s * 4);
    return { caption: "2015 — NASA's MRO spots Beagle 2 intact, 12 years after landing" };
  }
};

const renderGenesis: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;

  // Sky
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, "#0a1628");
  gradient.addColorStop(0.5, "#1a3050");
  gradient.addColorStop(1, "#446688");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Desert ground
  drawGround(ctx, cols, rows, s, C.desertDark, C.desert, 0.2, 6);

  const total = 200;
  const phase = frame % total;
  const cx = cols / 2;

  if (phase < 40) {
    // Capsule re-entering
    const t = phase / 40;
    const cy = 4 + t * 10;
    drawPixelShip(ctx, cx - 1, cy, s, "capsule");
    // Re-entry heat
    for (let dx = -2; dx <= 2; dx++) {
      if ((frame + dx) % 3 < 2) px(ctx, cx - 1 + dx, cy + 3, s, C.flame);
      if ((frame + dx) % 4 < 2) px(ctx, cx - 1 + dx, cy + 4, s, C.flameYellow);
    }
    ctx.fillStyle = C.text;
    ctx.font = `${s * 2.5}px monospace`;
    ctx.fillText("GENESIS RETURN", s * 2, s * 4);
    return { caption: "Sept 8, 2004 — Genesis capsule re-enters Earth's atmosphere" };
  } else if (phase < 80) {
    // Parachute should deploy — FAILS
    const t = (phase - 40) / 40;
    const cy = 14 + t * 15;
    drawPixelShip(ctx, cx - 1, cy, s, "capsule");

    // Mortar fires but nothing happens
    if (phase > 50 && phase < 60) {
      px(ctx, cx, cy - 1, s, C.flame);
    }

    // Flashing warning
    if (phase > 55 && phase % 6 < 3) {
      ctx.fillStyle = C.warning;
      ctx.font = `bold ${s * 3}px monospace`;
      ctx.fillText("CHUTE FAIL!", s * 2, s * 5);
    }

    // Upside-down sensor indicator
    if (phase > 60) {
      ctx.fillStyle = C.warning;
      ctx.font = `${s * 2}px monospace`;
      ctx.fillText("gravity switch: ↓↑ (inverted)", s * 2, s * 8);
    }
    return { caption: "Drogue parachute FAILS — gravity switch sensor installed upside-down" };
  } else if (phase < 130) {
    // Free-falling faster
    const t = (phase - 80) / 50;
    const cy = 29 + t * (rows - 38);
    drawPixelShip(ctx, cx - 1, cy, s, "capsule");

    // Speed increasing
    const speed = Math.floor(100 + t * 211);
    ctx.fillStyle = C.warning;
    ctx.font = `bold ${s * 3.5}px monospace`;
    ctx.fillText(`${speed} km/h`, s * 2, s * 5);

    // Helicopters waiting (for mid-air catch that won't happen)
    px(ctx, cx - 20, 20, s, C.shipDark);
    px(ctx, cx - 20, 19, s, C.antenna);
    if (frame % 4 < 2) { px(ctx, cx - 21, 19, s, C.antenna); } else { px(ctx, cx - 19, 19, s, C.antenna); }

    return { caption: `Capsule accelerates to ${speed} km/h — helicopters can't catch it` };
  } else if (phase < 160) {
    // CRASH
    const t = (phase - 130) / 30;
    drawExplosion(ctx, cx, rows - 8, s, Math.floor(t * 40), 8);
    // Dust cloud
    for (let i = 0; i < Math.floor(t * 12); i++) {
      const dx = Math.sin(i * 2.5) * t * 15;
      const dy = -Math.abs(Math.cos(i * 1.7)) * t * 8;
      px(ctx, cx + dx, rows - 8 + dy, s, C.desert);
    }
    return { caption: "311 km/h impact in Utah desert — capsule shatters on the ground" };
  } else {
    // Recovery — samples survived!
    // Broken capsule
    for (let dx = -3; dx <= 3; dx++) {
      px(ctx, cx + dx, rows - 7, s, C.shipDark);
      if (Math.abs(dx) < 2) px(ctx, cx + dx, rows - 8, s, C.shipDark);
    }
    // Scientists with samples
    px(ctx, cx - 8, rows - 8, s, C.text);
    px(ctx, cx - 8, rows - 7, s, C.panel);
    // Glowing samples
    if (phase % 6 < 4) {
      px(ctx, cx - 1, rows - 8, s, C.solarDark);
      px(ctx, cx, rows - 8, s, C.solar);
      px(ctx, cx + 1, rows - 8, s, C.solarDark);
    }
    ctx.fillStyle = C.success;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText("SAMPLES RECOVERED ✓", s * 2, s * 5);
    return { caption: "Remarkably, solar wind samples survived — science was saved!" };
  }
};

const renderChandrayaan2: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 19);
  drawGround(ctx, cols, rows, s, C.moonDark, C.moon, 0.4, 8);

  // Craters on surface
  for (let i = 0; i < 5; i++) {
    const crX = 10 + i * 25;
    for (let dx = -2; dx <= 2; dx++) {
      px(ctx, crX + dx, rows - 9, s, C.moonDark);
    }
  }

  const total = 200;
  const phase = frame % total;
  const cx = cols / 2;

  if (phase < 50) {
    // Orbiter + Vikram separating
    const t = phase / 50;
    // Orbiter
    px(ctx, cx - 15, 8, s, C.ship); px(ctx, cx - 14, 8, s, C.shipLight); px(ctx, cx - 13, 8, s, C.ship);
    px(ctx, cx - 16, 8, s, C.panel); px(ctx, cx - 12, 8, s, C.panel);
    // Vikram descending
    const vy = 10 + t * 10;
    drawPixelShip(ctx, cx - 3, vy, s, "lander");
    if (frame % 4 < 2) {
      px(ctx, cx, vy + 7, s, C.flame);
      px(ctx, cx - 1, vy + 8, s, C.flameYellow);
      px(ctx, cx + 1, vy + 8, s, C.flameYellow);
    }
    return { caption: "Sept 2019 — Vikram lander separates, begins descent to Moon's south pole" };
  } else if (phase < 100) {
    // Fine braking phase — starting to deviate
    const t = (phase - 50) / 50;
    const vy = 20 + t * 18;
    const drift = t * t * 6;
    drawPixelShip(ctx, cx - 3 + drift, vy, s, "lander");

    // Thrusters (irregular)
    if (frame % 5 < 3) px(ctx, cx + drift, vy + 7, s, C.flame);

    // Altitude
    const alt = (2.1 - t * 2.1).toFixed(1);
    ctx.fillStyle = t > 0.7 ? C.warning : C.success;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText(`ALT: ${alt}km`, s * 2, s * 5);
    if (t > 0.5) {
      ctx.fillText("DEVIATION ⚠", s * 2, s * 8);
    }
    return { caption: "Fine braking phase — Vikram deviates from planned trajectory at 2.1km" };
  } else if (phase < 140) {
    // Signal lost
    const t = (phase - 100) / 40;
    const vy = 38 + t * 10;
    const drift = 6 + t * 4;
    drawPixelShip(ctx, cx - 3 + drift, vy, s, "lander");

    // Static effect
    for (let i = 0; i < 8; i++) {
      const sx = Math.floor(Math.random() * cols);
      const sy = Math.floor(Math.random() * rows);
      px(ctx, sx, sy, s, `rgba(255,255,255,0.2)`);
    }

    if (phase % 5 < 3) {
      ctx.fillStyle = C.warning;
      ctx.font = `bold ${s * 4}px monospace`;
      ctx.fillText("SIGNAL LOST", s * 3, rows * s / 2);
    }
    return { caption: "Communication lost — Vikram crashes 500m from the landing site" };
  } else {
    // Crash, then hope
    const t = (phase - 140) / 60;
    if (t < 0.3) {
      drawExplosion(ctx, cx + 10, rows - 10, s, Math.floor(t * 50), 6);
    } else {
      // Crater
      for (let dx = -3; dx <= 3; dx++) px(ctx, cx + 10 + dx, rows - 10, s, C.moonDark);

      // Chandrayaan-3 success message
      if (phase % 6 < 4) {
        ctx.fillStyle = C.success;
        ctx.font = `bold ${s * 2.5}px monospace`;
        ctx.fillText("2023: CHANDRAYAAN-3 ✓", s * 2, s * 5);
        ctx.fillText("1st south pole landing!", s * 2, s * 8);
        // CH-3 lander
        drawPixelShip(ctx, cx - 15, rows - 15, s, "lander");
        // Flag
        px(ctx, cx - 12, rows - 18, s, "#FF9933");
        px(ctx, cx - 12, rows - 17, s, "#FFFFFF");
        px(ctx, cx - 12, rows - 16, s, "#138808");
      }
    }
    return { caption: "ISRO learns from failure → Chandrayaan-3 succeeds in 2023! 🇮🇳" };
  }
};

const renderPhoenix: Renderer = (ctx, w, h, frame) => {
  const s = 3;
  const cols = w / s, rows = h / s;
  ctx.fillStyle = "#0a0e1a"; ctx.fillRect(0, 0, w, h);
  drawStars(ctx, w, h, s, frame, 8);

  // Mars north pole surface (icy)
  for (let x = 0; x < cols; x++) {
    const height = 7 + Math.floor(Math.sin(x * 0.35) * 2);
    for (let y = 0; y < height; y++) {
      const icy = (x + y) % 4 < 2;
      px(ctx, x, rows - y, s, icy ? C.ice : C.mars);
    }
  }

  const total = 250;
  const phase = frame % total;
  const cx = cols / 2;
  const groundY = rows - 12;

  if (phase < 50) {
    // Landing approach
    const t = phase / 50;
    const ly = 4 + t * (groundY - 8);
    drawPixelShip(ctx, cx - 3, ly, s, "lander");
    for (let i = 0; i < 3; i++) { if ((frame + i) % 3 < 2) px(ctx, cx - 1 + i, ly + 7, s, C.flame); }
    return { caption: "May 25, 2008 — Phoenix approaches Mars north pole" };
  } else if (phase < 80) {
    // Landed + panels deploy
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    const dp = Math.min(5, Math.floor((phase - 50) / 4));
    for (let i = 0; i < dp; i++) {
      px(ctx, cx - 4 - i, groundY + 1, s, C.panel);
      px(ctx, cx + 4 + i, groundY + 1, s, C.panel);
      px(ctx, cx - 4 - i, groundY + 2, s, C.panelDark);
      px(ctx, cx + 4 + i, groundY + 2, s, C.panelDark);
    }
    ctx.fillStyle = C.success;
    ctx.font = `bold ${s * 3}px monospace`;
    ctx.fillText("LANDED ✓", s * 3, s * 5);
    return { caption: "Successful landing! First to land in Mars arctic region" };
  } else if (phase < 140) {
    // Robotic arm digging
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    for (let i = 0; i < 5; i++) {
      px(ctx, cx - 4 - i, groundY + 1, s, C.panel); px(ctx, cx + 4 + i, groundY + 1, s, C.panel);
    }

    const armPhase = (phase - 80) / 60;
    const armLen = Math.min(6, Math.floor(armPhase * 8));
    // Arm segments
    for (let i = 0; i < armLen; i++) {
      px(ctx, cx + 5 + Math.floor(i * 0.5), groundY - 1 + i, s, C.antenna);
    }
    // Scoop at end
    if (armLen >= 5) {
      px(ctx, cx + 7, groundY + 4, s, C.shipLight);
      px(ctx, cx + 8, groundY + 4, s, C.shipLight);
      // Digging particles
      if (phase % 4 < 2) {
        px(ctx, cx + 9, groundY + 3, s, C.marsLight);
        px(ctx, cx + 7, groundY + 5, s, C.mars);
      }
    }
    return { caption: "Robotic arm digs trenches in the Martian soil — searching for ice" };
  } else if (phase < 190) {
    // ICE FOUND!
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    for (let i = 0; i < 5; i++) {
      px(ctx, cx - 4 - i, groundY + 1, s, C.panel); px(ctx, cx + 4 + i, groundY + 1, s, C.panel);
    }
    // Arm extended
    for (let i = 0; i < 6; i++) px(ctx, cx + 5 + Math.floor(i * 0.5), groundY - 1 + i, s, C.antenna);

    // Exposed ice layer
    for (let dx = 0; dx < 6; dx++) {
      px(ctx, cx + 6 + dx, groundY + 5, s, C.ice);
      px(ctx, cx + 6 + dx, groundY + 6, s, C.iceDark);
      // Ice sparkle
      if ((frame + dx) % 8 < 3) px(ctx, cx + 6 + dx, groundY + 4, s, "#ffffff");
    }

    ctx.fillStyle = C.ice;
    ctx.font = `bold ${s * 3.5}px monospace`;
    ctx.fillText("WATER ICE CONFIRMED! ❄️", s * 2, s * 5);
    return { caption: "WATER ICE found just below the surface! First direct confirmation" };
  } else {
    // Winter comes — mission ends
    drawPixelShip(ctx, cx - 3, groundY, s, "lander");
    for (let i = 0; i < 5; i++) {
      px(ctx, cx - 4 - i, groundY + 1, s, C.panelDark); px(ctx, cx + 4 + i, groundY + 1, s, C.panelDark);
    }

    // Snow/frost falling
    const snowCount = Math.min(20, Math.floor((phase - 190) / 2));
    for (let i = 0; i < snowCount; i++) {
      const sx = (i * 17 + frame * 2) % cols;
      const sy = (i * 11 + frame * 3) % rows;
      px(ctx, sx, sy, s, C.ice);
    }
    // Frost accumulating on lander
    for (let dx = -4; dx <= 4; dx++) {
      px(ctx, cx + dx, groundY - 3, s, C.iceDark);
    }

    ctx.fillStyle = C.iceDark;
    ctx.font = `bold ${s * 2.5}px monospace`;
    ctx.fillText("5 months of discovery", s * 2, s * 5);
    ctx.fillText("Winter ends the mission", s * 2, s * 8);
    return { caption: "Martian winter arrives — Phoenix exceeds its 90-day mission by 2 months" };
  }
};

/* ─── registry ─── */
const renderers: Record<string, Renderer> = {
  "apollo-13": renderApollo13,
  "mars-climate-orbiter": renderMarsClimate,
  "schiaparelli-edm": renderSchiaparelli,
  "beagle-2": renderBeagle2,
  "genesis": renderGenesis,
  "chandrayaan-2": renderChandrayaan2,
  "phoenix": renderPhoenix,
};

interface Props {
  missionId: string;
}

const MissionPixelAnimation = ({ missionId }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const [caption, setCaption] = useState("");

  const renderer = renderers[missionId];

  useEffect(() => {
    if (!renderer || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    let running = true;
    let lastCaption = "";
    const tick = () => {
      if (!running) return;
      ctx.imageSmoothingEnabled = false;
      const result = renderer(ctx, W, H, frameRef.current);
      if (result.caption !== lastCaption) {
        lastCaption = result.caption;
        setCaption(result.caption);
      }
      frameRef.current++;
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [renderer]);

  if (!renderer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden border border-border/40 shadow-card"
    >
      <div className="relative bg-[#0b0e17]">
        <canvas
          ref={canvasRef}
          width={480}
          height={270}
          className="w-full h-auto block"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-background/70 backdrop-blur-sm border border-border/30">
          <span className="text-[10px] font-heading font-bold text-primary tracking-wider">8-BIT REPLAY</span>
        </div>
      </div>
      {/* Caption bar */}
      <div className="px-4 py-2.5 glass border-t border-border/30">
        <p className="text-xs text-secondary-foreground leading-relaxed font-medium min-h-[2rem] flex items-center">
          {caption}
        </p>
      </div>
    </motion.div>
  );
};

export default MissionPixelAnimation;
